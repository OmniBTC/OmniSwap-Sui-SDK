import { readConfig } from './readConfig';
import { Command } from 'commander';
import { getTransactionEffects } from '@mysten/sui.js';

export const faucetTokenCmd = async (
    program: Command
) => {
    const facuetTokens = async (
        coin_type :string
    ) => {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const faucetTokenTxn = await suiAmmSdk.Coin.buildFaucetTokenTransaction(coin_type);
        const executeResponse = await rawSigner.executeMoveCall(faucetTokenTxn,"WaitForEffectsCert");
        const response = getTransactionEffects(executeResponse)
        console.log(`excute status: ${response?.status.status} digest: ${response?.transactionDigest} `)
    };
    program.command('omniswap:faucet')
        .description('faucet token')
        .argument('<coin_type>')
        .action(facuetTokens)
}