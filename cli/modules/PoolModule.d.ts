import { MoveCallTransaction } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule';
import { SDK } from '../sdk';
import { Pool, PoolInfo } from '../types';
import Decimal from "decimal.js";
export declare type CreateAddLiquidTXPayloadParams = {
    coin_x: string;
    coin_y: string;
    coin_x_objectIds: string[];
    coin_y_objectIds: string[];
    coin_x_amount: number;
    coin_y_amount: number;
    gasPaymentObjectId: string;
    slippage: number;
};
export declare type CreateRemoveLiquidTXPayloadParams = {
    coin_x: string;
    coin_y: string;
    lp_coin_objectIds: string[];
    gasPaymentObjectId: string;
};
export declare class PoolModule implements IModule {
    protected _sdk: SDK;
    get sdk(): SDK;
    constructor(sdk: SDK);
    getPoolList(): Promise<Pool[]>;
    getPoolInfo(coinXType: string, coinYType: string): Promise<PoolInfo>;
    getCoinOut(coinInVal: Decimal.Instance, reserveInSize: Decimal.Instance, reserveOutSize: Decimal.Instance): Decimal;
    getCoinIn(coinOutVal: Decimal.Instance, reserveOutSize: Decimal.Instance, reserveInSize: Decimal.Instance): Decimal;
    calculateRate(interactiveToken: string, coin_x: string, coin_y: string, coin_in_value: number): Promise<Decimal>;
    buildAddLiquidTransAction(params: CreateAddLiquidTXPayloadParams): MoveCallTransaction;
    buildRemoveLiquidTransAction(params: CreateRemoveLiquidTXPayloadParams): MoveCallTransaction;
}
