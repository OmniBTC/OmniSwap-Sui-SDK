import { MoveCallTransaction, SplitCoinTransaction, MergeCoinTransaction } from '@mysten/sui.js';
import { IModule } from '../interfaces/IModule';
import { SDK } from '../sdk';
export declare const SUI_COIN_TYPE = "0x2::sui::SUI";
export interface CoinInfo {
    id: string;
    balance: bigint;
    coinSymbol: string;
}
export interface CoinObjects {
    balance: bigint;
    objects: CoinInfo[];
}
export declare type CreateAdminMintPayloadParams = {
    coinTypeArg: string;
    coinCapLock: string;
    walletAddress: string;
    amount: number;
    gasBudget?: number;
};
export declare class CoinModule implements IModule {
    protected _sdk: SDK;
    get sdk(): SDK;
    constructor(sdk: SDK);
    getCoinBalance(address: string, coinTypeArg: string): Promise<{
        balance: number;
        objects: CoinInfo[];
    }>;
    buildFaucetTokenTransaction(coinTypeArg: string): Promise<MoveCallTransaction>;
    buildAdminMintTestTokensTransaction(createAdminMintPayloadParams: CreateAdminMintPayloadParams): Promise<MoveCallTransaction>;
    buildSpiltTransaction(signerAddress: string, splitTxn: SplitCoinTransaction): Promise<Uint8Array>;
    buildMergeTransaction(signerAddress: string, mergeTxn: MergeCoinTransaction): Promise<Uint8Array>;
}
//# sourceMappingURL=CoinModule.d.ts.map