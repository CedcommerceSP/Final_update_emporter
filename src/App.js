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
import { PageLoader } from './shared/loader';
import  OthersRoutes  from './components/other/routes';
import { globalState } from './services/globalstate';
import history from './shared/history';

import { isUndefined } from 'util';

export class App extends Component {

  state = {
      showLoader: false,
  };
  constructor() {
      super();
      this.checkLoader();
  }

  checkLoader() {
      setInterval(() => {
          if (this.state.showLoader !== window.showLoader &&
                !isUndefined(window.showLoader)) {
              this.state.showLoader = window.showLoader;
              const state = this.state;
              this.setState(state);
          }
      }, 50);
  }

  render() {
    return (
        <AppProvider>
            <div>
                {
                    this.state.showLoader &&
                    <PageLoader height="100" width="100" type="Bars" color="#3f4eae" ></PageLoader>
                }
                <Switch>
                    <Route exact path="/" render={() => (
                        <Redirect to="/auth"/>
                    )}/>
                    <Route path='/auth' component={Auth}/>
                    <Route path='/panel'
                           render={() => {
                        // return globalState.getLocalStorage('user_authenticated') === 'true' ? <Panel/> : <Redirect to="/auth"/>
                        return true ? <Route path='/panel' component={Panel}/> : <Redirect to="/auth"/>
                    }}/>
                    <Route path='/show' render={() => {
                        // return globalState.getLocalStorage('user_authenticated') === 'true' ? <Panel/> : <Redirect to="/auth"/>
                        return true ? <OthersRoutes history={history}/> : <Redirect to="/auth"/>
                    }}/>
                    <Route path="**" render={() => (
                        <Redirect to="/auth"/>
                    )}/>
                </Switch>
            </div>
        </AppProvider>
    );
  }
}
