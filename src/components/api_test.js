import React, { Component } from 'react';

const API = 'https://api.radarrelay.com/v2/markets/ZRX-WETH/candles';
const DEFAULT_QUERY = 'redux';

class Api_test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      isLoading: false,
      dates: []
    };
  }

  componentDidMount() {
      this.setState({ isLoading: true});
    fetch(API)
      .then(response => response.json())
      .then(data => data.map(bar =>(
        {
          date: `${bar.startBlockTimestamp}`,
          open: `${bar.open}`,
          high: `${bar.high}`,
          low:  `${bar.low}`,
          close: `${bar.close}`
        }
      )))
      .then(bar => this.setState({ chartData: bar, isLoading: false }));


      /*
      .then(this.chartData.map(hit => hit.startBlockTimestamp)
      .then(hit.open) 
      */
  }

  render() {
    const { chartData, isLoading, dates } = this.state;

    if(isLoading) {
        return<p> Loading ... </p>
    }

    return (
        <div>
          <p>{dates}</p>
       <p>Hello Wold</p> 
      <ul>
        {chartData.map(hit =>
          <li key={hit.startBlockTimestamp}>
            <p>blocktime: {hit.date}</p>
            <p>Open: {hit.open}</p>
            <p>High: {hit.high}</p>
          </li>
        )}
      </ul>
      </div>
    );
  }
}


export default Api_test;