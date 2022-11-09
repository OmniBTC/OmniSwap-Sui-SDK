/* eslint-disable @typescript-eslint/no-empty-function */
import { getObjectId,JsonRpcProvider, getObjectFields } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import { extractAddressFromType, isSortedSymbols} from "../utils/contracts";
import { TxPayloadCallFunction } from '../types'

import Decimal from "decimal.js";

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

export type CreateTXPayloadParams = {
  fromToken: string;
  toToken: string;
  fromAmount: bigint;
  toAmount: bigint;
  interactiveToken: 'from' | 'to';
  slippage: number,
  pool: {
    lpToken: string,
    moduleAddress: string,
    address: string
  },
}


export class SwapModule implements IModule {
    protected _sdk: SDK;
    
    get sdk() {
      return this._sdk;
    }
    
    constructor(sdk: SDK) {
      this._sdk = sdk;
    }

    async calculateRates(params: CalculateRatesParams):Promise<void>{

    }

    createSwapTransactionPayload(params: CreateTXPayloadParams):void {
      const { packageObjectId } = this.sdk.networkOptions;
      

    }

 }
 