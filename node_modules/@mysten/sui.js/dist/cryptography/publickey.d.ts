/// <reference types="node" />
import BN from 'bn.js';
/**
 * Value to be converted into public key.
 */
export declare type PublicKeyInitData = number | string | Buffer | Uint8Array | Array<number> | PublicKeyData;
/**
 * JSON object representation of PublicKey class.
 */
export declare type PublicKeyData = {
    /** @internal */
    _bn: BN;
};
/**
 * A keypair used for signing transactions.
 */
export declare type SignatureScheme = 'ED25519' | 'Secp256k1';
export declare const SIGNATURE_SCHEME_TO_FLAG: {
    ED25519: number;
    Secp256k1: number;
};
export declare function checkPublicKeyData(value: PublicKeyInitData): value is PublicKeyData;
/**
 * A public key
 */
export interface PublicKey {
    /**
     * Checks if two public keys are equal
     */
    equals(publicKey: PublicKey): boolean;
    /**
     * Return the base-64 representation of the public key
     */
    toBase64(): string;
    /**
     * Return the byte array representation of the public key
     */
    toBytes(): Uint8Array;
    /**
     * Return the Buffer representation of the public key
     */
    toBuffer(): Buffer;
    /**
     * Return the base-64 representation of the public key
     */
    toString(): string;
    /**
     * Return the Sui address associated with this public key
     */
    toSuiAddress(): string;
}
