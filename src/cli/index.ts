import { Command } from 'commander';
import { Ed25519PublicKey,RawSigner } from '@mysten/sui.js';
import {SDK,CONFIGS} from '../main'
import { readConfig } from './readconfig';
import { addHexPrefix } from '../utils/hex'
import { SUI_COIN_TYPE, USDT_COIN_TYPE, XBTC_COIN_TYPE } from '../constants';

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
   const suiBalance = await sdk.Coin.getCoinBalance(address,SUI_COIN_TYPE);
   console.log(`address: ${address} sui balance: ${  suiBalance.balance }`);
};
  
program.command('omniswap:wallet')
  .description('print wallet ')
  .action(wallet)

const facuet= async () => {
    // faucet usdt 
    const { keypair } = readConfig(program);
    const rawSigner = new RawSigner(keypair,sdk.jsonRpcProvider,sdk.serializer);
    console.log('--------------faucet usdt---------------');
    const faucetUsdtTxn = await sdk.Coin.buildFaucetTokenTransaction(USDT_COIN_TYPE);
    let txnResponse = await rawSigner.executeMoveCallWithRequestType(faucetUsdtTxn,"WaitForEffectsCert");
    console.log('txn: ',txnResponse);
    console.log('--------------faucet xbtc---------------');
    const faucetxBtcTxn = await sdk.Coin.buildFaucetTokenTransaction(XBTC_COIN_TYPE);
    txnResponse = await rawSigner.executeMoveCallWithRequestType(faucetxBtcTxn,"WaitForEffectsCert");
    console.log('txn: ',txnResponse)
};

program.command('omniswap:faucet')
 .description('faucet sui')
 .action(facuet)

program.parse();