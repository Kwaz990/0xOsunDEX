import { ContractWrappers, MetamaskSubprovider, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Content, Footer } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';

import { Account } from './components/account';
import { Faucet } from './components/faucet';
import { InstallMetamask } from './components/install_metamask';
import { Nav } from './components/nav';
//import { Welcome } from './components/welcome';
import { ZeroExActions } from './components/zeroex_actions';
import { networkToRPCURI } from './utils';
//import "./App.css";
import Description from "./components/Description";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
//import PropTypes from "prop-types";
//import NavigationBar from "./components/NavigationBar";
import AvaialbleMarkets from "./components/AvailableMarkets";
import NavContainer from "./components/Nav_Container";
import { Container, Box } from 'bloomer';
//import Chart1 from "./components/chart2";

/*
@type {{textAlign: React.CSSProperties}} 

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
    paddingLeft: 30, 
    paddingRight: 30, 
    paddingBottom: 30
  };
  
  const flexCont = {
    display: "flex",
    flexDirection: "row",
    padding: 30
  };
*/

/*

style={{
    fontFamily: "sans-serif",
    textAlign: "center",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30
*/


/* 
{
                                display: "flex",
                                flexDirection: "row",
                                padding: 30
                            }
                            */

interface AppState {
    web3Wrapper?: Web3Wrapper;
    contractWrappers?: ContractWrappers;
    web3?: any;
}

export class MainApp extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        void this._initializeWeb3Async();
    }
    public render(): React.ReactNode {
        const AccountWithNotifications = withToastManager(Account);
        const ZeroExActionsWithNotifications = withToastManager(ZeroExActions);
        if (!this.state || !this.state.contractWrappers || !this.state.web3Wrapper) {
            return <div />;
        }
        return (
            <Router>
                <div>
                    <Nav web3Wrapper={this.state.web3Wrapper} />
                    <Content>
                        {this.state.web3 && (
                            <div>
                            <div className="container1">
                                <div className="intro">
                                <NavContainer />
                                <Description />
                                </div>
                                </div>
                                <div className="container2">
                                <div className="availableMarkets">
                                <Container>
                                    <Box isFullWidth={false}>
                                        <AvaialbleMarkets />
                                    </Box>
                                </Container>
                                </div>
                                </div>
                                <div className="container3">
                                <ToastProvider>
                                    <div className="accounts">
                                    <Container>
                                        <Box>
                                    <AccountWithNotifications
                                        erc20TokenWrapper={this.state.contractWrappers.erc20Token}
                                        web3Wrapper={this.state.web3Wrapper}
                                    />
                                    </Box>
                                    </Container>
                                    </div>
                                    <div className="orderBox">
                                    <Container>
                                        <Box>
                                    <ZeroExActionsWithNotifications contractWrappers={this.state.contractWrappers}
                                        web3Wrapper={this.state.web3Wrapper}
                                    />
                                    </Box>
                                    </Container>
                                    </div>
                                    </ToastProvider>
                                    </div>
                                    <div className="container4">
                                    <ToastProvider>
                                        <Container>
                                            <Box>
                                    <Faucet web3Wrapper={this.state.web3Wrapper} />
                                    </Box>
                                    </Container>
                                </ToastProvider>
                                </div>
                            </div>
                        )}
                        {!this.state.web3 && <InstallMetamask />}
                    </Content>
                    <Footer />
                </div>
            </Router>
        );
    }
    private async _initializeWeb3Async(): Promise<void> {
        let injectedProviderIfExists = (window as any).ethereum;
        if (!_.isUndefined(injectedProviderIfExists)) {
            if (!_.isUndefined(injectedProviderIfExists.enable)) {
                try {
                    await injectedProviderIfExists.enable();
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            const injectedWeb3IfExists = (window as any).web3;
            if (!_.isUndefined(injectedWeb3IfExists) && !_.isUndefined(injectedWeb3IfExists.currentProvider)) {
                injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
            } else {
                return undefined;
            }
        }
        if (injectedProviderIfExists) {
            // Wrap Metamask in a compatibility wrapper as some of the behaviour
            // differs
            const networkId = await new Web3Wrapper(injectedProviderIfExists).getNetworkIdAsync();
            const signerProvider =
                injectedProviderIfExists.isMetaMask || injectedProviderIfExists.isToshi
                    ? new MetamaskSubprovider(injectedProviderIfExists)
                    : new SignerSubprovider(injectedProviderIfExists);
            const provider = new Web3ProviderEngine();
            provider.addProvider(signerProvider);
            provider.addProvider(new RPCSubprovider(networkToRPCURI[networkId]));
            provider.start();
            const web3Wrapper = new Web3Wrapper(provider);
            const contractWrappers = new ContractWrappers(provider, { networkId });
            // Load all of the ABI's into the ABI decoder so logs are decoded
            // and human readable
            _.map(
                [
                    contractWrappers.exchange.abi,
                    contractWrappers.erc20Token.abi,
                    contractWrappers.etherToken.abi,
                    contractWrappers.forwarder.abi,
                ],
                abi => web3Wrapper.abiDecoder.addABI(abi),
            );
            this.setState({ web3Wrapper, contractWrappers, web3: injectedProviderIfExists });
        }
    }
}

const e = React.createElement;
const main = document.getElementById('app');
ReactDOM.render(e(MainApp), main);
