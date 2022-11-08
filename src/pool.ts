import { getObjectId,JsonRpcProvider, getObjectFields } from '@mysten/sui.js';

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

   async getPoolDetail(poolAddress:string): Promise<PoolInfo> {
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
        return  Promise.resolve(poolInfo);
   }
}

