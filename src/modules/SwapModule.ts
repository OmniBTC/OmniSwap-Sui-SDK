/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MoveCallTransaction } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk/sdk';


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
 