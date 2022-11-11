import { MoveCallTransaction } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule';
import { SDK } from '../sdk';
import Decimal from "decimal.js";
export declare type CalculateRatesParams = {
    fromToken: string;
    toToken: string;
    amount: bigint;
    interactiveToken: 'from' | 'to';
    pool: {
        lpToken: string;
        moduleAddress: string;
        address: string;
    };
};
export declare type CreateSwapTXPayloadParams = {
    coin_x: string;
    coin_y: string;
    coins_in_objectIds: string[];
    coins_in_value: number;
    coins_out_min: number;
    gasPaymentObjectId: string;
};
export declare class SwapModule implements IModule {
    protected _sdk: SDK;
    get sdk(): SDK;
    constructor(sdk: SDK);
    getCoinOutWithFees(coinInVal: Decimal.Instance, reserveInSize: Decimal.Instance, reserveOutSize: Decimal.Instance): Decimal;
    getCoinInWithFee(coinOutVal: Decimal.Instance, reserveOutSize: Decimal.Instance, reserveInSize: Decimal.Instance): Decimal;
    calculateRate(interactiveToken: string, coin_x: string, coin_y: string, coin_in_value: number): Promise<Decimal>;
    buildSwapTransaction(params: CreateSwapTXPayloadParams): MoveCallTransaction;
}
export declare function withSlippage(value: Decimal.Instance, slippage: Decimal.Instance, mode: 'plus' | 'minus'): Decimal;
