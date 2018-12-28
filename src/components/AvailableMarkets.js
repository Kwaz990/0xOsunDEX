import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Route from 'react-router-dom/Route';

import Markets from './Markets';
//import Tokens from './Tokens/all';






class AvailableMarkets extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          radarMarkets: [],
          isLoading: false,
          radarVolumes: []
        };
      }
    
      componentDidMount() {
    
     //   this.fetchMarkets();
     //   this.fetchVolume();
      
    
     // function fetchMarkets(){
        fetch('https://api.radarrelay.com/v2/markets')
        .then(function(response) {
            return response.json();
        }).then(function(parsedJSON) {
            var x = parsedJSON.map(market => (
           [
             market.id,
             market.displayName
           ]))
           return x;
           }).then(function(market) {
            this.setState({
                radarMarkets: market,
                isLoading: true
           })
          }.bind(this));
  
        }
/*
     //   function fetchVolume() { 
          fetch('https://api.radarrelay.com/v2/markets/ZRX-WETH/stats')
          .then(function(results) {
            console.log(results);
            return results.json();
        }).then(data => {   
            this.setState({
                isLoaded: true,
                radarVolumes: data


            }}}

*/

        //   render={props => (
        //     `${market[0]}`
        // )}/>
              //Loop through list of allowed tokens
      //using the token ABI & contract address
      //call the balanceOf method to see if this
      //address carries the token, then list on UI
      /*
      Tokens.forEach((token) => {  
        let contract = this.web3.eth.contract(token.abi);  
        let erc20Token = contract.at(token.address);      
        
        let tokens = this.state.tokens;

            this.setState({  
                tokens  
            })  
          } 
   )} 

*/
        /*
        fetch('https://api.radarrelay.com/v2/markets').then(results => {
            return results.json();
        }).then(data => {
            this.setState({
                isLoaded: true,
                items: data
            })
        
        });

        for (var i = 0; i < this.state.items.length; i ++) {
            var obj = this.state.items[i];

        };

            })
        });

    }
*/

    render() {
        var { isLoaded, radarMarkets } = this.state;
        if (isLoaded) {
            return <div>Loading...</div>;
        }
        else {
            return (
                <Router>
                <div class="Available Markets">
                    <table>
                        <thead>
                            <tr class="no-select">
                                <th class="token">TOKEN</th>
                                <th class="volume">VOLUME</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr data-type="h">
                        {radarMarkets.map(market => (
                                <li key={market[0]}>
                                <Link to = {"/Markets/" + `${market[0]}`}>{market[0]}</Link>
                                <Route path={"/Markets/" + `${market[0]}`} render = {marketRedirect => (
                                    <Markets market={market[0]} marketRedirect = {marketRedirect} /> 
                                )} />                              
                                </li>
                                ))}
                            </tr>
                        <tr data-type="h">
                        </tr>
                        </tbody>
                    </table>
                </div>
                </Router>
            );
        }
    };
}

export default AvailableMarkets;
