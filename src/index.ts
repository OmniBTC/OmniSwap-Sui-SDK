export const POOL_SUI_USDT = "0xdc117aec53ba851e1fca972c95bc1c2f794bfadb";
import { SDK } from './sdk/sdk';
import { TESTNET_CONFIG } from './config/configuration';
//import { CreateSwapTXPayloadParams } from './modules';
const SUI_COIN_TYPE = "0x2::sui::SUI";
const USDT_COIN_TYPE = "0xbf2972612002f472b5bd21394b4417d75c9fe887::usdt::USDT";

(async function main() {
    const address = '0x036e2406b8cf1fc4541ed6d0e252c77b094d0fd9';

    const sdk = new SDK(TESTNET_CONFIG);

    const poolDetail = await sdk.Pool.getPoolInfo(SUI_COIN_TYPE,USDT_COIN_TYPE);

    console.log(poolDetail);
    const price = await sdk.Pool.getPrice(SUI_COIN_TYPE,USDT_COIN_TYPE,BigInt(1))
    console.log(`price: ${price}`)

    const token = await sdk.Coin.getTokenBalance(address,SUI_COIN_TYPE);
    const amounOut = await sdk.Swap.calculateAmountOut(SUI_COIN_TYPE,USDT_COIN_TYPE,2)
    console.log(`amountOut: ${amounOut}`)
    const balance = token.balance;
    console.log(`balance: ${balance}`)
    const tokenList = sdk.CoinList.getCoinInfoList();
    console.log(tokenList);

    const tokenInfo = sdk.CoinList.getCoinInfoBySymbol('SUI');
    console.log(tokenInfo);
})();