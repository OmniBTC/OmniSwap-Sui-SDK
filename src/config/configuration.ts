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
    '0xc654deb390bbdd2ab0cdd935a17ef57351f77386',
    '0xed93ebb193b9cb6ba3c603c8f2ad58a606c1fb4f',
    '0xd96f8bf63c88801dc8a78d8770b40b0b60a1bb8f'
  );

  export const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG
  };
  