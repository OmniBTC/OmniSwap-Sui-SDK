import { Command } from 'commander';

const program = new Command();

program
  .name('yarn cli')
  .description('OmniSwap Sui TS CLI')
  .requiredOption('-c, --config <path>', 'path to your sui config.yml (generated with "sui client active-address")')
  .option('-p, --profile <PROFILE>', 'sui config profile to use', 'default');

 program.parse();