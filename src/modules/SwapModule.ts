/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';


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
 }
 