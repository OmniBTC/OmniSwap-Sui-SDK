export declare class NetworkConfiguration {
    name: string;
    fullNodeUrl: string;
    packageObjectId: string;
    globalId: string;
    poolsDynamicId: string;
    faucetPackageId: string;
    faucetObjectId: string;
    isMainNet: boolean;
    constructor(name: string, fullNodeUrl: string, packageObjectId: string, globalId: string, poolsDynamicId: string, faucetPackageId: string, faucetObjectId: string, isMainNet?: boolean);
}
export declare const MAINNET_CONFIG: NetworkConfiguration;
export declare const TESTNET_CONFIG: NetworkConfiguration;
export declare const CONFIGS: {
    mainnet: NetworkConfiguration;
    testnet: NetworkConfiguration;
};
//# sourceMappingURL=configuration.d.ts.map