/// <reference types="node" />
export declare function addHexPrefix(hex: string): string;
export declare function shortString(str: string, start?: number, end?: number): string;
export declare function shortAddress(address: string, start?: number, end?: number): string;
export declare function checkAddress(address: any, options?: {
    leadingZero: boolean;
}): boolean;
/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param v the value
 */
export declare function toBuffer(v: any): Buffer;
export declare function bufferToHex(buffer: Buffer): string;
//# sourceMappingURL=hex.d.ts.map