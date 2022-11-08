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

// SUI的balance 是一系列 object 余额相加起来
// coinTypeArg: "0x2::sui::SUI"
export async function getCoinBalance(provider:JsonRpcProvider,coinTypeArg:string,address:string) {
    const coinMoveObjects = await provider.getCoinBalancesOwnedByAddress(address);
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
