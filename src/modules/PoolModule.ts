/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getObjectId, getObjectFields, MoveCallTransaction } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import { Pool,PoolInfo } from '../types';
import { checkPairValid } from '../utils/contracts'

/// Current fee is 0.3%
const FEE_MULTIPLIER = 30;
    /// The integer scaling setting for fees calculation.
const FEE_SCALE = 10000;

export type CreateAddLiquidTXPayloadParams = {
  coin_x: string;
  coin_y: string;
  coin_x_objectIds: string[],
  coin_y_objectIds: string[],
  coin_x_amount: number;
  coin_y_amount: number;
  gasPaymentObjectId: string;
  slippage: number;
}

export class PoolModule implements IModule {

   protected _sdk: SDK;
   
   get sdk() {
     return this._sdk;
   }
   
   constructor(sdk: SDK) {
     this._sdk = sdk;
   }

   // eslint-disable-next-line @typescript-eslint/no-empty-function
   async getPoolList():Promise<Pool[]>{  
      const { poolsDynamicId } = this.sdk.networkOptions;
      const poolsObjects = await this._sdk.jsonRpcProvider.getObjectsOwnedByObject(
        poolsDynamicId
      );
      const pools:Pool[] = [];
      poolsObjects.forEach(pool=> {
        pools.push({
          pool_addr: pool['objectId'],
          pool_type: pool['type'],
        })
      })
      return Promise.resolve(pools)
   }

   async getPoolInfo(coinXType:string, coinYType: string): Promise<PoolInfo> {
        const poolList:Pool[] = await this.getPoolList();
        if (!checkPairValid(coinXType,coinYType)) {
          Promise.reject('Invalid Pair');
        }
        if (!this.sdk.CoinList.getCoinInfoByType(coinXType) || !this.sdk.CoinList.getCoinInfoByType(coinYType)) {
          Promise.reject('Coin Not In Offical Coin List')
        }

        const pool:Pool | undefined = poolList.find(pool => {
            return pool.pool_type.includes(coinXType) && pool.pool_type.includes(coinYType);
        })
        
        const moveObject = await this._sdk.jsonRpcProvider.getObject(pool!.pool_addr);

        const id = getObjectId(moveObject);
        const fields = getObjectFields(moveObject)!['value']!['fields'];
        if (!fields) {
          Promise.reject();
        }
        const lpSupply = fields?.['lp_supply'];
        const poolInfo: PoolInfo = {
            object_id: id,
            global: fields?.['global'],
            coin_x: BigInt(fields?.['coin_x']),
            coin_y: BigInt(fields?.['coin_y']),
            fee_coin_x: BigInt(fields?.['fee_coin_x']),
            fee_coin_y: BigInt(fields?.['fee_coin_y']),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
            lp_type: String(lpSupply?.type!),
            lp_supply: lpSupply?.fields['value']
        }
        return Promise.resolve(poolInfo);
   }

   async getPrice(coinXType:string, coinYType: string, coinIn:bigint):Promise<bigint> {
        const poolInfo = await this.getPoolInfo(coinXType, coinYType);
        const reserveIn = poolInfo.coin_x;
        const reserveOut = poolInfo.coin_y;
        //let lpSupply = poolInfo.lpValue;
        const fee_multiplier = FEE_SCALE - FEE_MULTIPLIER;

        const coin_in_val_after_fees = coinIn * BigInt(fee_multiplier);
        // reserve_in size after adding coin_in (scaled to 1000)
        const new_reserve_in = (reserveIn * BigInt(FEE_SCALE)) + coin_in_val_after_fees;

        const amounOut = coin_in_val_after_fees * reserveOut / new_reserve_in;
        return Promise.resolve(amounOut);
   }

  buildAddLiquidTransAction(params: CreateAddLiquidTXPayloadParams): MoveCallTransaction{
     const {  packageObjectId,globalId } = this.sdk.networkOptions;

     const txn:MoveCallTransaction = {
       packageObjectId:packageObjectId,
       module: 'interface',
       function: 'multi_add_liquidity',
       arguments: [globalId,params.coin_x_objectIds,params.coin_x_amount, 
        params.coin_x_amount * params.slippage, params.coin_y_objectIds,params.coin_y_amount,params.coin_y_amount*params.slippage],
       typeArguments: [params.coin_x,params.coin_y],
       gasPayment: params.gasPaymentObjectId,
       gasBudget: 10000,
     }
     return txn;
   } 
}
