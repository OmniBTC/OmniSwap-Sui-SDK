import { getObjectId,JsonRpcProvider,Coin } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';

export const SUI_COIN_TYPE = "0x2::sui::SUI";

export interface CoinInfo {
    id: string,
    balance: bigint,
    coinSymbol: string,
}

export interface CoinObjects {
    balance: bigint,
    objects: CoinInfo[]
}

export class TokenModule implements IModule {
    protected _sdk: SDK;
    
    get sdk() {
      return this._sdk;
    }
    
    constructor(sdk: SDK) {
      this._sdk = sdk;
    }

    // SUI的balance 是一系列 object 余额相加起来
    // coinTypeArg: "0x2::sui::SUI"
    async getTokenBalance(address:string,coinTypeArg:string) {
        const coinMoveObjects = await this._sdk.jsonRpcProvider.getCoinBalancesOwnedByAddress(address);
        let balanceObjects: CoinInfo[] = [];
        coinMoveObjects.forEach(object => {
            if (!Coin.isCoin(object)) {
                return;
            }
            let coinObjectId = getObjectId(object);
            let balance = Coin.getBalance(object)
            let coinSymbol = Coin.getCoinSymbol(coinTypeArg!);
            balanceObjects.push({
                id: coinObjectId,
                balance: balance!,
                coinSymbol: coinSymbol
            })
        })
        let balanceSum = Coin.totalBalance(coinMoveObjects)
        return {
            balance: balanceSum,
            objects: balanceObjects
        }
    }
 }
 