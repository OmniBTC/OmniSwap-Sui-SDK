
import { faucetTokenCmd } from './faucetCmd'
import { initProgram } from './option';
import { walletCmd } from './walletCmd'

const program = initProgram();
faucetTokenCmd(program);
walletCmd(program);

program.parse();