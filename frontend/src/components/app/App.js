import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './../login/Login.js';
import Account from './../account/Account.js';

function App() {
  return (
    <Router>
      <div className="App"></div>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
