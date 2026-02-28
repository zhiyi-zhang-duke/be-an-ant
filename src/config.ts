import fs from 'fs'
import path from 'path'
import os from 'os'
import readline from 'readline'

export interface Config {
  apiKey: string
  firebase: {
    projectId: string
    clientEmail: string
    privateKey: string
  }
  model?: string
}

const CONFIG_DIR = path.join(os.homedir(), '.be-an-ant')
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json')

export function getConfig(): Config | null {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8')
    return JSON.parse(raw) as Config
  } catch {
    return null
  }
}

export function saveConfig(config: Config): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8')
}

export function requireConfig(): Config {
  const config = getConfig()
  if (!config) {
    console.error('No config found. Run `ant config` to set up your API key and Firebase project.')
    process.exit(1)
  }
  return config
}

export async function promptConfig(): Promise<Config> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q: string): Promise<string> =>
    new Promise(resolve => rl.question(q, answer => resolve(answer.trim())))

  console.log('\nbe-an-ant setup\n')
  console.log('You need an Anthropic API key and a Firebase project (for data storage).\n')

  const apiKey = await ask('Anthropic API key: ')

  console.log('\nFirebase service account credentials (from Firebase Console → Project Settings → Service Accounts):')
  const projectId = await ask('Firebase project ID: ')
  const clientEmail = await ask('Service account client email: ')
  console.log('Paste the private key (one line, with \\n for newlines, including BEGIN/END markers):')
  const privateKeyRaw = await ask('Private key: ')
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n')

  rl.close()

  return { apiKey, firebase: { projectId, clientEmail, privateKey } }
}
