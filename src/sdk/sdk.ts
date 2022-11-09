import { JsonRpcProvider, RpcTxnDataSerializer, TxnDataSerializer} from '@mysten/sui.js';
import { NetworkConfiguration } from '../config/configuration';
import { SwapModule,TokenModule,PoolModule } from '../modules';

export class SDK {
    protected _jsonRpcProvider: JsonRpcProvider;
    protected _networkConfiguration: NetworkConfiguration;
    protected _serializer: TxnDataSerializer;
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

    get serializer() {
        return this._serializer;
    }

    constructor(networkConfiguration:NetworkConfiguration) {
        this._jsonRpcProvider = new JsonRpcProvider(networkConfiguration.fullNodeUrl)
        this._serializer = new RpcTxnDataSerializer(this._jsonRpcProvider.endpoints.fullNode, 
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._jsonRpcProvider.options.skipDataValidation!)
        this._networkConfiguration = networkConfiguration;
        this._swap = new SwapModule(this);
        this._token = new TokenModule(this);
        this._pool = new PoolModule(this);
    }
}