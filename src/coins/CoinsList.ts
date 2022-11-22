import { RawCoinInfo } from "./types";

export const REQUESTS_MAINNET: RawCoinInfo[] = [

  {
    "name": "Tether USD",
    "symbol": "USDT",
    "official_symbol": "USDT",
    "coingecko_id": "tether",
    "decimals": 8,
    "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
    "project_url": "",
    "token_type": {
      "type": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1::usdt::USDT",
      "account_address": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1",
      "module_name": "usdt",
      "struct_name": "USDT"
    },
    "extensions": {
      "data": []
    }
  },
 
  {
    "name": "XBTC",
    "symbol": "XBTC",
    "official_symbol": "XBTC",
    "coingecko_id": "",
    "decimals": 8,
    "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
    "project_url": "https://github.com/OmniBTC/OmniBridge",
    "token_type": {
      "type": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1::xbtc::XBTC",
      "account_address": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1",
      "module_name": "xbtc",
      "struct_name": "XBTC"
    },
    "extensions": {
      "data": []
    }
  },

    {
      "name": "Sui Coin",
      "symbol": "SUI",
      "official_symbol": "SUI",
      "coingecko_id": "Sui",
      "decimals": 9,
      "logo_url": "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
      "project_url": "http://sui.io/",
      "token_type": {
        "type": "0x2::sui::SUI",
        "account_address": "0x2",
        "module_name": "sui",
        "struct_name": "SUI"
      },
      "extensions": {
        "data": []
      }
    }
]

export const REQUESTS_TESTNET: RawCoinInfo[] = [

    {
      "name": "Tether USD",
      "symbol": "USDT",
      "official_symbol": "USDT",
      "coingecko_id": "tether",
      "decimals": 8,
      "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
      "project_url": "",
      "token_type": {
        "type": "0x985c26f5edba256380648d4ad84b202094a4ade3::usdt::USDT",
        "account_address": "0x985c26f5edba256380648d4ad84b202094a4ade3",
        "module_name": "usdt",
        "struct_name": "USDT"
      },
      "extensions": {
        "data": []
      }
    },
    {
      "name": "XBTC",
      "symbol": "XBTC",
      "official_symbol": "XBTC",
      "coingecko_id": "",
      "decimals": 8,
      "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
      "project_url": "https://github.com/OmniBTC/OmniBridge",
      "token_type": {
        "type": "0x985c26f5edba256380648d4ad84b202094a4ade3::xbtc::XBTC",
        "account_address": "0x985c26f5edba256380648d4ad84b202094a4ade3",
        "module_name": "xbtc",
        "struct_name": "XBTC"
      },
      "extensions": {
        "data": []
      }
    },
    {
      "name": "Sui Coin",
      "symbol": "SUI",
      "official_symbol": "SUI",
      "coingecko_id": "Sui",
      "decimals": 9,
      "logo_url": "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
      "project_url": "http://sui.io/",
      "token_type": {
        "type": "0x2::sui::SUI",
        "account_address": "0x2",
        "module_name": "sui",
        "struct_name": "SUI"
      },
      "extensions": {
        "data": []
      }
    },
    {
      "name": "BTC",
      "symbol": "BTC",
      "official_symbol": "BTC",
      "coingecko_id": "",
      "decimals": 8,
      "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
      "project_url": "https://github.com/OmniBTC/OmniBridge",
      "token_type": {
        "type": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::btc::BTC",
        "account_address": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1",
        "module_name": "btc",
        "struct_name": "BTC"
      },
      "extensions": {
        "data": []
      }
    },
    {
      "name": "Binance Coin",
      "symbol": "BNB",
      "official_symbol": "BNB",
      "coingecko_id": "binancecoin",
      "decimals": 8,
      "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BNB.svg",
      "project_url": "",
      "token_type": {
        "type": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::bnb::BNB",
        "account_address": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1",
        "module_name": "bnb",
        "struct_name": "BNB"
      },
      "extensions": {
        "data": []
      }
    },

    {
      "name": "Ethereum",
      "symbol": "ETH",
      "official_symbol": "ETH",
      "coingecko_id": "eth",
      "decimals": 6,
      "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WETH.svg",
      "project_url": "",
      "token_type": {
        "type": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::eth::ETH",
        "account_address": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1",
        "module_name": "eth",
        "struct_name": "ETH"
      },
      "extensions": {
        "data": []
      }
    },
]