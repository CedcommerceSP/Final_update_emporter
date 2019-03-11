import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import * as queryString from "query-string";
import {isUndefined} from "util";
import { Modal, Label, Banner } from '@shopify/polaris';

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
import Guide from "./Components/dashboard/guide";
import CurrentPlan from "./Components/plans-component/current-plan";
import AnalyticsReporting from "./Components/products-component/analytics-reporting";
import BillingHistory from "./Components/plans-component/billing-history";
import ConnectedAccounts from "./Components/apps-component/connected-accounts";
import ReportAnIssue from "./Components/help-component/report-issue";
import ViewProfile from "./Components/profile-component/view-profile";
import ViewProducts from "./Components/products-component/view-products";
import { modifyAccountConnectedInfo} from "./Components/static-functions";

import {requests} from "../../services/request";

import './panel.css';

export class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: true,
            necessaryInfo: {},
        };
        this.disableHeader = this.disableHeader.bind(this);
        this.getNecessaryInfo = this.getNecessaryInfo.bind(this);
        this.getNecessaryInfo();
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

    getNecessaryInfo(){
        requests.postRequest('frontend/app/getNecessaryDetails').then(e => {
           if ( e.success ) {
               let account_connected_array = e['account_connected'].map(e => (e.code));
               let account_connected = modifyAccountConnectedInfo(account_connected_array);
               let credits = {};
               if ( typeof e['services'] === 'object' ) {
                   e['services'].forEach(e => {
                       if ( e.code === 'product_import' ) {
                           credits = e;
                       }
                   });
                   if ( credits['available_credits'] < 5 ) {
                       this.setState({creditsExpired:true});
                   }
               }
               let user_necessary_details = {
                   account_connected: account_connected,
                   services: e['services'],
                   credits : credits,
                   account_connected_array:account_connected_array
               };
               console.log(user_necessary_details);
               this.setState({
                   necessaryInfo: user_necessary_details
               });
           }
        });
    }

    componentWillUpdate() {
        if ( environment.isLive ) {
            console.clear();
            console.info("Welcome To OMNI-Importer");
        }
    }
    disableHeader(value) {
        if ( !value ) {
            console.clear();
        }
        this.setState({header:value});
    }
    menu = panelFunctions.getMenu();
    render() {
        return (
                <div className="container-fluid app-panel-container">
                    <div className="row">
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
                                    return <Products {...this.props} necessaryInfo={this.state.necessaryInfo}/>
                                }}/>
                                <Route exact path='/panel/products/view/:id' component={ViewProducts}/>
                                <Route exact path='/panel/products/analysis' component={AnalyticsReporting}/>
                                <Route exact path='/panel/accounts' render={() => {
                                    return <Apps {...this.props} getNecessaryInfo={this.getNecessaryInfo} necessaryInfo={this.state.necessaryInfo}/>
                                }}/>
                                <Route exact path='/panel/accounts/connect' component={ConnectedAccounts}/>
                                <Route exact path='/panel/plans' component={Plans}/>
                                <Route path='/panel/accounts/install' component={InstallApp}/>
                                <Route path='/panel/accounts/success' component={AppInstalled}/>
                                <Route exact path='/panel/import' component={Import}/>
                                <Route exact path='/panel/profiling' component={Profiling}/>
                                <Route exact path='/panel/profiling/view' component={ViewProfile}/>
                                <Route exact path='/panel/profiling/create' component={CreateProfile}/>
                                <Route exact path='/panel/configuration' render={() => {
                                    return <Configuration {...this.props} necessaryInfo={this.state.necessaryInfo}/>
                                }}/>
                                <Route exact path='/panel/plans' component={Plans}/>
                                <Route exact path='/panel/plans/current' component={CurrentPlan}/>
                                <Route exact path='/panel/plans/history' component={BillingHistory}/>
                                <Route exact path='/panel/queuedtasks' component={QueuedTask}/>
                                <Route exact path='/panel/queuedtasks/activities' component={Activities}/>
                                <Route exact path='/panel/help' render={() => {
                                    return <FAQPage {...this.props} necessaryInfo={this.state.necessaryInfo} disableHeader={this.disableHeader}/>
                                }}/>
                                <Route exact path='/panel/help/report' component={ReportAnIssue}/>
                                <Route exact path='/panel/dashboard/guide' component={Guide}/>
                                <Route exact path='/panel/dashboard' render={() => {
                                    return <Dashboard disableHeader={this.disableHeader} necessaryInfo={this.state.necessaryInfo} {...this.props}/>
                                }}/>
                                <Route exact path="**" render={() => (
                                    <Redirect to="/panel/dashboard"/>
                                )}/>
                            </Switch>
                        </div>
                    </div>
                    <Modal title={"Low Credits"} open={this.state.creditsExpired} onClose={() => {
                        this.setState({creditsExpired:false});}} primaryAction={{content:"Plan Section", onClick:() => {
                            this.redirect('/panel/plans');
                            this.setState({creditsExpired:false});
                        }}}>
                        <Modal.Section>
                            <Banner title={"Alert"} status="warning">
                                <Label id={123}>
                                    You Almost Exhausted Your Credits. Kindly Buy Some Credits From Plan Section.
                                </Label>
                            </Banner>
                        </Modal.Section>
                    </Modal>
                </div>
        );
    }
    redirect = (url) => {
        this.props.history.push(url);
    };
}


