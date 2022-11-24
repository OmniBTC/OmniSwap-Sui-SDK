'use strict';

var sui_js = require('@mysten/sui.js');
var bcs = require('@mysten/bcs');
var fs = require('fs');
var Decimal = require('decimal.js');
var commander = require('commander');
var Chaik = require('chalk');
var figlet = require('figlet');
var clear = require('clear');
var crypto = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var Decimal__default = /*#__PURE__*/_interopDefaultLegacy(Decimal);
var commander__default = /*#__PURE__*/_interopDefaultLegacy(commander);
var Chaik__default = /*#__PURE__*/_interopDefaultLegacy(Chaik);
var figlet__default = /*#__PURE__*/_interopDefaultLegacy(figlet);
var clear__default = /*#__PURE__*/_interopDefaultLegacy(clear);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function checkPairValid(coinX, coinY) {
    if (!coinX || !coinY) {
        return false;
    }
    if (coinX == coinY) {
        return false;
    }
    return true;
}

function d(value) {
    if (Decimal__default["default"].isDecimal(value)) {
        return value;
    }
    return new Decimal__default["default"](value === undefined ? 0 : value);
}

class PoolModule {
    constructor(sdk) {
        this._sdk = sdk;
    }
    get sdk() {
        return this._sdk;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getPoolList() {
        return __awaiter(this, void 0, void 0, function* () {
            const { poolsDynamicId } = this.sdk.networkOptions;
            const poolsObjects = yield this._sdk.jsonRpcProvider.getObjectsOwnedByObject(poolsDynamicId);
            const pools = [];
            poolsObjects.forEach(pool => {
                pools.push({
                    pool_addr: pool['objectId'],
                    pool_type: pool['type'],
                });
            });
            return Promise.resolve(pools);
        });
    }
    getPoolInfo(coinXType, coinYType) {
        return __awaiter(this, void 0, void 0, function* () {
            const poolList = yield this.getPoolList();
            if (!checkPairValid(coinXType, coinYType)) {
                Promise.reject('Invalid Pair');
            }
            if (!this.sdk.CoinList.getCoinInfoByType(coinXType) || !this.sdk.CoinList.getCoinInfoByType(coinYType)) {
                Promise.reject('Coin Not In Offical Coin List');
            }
            const pool = poolList.find(pool => {
                return pool.pool_type.includes(coinXType) && pool.pool_type.includes(coinYType);
            });
            const moveObject = yield this._sdk.jsonRpcProvider.getObject(pool.pool_addr);
            const id = sui_js.getObjectId(moveObject);
            const fields = sui_js.getObjectFields(moveObject)['value']['fields'];
            if (!fields) {
                Promise.reject();
            }
            const lpSupply = fields === null || fields === void 0 ? void 0 : fields['lp_supply'];
            const poolInfo = {
                object_id: id,
                global: fields === null || fields === void 0 ? void 0 : fields['global'],
                coin_x: Number(fields === null || fields === void 0 ? void 0 : fields['coin_x']),
                coin_y: Number(fields === null || fields === void 0 ? void 0 : fields['coin_y']),
                fee_coin_x: Number(fields === null || fields === void 0 ? void 0 : fields['fee_coin_x']),
                fee_coin_y: Number(fields === null || fields === void 0 ? void 0 : fields['fee_coin_y']),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
                lp_type: String(lpSupply === null || lpSupply === void 0 ? void 0 : lpSupply.type),
                lp_supply: lpSupply === null || lpSupply === void 0 ? void 0 : lpSupply.fields['value']
            };
            return Promise.resolve(poolInfo);
        });
    }
    getCoinOut(coinInVal, reserveInSize, reserveOutSize) {
        return coinInVal.mul(reserveInSize).div(reserveOutSize).toDP(0);
    }
    getCoinIn(coinOutVal, reserveOutSize, reserveInSize) {
        return coinOutVal.mul(reserveOutSize).div(reserveInSize).toDP(0);
    }
    calculateRate(interactiveToken, coin_x, coin_y, coin_in_value) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromCoinInfo = this.sdk.CoinList.getCoinInfoByType(coin_x);
            const toCoinInfo = this.sdk.CoinList.getCoinInfoByType(coin_y);
            if (!fromCoinInfo) {
                throw new Error('From Coin not exists');
            }
            if (!toCoinInfo) {
                throw new Error('To Coin not exits');
            }
            const pool = yield this.sdk.Pool.getPoolInfo(coin_x, coin_y);
            const coin_x_reserve = pool.coin_x;
            const coin_y_reserce = pool.coin_y;
            const [reserveX, reserveY] = interactiveToken === 'from' ? [coin_x_reserve, coin_y_reserce] : [coin_y_reserce, coin_x_reserve];
            const coin_x_in = d(coin_in_value);
            const amoutOut = interactiveToken === 'from' ? this.getCoinOut(d(coin_x_in), d(reserveX), d(reserveY))
                : this.getCoinIn(coin_x_in, d(reserveX), d(reserveY));
            return amoutOut;
        });
    }
    buildAddLiquidTransAction(params) {
        const { packageObjectId, globalId } = this.sdk.networkOptions;
        const txn = {
            packageObjectId: packageObjectId,
            module: 'interface',
            function: 'multi_add_liquidity',
            arguments: [
                globalId,
                params.coin_x_objectIds,
                params.coin_x_amount,
                params.coin_x_amount * params.slippage,
                params.coin_y_objectIds,
                params.coin_y_amount,
                params.coin_y_amount * params.slippage
            ],
            typeArguments: [params.coin_x, params.coin_y],
            gasBudget: 20000,
        };
        return txn;
    }
    buildRemoveLiquidTransAction(params) {
        const { packageObjectId, globalId } = this.sdk.networkOptions;
        const txn = {
            packageObjectId: packageObjectId,
            module: 'interface',
            function: 'multi_remove_liquidity',
            arguments: [globalId, params.lp_coin_objectIds],
            typeArguments: [params.coin_x, params.coin_y],
            gasPayment: params.gasPaymentObjectId,
            gasBudget: 10000,
        };
        return txn;
    }
}

class SwapModule {
    constructor(sdk) {
        this._sdk = sdk;
    }
    get sdk() {
        return this._sdk;
    }
    getCoinOutWithFees(coinInVal, reserveInSize, reserveOutSize) {
        const { feePct, feeScale } = { feePct: d(3), feeScale: d(1000) };
        const feeMultiplier = feeScale.sub(feePct);
        const coinInAfterFees = coinInVal.mul(feeMultiplier);
        const newReservesInSize = reserveInSize.mul(feeScale).plus(coinInAfterFees);
        return coinInAfterFees.mul(reserveOutSize).div(newReservesInSize).toDP(0);
    }
    getCoinInWithFee(coinOutVal, reserveOutSize, reserveInSize) {
        const { feePct, feeScale } = { feePct: d(3), feeScale: d(1000) };
        const feeMultiplier = feeScale.sub(feePct);
        const newReservesOutSize = (reserveOutSize.minus(coinOutVal)).mul(feeMultiplier);
        return coinOutVal.mul(feeScale).mul(reserveInSize).div(newReservesOutSize).toDP(0).abs();
    }
    calculateRate(interactiveToken, coin_x, coin_y, coin_in_value) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromCoinInfo = this.sdk.CoinList.getCoinInfoByType(coin_x);
            const toCoinInfo = this.sdk.CoinList.getCoinInfoByType(coin_y);
            if (!fromCoinInfo) {
                throw new Error('From Coin not exists');
            }
            if (!toCoinInfo) {
                throw new Error('To Coin not exits');
            }
            const pool = yield this.sdk.Pool.getPoolInfo(coin_x, coin_y);
            const coin_x_reserve = pool.coin_x;
            const coin_y_reserce = pool.coin_y;
            const [reserveX, reserveY] = interactiveToken === 'from' ? [coin_x_reserve, coin_y_reserce] : [coin_y_reserce, coin_x_reserve];
            const coin_x_in = d(coin_in_value);
            const amoutOut = interactiveToken === 'from' ? this.getCoinOutWithFees(d(coin_x_in), d(reserveX), d(reserveY))
                : this.getCoinInWithFee(coin_x_in, d(reserveX), d(reserveY));
            return amoutOut;
        });
    }
    buildSwapTransaction(params) {
        const { packageObjectId, globalId } = this.sdk.networkOptions;
        const txn = {
            packageObjectId: packageObjectId,
            module: 'interface',
            function: 'multi_swap',
            arguments: [globalId, params.coins_in_objectIds, params.coins_in_value, params.coins_out_min],
            typeArguments: [params.coin_x, params.coin_y],
            gasPayment: params.gasPaymentObjectId,
            gasBudget: 10000,
        };
        return txn;
    }
}

class CoinModule {
    constructor(sdk) {
        this._sdk = sdk;
    }
    get sdk() {
        return this._sdk;
    }
    // coinTypeArg: "0x2::sui::SUI"
    getCoinBalance(address, coinTypeArg) {
        return __awaiter(this, void 0, void 0, function* () {
            const coinMoveObjects = yield this._sdk.jsonRpcProvider.getCoinBalancesOwnedByAddress(address);
            const balanceObjects = [];
            coinMoveObjects.forEach(object => {
                if (!sui_js.Coin.isCoin(object)) {
                    return;
                }
                if (coinTypeArg != sui_js.Coin.getCoinTypeArg(object)) {
                    return;
                }
                const coinObjectId = sui_js.getObjectId(object);
                const balance = sui_js.Coin.getBalance(object);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const coinSymbol = sui_js.Coin.getCoinSymbol(coinTypeArg);
                balanceObjects.push({
                    id: coinObjectId,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    balance: balance,
                    coinSymbol: coinSymbol
                });
            });
            const balanceSum = balanceObjects.reduce((pre, cur) => {
                return Number(cur.balance) + pre;
            }, 0);
            return {
                balance: balanceSum,
                objects: balanceObjects
            };
        });
    }
    buildFaucetTokenTransaction(coinTypeArg) {
        return __awaiter(this, void 0, void 0, function* () {
            const faucetPackageId = this.sdk.networkOptions.faucetPackageId;
            const faucetObjectId = this.sdk.networkOptions.faucetObjectId;
            const txn = {
                packageObjectId: faucetPackageId,
                module: 'faucet',
                function: 'claim',
                arguments: [faucetObjectId],
                typeArguments: [coinTypeArg],
                gasBudget: 10000,
            };
            return txn;
        });
    }
    // only admin
    buildAdminMintTestTokensTransaction(createAdminMintPayloadParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const faucetPackageId = this.sdk.networkOptions.faucetPackageId;
            const txn = {
                packageObjectId: faucetPackageId,
                module: 'lock',
                function: 'mint_and_transfer',
                arguments: [
                    createAdminMintPayloadParams.coinCapLock,
                    createAdminMintPayloadParams.amount,
                    createAdminMintPayloadParams.walletAddress
                ],
                typeArguments: [createAdminMintPayloadParams.coinTypeArg],
                gasBudget: createAdminMintPayloadParams.gasBudget ? createAdminMintPayloadParams.gasBudget : 10000,
            };
            return txn;
        });
    }
    buildSpiltTransaction(signerAddress, splitTxn) {
        return __awaiter(this, void 0, void 0, function* () {
            const serializer = yield this._sdk.serializer.newSplitCoin(signerAddress, splitTxn);
            return serializer.getData();
        });
    }
    buildMergeTransaction(signerAddress, mergeTxn) {
        return __awaiter(this, void 0, void 0, function* () {
            const serializer = yield this._sdk.serializer.newMergeCoin(signerAddress, mergeTxn);
            return serializer.getData();
        });
    }
}

const REQUESTS_MAINNET = [
    {
        "name": "Tether USD",
        "symbol": "USDT",
        "official_symbol": "USDT",
        "coingecko_id": "tether",
        "decimals": 8,
        "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
        "project_url": "",
        "token_type": {
            "type": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1::usdt::USDT",
            "account_address": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1",
            "module_name": "usdt",
            "struct_name": "USDT"
        },
        "extensions": {
            "data": []
        }
    },
    {
        "name": "XBTC",
        "symbol": "XBTC",
        "official_symbol": "XBTC",
        "coingecko_id": "",
        "decimals": 8,
        "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
        "project_url": "https://github.com/OmniBTC/OmniBridge",
        "token_type": {
            "type": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1::xbtc::XBTC",
            "account_address": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1",
            "module_name": "xbtc",
            "struct_name": "XBTC"
        },
        "extensions": {
            "data": []
        }
    },
    {
        "name": "Sui Coin",
        "symbol": "SUI",
        "official_symbol": "SUI",
        "coingecko_id": "Sui",
        "decimals": 9,
        "logo_url": "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
        "project_url": "http://sui.io/",
        "token_type": {
            "type": "0x2::sui::SUI",
            "account_address": "0x2",
            "module_name": "sui",
            "struct_name": "SUI"
        },
        "extensions": {
            "data": []
        }
    }
];
const REQUESTS_TESTNET = [
    {
        "name": "Tether USD",
        "symbol": "USDT",
        "official_symbol": "USDT",
        "coingecko_id": "tether",
        "decimals": 8,
        "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
        "project_url": "",
        "token_type": {
            "type": "0x985c26f5edba256380648d4ad84b202094a4ade3::usdt::USDT",
            "account_address": "0x985c26f5edba256380648d4ad84b202094a4ade3",
            "module_name": "usdt",
            "struct_name": "USDT"
        },
        "extensions": {
            "data": []
        }
    },
    {
        "name": "XBTC",
        "symbol": "XBTC",
        "official_symbol": "XBTC",
        "coingecko_id": "",
        "decimals": 8,
        "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
        "project_url": "https://github.com/OmniBTC/OmniBridge",
        "token_type": {
            "type": "0x985c26f5edba256380648d4ad84b202094a4ade3::xbtc::XBTC",
            "account_address": "0x985c26f5edba256380648d4ad84b202094a4ade3",
            "module_name": "xbtc",
            "struct_name": "XBTC"
        },
        "extensions": {
            "data": []
        }
    },
    {
        "name": "Sui Coin",
        "symbol": "SUI",
        "official_symbol": "SUI",
        "coingecko_id": "Sui",
        "decimals": 9,
        "logo_url": "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
        "project_url": "http://sui.io/",
        "token_type": {
            "type": "0x2::sui::SUI",
            "account_address": "0x2",
            "module_name": "sui",
            "struct_name": "SUI"
        },
        "extensions": {
            "data": []
        }
    },
    {
        "name": "BTC",
        "symbol": "BTC",
        "official_symbol": "BTC",
        "coingecko_id": "",
        "decimals": 8,
        "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
        "project_url": "https://github.com/OmniBTC/OmniBridge",
        "token_type": {
            "type": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::btc::BTC",
            "account_address": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1",
            "module_name": "btc",
            "struct_name": "BTC"
        },
        "extensions": {
            "data": []
        }
    },
    {
        "name": "Binance Coin",
        "symbol": "BNB",
        "official_symbol": "BNB",
        "coingecko_id": "binancecoin",
        "decimals": 8,
        "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BNB.svg",
        "project_url": "",
        "token_type": {
            "type": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::bnb::BNB",
            "account_address": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1",
            "module_name": "bnb",
            "struct_name": "BNB"
        },
        "extensions": {
            "data": []
        }
    },
    {
        "name": "Ethereum",
        "symbol": "ETH",
        "official_symbol": "ETH",
        "coingecko_id": "eth",
        "decimals": 6,
        "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WETH.svg",
        "project_url": "",
        "token_type": {
            "type": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::eth::ETH",
            "account_address": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1",
            "module_name": "eth",
            "struct_name": "ETH"
        },
        "extensions": {
            "data": []
        }
    },
];

class CoinListModule {
    constructor(sdk) {
        this._sdk = sdk;
        this.coinList = sdk.networkOptions.isMainNet ? REQUESTS_MAINNET : REQUESTS_TESTNET;
        this.fullnameToCoinInfo = {};
        this.symbolToCoinInfo = {};
        this.typeToCoinInfo = {};
        this.buildCache();
    }
    get sdk() {
        return this._sdk;
    }
    buildCache() {
        for (const tokenInfo of this.coinList) {
            this.symbolToCoinInfo[tokenInfo.symbol] = tokenInfo;
            this.typeToCoinInfo[tokenInfo.token_type.type] = tokenInfo;
            this.fullnameToCoinInfo[tokenInfo.name] = tokenInfo;
        }
    }
    getCoinInfoList() {
        return this.coinList;
    }
    getCoinInfoBySymbol(symbol) {
        return this.symbolToCoinInfo[symbol];
    }
    getCoinInfoByType(tokenType) {
        return this.typeToCoinInfo[tokenType];
    }
    getCoinInfoByfullName(fullname) {
        return this.typeToCoinInfo[fullname];
    }
}

class SDK {
    constructor(networkConfiguration) {
        this._jsonRpcProvider = new sui_js.JsonRpcProvider(networkConfiguration.fullNodeUrl);
        this._serializer = new sui_js.RpcTxnDataSerializer(this._jsonRpcProvider.endpoints.fullNode, 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._jsonRpcProvider.options.skipDataValidation);
        this._networkConfiguration = networkConfiguration;
        this._swap = new SwapModule(this);
        this._token = new CoinModule(this);
        this._pool = new PoolModule(this);
        this._coinList = new CoinListModule(this);
    }
    get jsonRpcProvider() {
        return this._jsonRpcProvider;
    }
    get Swap() {
        return this._swap;
    }
    get Pool() {
        return this._pool;
    }
    get Coin() {
        return this._token;
    }
    get CoinList() {
        return this._coinList;
    }
    get networkOptions() {
        return this._networkConfiguration;
    }
    get serializer() {
        return this._serializer;
    }
}

//import {  Network  } from '@mysten/sui.js';
class NetworkConfiguration {
    constructor(name, fullNodeUrl, packageObjectId, globalId, poolsDynamicId, faucetPackageId, faucetObjectId, isMainNet = false) {
        this.name = name;
        this.fullNodeUrl = fullNodeUrl;
        this.packageObjectId = packageObjectId;
        this.globalId = globalId;
        this.poolsDynamicId = poolsDynamicId;
        this.faucetPackageId = faucetPackageId;
        this.faucetObjectId = faucetObjectId;
        this.isMainNet = isMainNet;
    }
}
const MAINNET_CONFIG = new NetworkConfiguration('mainnet', 'https://fullnode.mainnet.sui.io:443', '0x1f0d4d3ca884a1a6958fe5ba9dc6d8003d9f7d76', '0x92131c160fa0f1b95190a3a7cbfa32d0149ab00f', '0x19465f7b8008aa1443269808840856a3c8b2c119', "", "");
const TESTNET_CONFIG = new NetworkConfiguration('testnet', 'https://fullnode.testnet.sui.io:443', '0xc648bfe0d87c25e0436d720ba8f296339bdba5c3', '0x254cf7b848688aa86a8eb69677bbe2e4c46ecf50', '0x81c0cfc53769aaaacee87b4dd8e827e7a86afb8c', "0x985c26f5edba256380648d4ad84b202094a4ade3", "0x50ed67cc1d39a574301fa8d71a47419e9b297bab");
const CONFIGS = {
    mainnet: MAINNET_CONFIG,
    testnet: TESTNET_CONFIG
};

const readConfig = (program) => {
    const { config } = program.opts();
    const keystoreList = fs__namespace.readFileSync(config + "/sui.keystore", { encoding: 'utf-8' });
    // JSON.parse(keystoreList)[0];
    const decoded_array_buffer = bcs.fromB64(JSON.parse(keystoreList)[0]); // this UInt8Array
    // split the keys
    const decoded_array = Array.from(decoded_array_buffer);
    decoded_array.shift();
    const privatekey = Uint8Array.from(decoded_array.slice(32, 64));
    const keypair = sui_js.Ed25519Keypair.fromSeed(privatekey);
    const suiAmmSdk = new SDK(CONFIGS.testnet);
    const rawSigner = new sui_js.RawSigner(keypair, suiAmmSdk.jsonRpcProvider, suiAmmSdk.serializer);
    return { suiAmmSdk, rawSigner };
};

const faucetTokenCmd = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const facuetTokens = (coin_type) => __awaiter(void 0, void 0, void 0, function* () {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const faucetTokenTxn = yield suiAmmSdk.Coin.buildFaucetTokenTransaction(coin_type);
        const executeResponse = yield rawSigner.executeMoveCallWithRequestType(faucetTokenTxn, "WaitForEffectsCert");
        const response = sui_js.getTransactionEffects(executeResponse);
        console.log(`excute status: ${response === null || response === void 0 ? void 0 : response.status.status} digest: ${response === null || response === void 0 ? void 0 : response.transactionDigest} `);
    });
    program.command('omniswap:faucet')
        .description('faucet token')
        .argument('<coin_type>')
        .action(facuetTokens);
});

let program$1;
const initProgram = () => {
    program$1 = new commander__default["default"].Command();
    clear__default["default"]();
    console.log(Chaik__default["default"].red(figlet__default["default"].textSync('Sui-AMM-CLI', { horizontalLayout: 'full' })));
    program$1.requiredOption('-c, --config <path>', 'path to your sui config.yml (generated with "sui client active-address")');
    return program$1;
};

function addHexPrefix(hex) {
    return !hex.startsWith('0x') ? '0x' + hex : hex;
}

const SUI_COIN_TYPE = "0x2::sui::SUI";

const walletCmd = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = () => __awaiter(void 0, void 0, void 0, function* () {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const address = addHexPrefix(yield rawSigner.getAddress());
        const suiBalance = yield suiAmmSdk.Coin.getCoinBalance(address, SUI_COIN_TYPE);
        console.log(`address: ${address} sui balance: ${suiBalance.balance}`);
    });
    program.command('omniswap:wallet')
        .description('print wallet ')
        .action(wallet);
});

const MINT_TOKEN_MAPS = new Map([
    ['0x985c26f5edba256380648d4ad84b202094a4ade3::usdt::USDT', '0xe8d7d9615ebab5a4a76dafaae6272ae0301b2939'],
    ['0x985c26f5edba256380648d4ad84b202094a4ade3::xbtc::XBTC', '0x0712d20475a629e5ef9a13a7c97d36bc406155b6'],
    ['0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::btc::BTC', '0x6c067ce5d8ff85f34a39157c6600d7f2daf8e91c'],
    ['0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::eth::ETH', '0x15d7b751ce55b49bee7970708aa5ff5c9bc74fb1'],
    ['0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::bnb::BNB', '0x42dc81a4fc8528241ad545d53f0e945e34be5a9d'],
]);
const listPoolCmd = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const listPools = () => __awaiter(void 0, void 0, void 0, function* () {
        const { suiAmmSdk } = readConfig(program);
        const poolList = yield suiAmmSdk.Pool.getPoolList();
        console.log(poolList);
    });
    program.command('omniswap:list_pools')
        .description('list all pools')
        .action(listPools);
});
const addLiquidCmd = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const addLiquid = (coin_x_type, coin_y_type, coin_x_object_ids, coin_x_amount, coin_y_object_ids, coin_y_amount, slippage, gasPayment) => __awaiter(void 0, void 0, void 0, function* () {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const coin_x_object_ids_list = coin_x_object_ids.split(',');
        const coin_y_object_ids_list = coin_y_object_ids.split(',');
        const addLiquidParams = {
            coin_x: coin_x_type,
            coin_y: coin_y_type,
            coin_x_objectIds: coin_x_object_ids_list,
            coin_y_objectIds: coin_y_object_ids_list,
            coin_x_amount: Number(coin_x_amount),
            coin_y_amount: Number(coin_y_amount),
            slippage: Number(slippage),
            gasPaymentObjectId: gasPayment
        };
        console.log(`Add Liquid params: ${JSON.stringify(addLiquidParams)}`);
        const addLiquidTxn = yield suiAmmSdk.Pool.buildAddLiquidTransAction(addLiquidParams);
        const executeResponse = yield rawSigner.executeMoveCallWithRequestType(addLiquidTxn, "WaitForEffectsCert");
        const response = sui_js.getTransactionEffects(executeResponse);
        console.log(`excute status: ${response === null || response === void 0 ? void 0 : response.status.status} digest: ${response === null || response === void 0 ? void 0 : response.transactionDigest} `);
    });
    program.command('omniswap:addLiquid')
        .description('add liquid')
        .argument('<coin_x_type>')
        .argument('<coin_y_type>')
        .argument('<coin_x_object_ids>')
        .argument('<coin_x_amount>')
        .argument('<coin_y_object_ids>')
        .argument('<coin_y_amount>')
        .argument('<slippage>')
        .argument('gaspayment')
        .action(addLiquid);
});
const removeLiquidCmd = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const removeLiquid = (coin_x_type, coin_y_type, lp_coin_object_ids, gasPayment) => __awaiter(void 0, void 0, void 0, function* () {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const lp_coin_object_ids_list = lp_coin_object_ids.split(",");
        const removeLiquidParams = {
            coin_x: coin_x_type,
            coin_y: coin_y_type,
            lp_coin_objectIds: lp_coin_object_ids_list,
            gasPaymentObjectId: gasPayment
        };
        console.log(`remove Liquid params: ${JSON.stringify(removeLiquidParams)}`);
        const removeLiquidTxn = yield suiAmmSdk.Pool.buildRemoveLiquidTransAction(removeLiquidParams);
        const executeResponse = yield rawSigner.executeMoveCallWithRequestType(removeLiquidTxn, "WaitForEffectsCert");
        const response = sui_js.getTransactionEffects(executeResponse);
        console.log(`excute status: ${response === null || response === void 0 ? void 0 : response.status.status} digest: ${response === null || response === void 0 ? void 0 : response.transactionDigest} `);
    });
    program.command('omniswap:removeLiquid')
        .description('add liquid')
        .argument('<coin_x_type>')
        .argument('<coin_y_type>')
        .argument('<lp_coin_object_ids>')
        .argument('gaspayment')
        .action(removeLiquid);
});
const adminMintTestTokenCmd = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const DEFAULT_MINT_AMOUNT = 10000000000000;
    const DEFAULT_GAS_BUDGET = 10000;
    const adminAddLiquidCmd = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        for (const token of MINT_TOKEN_MAPS) {
            const coinTypeArg = token[0];
            const coinCapLock = token[1];
            const { suiAmmSdk, rawSigner } = readConfig(program);
            const address = addHexPrefix(yield rawSigner.getAddress());
            const mintTxn = yield suiAmmSdk.Coin.buildAdminMintTestTokensTransaction({
                coinTypeArg: coinTypeArg,
                coinCapLock: coinCapLock,
                walletAddress: address,
                amount: DEFAULT_MINT_AMOUNT,
                gasBudget: DEFAULT_GAS_BUDGET + crypto.randomInt(1000)
            });
            const executeResponse = yield rawSigner.executeMoveCallWithRequestType(mintTxn, "WaitForEffectsCert");
            const response = sui_js.getTransactionEffects(executeResponse);
            const createTokenObjectId = (_a = sui_js.getCreatedObjects(executeResponse)) === null || _a === void 0 ? void 0 : _a[0].reference.objectId;
            console.log(`mint token: ${coinTypeArg} objectId: ${createTokenObjectId}`);
            console.log(`excute status: ${response === null || response === void 0 ? void 0 : response.status.status} digest: ${response === null || response === void 0 ? void 0 : response.transactionDigest} `);
        }
        // 3. get sui payment object
    });
    program.command('omniswap:adminMintTestToken')
        .description('admin mint test token')
        .action(adminAddLiquidCmd);
});
const adminAddAllLiquidCmd = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const excuteAddliquid = (coin_x_type, coin_y_type, coin_x_object_ids_list, coin_y_object_ids_list) => __awaiter(void 0, void 0, void 0, function* () {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        const addLiquidParams = {
            coin_x: coin_x_type,
            coin_y: coin_y_type,
            coin_x_objectIds: coin_x_object_ids_list,
            coin_y_objectIds: coin_y_object_ids_list,
            coin_x_amount: 10000000000000,
            coin_y_amount: 10000000000000,
            slippage: 0.2
        };
        console.log(`Add Liquid params: ${JSON.stringify(addLiquidParams)}`);
        const addLiquidTxn = yield suiAmmSdk.Pool.buildAddLiquidTransAction(addLiquidParams);
        const executeResponse = yield rawSigner.executeMoveCallWithRequestType(addLiquidTxn, "WaitForEffectsCert");
        const response = sui_js.getTransactionEffects(executeResponse);
        console.log(`excute status: ${response === null || response === void 0 ? void 0 : response.status.status} digest: ${response === null || response === void 0 ? void 0 : response.transactionDigest} `);
    });
    const addAllLiquid = () => __awaiter(void 0, void 0, void 0, function* () {
        const { suiAmmSdk, rawSigner } = readConfig(program);
        // GET USDT tokenList 
        // 1. BNB TOKEN
        const tokenTypeArgList = Array.from(MINT_TOKEN_MAPS.keys());
        const bnbTokenArg = tokenTypeArgList.find(token => token.includes('BNB'));
        const address = addHexPrefix(yield rawSigner.getAddress());
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const bnbObject = suiAmmSdk.Coin.getCoinBalance(address, bnbTokenArg);
        console.log(`token: ${bnbTokenArg} balance: ${(yield bnbObject).balance}`);
        const ethTokenArg = tokenTypeArgList.find(token => token.includes('ETH'));
        const ethObject = suiAmmSdk.Coin.getCoinBalance(address, ethTokenArg);
        console.log(`token: ${ethTokenArg} balance: ${(yield ethObject).balance}`);
        const btcTokenArg = tokenTypeArgList.find(token => token.includes('btc::BTC'));
        const btcObject = suiAmmSdk.Coin.getCoinBalance(address, btcTokenArg);
        console.log(`token: ${btcTokenArg} balance: ${(yield btcObject).balance}`);
        // 2. USDT TOKEN
        const usdtTokenArg = tokenTypeArgList.find(token => token.includes('USDT'));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const usdtObject = suiAmmSdk.Coin.getCoinBalance(address, usdtTokenArg);
        console.log(`token: ${usdtTokenArg} balance: ${(yield usdtObject).balance}`);
        const bnbList = [(yield bnbObject).objects[0].id];
        const ethList = [(yield ethObject).objects[0].id];
        const btcList = [(yield btcObject).objects[0].id];
        // 3. add BNB-USDT liquid
        yield excuteAddliquid(bnbTokenArg, usdtTokenArg, bnbList, [(yield usdtObject).objects[0].id]);
        yield excuteAddliquid(ethTokenArg, usdtTokenArg, ethList, [(yield usdtObject).objects[1].id]);
        yield excuteAddliquid(btcTokenArg, usdtTokenArg, btcList, [(yield usdtObject).objects[2].id]);
    });
    program.command('omniswap:adminAddAllLiquid')
        .description('admin add liquid')
        .action(addAllLiquid);
});

const program = initProgram();
faucetTokenCmd(program);
walletCmd(program);
addLiquidCmd(program);
removeLiquidCmd(program);
listPoolCmd(program);
adminMintTestTokenCmd(program);
adminAddAllLiquidCmd(program);
program.parse();
//# sourceMappingURL=index.js.map
