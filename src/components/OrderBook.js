import React, { Component } from 'react';
// import { BrowserRouter as Router, Link } from 'react-router-dom';
// import Route from 'react-router-dom/Route';
// import Sell from './Sell';
// import Buy from './Buy';
// import Charts from './Charts';
// import BuyBox from './BuyBox';
// import SellBox from './SellBox';
// import BuyOrders from './BuyOrders';
// import SellOrders from './SellOrders';
// import OrderHistory from './OrderHistory';
// import { OrderWatcher } from '@0x/order-watcher';

import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    // generatePseudoRandomSalt,
    // Order,
    // orderHashUtils,
    // signatureUtils,
} from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { NETWORK_CONFIGS, TX_DEFAULTS } from '../configs';
import { DECIMALS, NULL_ADDRESS, ZERO } from '../constants';
import { getContractAddressesForNetwork, getContractWrappersConfig } from '../contracts';
import { PrintUtils } from '../print_utils';
import { providerEngine } from '../provider_engine';
// import { getRandomFutureDateInSeconds } from '../utils';
// import { HttpClient, OrderbookRequest, OrderConfigRequest } from '@0x/connect';



export async function getOrderBook() {
    PrintUtils.printScenario('Fetching OrderBook');
    // Initialize the ContractWrappers, this provides helper functions around calling
    // 0x contracts as well as ERC20/ERC721 token contracts on the blockchain
    const contractWrappers = new ContractWrappers(providerEngine, getContractWrappersConfig(NETWORK_CONFIGS.networkId));
    // Initialize the Web3Wrapper, this provides helper functions around fetching
    // account information, balances, general contract logs
    const web3Wrapper = new Web3Wrapper(providerEngine);
    const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
    const contractAddresses = getContractAddressesForNetwork(NETWORK_CONFIGS.networkId);
    const zrxTokenAddress = contractAddresses.zrxToken;
    const etherTokenAddress = contractAddresses.etherToken;
    const printUtils = new PrintUtils(
        web3Wrapper,
        contractWrappers,
        { maker, taker },
        { WETH: etherTokenAddress, ZRX: zrxTokenAddress },
    );
    printUtils.printAccounts();

    // the amount the maker is selling of maker asset
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
    // the amount the maker wants of taker asset
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
    // 0x v2 uses hex encoded asset data strings to encode all the information needed to identify an asset
    const makerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
    let txHash;
    let txReceipt;


    const testGetOrders = async () => {
        const response = await fetch('https://api.radarrelay.com/v2/markets');
        const myjson = await response.json();
        console.log(myjson);
    }

   /* 
    // Initialize the Standard Relayer API client
    const httpClient = new HttpClient('https://api.radarrelay.com/v2/markets/{ZRX-WETH}/book');


    // Taker queries the Orderbook from the Relayer
    const orderbookRequest = { baseAssetData: makerAssetData, quoteAssetData: takerAssetData };
    const response = await httpClient.getOrderbookAsync(orderbookRequest, { networkId: NETWORK_CONFIGS.networkId });
    if (response.asks.total === 0) {
        throw new Error('No orders found on the SRA Endpoint');
    }
    console.log(response);
    */
}

class OrderBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0.00,
            type: 'Buy',
            price: 0.00,
            amount: 0.00,
            total: 0.00,
        };
        this.handleamountData = this.handleamountData.bind(this);
        this.handletimeData = this.handletimeData.bind(this);
        this.handletypeData = this.handletypeData.bind(this);
        this.handlepriceData = this.handlepriceData.bind(this);
        this.handletotalData = this.handletotalData.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }
    handleamountData(event) {
        const val = event.target.value;
        this.setState(() => ({
            amount: val
        }));
    }
    handlepriceData(event) {
        const val = event.target.value;
        this.setState(() => ({
            price: val
        }));
    }
    handletimeData(event) {
        const val = event.target.value;
        this.setState(() => ({
            time: val
        }));
    }
    handletypeData(event) {
        const val = event.target.value;
        this.setState(() => ({
            type: val
        }));
    }
    handletotalData(event) {
        const val = event.target.value;
        this.setState(() => ({
            total: val
        }));
    }
    onButtonClick() {
        void (async () => {
          try {
            await getOrderBook();
          } catch (e) {
            console.log(e);
            providerEngine.stop();
          //  process.exit(1);
          }
        })();
    }
    render() {
        return (
            <div>
                <button onClick={this.onButtonClick} type="submit">Get OrderBook</button>
                <div class="order-table">
                    <table>
                        <thead>
                            <tr class="no-select">
                                <th class="time down">TIME</th>
                                <th class="type">TYPE</th>
                                <th class="price"><span class="hide-xs">Price (WETH)</span><span class="show-xs">PRICE</span></th>
                                <th class="amount text-right">ZRX</th>
                                <th class="total text-right">WETH</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        );
    };
};

export default OrderBook;
