import { Command } from 'commander'
import { llm } from '../llm'
import { planSystemPrompt } from '../prompts'
import { PlanSchema } from '../schema'
import { getProfile, savePlan, addSession } from '../db'
import { extractTag } from '../util'

export function registerPlan(program: Command): void {
  program
    .command('plan')
    .description('Generate or refresh your action plan')
    .action(async () => {
      const profile = await getProfile()
      if (!profile) {
        console.error('No profile found. Run `ant intake` first.')
        process.exit(1)
      }

      console.log('Generating plan...\n')

      const systemPrompt = planSystemPrompt(profile)
      const response = await llm(
        systemPrompt,
        'Generate a ranked action plan based on my profile. Be specific and direct.'
      )

      const planJson = extractTag(response, 'plan')
      if (!planJson) {
        console.error('LLM did not return a <plan> block. Raw response:\n')
        console.error(response)
        process.exit(1)
      }

      let plan
      try {
        const parsed = JSON.parse(planJson)
        plan = PlanSchema.parse(parsed)
      } catch (err) {
        console.error('Failed to parse plan from LLM response.')
        if (err instanceof Error) console.error(err.message)
        process.exit(1)
      }

      await savePlan(plan)

      const changes = plan.dimensions.map(d => `${d.id}: rank ${d.rank}, score ${d.score}/5`)
      await addSession({
        type: 'plan',
        date: new Date().toISOString().split('T')[0],
        summary: 'Action plan generated.',
        planChanges: changes,
      })

      // Print the plan
      console.log('─'.repeat(60))
      console.log('ACTION PLAN\n')

      const sorted = [...plan.dimensions].sort((a, b) => a.rank - b.rank)
      for (const dim of sorted) {
        const scoreBar = '█'.repeat(dim.score) + '░'.repeat(5 - dim.score)
        console.log(`${dim.rank}. ${dim.id.toUpperCase()} [${scoreBar}] ${dim.score}/5`)
        console.log(`   ${dim.rationale}`)
        const highActions = dim.actions.filter(a => a.priority === 'high')
        if (highActions.length) {
          console.log('   High priority:')
          highActions.forEach(a => console.log(`   → ${a.text}`))
        }
        const medActions = dim.actions.filter(a => a.priority === 'medium')
        if (medActions.length) {
          console.log('   Medium priority:')
          medActions.forEach(a => console.log(`   → ${a.text}`))
        }
        console.log()
      }

      console.log('─'.repeat(60))
      console.log('\nPlan saved. Run `ant retro` weekly to update it.\n')
      process.exit(0)
    })
}
