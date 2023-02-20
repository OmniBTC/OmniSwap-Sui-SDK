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

export type CreateAdminMintPayloadParams = {
    coinTypeArg: string;
    coinCapLock:string,
    walletAddress:string,
    amount: number,
    gasBudget?: number,
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
        const faucetPackageId = this.sdk.networkOptions.faucetPackageId;
        const faucetObjectId = this.sdk.networkOptions.faucetObjectId;
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
    
    // only admin
    async buildAdminMintTestTokensTransaction(createAdminMintPayloadParams: CreateAdminMintPayloadParams) {
        const faucetPackageId = this.sdk.networkOptions.faucetPackageId;
        const txn:MoveCallTransaction = {
            packageObjectId: faucetPackageId,
            module: 'lock',
            function: 'mint_and_transfer',
            arguments: [
                createAdminMintPayloadParams.coinCapLock,
                createAdminMintPayloadParams.amount,
                createAdminMintPayloadParams.walletAddress],
            typeArguments: [createAdminMintPayloadParams.coinTypeArg],
            gasBudget: createAdminMintPayloadParams.gasBudget ? createAdminMintPayloadParams.gasBudget : 10000,
        }
        return txn;
    }

    // async buildSpiltTransaction(signerAddress: string, splitTxn:SplitCoinTransaction) {
    //     const serializer = await this._sdk.serializer.serializeToByte(
    //         signerAddress,
    //         splitTxn
    //     );
    //     return serializer.getData();
    // }

    // async buildMergeTransaction(signerAddress: string, mergeTxn:MergeCoinTransaction) {
    //     const serializer = await this._sdk.serializer.newMergeCoin(
    //         signerAddress,
    //         mergeTxn
    //     );
    //     return serializer.getData();
    // }
 }
 