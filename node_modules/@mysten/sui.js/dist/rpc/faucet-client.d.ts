import { FaucetResponse, SuiAddress } from '../types';
import { HttpHeaders } from './client';
export declare function requestSuiFromFaucet(endpoint: string, recipient: SuiAddress, httpHeaders?: HttpHeaders): Promise<FaucetResponse>;
