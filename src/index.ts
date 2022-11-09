export const POOL_SUI_USDT = "0xdc117aec53ba851e1fca972c95bc1c2f794bfadb";
import { SDK } from './sdk';
import { DEVNET_CONFIG } from './config/configuration';
//import { CreateSwapTXPayloadParams } from './modules';
const SUI_COIN_TYPE = "0x2::sui::SUI";
const USDT_COIN_TYPE = "0x23d2590e4f6afdbb5c599ef7b1d6d93f5e10afd3::usdt::USDT";

(async function main() {
    const address = '0x036e2406b8cf1fc4541ed6d0e252c77b094d0fd9';

    const sdk = new SDK(DEVNET_CONFIG);

    const poolDetail = await sdk.Pool.getPoolInfo(SUI_COIN_TYPE,USDT_COIN_TYPE);

    console.log(poolDetail);
    const price = await sdk.Pool.getPrice(SUI_COIN_TYPE,USDT_COIN_TYPE,BigInt(1))
    console.log(`price: ${price}`)

    const token = await sdk.Token.getTokenBalance(address,SUI_COIN_TYPE);
    const balance = token.balance;
    console.log(`balance: ${balance}`)
})();