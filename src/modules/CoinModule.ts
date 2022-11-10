import { getObjectId, Coin,MoveCallTransaction } from '@mysten/sui.js';
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

export class CoinModule implements IModule {
    protected _sdk: SDK;
    
    get sdk() {
      return this._sdk;
    }
    
    constructor(sdk: SDK) {
      this._sdk = sdk;
    }

    // coinTypeArg: "0x2::sui::SUI"
    async getTokenBalance(address:string,coinTypeArg:string) {
        const coinMoveObjects = await this._sdk.jsonRpcProvider.getCoinBalancesOwnedByAddress(address);
        const balanceObjects: CoinInfo[] = [];
        coinMoveObjects.forEach(object => {
            if (!Coin.isCoin(object)) {
                return;
            }
            if (coinTypeArg != Coin.getCoinTypeArg(object)) {
                return;
            }
            const coinObjectId = getObjectId(object);
            const balance = Coin.getBalance(object)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const coinSymbol = Coin.getCoinSymbol(coinTypeArg!);
            
            balanceObjects.push({
                id: coinObjectId,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                balance: balance!,
                coinSymbol: coinSymbol
            })
        })
        const balanceSum = Coin.totalBalance(coinMoveObjects)
        return {
            balance: balanceSum,
            objects: balanceObjects
        }
    }

    async buildFaucetTransaction(coinTypeArg: string) {
        const faucetPackageId = "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1";
        const faucetObjectId = "0xa1edadeb50fc367837b6d37f361d6f7ee4688fdb";
        const txn:MoveCallTransaction = {
            packageObjectId: faucetPackageId,
            module: 'faucet',
            function: 'claim',
            arguments: [faucetObjectId],
            typeArguments: [coinTypeArg],
            gasBudget: 10000,
        }
        return txn;
    }
 }
 