export type PoolInfo = {
    object_id:string
    global: string,
    coin_x: bigint,
    coin_y: bigint,
    fee_coin_y: bigint,
    fee_coin_x: bigint,
    lp_type: string,
    lp_supply: bigint
};

export type TxPayloadCallFunction = {
    packageObjectId: string;
    module: string;
    function: string;
    typeArguments: string[];
    arguments: string[];
    gasBudget: number;
  };