import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
    SignedOrder,
} from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Button, Control, Field, Input, PanelBlock, Select, TextArea, Notification, Delete } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import { HttpClient } from '@0x/connect';
import { TOKENS, TOKENS_BY_NETWORK } from '../../tokens';
import { NULL_ADDRESS, ZERO } from '../../utils';
//import { OpenModule } from '../open_module';
import { PanelBlockField } from '../panel_block_field';
//import { FillOrder } from './fill_order';

interface Props {
    contractWrappers: ContractWrappers;
    web3Wrapper: Web3Wrapper;
    onTxSubmitted: (txHash: string) => void;
}
interface CreateOrderState {
    makerTokenSymbol: string;
    takerTokenSymbol: string;
    makerAmount: string;
    takerAmount: string;
    signedOrder?: SignedOrder;
    orderHash?: string;
    errorMessage?: string;
}

enum TraderSide {
    MAKER,
    TAKER,
}

export class CreateOrder extends React.Component<Props, CreateOrderState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            makerTokenSymbol: TOKENS.ZRX.symbol,
            takerTokenSymbol: TOKENS.WETH.symbol,
            makerAmount: '1',
            takerAmount: '1',
        };
    }


    public createOrderAsync = async (): Promise<SignedOrder> => {
        // Instantiate relayer client pointing to a local server on port 3000
        const relayerApiUrl = 'http://142.93.65.130:3000/v2/order';
        const relayerClient = new HttpClient(relayerApiUrl);
        const httpClient = relayerClient;

        const { makerTokenSymbol, makerAmount, takerTokenSymbol, takerAmount } = this.state;
        const { web3Wrapper, contractWrappers } = this.props;
        // Query the available addresses
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        // Retrieve the network for the correct token addresses
        const networkId = await web3Wrapper.getNetworkIdAsync();
        // Use the first account as the maker
        const makerAddress = addresses[0];
        // Get the Token Metadata, address, decimals
        const tokensForNetwork = TOKENS_BY_NETWORK[networkId];
        const makerToken = tokensForNetwork[makerTokenSymbol];
        const takerToken = tokensForNetwork[takerTokenSymbol];
        // Encode the selected makerToken as assetData for 0x
        const makerAssetData = assetDataUtils.encodeERC20AssetData(makerToken.address);
        // Encode the selected takerToken as assetData for 0x
        const takerAssetData = assetDataUtils.encodeERC20AssetData(takerToken.address);
        // Amounts are in Unit amounts, 0x requires base units (as many tokens use decimals)
        const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(makerAmount), makerToken.decimals);
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(takerAmount), takerToken.decimals);
        const exchangeAddress = contractWrappers.exchange.address;
        // Create the order
        const order: Order = {
            makerAddress, // maker is the first address
            takerAddress: NULL_ADDRESS, // taker is open and can be filled by anyone
            makerAssetAmount, // The maker asset amount
            takerAssetAmount, // The taker asset amount
            expirationTimeSeconds: new BigNumber(Date.now() + 10 * 60), // Time when this order expires
            makerFee: ZERO, // 0 maker fees
            takerFee: ZERO, // 0 taker fees
            feeRecipientAddress: NULL_ADDRESS, // No fee recipient
            senderAddress: NULL_ADDRESS, // Sender address is open and can be submitted by anyone
            salt: generatePseudoRandomSalt(), // Random value to provide uniqueness
            makerAssetData,
            takerAssetData,
            exchangeAddress,
        };
        // Generate the order hash for the order
        const orderHashHex = orderHashUtils.getOrderHashHex(order);
        const provider = web3Wrapper.getProvider();
        // The maker signs the order as a proof
        try {
            const signedOrder = await signatureUtils.ecSignOrderAsync(provider, order, makerAddress);
            // Store the signed Order
            this.setState(prevState => ({ ...prevState, signedOrder, orderHash: orderHashHex }));
            // Submit the order to the SRA Endpoint
            const submitOrderSuccess = (
                <Notification isColor='primary'>
                    <Delete />
                        Order Successfully Submitted!
                    </Notification>
            )
            await httpClient.submitOrderAsync(signedOrder, { networkId: networkId });
            submitOrderSuccess;
            return signedOrder;
        } catch (err) {
            this.setState({ errorMessage: err.message });
            return null as any;
        }
    }
    public render(): React.ReactNode {
        const signedOrderRender = this.state.signedOrder ? (
            <div>
                <PanelBlockField label="Order Hash">
                    <Input value={this.state.orderHash} readOnly={true} />
                </PanelBlockField>
                <PanelBlockField label="Signed Order">
                    <TextArea value={JSON.stringify(this.state.signedOrder, null, 2)} type="text" readOnly={true} />
                </PanelBlockField>
            </div>
        ) : (
                <div />
            );
        const makerTokenRender = (
            <PanelBlockField label="Buy Token">
                <Field hasAddons={true}>
                    <Control>{this.buildTokenSelector(TraderSide.MAKER)}</Control>
                    <Input
                        onChange={(e: any) => this.orderTokenAmountChanged(e.target.value, TraderSide.MAKER)}
                        value={this.state.makerAmount}
                        type="text"
                        placeholder="Amount to Buy"
                        id='numTokenBuy'
                    />
                </Field>
            </PanelBlockField>
        );
        const takerTokenRender = (
            <PanelBlockField label="WETH">
                <Field hasAddons={true}>
                    <Control>{this.wethMarkets(TraderSide.TAKER)}</Control>
                    <Control isExpanded={true}>
                        <Input
                            onChange={(e: any) => this.orderTokenAmountChanged(e.target.value, TraderSide.TAKER)}
                            value={this.state.takerAmount}
                            type="text"
                            placeholder="WETH"
                            id='priceWETH'
                        />
                    </Control>
                </Field>
            </PanelBlockField>
        );

        /*
        const fillOrderRender = (

            <Button onClick={FillOrder (signedOrder: signedOrder) {this.state.signedOrder}
        )
        const fillOrderButton = (
            <Button onClick =
        )
                */
            /*
            import Fillorder and create a button that when clicked will execute the fill order function 
            with the singedOrder state 
            */




        /*
        const totalTokenRender = (
            <PanelBlockField label="Total WETH">
                <Field hasAddons={true}>
                    <Control>
                        <img src='https://0xproject.com/images/token_icons/WETH.png' height="40" width="40"></img>
                    </Control>
                    <Control isExpanded={true}>
                        <Input id="totalWETH" isColor='success' placeholder='Text Input' value={Number(this.state.makerAmount) * Number(this.state.takerAmount)} />
                    </Control>
                </Field>
            </PanelBlockField>
        );
            */

        /*
                function doMath() {
                    // Capture the entered values of two input boxes
                    var my_input1 = (document.getElementById('numTokenBuy') as HTMLTextAreaElement).value;
                    var my_input2 = (document.getElementById('priceWETH') as HTMLTextAreaElement).value;
        
                    // Add them together and display
                    var product = parseInt(my_input1) * parseInt(my_input2);
                    return product;
                }
        
        */
        const errorMessageRender = this.state.errorMessage ? <div>{this.state.errorMessage}</div> : <div />;
        return (
            <div>
                <PanelBlock>
                    <div>
                        Creates a 0x order, specifying the Maker and Taker tokens and their amounts.
                    </div>
                </PanelBlock>
                {makerTokenRender}
                {takerTokenRender}
                {errorMessageRender}
                {signedOrderRender}
                <PanelBlock>
                    <Button onClick={this.createOrderAsync} isFullWidth={true} isSize="small" isColor="primary">
                        Place Buy Order
                    </Button>
                </PanelBlock>
            </div>
        );
    }
    public orderTokenSelected = (symbol: string, traderSide: TraderSide) => {
        this.setState(prevState => {
            return traderSide === TraderSide.MAKER
                ? { ...prevState, makerTokenSymbol: symbol }
                : { ...prevState, takerTokenSymbol: symbol };
        });
    }
    public orderTokenAmountChanged = (amount: string, traderSide: TraderSide) => {
        this.setState(prevState => {
            return traderSide === TraderSide.MAKER
                ? { ...prevState, makerAmount: amount }
                : { ...prevState, takerAmount: amount };
        });
    }
    public buildTokenSelector = (traderSide: TraderSide) => {
        const selected = traderSide === TraderSide.MAKER ? this.state.makerTokenSymbol : this.state.takerTokenSymbol;
        return (
            <Select onChange={(e: any) => this.orderTokenSelected(e.target.value, traderSide)} value={selected}>
                {_.map(Object.keys(TOKENS), tokenSymbol => {
                    return (
                        <option key={`${tokenSymbol}-${traderSide}`} value={tokenSymbol}>
                            {tokenSymbol}
                        </option>
                    );
                })}
            </Select>
        );
    }

    public wethMarkets = (traderSide: TraderSide) => {
        const selected = this.state.takerTokenSymbol;
        return (
            <Select value={selected}>
                <option value={selected}>
                    {selected}
                </option>
            </Select>
        );
    }


}
