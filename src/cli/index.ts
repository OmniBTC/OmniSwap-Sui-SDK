import { Command } from 'commander';
import { Ed25519PublicKey } from '@mysten/sui.js';
import {SDK,CONFIGS} from '../main'
import { readConfig } from './readconfig';
import { addHexPrefix } from '../utils/hex'
import { delay } from '../utils/time'

const program = new Command();
const sdk = new SDK(CONFIGS.testnet);

program
  .name('yarn cli')
  .description('OmniSwap Sui TS CLI')
  .requiredOption('-c, --config <path>', 'path to your sui config.yml (generated with "sui client active-address")')
  .option('-p, --profile <PROFILE>', 'sui config profile to use', 'default');

const walletFaucet = async () => {
   const { keypair } = readConfig(program);
   const ed25519PublicKey =  new  Ed25519PublicKey(keypair.getPublicKey())
   const address = addHexPrefix(ed25519PublicKey.toSuiAddress())
   console.log(address)
   // eslint-disable-next-line no-constant-condition
   while (true) {
    console.log('请求水龙头')
    await sdk.Coin.faucetSui(address)
    await delay(100)
    await sdk.Coin.faucetSui("0xda4fd3759e6c5cee43f2ec08e2d77a3dfdcee132")
    await delay(100)
    
   }

};
  
program.command('omniswap:wallet')
  .description('print wallet and faucet tokens')
  .action(walletFaucet)


  program.parse();