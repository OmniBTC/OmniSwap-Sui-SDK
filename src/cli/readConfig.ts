import { Ed25519Keypair, RawSigner } from '@mysten/sui.js';
import { fromB64 } from '@mysten/bcs';
import { Command } from 'commander';
import * as fs from 'fs';
import { SDK } from '../sdk';
import { CONFIGS } from '../config';

export const readConfig = (program: Command) => {
    const { config } = program.opts();
    const keystoreList = fs.readFileSync(config + "/sui.keystore", { encoding: 'utf-8' });
    // JSON.parse(keystoreList)[0];
    const decoded_array_buffer = fromB64(JSON.parse(keystoreList)[0]); // this UInt8Array
    // split the keys
    const decoded_array = Array.from(decoded_array_buffer);
    decoded_array.shift()
    const privatekey = Uint8Array.from(decoded_array.slice(32, 64));

    const keypair = Ed25519Keypair.fromSeed(privatekey);
    
    const suiAmmSdk = new SDK(CONFIGS.testnet);
    const rawSigner = new RawSigner(keypair,suiAmmSdk.jsonRpcProvider,suiAmmSdk.serializer);
    
    return { suiAmmSdk, rawSigner };
}