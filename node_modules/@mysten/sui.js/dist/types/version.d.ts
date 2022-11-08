export declare type RpcApiVersion = {
    major: number;
    minor: number;
    patch: number;
};
export declare function parseVersionFromString(version: string): RpcApiVersion | undefined;
