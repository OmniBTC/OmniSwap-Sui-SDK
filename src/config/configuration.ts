import { getObjectId,JsonRpcProvider, Network,Coin } from '@mysten/sui.js';

export class NetworkConfiguration {
    constructor(
      public name: string,
      public fullNodeUrl: string,
      public omniswapAddress: string,
      public isMainNet = false
    ) {}
  }
  
  export const MAINNET_CONFIG = new NetworkConfiguration(
    'mainnet',
     Network.DEVNET,
    '0x3473693143ec59cf171d5cb68cb3d8646f4e23ecba2366494dea3bbad4303da4'
  );
  
  
  export const TESTNET_CONFIG = new NetworkConfiguration(
    'testnet',
     Network.DEVNET,
    '0xe98445b5e7489d1a4afee94940ca4c40e1f6c87a59c3b392e4744614af209de4'
  );

  export const DEVNET_CONFIG = new NetworkConfiguration(
    'testnet',
     Network.DEVNET,
    '0xe98445b5e7489d1a4afee94940ca4c40e1f6c87a59c3b392e4744614af209de4'
  );

  export const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG,
    devnet: DEVNET_CONFIG
  };
  