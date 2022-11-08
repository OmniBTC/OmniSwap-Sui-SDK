import { getObjectId,JsonRpcProvider, getObjectFields } from '@mysten/sui.js';

/// Current fee is 0.3%
const FEE_MULTIPLIER: bigint = 30n;
    /// The integer scaling setting for fees calculation.
const FEE_SCALE: bigint = 10000n;

export interface PoolInfo {
    objectId: string,
    global: string,
    tokenX: bigint,
    tokenY: bigint,
    lpType: string,
    lpValue: bigint
}

export class Pool {
   public provider: JsonRpcProvider;
   
   constructor(provider:JsonRpcProvider) {
        this.provider = provider;
   }
   
   async getPoolList():Promise<void>{  
   }

   async getPoolInfo(poolAddress:string): Promise<PoolInfo> {
        const moveObject = await this.provider.getObject(poolAddress);
        const id = getObjectId(moveObject);
        const fields = getObjectFields(moveObject);
        const lpSupply = fields!['lp_supply'];
        const poolInfo: PoolInfo = {
            objectId: id,
            global: fields!['global'],
            tokenX: fields!['sui'],
            tokenY: fields!['token'],
            lpType: lpSupply?.type!,
            lpValue: lpSupply?.fields['value']
        }
        return Promise.resolve(poolInfo);
   }

   async getPrice(poolAddress:string, coinIn:bigint):Promise<bigint> {
        let poolInfo = await this.getPoolInfo(poolAddress);
        let reserveIn = poolInfo.tokenX;
        let reserveOut = poolInfo.tokenY;
        //let lpSupply = poolInfo.lpValue;

        let fee_multiplier = FEE_SCALE - FEE_MULTIPLIER;

        let coin_in_val_after_fees = coinIn * fee_multiplier;
        // reserve_in size after adding coin_in (scaled to 1000)
        let new_reserve_in = (reserveIn * FEE_SCALE) + coin_in_val_after_fees;

        const amounOut = coin_in_val_after_fees * reserveOut / new_reserve_in;
        return Promise.resolve(amounOut);
   }
}

