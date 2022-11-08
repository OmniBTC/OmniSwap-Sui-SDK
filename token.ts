import { getObjectId,JsonRpcProvider,Coin } from '@mysten/sui.js';

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

export class Token {
    public jsonProvider:JsonRpcProvider;
    public coinTypeArg:string;
    
    constructor(jsonProvider:JsonRpcProvider, coinTypeArg:string) {
        this.jsonProvider = jsonProvider;
        this.coinTypeArg = coinTypeArg;
    }

    // SUI的balance 是一系列 object 余额相加起来
    // coinTypeArg: "0x2::sui::SUI"
    async getTokenBalance(address:string) {
        const coinMoveObjects = await this.jsonProvider.getCoinBalancesOwnedByAddress(address);
        let balanceObjects: CoinInfo[] = [];
        coinMoveObjects.forEach(object => {
            if (!Coin.isCoin(object)) {
                return;
            }
            let coinObjectId = getObjectId(object);
            let balance = Coin.getBalance(object)
            let coinSymbol = Coin.getCoinSymbol(this.coinTypeArg!);
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
    
    async getTokenInfo() {

    }
}
