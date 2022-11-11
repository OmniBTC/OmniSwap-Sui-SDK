'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('yarn cli')
    .description('OmniSwap Sui TS CLI')
    .requiredOption('-c, --config <path>', 'path to your sui config.yml (generated with "sui client active-address")')
    .option('-p, --profile <PROFILE>', 'sui config profile to use', 'default');
//# sourceMappingURL=index.js.map
