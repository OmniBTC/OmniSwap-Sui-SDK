//import {  Network  } from '@mysten/sui.js';

export class NetworkConfiguration {
    constructor(
      public name: string,
      public fullNodeUrl: string,
      public packageObjectId: string,
      public globalId: string,
      public poolsDynamicId: string,
      public faucetPackageId:string,
      public faucetObjectId:string,
      public isMainNet = false
    ) {}
  }
  
  export const MAINNET_CONFIG = new NetworkConfiguration(
    'mainnet',
    'https://fullnode.mainnet.sui.io:443',
    '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76',
    '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f',
    '0x19465f7b8008aa1443269808840856a3c8b2c119',
    "",
    ""
  );
  
  export const TESTNET_CONFIG = new NetworkConfiguration(
    'testnet',
     'https://fullnode.testnet.sui.io:443',
    '0xe4dfb7dca0d54f5cc51ed39d847251417666b7c1',
    '0x5faf9ee713fa866766ac448f2b634074c23851e3',
    '0x5a9772c7c3346dd1834873c07b0e2076a38d5d8e',
    "0x0a3af85362a35154ce5f513bada2d38887d8a66f",
    "0x41ed95838a6e03d172b4d55f3cdebe66cd1a3de2"
  );

  export const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG
  };
  