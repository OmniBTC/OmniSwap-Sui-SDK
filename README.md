## OmniSwap-Sui-SDK
The typescript SDK for [Sui-AMM-swap](https://github.com/OmniBTC/Sui-AMM-swap)

## Docs
[OmniSwap Sui SDK docs](https://docs-omniswap-sui.omnibtc.finance)

## Usage

### Install
```bash
yarn add @omnibtc/omniswap-sui-sdk
```

### Test
```bash
yarn test
```

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

## CLI
yarn cli
```
 ____            _              _      __  __   __  __            ____   _       ___ 
 / ___|   _   _  (_)            / \    |  \/  | |  \/  |          / ___| | |     |_ _|
 \___ \  | | | | | |  _____    / _ \   | |\/| | | |\/| |  _____  | |     | |      | | 
  ___) | | |_| | | | |_____|  / ___ \  | |  | | | |  | | |_____| | |___  | |___   | | 
 |____/   \__,_| |_|         /_/   \_\ |_|  |_| |_|  |_|          \____| |_____| |___|
                                                                                      
Usage: index [options] [command]

Options:
  -c, --config <path>                                                                                                                             path to your sui config.yml (generated with "sui client active-address")
  -h, --help                                                                                                                                      display help for command

Commands:
  omniswap:faucet <coin_type>                                                                                                                     faucet token
  omniswap:wallet                                                                                                                                 print wallet 
  omniswap:addLiquid <coin_x_type> <coin_y_type> <coin_x_object_ids> <coin_x_amount> <coin_y_object_ids> <coin_y_amount> <slippage> <gaspayment>  add liquid
  help [command]                                                                                                                                  display help for command
```

### Add Liquid
```
yarn cli -c ~/.sui/sui_config omniswap:addLiquid 0x985c26f5edba256380648d4ad84b202094a4ade3::usdt::USDT 0x985c26f5edba256380648d4ad84b202094a4ade3::xbtc::XBTC 0xc9e9cd5042b0df537426abc1e2f4b20babd07186 1 0x74d246f80c53ab48d0b7b23387d8e1dc64536265 1 1 0xf3a028216f202bba58f2520a3ed6aca6c5d4275e
```