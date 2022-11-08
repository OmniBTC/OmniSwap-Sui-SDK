import { TypeTag } from '../../types';
export declare class TypeTagSerializer {
    parseFromStr(str: string): TypeTag;
    parseStructTypeTag(str: string): TypeTag[];
}
