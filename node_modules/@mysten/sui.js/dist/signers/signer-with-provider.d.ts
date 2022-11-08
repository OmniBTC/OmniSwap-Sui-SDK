import { Provider } from '../providers/provider';
import { HttpHeaders } from '../rpc/client';
import { Base64DataBuffer } from '../serialization/base64';
import { ExecuteTransactionRequestType, FaucetResponse, SuiAddress, SuiExecuteTransactionResponse } from '../types';
import { SignaturePubkeyPair, Signer } from './signer';
import { MoveCallTransaction, MergeCoinTransaction, PayTransaction, PaySuiTransaction, PayAllSuiTransaction, SplitCoinTransaction, TransferObjectTransaction, TransferSuiTransaction, TxnDataSerializer, PublishTransaction, SignableTransaction } from './txn-data-serializers/txn-data-serializer';
export declare abstract class SignerWithProvider implements Signer {
    readonly provider: Provider;
    readonly serializer: TxnDataSerializer;
    abstract getAddress(): Promise<SuiAddress>;
    /**
     * Returns the signature for the data and the public key of the signer
     */
    abstract signData(data: Base64DataBuffer): Promise<SignaturePubkeyPair>;
    abstract connect(provider: Provider): SignerWithProvider;
    /**
     * Request gas tokens from a faucet server and send to the signer
     * address
     * @param httpHeaders optional request headers
     */
    requestSuiFromFaucet(httpHeaders?: HttpHeaders): Promise<FaucetResponse>;
    constructor(provider?: Provider, serializer?: TxnDataSerializer);
    /**
     * Sign a transaction and submit to the Fullnode for execution. Only exists
     * on Fullnode
     */
    signAndExecuteTransactionWithRequestType(transaction: Base64DataBuffer | SignableTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     *
     * Serialize and sign a `TransferObject` transaction and submit to the Fullnode
     * for execution
     */
    transferObjectWithRequestType(transaction: TransferObjectTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     *
     * Serialize and sign a `TransferSui` transaction and submit to the Fullnode
     * for execution
     */
    transferSuiWithRequestType(transaction: TransferSuiTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     *
     * Serialize and Sign a `Pay` transaction and submit to the fullnode for execution
     */
    payWithRequestType(transaction: PayTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     * Serialize and Sign a `PaySui` transaction and submit to the fullnode for execution
     */
    paySuiWithRequestType(transaction: PaySuiTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     * Serialize and Sign a `PayAllSui` transaction and submit to the fullnode for execution
     */
    payAllSuiWithRequestType(transaction: PayAllSuiTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     *
     * Serialize and sign a `MergeCoin` transaction and submit to the Fullnode
     * for execution
     */
    mergeCoinWithRequestType(transaction: MergeCoinTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     *
     * Serialize and sign a `SplitCoin` transaction and submit to the Fullnode
     * for execution
     */
    splitCoinWithRequestType(transaction: SplitCoinTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     * Serialize and sign a `MoveCall` transaction and submit to the Fullnode
     * for execution
     */
    executeMoveCallWithRequestType(transaction: MoveCallTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
    /**
     *
     * Serialize and sign a `Publish` transaction and submit to the Fullnode
     * for execution
     */
    publishWithRequestType(transaction: PublishTransaction, requestType?: ExecuteTransactionRequestType): Promise<SuiExecuteTransactionResponse>;
}
