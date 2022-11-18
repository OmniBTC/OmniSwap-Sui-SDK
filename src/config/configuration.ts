//import {  Network  } from '@mysten/sui.js';

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
    'https://fullnode.mainnet.sui.io:443',
    '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76',
    '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f',
    '0x19465f7b8008aa1443269808840856a3c8b2c119'
  );
  
  export const TESTNET_CONFIG = new NetworkConfiguration(
    'testnet',
     'https://fullnode.testnet.sui.io:443',
    '0xc648bfe0d87c25e0436d720ba8f296339bdba5c3',
    '0x254cf7b848688aa86a8eb69677bbe2e4c46ecf50',
    '0x81c0cfc53769aaaacee87b4dd8e827e7a86afb8c'
  );

  export const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG
  };
  