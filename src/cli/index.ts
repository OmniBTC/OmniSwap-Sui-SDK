
import { faucetTokenCmd } from './faucetCmd'
import { initProgram } from './option';
import { walletCmd } from './walletCmd';
import { addLiquidCmd,removeLiquidCmd } from './liquidCmd';

const program = initProgram();
faucetTokenCmd(program);
walletCmd(program);
addLiquidCmd(program);
removeLiquidCmd(program);

program.parse();