import { getObjectId, Coin,MoveCallTransaction,SplitCoinTransaction,MergeCoinTransaction } from '@mysten/sui.js';
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
    async getCoinBalance(address:string,coinTypeArg:string) {
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
        const balanceSum:number = balanceObjects.reduce((pre,cur)=> {
           return  Number(cur.balance) + pre
        },0)
        return {
            balance: balanceSum,
            objects: balanceObjects
        }
    }

    async buildFaucetTokenTransaction(coinTypeArg: string) {
        const faucetPackageId = "0x985c26f5edba256380648d4ad84b202094a4ade3";
        const faucetObjectId = "0x50ed67cc1d39a574301fa8d71a47419e9b297bab";
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

    async buildSpiltTransaction(signerAddress: string, splitTxn:SplitCoinTransaction) {
        const serializer = await this._sdk.serializer.newSplitCoin(
            signerAddress,
            splitTxn
        );
        return serializer.getData();
    }

    async buildMergeTransaction(signerAddress: string, mergeTxn:MergeCoinTransaction) {
        const serializer = await this._sdk.serializer.newMergeCoin(
            signerAddress,
            mergeTxn
        );
        return serializer.getData();
    }
 }
 