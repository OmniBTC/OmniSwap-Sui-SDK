
import { faucetTokenCmd } from './faucetCmd'
import { initProgram } from './option';
import { walletCmd } from './walletCmd';
import { addLiquidCmd,removeLiquidCmd,listPoolCmd, adminMintTestTokenCmd,adminAddAllLiquidCmd } from './liquidCmd';

const program = initProgram();
faucetTokenCmd(program);
walletCmd(program);
addLiquidCmd(program);
removeLiquidCmd(program);
listPoolCmd(program);
adminMintTestTokenCmd(program);
adminAddAllLiquidCmd(program);

program.parse();