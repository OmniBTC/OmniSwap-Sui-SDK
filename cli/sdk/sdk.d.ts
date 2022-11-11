import { JsonRpcProvider, TxnDataSerializer } from '@mysten/sui.js';
import { NetworkConfiguration } from '../config/configuration';
import { SwapModule, CoinModule, PoolModule, CoinListModule } from '../modules';
export declare class SDK {
    protected _jsonRpcProvider: JsonRpcProvider;
    protected _networkConfiguration: NetworkConfiguration;
    protected _serializer: TxnDataSerializer;
    protected _swap: SwapModule;
    protected _pool: PoolModule;
    protected _token: CoinModule;
    protected _coinList: CoinListModule;
    get jsonRpcProvider(): JsonRpcProvider;
    get Swap(): SwapModule;
    get Pool(): PoolModule;
    get Coin(): CoinModule;
    get CoinList(): CoinListModule;
    get networkOptions(): NetworkConfiguration;
    get serializer(): TxnDataSerializer;
    constructor(networkConfiguration: NetworkConfiguration);
}
