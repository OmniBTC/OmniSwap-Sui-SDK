
import { faucetTokenCmd } from './faucetCmd'
import { initProgram } from './option';
import { walletCmd } from './walletCmd';
import { addLiquidCmd } from './liquidCmd';

const program = initProgram();
faucetTokenCmd(program);
walletCmd(program);
addLiquidCmd(program);

program.parse();