#!/usr/bin/env node

import { Command } from 'commander'
import { registerIntake } from './commands/intake'
import { registerPlan } from './commands/plan'
import { registerRetro } from './commands/retro'
import { registerLog } from './commands/log'
import { registerConfig } from './commands/config'

const program = new Command()

program
  .name('ant')
  .description('be-an-ant — AI-powered career development CLI')
  .version('0.1.0')

registerConfig(program)
registerIntake(program)
registerPlan(program)
registerRetro(program)
registerLog(program)

program.parse()
