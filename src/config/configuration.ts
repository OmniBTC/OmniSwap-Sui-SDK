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
     Network.DEVNET,
    '0x6b2b8d00733280d641a506e3865de71a0e9398e9',
    '0xa65f9fb71b9989c7bb530c2c077e5decc7fe1d9d',
    '0xb445efd1984827519c9d9666815b6f93256f16c4'
  );

  export const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG
  };
  