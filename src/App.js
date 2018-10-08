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
import { environment } from './environments/environment';
import { isUndefined } from 'util';

export class App extends Component {

  state = {
      showLoader: false,
      shopOrigin: ''
  };
  constructor() {
      super();
      this.checkLoader();
      setTimeout(() => {
          this.getShopOrigin();
      }, 400)
  }

  getShopOrigin() {
      if (globalState.getLocalStorage('shop') !== null) {
          if (!this.inFrame()) {
              this.state.shopOrigin = globalState.getLocalStorage('shop');
              globalState.removeLocalStorage('shop');
              this.setState(this.state);
          }
      }
  }

  inFrame() {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
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

  renderApp() {
      return (
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
                             return <Route path='/panel' component={Panel}/>
                         }}/>
                  <Route path='/show' render={() => {
                      // return globalState.getLocalStorage('user_authenticated') === 'true' ? <Panel/> : <Redirect to="/auth"/>
                      return <Route path='/show' component={OthersRoutes}/>
                  }}/>
                  <Route path="**" render={() => (
                      <Redirect to="/auth"/>
                  )}/>
              </Switch>
          </div>
      );
  }

  render() {
      if (this.state.shopOrigin !== '') {
          return (
              <AppProvider
                  apiKey={environment.APP_API_KEY}
                  shopOrigin={"https://" + this.state.shopOrigin}
                  forceRedirect={true}>
                  {this.renderApp()}
              </AppProvider>
          );
      } else {
          return (
              <AppProvider>
                  {this.renderApp()}
              </AppProvider>
          );
      }
  }
}