import { Command } from 'commander'
import readline from 'readline'
import { llmChat, Message } from '../llm'
import { intakeSystemPrompt } from '../prompts'
import { ProfileSchema } from '../schema'
import { getProfile, saveProfile, addSession } from '../db'
import { getConfig, promptConfig, saveConfig } from '../config'
import { extractTag } from '../util'

export function registerIntake(program: Command): void {
  program
    .command('intake')
    .description('Run the intake interview to build your profile')
    .action(async () => {
      // First-run: prompt for config if missing
      if (!getConfig()) {
        console.log('No config found. Let\'s set that up first.\n')
        const config = await promptConfig()
        saveConfig(config)
        console.log('\nConfig saved.\n')
      }

      const existing = await getProfile()
      if (existing) {
        console.log('A profile already exists. Running intake again will overwrite it.')
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        const answer = await new Promise<string>(resolve =>
          rl.question('Continue? [y/N] ', ans => { rl.close(); resolve(ans.trim().toLowerCase()) })
        )
        if (answer !== 'y') {
          console.log('Cancelled.')
          process.exit(0)
        }
      }

      console.log('\nStarting intake interview. Answer naturally — this is a conversation, not a form.\n')
      console.log('Type your responses and press Enter. Type "quit" to cancel at any time.\n')
      console.log('─'.repeat(60) + '\n')

      const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
      const askUser = (): Promise<string> =>
        new Promise(resolve => rl.question('You: ', answer => resolve(answer.trim())))

      const systemPrompt = intakeSystemPrompt()
      const messages: Message[] = []

      // Kick off the interview
      const opening = await llmChat(systemPrompt, [{ role: 'user', content: 'Ready to start.' }])
      console.log(`\nant: ${opening}\n`)
      messages.push({ role: 'user', content: 'Ready to start.' })
      messages.push({ role: 'assistant', content: opening })

      let profile = null

      while (true) {
        const userInput = await askUser()

        if (userInput.toLowerCase() === 'quit') {
          console.log('\nIntake cancelled.')
          rl.close()
          process.exit(0)
        }

        messages.push({ role: 'user', content: userInput })

        const response = await llmChat(systemPrompt, messages)
        messages.push({ role: 'assistant', content: response })

        const profileJson = extractTag(response, 'profile')

        if (profileJson) {
          // Interview complete — parse and save
          try {
            const parsed = JSON.parse(profileJson)
            profile = ProfileSchema.parse(parsed)
          } catch (err) {
            console.error('\nFailed to parse profile from LLM response.')
            if (err instanceof Error) console.error(err.message)
            rl.close()
            process.exit(1)
          }
          break
        }

        console.log(`\nant: ${response}\n`)
      }

      rl.close()

      if (!profile) {
        console.error('Interview ended without a complete profile. Try running intake again.')
        process.exit(1)
      }

      await saveProfile(profile)
      await addSession({
        type: 'intake',
        date: new Date().toISOString().split('T')[0],
        summary: 'Initial intake interview completed. Profile created.',
        planChanges: [],
      })

      console.log('\n' + '─'.repeat(60))
      console.log('\nIntake complete. Profile saved.')
      console.log('\nNext step: run `ant plan` to generate your action plan.\n')
    })
}
