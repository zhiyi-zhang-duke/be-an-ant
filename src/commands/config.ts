import { Command } from 'commander'
import { promptConfig, saveConfig, getConfig } from '../config'

export function registerConfig(program: Command): void {
  program
    .command('config')
    .description('Set up or update your API key and Firebase project config')
    .action(async () => {
      const existing = getConfig()
      if (existing) {
        console.log('Existing config found. Running setup will overwrite it.')
      }
      const config = await promptConfig()
      saveConfig(config)
      console.log('\nConfig saved to ~/.be-an-ant/config.json')
    })
}
