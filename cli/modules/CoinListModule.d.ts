import { IModule } from '../interfaces/IModule';
import { SDK } from '../sdk';
import { RawCoinInfo } from '../coins';
export declare class CoinListModule implements IModule {
    protected _sdk: SDK;
    fullnameToCoinInfo: Record<string, RawCoinInfo>;
    symbolToCoinInfo: Record<string, RawCoinInfo>;
    typeToCoinInfo: Record<string, RawCoinInfo>;
    coinList: RawCoinInfo[];
    constructor(sdk: SDK);
    get sdk(): SDK;
    private buildCache;
    getCoinInfoList(): RawCoinInfo[];
    getCoinInfoBySymbol(symbol: string): RawCoinInfo;
    getCoinInfoByType(tokenType: string): RawCoinInfo;
    getCoinInfoByfullName(fullname: string): RawCoinInfo;
}
//# sourceMappingURL=CoinListModule.d.ts.map