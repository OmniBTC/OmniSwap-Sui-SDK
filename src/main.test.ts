import {SDK,CONFIGS} from './main'
//import {d, decimalsMultiplier} from "./utils/number";
import { SUI_COIN_TYPE,USDT_COIN_TYPE} from './constants'

describe('Pool Module',()=>{
    const sdk = new SDK(CONFIGS.testnet);
    const poolList = sdk.Pool.getPoolList();
    console.log(poolList);

    const poolDetail = sdk.Pool.getPoolInfo(SUI_COIN_TYPE,USDT_COIN_TYPE);
    console.log(poolDetail);

    expect(1).toBe(1)

})