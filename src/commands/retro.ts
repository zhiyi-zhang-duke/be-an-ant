import { Command } from 'commander'
import readline from 'readline'
import { llmChat, Message } from '../llm'
import { retroSystemPrompt } from '../prompts'
import { PlanSchema } from '../schema'
import { z } from 'zod'
import { getProfile, getPlan, savePlan, addSession } from '../db'
import { extractTag } from '../util'

export function registerRetro(program: Command): void {
  program
    .command('retro')
    .description('Run a weekly retrospective and update your plan')
    .action(async () => {
      const profile = await getProfile()
      if (!profile) {
        console.error('No profile found. Run `ant intake` first.')
        process.exit(1)
      }

      const plan = await getPlan()
      if (!plan) {
        console.error('No plan found. Run `ant plan` first.')
        process.exit(1)
      }

      console.log('\nWeekly retro. Answer honestly — the plan updates based on what actually happened.\n')
      console.log('Type your responses and press Enter. Type "quit" to cancel.\n')
      console.log('─'.repeat(60) + '\n')

      const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
      const askUser = (): Promise<string> =>
        new Promise(resolve => rl.question('You: ', answer => resolve(answer.trim())))

      const systemPrompt = retroSystemPrompt(profile, plan)
      const messages: Message[] = []

      // Kick off the retro
      const opening = await llmChat(systemPrompt, [{ role: 'user', content: 'Ready for retro.' }])
      console.log(`\nant: ${opening}\n`)
      messages.push({ role: 'user', content: 'Ready for retro.' })
      messages.push({ role: 'assistant', content: opening })

      let updatedPlan = null
      let changes: string[] = []

      while (true) {
        const userInput = await askUser()

        if (userInput.toLowerCase() === 'quit') {
          console.log('\nRetro cancelled. Plan unchanged.')
          rl.close()
          process.exit(0)
        }

        messages.push({ role: 'user', content: userInput })

        const response = await llmChat(systemPrompt, messages)
        messages.push({ role: 'assistant', content: response })

        const planJson = extractTag(response, 'plan')

        if (planJson) {
          try {
            const parsed = JSON.parse(planJson)
            updatedPlan = PlanSchema.parse(parsed)
          } catch (err) {
            console.error('\nFailed to parse updated plan from LLM response.')
            if (err instanceof Error) console.error(err.message)
            rl.close()
            process.exit(1)
          }

          const changesJson = extractTag(response, 'changes')
          if (changesJson) {
            try {
              changes = z.array(z.string()).parse(JSON.parse(changesJson))
            } catch {
              changes = []
            }
          }

          break
        }

        console.log(`\nant: ${response}\n`)
      }

      rl.close()

      if (!updatedPlan) {
        console.error('Retro ended without an updated plan. Try running retro again.')
        process.exit(1)
      }

      await savePlan(updatedPlan)
      await addSession({
        type: 'retro',
        date: new Date().toISOString().split('T')[0],
        summary: changes.length ? changes.join(' | ') : 'Weekly retro completed. Plan updated.',
        planChanges: changes,
      })

      console.log('\n' + '─'.repeat(60))
      console.log('\nRetro complete. Plan updated.\n')

      if (changes.length) {
        console.log('Changes:')
        changes.forEach(c => console.log(`  → ${c}`))
        console.log()
      }

      // Print updated top priorities
      const sorted = [...updatedPlan.dimensions].sort((a, b) => a.rank - b.rank)
      console.log('Top priorities for next week:')
      sorted.slice(0, 3).forEach(dim => {
        const highActions = dim.actions.filter(a => a.priority === 'high')
        console.log(`\n  ${dim.rank}. ${dim.id.toUpperCase()}`)
        highActions.forEach(a => console.log(`     → ${a.text}`))
      })
      console.log()
    })
}
