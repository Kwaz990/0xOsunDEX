import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Chart1 from './chart2';
import Charthigh from "./charthigh";
//import Stockchart from "./stockchart"
//import Markets from './Markets';
//import Tokens from './Tokens/all';
import "./UI.css";
import { TOKENS, TOKENS_BY_NETWORK } from '../tokens';






class AvailableMarkets extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          radarMarkets: [],
          isLoading: false,
          shortList: []
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
           ]));



           //The following code filters the radar relay markets to align with the tokens.ts file
           // var subtokenList = Object.keys(TOKENS)
           var subtokenList = ["GNT", "MKR", "ZRX", "REP"]
           var excludedList = ["DAI"]

           var filteredX = x.filter(element =>
               subtokenList.some(y => element[0].includes(y)) &&
               !excludedList.some(y => element[0].includes(y)))
            

           console.log('this is X', x)
           console.log('this is filteredX', filteredX)
           console.log(TOKENS)
           console.log(TOKENS_BY_NETWORK)
           //filter the list here and set it to state. Then it will be displayed with link later
           console.log('this is waht you want',x.filter(market => ['MKR-WETH', 'MKR/WETH']))
           //To get the original long list simply return x instead of filteredX
           return filteredX;
           }).then(function(market) {
            this.setState({
                radarMarkets: market,
                isLoading: true
           })
          }.bind(this));
  
        }

    render() {
        var { isLoaded, radarMarkets } = this.state;
        if (isLoaded) {
            return <div>Loading...</div>;
        }
        else {
            return (
                <Router>
                <div className="availableMarketsContainer">
                    <div className ="chartView">
                    <Route path="/Markets/:symbol" render={function(match) {
                        console.log(match.match.params);
                        return(
                        <div className="chart">
                        <Charthigh market={match.match.params.symbol} marketRedirect={null} />
                        </div>)
                    }} />
                    </div>
                    <table className= "marketList">
                        <thead>
                            <tr>
                                <th className="has-text-centered content">TOKEN</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr data-type="h" className = "has-text-centered content">
                        {radarMarkets.map(market => (
                                <li key={market[0]}>
                                <Link to = {"/Markets/" + `${market[0]}`}
                                    onClick={this.forceUpdate}
                                >{market[0]}</Link>
                                                             
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
