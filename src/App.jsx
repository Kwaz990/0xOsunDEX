import * as React from "react";
import "./App.css";
import React, { Component } from "react";
//import logo from "./logo.svg";
//import "./App.css";
import Description from "./components/Description";
import {Web3Provider} from "react-web3";
//import Web3 from "web3";
import { BrowserRouter as Router, Link } from "react-router-dom";
//import PropTypes from "prop-types";
import NavigationBar from "./components/NavigationBar";
import UnlockMetaMask from "./components/unlockMetaMask";
import AvaialbleMarkets from "./components/AvailableMarkets";

const logo = require("./logo.svg");

class App extends React.Component {
  render() {
    return (
      <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <NavigationBar />
          <Description />
          <AvaialbleMarkets />
        </header>
      </div>
      </Router>
    );
  }
}

export default App;
