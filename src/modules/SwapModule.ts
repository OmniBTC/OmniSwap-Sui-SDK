/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MoveCallTransaction } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import { FEE_MULTIPLIER, FEE_SCALE } from '../constants'

export type CalculateRatesParams = {
  fromToken: string;
  toToken: string;
  amount: bigint;
  interactiveToken: 'from' | 'to',
  pool: {
    lpToken: string,
    moduleAddress: string,
    address: string
  },
}

export type CreateSwapTXPayloadParams = {
  coin_x: string;
  coin_y: string;
  coins_in_objectIds: string[];
  coins_in_value: number;
  coins_out_min: number;
  gasPaymentObjectId: string;
}

export class SwapModule implements IModule {
    protected _sdk: SDK;
    
    get sdk() {
      return this._sdk;
    }
    
    constructor(sdk: SDK) {
      this._sdk = sdk;
    }

    getAmountOut(coin_in: bigint,reserve_in: bigint, reserve_out: bigint) {
      const fee_multiplier = FEE_SCALE - FEE_MULTIPLIER;
      const coin_in_after_fee = coin_in - (coin_in* BigInt(FEE_MULTIPLIER))/ BigInt(FEE_SCALE);
    
      const coin_in_val_after_fees = coin_in_after_fee  * BigInt(fee_multiplier);
    
      const new_reserve_in = (reserve_in * BigInt(FEE_SCALE)) + coin_in_val_after_fees;
    
      const amountOut = coin_in_val_after_fees * reserve_out / new_reserve_in;
      return amountOut;
    
    } 

    async calculateAmountOut(coin_x:string,coin_y:string,coin_in_value:number) {
      const pool = await this.sdk.Pool.getPoolInfo(coin_x, coin_y);
      const coin_x_reserve = pool.coin_x;
      const coin_y_reserce = pool.coin_y;
      const coin_x_in = BigInt(coin_in_value);
      const amoutOut = this.getAmountOut(coin_x_in,coin_x_reserve,coin_y_reserce);
      return amoutOut;
    } 

    buildSwapTransaction(params: CreateSwapTXPayloadParams): MoveCallTransaction{
      const {  packageObjectId,globalId } = this.sdk.networkOptions;
 
      const txn:MoveCallTransaction = {
        packageObjectId:packageObjectId,
        module: 'interface',
        function: 'multi_swap',
        arguments: [globalId,params.coins_in_objectIds,params.coins_in_value,params.coins_out_min],
        typeArguments: [params.coin_x,params.coin_y],
        gasPayment: params.gasPaymentObjectId,
        gasBudget: 10000,
      }
      return txn;
    } 
 }
 