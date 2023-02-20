import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import { REQUESTS_MAINNET,REQUESTS_TESTNET,REQUESTS_DEVNET, RawCoinInfo} from '../coins';

export class CoinListModule implements IModule {
    protected _sdk: SDK;
    public fullnameToCoinInfo: Record<string, RawCoinInfo>;
    public symbolToCoinInfo: Record<string, RawCoinInfo>;
    public typeToCoinInfo: Record<string, RawCoinInfo>;
    public coinList: RawCoinInfo[];
    
    constructor(sdk: SDK) {
      this._sdk = sdk;
      const networkName = sdk.networkOptions.name;
      this.coinList = networkName === 'devnet' ? REQUESTS_DEVNET :
               (networkName === 'testnet' ? REQUESTS_TESTNET : REQUESTS_MAINNET);
      this.fullnameToCoinInfo = {};
      this.symbolToCoinInfo = {};
      this.typeToCoinInfo = {};
      this.buildCache();
    }

    get sdk() {
      return this._sdk;
    }

    private buildCache() {
      for (const tokenInfo of this.coinList) {
        this.symbolToCoinInfo[tokenInfo.symbol] = tokenInfo;
        this.typeToCoinInfo[tokenInfo.token_type.type] = tokenInfo;
        this.fullnameToCoinInfo[tokenInfo.name] = tokenInfo;
      }
    }

    getCoinInfoList() {
       return this.coinList;
    }    

    getCoinInfoBySymbol(symbol: string) {
      return this.symbolToCoinInfo[symbol];
    }

    getCoinInfoByType(tokenType: string) {
      return this.typeToCoinInfo[tokenType];
    }

    getCoinInfoByfullName(fullname: string) {
      return this.typeToCoinInfo[fullname];
    }
}