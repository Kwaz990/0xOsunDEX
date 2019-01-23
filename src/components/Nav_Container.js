import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Switch, withRouter } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import OsunTokenSale from './OsunTokenSale';
import Markets from './Markets';
//import DashboardContainer from './DashboardContainer';
//import OrderHistoryPage from './OrderHistoryPage';
import { TransitionGroup, CSSTransition } from "react-transition-group";


//         <Route path="/Markets" component={Markets} />
function NavContainer({ location }) {
        return(
            <div className ="has-text-centered content">
                  <TransitionGroup className="transition-group">
        <CSSTransition
          key={location.key}
          timeout={{ enter: 300, exit: 300 }}
          className={'fade'}
        >
        <section className="route-section">
      <Switch location = {location}> 
        Osun DEX: 
        <ul >
        <Link to = "/">Home        </Link>
        </ul>
        </Switch>
        </section>
        </CSSTransition>
        </TransitionGroup>
    </div>
        );
        
    };
export default withRouter(NavContainer);
