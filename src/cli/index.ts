import { Command } from 'commander';
import { Ed25519PublicKey } from '@mysten/sui.js';
import {SDK,CONFIGS} from '../main'
import { readConfig } from './readconfig';
import { addHexPrefix } from '../utils/hex'
import { delay } from '../utils/time';

const program = new Command();
const sdk = new SDK(CONFIGS.testnet);

program
  .name('yarn cli')
  .description('OmniSwap Sui TS CLI')
  .option('-c, --config <path>', 'path to your sui config.yml (generated with "sui client active-address")')
  .option('-p, --profile <PROFILE>', 'sui config profile to use', 'default');

const wallet= async () => {
   const { keypair } = readConfig(program);
   const ed25519PublicKey =  new  Ed25519PublicKey(keypair.getPublicKey())
   const address = addHexPrefix(ed25519PublicKey.toSuiAddress())
   console.log(address)
};
  
program.command('omniswap:wallet')
  .description('print wallet ')
  .action(wallet)

const facuet= async (address:string) => {
    console.log(address)
    let i = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('faucet sui token ', i++)
      sdk.Coin.faucetSui(address).catch(err=>{
        console.log('error to faucet sui ' + err);
      })
      delay(1)
    }
};

program.command('omniswap:faucet')
 .description('faucet sui')
 .argument('address')
 .action(facuet)

program.parse();