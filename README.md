## Omniswap-Sui-SDK
The typescript SDK for [Sui-AMM-swap](https://github.com/OmniBTC/Sui-AMM-swap)

## Usage

### Install
```bash
yarn add @omnibtc/omniswap-sui-sdk
```

### Init SDK

```ts
import { SDK,DEVNET_CONFIG } from '@omnibtc/omniswap-sui-sdk';

const SUI_COIN_TYPE = "0x2::sui::SUI";
const USDT_COIN_TYPE = "0xbf2972612002f472b5bd21394b4417d75c9fe887::usdt::USDT";

(async function main() {
    const address = '0x036e2406b8cf1fc4541ed6d0e252c77b094d0fd9';

    const sdk = new SDK(DEVNET_CONFIG);
    
    const poolDetail = await sdk.Pool.getPoolInfo(SUI_COIN_TYPE,USDT_COIN_TYPE);
    console.log(poolDetail);
    const price = await sdk.Pool.getPrice(SUI_COIN_TYPE,USDT_COIN_TYPE,BigInt(1))
    console.log(`price: ${price}`)

    const token = await sdk.Token.getTokenBalance(address,SUI_COIN_TYPE);
    const balance = token.balance;
    console.log(`balance: ${balance}`
})();

```