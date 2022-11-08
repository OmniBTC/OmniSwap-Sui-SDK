import { JsonRpcProvider} from '@mysten/sui.js';
import { NetworkConfiguration } from './config/configuration';
import { SwapModule } from './modules/SwapModule';
import { TokenModule } from './modules/TokenModule';
import { PoolModule } from './modules/PoolModule'

export class SDK {
    protected _jsonRpcProvider: JsonRpcProvider;
    protected _networkConfiguration: NetworkConfiguration;
    protected _swap:SwapModule;
    protected _pool:PoolModule;
    protected _token:TokenModule;
    
    get jsonRpcProvider() {
        return this._jsonRpcProvider;
    }

    get Swap() {
        return this._swap;
    }

    get Pool() {
        return this._pool;
    }

    get Token() {
        return this._token;
    }

    get networkOptions() {
        return this._networkConfiguration;
    }

    constructor(networkConfiguration:NetworkConfiguration) {
        this._jsonRpcProvider = new JsonRpcProvider(networkConfiguration.fullNodeUrl)
        this._networkConfiguration = networkConfiguration;
        this._swap = new SwapModule(this);
        this._token = new TokenModule(this);
        this._pool = new PoolModule(this);
    }
}