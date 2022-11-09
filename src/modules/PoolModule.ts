import { getObjectId, getObjectFields } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import { PoolInfo } from '../types';

/// Current fee is 0.3%
const FEE_MULTIPLIER = 30;
    /// The integer scaling setting for fees calculation.
const FEE_SCALE = 10000;

export class PoolModule implements IModule {

   protected _sdk: SDK;
   
   get sdk() {
     return this._sdk;
   }
   
   constructor(sdk: SDK) {
     this._sdk = sdk;
   }

   // eslint-disable-next-line @typescript-eslint/no-empty-function
   async getPoolList():Promise<void>{  
   }

   async getPoolInfo(poolAddress:string): Promise<PoolInfo> {
        const moveObject = await this._sdk.jsonRpcProvider.getObject(poolAddress);
        const id = getObjectId(moveObject);
        const fields = getObjectFields(moveObject);
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

   async getPrice(poolAddress:string, coinIn:bigint):Promise<bigint> {
        const poolInfo = await this.getPoolInfo(poolAddress);
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
}
