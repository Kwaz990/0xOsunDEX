import React, { Component } from "react";
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official'





class Stockchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            stockOptions: {
                yAxis: [
                  {
                    height: "75%",
                    labels: {
                      align: "right",
                      x: -3
                    },
                    title: {
                      text: "Price Test"
                    }
                  },
                  {
                    top: "75%",
                    height: "25%",
                    labels: {
                      align: "right",
                      x: -3
                    },
                    offset: 0,
                    title: {
                      text: "MACD"
                    }
                  }
                ],
                series: [
                  {
                    data: null,
                    type: "ohlc",
                    name: "AAPL Stock Price",
                    id: "aapl"
                  },
                  {
                    type: "pivotpoints",
                    linkedTo: "aapl",
                    zIndex: 0,
                    lineWidth: 1,
                    dataLabels: {
                      overflow: "none",
                      crop: false,
                      y: 4,
                      style: {
                        fontSize: 9
                      }
                    }
                  },
                  {
                    type: "macd",
                    yAxis: 1,
                    linkedTo: "aapl"
                  }
                ]
              }
            }
    };


    componentDidMount() {
        var marketLink = this.props.market;
        // var marketLink="ZRX-WETH";
        var graph = this;
        var url = "https://api.radarrelay.com/v2/markets/" + marketLink + "/candles"
        var oldurl = "https://api.radarrelay.com/v2/markets/ZRX-WETH/candles"
        console.log(marketLink)
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
                        [bar.startBlockTimestamp, [
                            Number(bar.open),
                            Number(bar.high),
                            Number(bar.low),
                            Number(bar.close)
                        ]]
                    ))

                    return x;
                }).then(function (bar) {
                    graph.setState({
                        isLoading: false,
                        stockOptions: {
                            chart: {
                                id: "candlestick"
                            },
                        },
                        series: [{
                            data: bar
                        }]
                    });
                })
        }
    };






render() {
    return(
        <div>
  <HighchartsReact
    highcharts={Highcharts}
    constructorType={"stockChart"}
    options={this.state.stockOptions}
  />
        </div>
    )
};

}
export default Stockchart;
