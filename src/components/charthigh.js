import React, { Component } from "react";
import ApexChart from "react-apexcharts";
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official'
import { BigNumber } from '0x.js';


// THis is a dummy list that allows you to have data points <= length of the dummy list
// this is necessary for the API pull
/*
var dumbshit = []
for (let i = 0; i < 1000; i++) {
    dumbshit.push([0, [0, 0, 0, 0]])
}
*/
class Charthigh extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: {
                    title: {
                        text: this.props.market,
                        align: "left"
                    },
            series: [{
                type: 'candlestick',
                name: this.props.market,
                data: [] //for highcharts the data must be in the for [x, open, high, low, close] where x is the timestamp
            }]
        },
    }
};
    /*
    graph.setState({
                    isLoading: false,
                    options: {
                        chart: {
                            id: "candlestick"
                        },
                    },
                    series: [{
                        data: [
                            [500, [6593.34, 6600, 6582.63, 6600]],
                            [5000, [6595.16, 6604.76, 6590.73, 6593.86]]
                        ]
                    }]
                })
*/


    componentDidMount() {
        var marketLink = this.props.market;
        // var marketLink="ZRX-WETH";
        var graph = this;
        var url = "https://api.radarrelay.com/v2/markets/" + marketLink + "/candles"
        var oldurl = "https://api.radarrelay.com/v2/markets/ZRX-WETH/candles"
        //console.log(marketLink)
        if (typeof (marketLink) === 'string' && marketLink !== 'undefined') {
            console.log("True", marketLink)
            fetch(url)
                // fetch("https://api.radarrelay.com/v2/markets/" + marketLink + "/candles")
                .then(function (response) {
                    console.log(response.headers)
                    // console.log(response.text())
                    return response.json();
                }).then(function (data) {
                    var x = data.map(bar => (
                        [Number(bar.startBlockTimestamp * 1000), 
                            Number(bar.open),
                            Number(bar.high),
                            Number(bar.low),
                            Number(bar.close)
                        ]
                    ))
                    console.log('these are chart candles', x)
                   // console.log('this is bar', bar)
                    return x;
                }).then(function (bar) {
                graph.setState({
                        isLoading: false,
                        options: {
                    series: [{
                        type: 'candlestick',
                        data: bar //for highcharts the data must be in the for [x, open, high, low, close] where x is the timestamp
                    }]
                    }});
                })
        }
    };
    render(props) {
        var value = String(this.props.market)
        const marketRedirect = this.props.marketRedirect;
        return (
            <div id="chartMain">
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={this.state.options}
                />
            </div>

        );
    }
}
export default Charthigh;