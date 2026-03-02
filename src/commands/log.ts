import { Command } from 'commander'
import { getSessions } from '../db'

const TYPE_LABEL: Record<string, string> = {
  intake: 'INTAKE',
  plan:   'PLAN',
  retro:  'RETRO',
}

export function registerLog(program: Command): void {
  program
    .command('log')
    .description('View session history')
    .action(async () => {
      const sessions = await getSessions()

      if (!sessions.length) {
        console.log('No sessions yet. Run `ant intake` to get started.')
        process.exit(0)
      }

      console.log('\nSESSION HISTORY\n')
      console.log('─'.repeat(60))

      for (const session of sessions) {
        const label = TYPE_LABEL[session.type] ?? session.type.toUpperCase()
        console.log(`\n${session.date}  [${label}]`)
        console.log(`  ${session.summary}`)
        if (session.planChanges.length) {
          session.planChanges.forEach(c => console.log(`  → ${c}`))
        }
      }

      console.log('\n' + '─'.repeat(60) + '\n')
      process.exit(0)
    })
}
