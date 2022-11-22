import { readConfig } from './readConfig';
import { Command } from 'commander';
import { getTransactionEffects } from '@mysten/sui.js';
import { CreateAddLiquidTXPayloadParams,CreateRemoveLiquidTXPayloadParams } from '../modules';

export const listPoolCmd = async (
    program:Command
) => {
    const listPools = async() => {
        const { suiAmmSdk } = readConfig(program);
        const poolList = await suiAmmSdk.Pool.getPoolList();
        console.log(poolList);
    }
    program.command('omniswap:list_pools')
        .description('list all pools')
        .action(listPools)
}

export const addLiquidCmd = async (
    program: Command
) => {
    const addLiquid = async (
        coin_x_type:string,
        coin_y_type:string,
        coin_x_object_ids:string,
        coin_x_amount: string,
        coin_y_object_ids:string,
        coin_y_amount: string,
        slippage:string,
        gasPayment:string,
    ) => {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const coin_x_object_ids_list = coin_x_object_ids.split(',')
        const coin_y_object_ids_list = coin_y_object_ids.split(',')
        const addLiquidParams:CreateAddLiquidTXPayloadParams = {
            coin_x: coin_x_type,
            coin_y: coin_y_type,
            coin_x_objectIds:coin_x_object_ids_list,
            coin_y_objectIds: coin_y_object_ids_list,
            coin_x_amount: Number(coin_x_amount),
            coin_y_amount: Number(coin_y_amount),
            slippage: Number(slippage),
            gasPaymentObjectId:gasPayment
        }
        console.log(`Add Liquid params: ${JSON.stringify(addLiquidParams)}`)
        const addLiquidTxn = await suiAmmSdk.Pool.buildAddLiquidTransAction(addLiquidParams);
        const executeResponse = await rawSigner.executeMoveCallWithRequestType(addLiquidTxn,"WaitForEffectsCert");
        const response = getTransactionEffects(executeResponse)
        console.log(`excute status: ${response?.status.status} digest: ${response?.transactionDigest} `)
    };
    program.command('omniswap:addLiquid')
        .description('add liquid')
        .argument('<coin_x_type>')
        .argument('<coin_y_type>')
        .argument('<coin_x_object_ids>')
        .argument('<coin_x_amount>')
        .argument('<coin_y_object_ids>')
        .argument('<coin_y_amount>')
        .argument('<slippage>')
        .argument('gaspayment')
        .action(addLiquid)
}

export const removeLiquidCmd = async (
    program: Command

) => {
    const removeLiquid = async (
        coin_x_type:string,
        coin_y_type:string,
        lp_coin_object_ids:string,
    
        gasPayment:string,
    ) => {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const lp_coin_object_ids_list = lp_coin_object_ids.split(",");
    
        const removeLiquidParams:CreateRemoveLiquidTXPayloadParams = {
            coin_x: coin_x_type,
            coin_y: coin_y_type,
            lp_coin_objectIds: lp_coin_object_ids_list,
            gasPaymentObjectId:gasPayment
        }
        console.log(`remove Liquid params: ${JSON.stringify(removeLiquidParams)}`)
        const removeLiquidTxn = await suiAmmSdk.Pool.buildRemoveLiquidTransAction(removeLiquidParams);
        const executeResponse = await rawSigner.executeMoveCallWithRequestType(removeLiquidTxn,"WaitForEffectsCert");
        const response = getTransactionEffects(executeResponse)
        console.log(`excute status: ${response?.status.status} digest: ${response?.transactionDigest} `)
    };
    program.command('omniswap:removeLiquid')
        .description('add liquid')
        .argument('<coin_x_type>')
        .argument('<coin_y_type>')
        .argument('<lp_coin_object_ids>')
        .argument('gaspayment')
        .action(removeLiquid)
}