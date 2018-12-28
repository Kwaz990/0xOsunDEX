import React, { Component } from 'react';

const API = 'https://api.radarrelay.com/v2/markets/ZRX-WETH/candles';
const DEFAULT_QUERY = 'redux';

class ApiTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      isLoading: false,
      dates: []
    };
  }

  componentDidMount() {

    this.fetchData();
  }

  fetchData(){
    fetch(API)
    .then(response => response.json())
    .then(parsedJSON => parsedJSON.results.map(bar => (
       {
         date: `${bar.startBlockTimestamp}`,
         open: `${bar.open}`,
         high: `${bar.high}`,
         low:  `${bar.low}`,
         close: `${bar.close}`
       }
       )))
       .then(bar => this.setState({
         chartData: bar,
         isLoading: true
       }))
       .catch(error => console.log('parsing failed', error))
      }

  

/*

      this.setState({ isLoading: true});

      .then(data => this.setState({ chartData: data, isLoading: false }))
    fetch(API)
      .then(response => response.json())
      .then(data.startBlockTimestamp => this.setState({ dates: data.startBlockTimestamp}))

      /*
      .then(this.chartData.map(hit => hit.startBlockTimestamp)
      .then(hit.open) 
      */
  

  render() {
    const { chartData, isLoading, bar } = this.state;

    if(isLoading) {
        return<p> Loading ... </p>
    }

    return (
        <div>
       <p>Hello Wold</p> 
      <ul>
        {chartData.map(hit => 
          <li key={hit.date}>
            <p>bar: {hit.bar}</p>

          </li>
        )}
      </ul>
      </div>
    );
  }
}


export default ApiTest;