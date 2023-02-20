import {SDK,CONFIGS} from './main'
//import {d, decimalsMultiplier} from "./utils/number";
import { SUI_COIN_TYPE,USDT_COIN_TYPE} from './constants'

describe('Pool Module',()=>{
    const sdk = new SDK(CONFIGS.devnet);
    test('get pool',async()=>{
        const poolList = await sdk.Pool.getPoolList();
        console.log(poolList);
        const poolDetail = await sdk.Pool.getPoolInfo(SUI_COIN_TYPE,USDT_COIN_TYPE);
        console.log(poolDetail);
        expect(1).toBe(1)
    })
})

describe('Token Module',()=>{
    const sdk = new SDK(CONFIGS.devnet);
    const address = '0x055c9bb0fcfc922633d9cead1f3c85cbf357e4d6';
    test('get token balance',async()=>{
        const sui = await sdk.Coin.getCoinBalance(address,SUI_COIN_TYPE);
        console.log(`sui balance: ${sui.balance}`)
        console.log(sui.objects);
        console.log('----------------------------------------------------');
        const usdt = await sdk.Coin.getCoinBalance(address,USDT_COIN_TYPE);
        console.log(`usdt balance: ${usdt.balance}`)
        console.log(usdt.objects);
        expect(1).toBe(1)
    })
})

describe('Swap Module',()=>{
    const sdk = new SDK(CONFIGS.devnet);

    test('calculate rate',async()=>{
        const fromRate = await sdk.Swap.calculateRate('from',SUI_COIN_TYPE,USDT_COIN_TYPE,1);
        console.log(`from rate: ${fromRate}`);
        console.log('----------------------------------------------------');
        const toRate = await sdk.Swap.calculateRate('to',SUI_COIN_TYPE,USDT_COIN_TYPE,Math.pow(10,6));
        console.log(`to rate: ${toRate}`);
        expect(1).toBe(1)
    })
})