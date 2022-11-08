import { getObjectId,JsonRpcProvider, getObjectFields } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import { PoolInfo } from '../types';

/// Current fee is 0.3%
const FEE_MULTIPLIER: bigint = 30n;
    /// The integer scaling setting for fees calculation.
const FEE_SCALE: bigint = 10000n;

export class PoolModule implements IModule {

   protected _sdk: SDK;
   
   get sdk() {
     return this._sdk;
   }
   
   constructor(sdk: SDK) {
     this._sdk = sdk;
   }

   async getPoolList():Promise<void>{  
   }

   async getPoolInfo(poolAddress:string): Promise<PoolInfo> {
        const moveObject = await this._sdk.jsonRpcProvider.getObject(poolAddress);
        const id = getObjectId(moveObject);
        const fields = getObjectFields(moveObject);
        const lpSupply = fields!['lp_supply'];
        const poolInfo: PoolInfo = {
            object_id: id,
            global: fields!['global'],
            coin_x: BigInt(fields!['coin_x']),
            coin_y: BigInt(fields!['coin_y']),
            fee_coin_x: BigInt(fields!['fee_coin_x']),
            fee_coin_y: BigInt(fields!['fee_coin_y']),
            lp_type: lpSupply?.type!,
            lp_supply: lpSupply?.fields['value']
        }
        return Promise.resolve(poolInfo);
   }

   async getPrice(poolAddress:string, coinIn:bigint):Promise<bigint> {
        let poolInfo = await this.getPoolInfo(poolAddress);
        let reserveIn = poolInfo.coin_x;
        let reserveOut = poolInfo.coin_y;
        //let lpSupply = poolInfo.lpValue;
        let fee_multiplier = FEE_SCALE - FEE_MULTIPLIER;

        let coin_in_val_after_fees = coinIn * fee_multiplier;
        // reserve_in size after adding coin_in (scaled to 1000)
        let new_reserve_in = (reserveIn * FEE_SCALE) + coin_in_val_after_fees;

        const amounOut = coin_in_val_after_fees * reserveOut / new_reserve_in;
        return Promise.resolve(amounOut);
   }
}
