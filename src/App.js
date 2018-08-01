import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from '@shopify/polaris';

import { Auth } from './components/Auth/auth';
import { Panel } from './components/Panel/panel';

import { globalState } from './services/globalstate';
import history from './shared/history';

export class App extends Component {

  render() {
    return (
        <AppProvider>
          <Switch>
              <Route exact path="/" render={() => (
                  <Redirect to="/auth"/>
              )}/>
              <Route path='/auth' component={Auth}/>
              <Route path='/panel' render={() => {
                  // return globalState.getLocalStorage('user_authenticated') === 'true' ? <Panel/> : <Redirect to="/auth"/>
                  return true ? <Panel history={history}/> : <Redirect to="/auth"/>
              }}/>
              <Route path="*" render={() => (
                  <Redirect to="/auth"/>
              )}/>
          </Switch>
        </AppProvider>
    );
  }
}
