export declare type TokenType = {
    type: string;
    account_address: string;
    module_name: string;
    struct_name: string;
};
export declare type ExtensionType = {
    data: [string, string][];
};
export declare type RawCoinInfo = {
    name: string;
    symbol: string;
    official_symbol: string;
    coingecko_id: string;
    decimals: number;
    logo_url: string;
    project_url: string;
    token_type: TokenType;
    extensions: ExtensionType;
};
