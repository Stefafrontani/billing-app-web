/** DEPENDENCIES */
import React from 'react';
import { Route, Switch } from "react-router-dom";

/** COMPOMENTS */
import AppContainer from '../AppContainer/AppContainer';
import HomeView from '../../views/HomeView';
import NewPurchaseView from '../../../purchases/views/NewPurchaseView';
import PaymentsView from '../../../payments/views/PaymentsView';

/** STYLES */
import './App.scss';

function App() {
  return (
    <div className="App">
      <AppContainer>
        <Switch>
          <Route exact path="/">
            <HomeView />
          </Route>
          <Route path="/new-purchase">
            <NewPurchaseView />
          </Route>
          <Route path="/payments">
            <PaymentsView />
          </Route>
        </Switch>
      </AppContainer>
    </div>
  );
}

export default App;