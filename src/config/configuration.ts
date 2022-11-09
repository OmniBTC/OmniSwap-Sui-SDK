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
    '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f'
  );
  
  
  export const TESTNET_CONFIG = new NetworkConfiguration(
    'testnet',
     Network.DEVNET,
     '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76',
     '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f',
     '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f'
  );

  export const DEVNET_CONFIG = new NetworkConfiguration(
    'testnet',
     Network.DEVNET,
    '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76',
    '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f',
    '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f'
  );

  export const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG,
    devnet: DEVNET_CONFIG
  };
  