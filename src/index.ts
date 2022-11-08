import { getObjectId,JsonRpcProvider, Network,Coin } from '@mysten/sui.js';
import { Pool } from './pool';
import { SUI_COIN_TYPE,getCoinBalance } from './coin'
import { POOL_SUI_USDT } from './const'
// connect to local RPC server
const SUI_DECIMAL = 9;
const provider = new JsonRpcProvider(Network.DEVNET);

(async function main() {
    const address = '0x036e2406b8cf1fc4541ed6d0e252c77b094d0fd9';
    const res = await getCoinBalance(provider,SUI_COIN_TYPE,address);
    const balance = res.balance;
    console.log(`balance: ${balance}`)
    const pool = new Pool(provider);
    const poolDetail =  await pool.getPoolDetail(POOL_SUI_USDT);
    console.log(JSON.stringify(poolDetail));

})();