import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect,
    Router,
    BrowserRouter
} from 'react-router-dom';

import { Products } from './Components/products';
import { Apps } from './Components/apps';
import { InstallApp } from './Components/apps-component/install-app';
import { AppInstalled } from './Components/apps-component/app-installed';
import { Import } from './Components/import';
import { Profiling } from './Components/profiling';
import { CreateProfile } from './Components/profile-component/create-profile';
import { Configuration } from './Components/configuration';
import { QueuedTask } from './Components/queued_task';
import { Activities } from './Components/queued-tasks-component/activities';
import { Plans } from './Components/plans';
import { Header } from './Layout/header';
import Dashboard from './Components/dashboard';
import FAQPage from './Components/faq';
import { environment } from '../../environments/environment';
import { panelFunctions } from './functions';

import './panel.css';
import CurrentPlan from "./Components/plans-component/current-plan";
import Analyticsreporting from "./Components/products-component/analytics-reporting";
import BillingHistory from "./Components/plans-component/billing-history";
import ConnectedAccounts from "./Components/apps-component/connected-accounts";
import ReportAnIssue from "./Components/help-component/report-issue";
import ViewProfile from "./Components/profile-component/view-profile";
import {requests} from "../../services/request";

import {globalState} from '../../services/globalstate';
import ViewProducts from "./Components/products-component/view-products";
import * as queryString from "query-string";
import {isUndefined} from "util";


const style = {
    trial: {
        height:'70px',
        backgroundColor:'#858585',
        color:'#fff',
        paddingTop:'48px',
        paddingRight:'10px'
    },
    close: {
        cursor:'pointer',
        float:'right'
    }
};
export class Panel extends Component {
    constructor(props) {
        super(props);
        this.disableHeader = this.disableHeader.bind(this);
        // this.trialActive();
    }
    componentWillMount() {
        const params = queryString.parse(this.props.location.search);
        if ( !isUndefined(params.hmac) && !isUndefined(params.shop)) {
            let url = environment.API_ENDPOINT + "shopify/site/login?";
            let end = '';
            for (let i = 0; i < Object.keys(params).length; i++) {
                const key = Object.keys(params)[i];
                url += end + key + '=' + params[key];
                end = '&';
            }
            window.location = url;
        }
    }
    state = {
        showLoader: false,
        header: true,
        isTrialActive: false,
        isTrialActiveClose: true, // when user close the notify
        daysLeft: '',
    };
    trialActive = () => {
        // if ( globalState.getLocalStorage('trial') ) {
        //     this.state.isTrialActive = true;
        //     this.state.daysLeft = globalState.getLocalStorage('trial');
        // } else if ( this.state.isTrialActiveClose ) {
        //         requests.getRequest('plan/plan/getActive').then(status => {
        //             if ( status.success ) {
        //                 this.setState({isTrialActive:false,isTrialActiveClose:false});
        //                 globalState.getLocalStorage('trial')?globalState.removeLocalStorage('trial'):null;
        //             } else {
        //                 requests.getRequest('amazonimporter/config/isTrialActive').then(data => {
        //                     if(data.success) {
        //                         if (data.code === 'UNDER_TRIAL') {
        //                             this.setState({isTrialActive:true,daysLeft:data.message});
        //                             globalState.setLocalStorage('trial',data.message);
        //                         } else {
        //                             globalState.getLocalStorage('trial')?globalState.removeLocalStorage('trial'):null;
        //                         }
        //                     }
        //                 });
        //             }
        //         });
        //     }
    };
    // componentWillUnmount() {
    //     globalState.removeLocalStorage('trial');
    // }
    disableHeader(value) { // disable header
        // if ( !value ) {
        //     globalState.removeLocalStorage('trial');
        // } else {
        //     this.trialActive();
        // }
        this.setState({header:value});
    }
    menu = panelFunctions.getMenu();
    render() {
        return (
                <div className="container-fluid app-panel-container">
                    <div className="row">
                        {/*{this.state.isTrialActive && this.state.isTrialActiveClose && globalState.getLocalStorage('trial') && this.state.header?<div className="col-12 text-center" style={style.trial}>*/}
                            {/*<h3>*/}
                                {/*{this.state.daysLeft}*/}
                                {/*<span style={style.close} className="text-right" onClick={() => {*/}
                                    {/*this.setState({isTrialActive:false,isTrialActiveClose:false});*/}
                                    {/*globalState.removeLocalStorage('trial');*/}
                                {/*}}>*/}
                                    {/*☒*/}
                                {/*</span>*/}
                            {/*</h3>*/}
                        {/*</div>:null}*/}
                        <div className="col-12">
                            <div className="app-header">
                                {this.state.header?<Header menu={this.menu} history={this.props.history}/>:null}
                            </div>
                        </div>
                    </div>
                    <div className="row h-100 app-panel">
                        <div className="col-12">
                            <Switch>
                                <Route exact path="/panel/" render={() => (
                                    <Redirect to="/panel/dashboard"/>
                                )}/>
                                <Route exact path='/panel/products'  render={() => {
                                    return <Products parentProps={this.props} history={this.props.history}/>
                                }}/>
                                <Route exact path='/panel/products/view/:id' component={ViewProducts}/>
                                <Route exact path='/panel/products/analysis' component={Analyticsreporting}/>
                                <Route exact path='/panel/accounts' component={Apps}/>
                                <Route exact path='/panel/accounts/connect' component={ConnectedAccounts}/>
                                <Route exact path='/panel/plans' component={Plans}/>
                                <Route path='/panel/accounts/install' component={InstallApp}/>
                                <Route path='/panel/accounts/success' component={AppInstalled}/>
                                <Route exact path='/panel/import' component={Import}/>
                                <Route exact path='/panel/profiling' component={Profiling}/>
                                <Route exact path='/panel/profiling/view' component={ViewProfile}/>
                                <Route exact path='/panel/profiling/create' component={CreateProfile}/>
                                <Route exact path='/panel/configuration' component={Configuration}/>
                                <Route exact path='/panel/plans' component={Plans}/>
                                <Route exact path='/panel/plans/current' component={CurrentPlan}/>
                                <Route exact path='/panel/plans/history' component={BillingHistory}/>
                                <Route exact path='/panel/queuedtasks' component={QueuedTask}/>
                                <Route exact path='/panel/queuedtasks/activities' component={Activities}/>
                                <Route exact path='/panel/help' component={FAQPage}/>
                                <Route exact path='/panel/help/report' component={ReportAnIssue}/>
                                <Route exact path='/panel/dashboard' render={() => {
                                    return <Dashboard disableHeader={this.disableHeader} parentProps={this.props} history={this.props.history}/>
                                }}/>
                                <Route exact path="**" render={() => (
                                    <Redirect to="/panel/dashboard"/>
                                )}/>
                            </Switch>
                        </div>
                    </div>
                </div>
        );
    }
}


