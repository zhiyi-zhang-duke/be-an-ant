import { Command } from 'commander'
import readline from 'readline'
import { llm } from '../llm'
import { DIMENSIONS, Dimension, onboardSystemPrompt, dimensionLabel } from '../prompts'
import { getProfile, saveProfile } from '../db'

function extractTag(text: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i')
  const match = text.match(re)
  return match ? match[1].trim() : null
}

async function pickDimension(): Promise<Dimension> {
  console.log('\nWhich dimension do you want to add context for?\n')
  DIMENSIONS.forEach((d, i) => {
    console.log(`  ${i + 1}. ${d.padEnd(16)} — ${dimensionLabel(d)}`)
  })
  console.log()

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise<string>(resolve =>
    rl.question('Enter number or dimension name: ', ans => { rl.close(); resolve(ans.trim()) })
  )

  const byIndex = parseInt(answer, 10)
  if (!isNaN(byIndex) && byIndex >= 1 && byIndex <= DIMENSIONS.length) {
    return DIMENSIONS[byIndex - 1]
  }

  const byName = DIMENSIONS.find(d => d === answer.toLowerCase())
  if (byName) return byName

  console.error(`\nUnrecognised dimension: "${answer}". Valid options: ${DIMENSIONS.join(', ')}`)
  process.exit(1)
}

async function collectDump(dimension: Dimension): Promise<string> {
  console.log(`\nDimension: ${dimension}`)
  console.log(`What this covers: ${dimensionLabel(dimension)}\n`)
  console.log('Dump whatever you know — stream of consciousness is fine.')
  console.log('Press Enter twice when done.\n')
  console.log('─'.repeat(60) + '\n')

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const lines: string[] = []
  let consecutiveBlanks = 0

  await new Promise<void>(resolve => {
    rl.on('line', line => {
      if (line === '') {
        consecutiveBlanks++
        if (consecutiveBlanks >= 2) {
          rl.close()
          resolve()
        } else {
          lines.push(line)
        }
      } else {
        consecutiveBlanks = 0
        lines.push(line)
      }
    })
    rl.on('close', resolve)
  })

  return lines.join('\n').trim()
}

export function registerOnboard(program: Command): void {
  program
    .command('onboard [dimension]')
    .description('Add context for a specific plan dimension')
    .action(async (dimensionArg?: string) => {
      const profile = await getProfile()
      if (!profile) {
        console.error('No profile found. Run `ant intake` first.')
        process.exit(1)
      }

      let dimension: Dimension
      if (dimensionArg) {
        if (!DIMENSIONS.includes(dimensionArg as Dimension)) {
          console.error(`Unknown dimension: "${dimensionArg}". Valid options: ${DIMENSIONS.join(', ')}`)
          process.exit(1)
        }
        dimension = dimensionArg as Dimension
      } else {
        dimension = await pickDimension()
      }

      const existing = profile.dimensionContext?.[dimension]
      if (existing) {
        console.log(`\nExisting context for ${dimension}:\n  ${existing}\n`)
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        const answer = await new Promise<string>(resolve =>
          rl.question('Replace it? [y/N] ', ans => { rl.close(); resolve(ans.trim().toLowerCase()) })
        )
        if (answer !== 'y') {
          console.log('Cancelled.')
          process.exit(0)
        }
      }

      const dump = await collectDump(dimension)
      if (!dump) {
        console.log('\nNo input provided. Cancelled.')
        process.exit(0)
      }

      console.log('\n─'.repeat(60))
      console.log('Distilling...\n')

      const systemPrompt = onboardSystemPrompt(dimension)
      const response = await llm(systemPrompt, dump)

      const summary = extractTag(response, 'context')
      if (!summary) {
        console.error('Failed to extract summary from LLM response.')
        console.error('Raw response:', response)
        process.exit(1)
      }

      const updatedProfile = {
        ...profile,
        dimensionContext: {
          ...profile.dimensionContext,
          [dimension]: summary,
        },
        updatedAt: new Date().toISOString(),
      }

      await saveProfile(updatedProfile)

      console.log(`Context saved for ${dimension}:\n`)
      console.log(`  ${summary}\n`)
      console.log('This will be included in your next `ant plan` or `ant retro`.')
    })
}
