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
  
  // export const MAINNET_CONFIG = new NetworkConfiguration(
  //   'mainnet',
  //    Network.DEVNET,
  //   '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76',
  //   '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f',
  //   '0x19465f7b8008aa1443269808840856a3c8b2c119'
  // );
  
  
  // export const TESTNET_CONFIG = new NetworkConfiguration(
  //   'testnet',
  //    Network.DEVNET,
  //    '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76',
  //    '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f',
  //    '0x19465f7b8008aa1443269808840856a3c8b2c119'
  // );

  export const DEVNET_CONFIG = new NetworkConfiguration(
    'testnet',
     Network.DEVNET,
    '0xcfde6e8505975c2c7a89111c08717bc6975325dd',
    '0xf962ddb9ededccfb9a1300d640d8301bb682d633',
    '0x15e2ef5cfaaddf70489dd35dd4ef75f5d9c0a696'
  );

  export const CONFIGS = {
    // mainnet: MAINNET_CONFIG,
    //testnet: TESTNET_CONFIG,
    devnet: DEVNET_CONFIG
  };
  