/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MoveCallTransaction } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import {d} from "../utils/number";
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

    getCoinOutWithFees(
      coinInVal: Decimal.Instance,
      reserveInSize: Decimal.Instance,
      reserveOutSize: Decimal.Instance
    ) {
      const { feePct, feeScale } = { feePct: d(3), feeScale: d(1000) };
      const feeMultiplier = feeScale.sub(feePct);
      const coinInAfterFees = coinInVal.mul(feeMultiplier);
      const newReservesInSize = reserveInSize.mul(feeScale).plus(coinInAfterFees);
    
      return coinInAfterFees.mul(reserveOutSize).div(newReservesInSize).toDP(0);
    }

    getCoinInWithFee(coinOutVal: Decimal.Instance,
      reserveOutSize: Decimal.Instance,
      reserveInSize: Decimal.Instance) {
      const { feePct, feeScale } = { feePct: d(3), feeScale: d(1000) };
      const feeMultiplier = feeScale.sub(feePct);
      const newReservesOutSize = reserveOutSize.sub(coinOutVal).mul(feeMultiplier);

      return coinOutVal.mul(feeScale).mul(reserveInSize).div(newReservesOutSize).plus(1).toDP(0);
    
    } 

    async calculateRate(interactiveToken: string,coin_x:string,coin_y:string,coin_in_value:number) {
      const fromCoinInfo = this.sdk.CoinList.getCoinInfoByType(coin_x);
      const toCoinInfo = this.sdk.CoinList.getCoinInfoByType(coin_y);
      if (!fromCoinInfo) {
        throw new Error('From Coin not exists');
      } 
      if (!toCoinInfo) {
        throw new Error('To Coin not exits');
      }
      const pool = await this.sdk.Pool.getPoolInfo(coin_x, coin_y);
      const coin_x_reserve = pool.coin_x;
      const coin_y_reserce = pool.coin_y;

      const [reserveX, reserveY] = 
        interactiveToken === 'from' ? [coin_x_reserve,coin_y_reserce] : [coin_y_reserce,coin_x_reserve];

      const coin_x_in = d(coin_in_value);

      const amoutOut = 
         interactiveToken === 'from' ? this.getCoinOutWithFees(d(coin_x_in),d(reserveX),d(reserveY)) 
         : this.getCoinInWithFee(coin_x_in,d(reserveX),d(reserveY));
      
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
 
 export function withSlippage(value: Decimal.Instance, slippage: Decimal.Instance, mode: 'plus' | 'minus') {
  return d(value)[mode](d(value).mul(slippage)).toDP(0);
}