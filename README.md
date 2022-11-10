## OmniSwap-Sui-SDK
The typescript SDK for [Sui-AMM-swap](https://github.com/OmniBTC/Sui-AMM-swap)

## Usage

### Install
```bash
yarn add @omnibtc/omniswap-sui-sdk
```

### Test
```bash
yarn test
```

### Docs
[OmniSwap Sui SDK docs](docs-omniswap-sui.omnibtc.finance)

### Init SDK

```ts
import { SDK,TESTNET_CONFIG } from '@omnibtc/omniswap-sui-sdk';
(async function main() {
    const sdk = new SDK(TESTNET_CONFIG);
})();
```
### Query LiquidPool

```ts
import { SDK,TESTNET_CONFIG } from '@omnibtc/omniswap-sui-sdk';
const SUI_COIN_TYPE = "0x2::sui::SUI";
const USDT_COIN_TYPE = "0xbf2972612002f472b5bd21394b4417d75c9fe887::usdt::USDT";
(async function main() {
    const sdk = new SDK(TESTNET_CONFIG);
    // get all pool list
    const poolDetail = await sdk.Pool.getPoolList();
    // get pool info from coinx and coiny
    const poolDetail = await sdk.Pool.getPoolInfo(SUI_COIN_TYPE,USDT_COIN_TYPE);
    console.log(poolDetail);
})();
```

### CoinList

```ts
...
//get coin list:
const tokenList =  sdk.CoinList.getCoinInfoList();
console.log(tokenList);
```
```ts
//get coin info:
const tokenInfo = sdk.CoinList.getCoinInfoBySymbol('SUI');
console.log(tokenInfo);
```

### Coin
```ts
const SUI_COIN_TYPE = "0x2::sui::SUI";
const USDT_COIN_TYPE = "0xbf2972612002f472b5bd21394b4417d75c9fe887::usdt::USDT";
const address = '0x036e2406b8cf1fc4541ed6d0e252c77b094d0fd9';
...
const token = await sdk.Coin.getTokenBalance(address,SUI_COIN_TYPE);
```
