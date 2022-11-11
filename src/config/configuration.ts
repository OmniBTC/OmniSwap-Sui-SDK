import {  Network  } from '@mysten/sui.js';

export class NetworkConfiguration {
    constructor(
      public name: string,
      public fullNodeUrl: string,
      public packageObjectId: string,
      public globalId: string,
      public poolsDynamicId: string,
      public isMainNet = false
    ) {}
  }
  
  export const MAINNET_CONFIG = new NetworkConfiguration(
    'mainnet',
     Network.DEVNET,
    '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76',
    '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f',
    '0x19465f7b8008aa1443269808840856a3c8b2c119'
  );
  
  export const TESTNET_CONFIG = new NetworkConfiguration(
    'testnet',
     'https://fullnode.testnet.sui.io:443',
    '0x2918d7520ca9783a3ce34649c11631337e5a69a3',
    '0x10638d1453b122aacdcd06ddb4bb5839d0869aa5',
    '0xc5436198558e515e7fe5adc45084591cef140c31'
  );

  export const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG
  };
  