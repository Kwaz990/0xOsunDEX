import React, { Component } from "react";
import ApexChart from "react-apexcharts";


// THis is a dummy list that allows you to have data points <= length of the dummy list
// this is necessary for the API pull
var dumbshit = []
for (let i = 0; i < 100; i++) {
    dumbshit.push([0, [0, 0, 0, 0]])
}

class Chart1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            options: {
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        rotate: -45,
                        rotateAlways: false,
                        hideOverlappingLabels: true,
                        showDuplicates: false,
                        trim: true,
                        minHeight: undefined,
                        maxHeight: 120,                        
                    }
                },
                yaxis: {
                    title: {
                        text: "Price WETH",
                        align: "left"
                    },
                },
                title: {
                    text: String(this.props.market),
                    align: "center"
                },
                chart: {
                    id: "MainChart",
                    width: '100%',
                    animations: {
                        enabled: false,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        formatter: function (val, opts) {
                            return val
                        },
                        textAnchor: 'middle',
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                            fontSize: '14px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            colors: undefined
                        },
                        dropShadow: {
                            enabled: false,
                            top: 1,
                            left: 1,
                            blur: 1,
                            opacity: 0.45
                        }
                    }
                },
            },
            series: [{
                data: dumbshit
            }]
        };
    }
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
                    console.log('this is what you want', x)
                    return x;
                }).then(function (bar) {
                    graph.setState({
                        isLoading: false,
                        options: {
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


    render(props) {
        var value = String(this.props.market)
        const marketRedirect = this.props.marketRedirect;
        return (
                    <div id="chartMain">
                        <ApexChart
                            options={this.state.options}
                            series={this.state.series}
                            type="candlestick"
                            width="800"
                        />
                    </div>

        );
    }
}
export default Chart1;