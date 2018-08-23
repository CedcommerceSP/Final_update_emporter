import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect,
    Router
} from 'react-router-dom';

import { Products } from './Components/products';
import { CreateProduct } from './Components/products-component/create-product';
import { EditProduct } from './Components/products-component/edit-product';
import { Apps } from './Components/apps';
import { InstallApp } from './Components/apps-component/install-app';
import { AppInstalled } from './Components/apps-component/app-installed';
import { Import } from './Components/import';
import { Profiling } from './Components/profiling';
import { CreateProfile } from './Components/profile-component/create-profile';
import { Configuration } from './Components/configuration';
import { QueuedTask } from './Components/queued_task';
import { Plans } from './Components/plans';
import { Header } from './Layout/header';
import Dashboard from './Components/dashboard';

import history from '../../shared/history';

import './panel.css';

export class Panel extends Component {

    state = {
      showLoader: false
    };
    menu = [
        {
            id: 'dashboard',
            content: 'Dashboard',
            accessibilityLabel: 'Dashboard',
            link: '/panel/dashboard',
            panelID: 'dashboard'
        },
        {
            id: 'apps',
            content: 'Apps',
            accessibilityLabel: 'Apps',
            link: '/panel/apps',
            panelID: 'apps'
        },
        {
            id: 'products',
            content: 'Products',
            accessibilityLabel: 'Products',
            link: '/panel/products',
            panelID: 'products'
        },
        {
            id: 'import',
            content: 'Upload Products',
            accessibilityLabel: 'Import',
            link: '/panel/import',
            panelID: 'import'
        },
        {
            id: 'profiling',
            content: 'Profiling',
            accessibilityLabel: 'Profiling',
            link: '/panel/profiling',
            panelID: 'profiling'
        },
        {
            id: 'configuration',
            content: 'Configuration',
            accessibilityLabel: 'Configuration',
            link: '/panel/configuration',
            panelID: 'configuration'
        },
        {
            id: 'plans',
            content: 'Plans',
            accessibilityLabel: 'Plans',
            link: '/panel/plans',
            panelID: 'plans'
        },
        {
            id: 'queuedtasks',
            content: 'Queues',
            accessibilityLabel: 'Queues',
            link: '/panel/queuedtasks',
            panelID: 'queuedtasks'
        }
    ];
    render() {
        // globalState.removeLocalStorage('user_authenticated');
        return (
            <Router history={history}>
                <div className="container-fluid app-panel-container">
                    <div className="row">
                        <div className="col-12">
                            <div className="app-header">
                                <Header menu={this.menu} selected={1} history={history}></Header>
                            </div>
                        </div>
                    </div>
                    <div className="row h-100 app-panel">
                        <div className="col-12">
                            <Switch>
                                <Route exact path="/panel/" render={() => (
                                    <Redirect to="/panel/products"/>
                                )}/>
                                <Route exact path='/panel/products' component={Products}/>
                                <Route exact path='/panel/products/create' component={CreateProduct}/>
                                <Route path='/panel/products/edit/:id' component={EditProduct}/>
                                <Route exact path='/panel/apps' component={Apps}/>
                                <Route path='/panel/apps/install' component={InstallApp}/>
                                <Route path='/panel/apps/success' component={AppInstalled}/>
                                <Route exact path='/panel/import' component={Import}/>
                                <Route exact path='/panel/profiling' component={Profiling}/>
                                <Route exact path='/panel/profiling/create' component={CreateProfile}/>
                                <Route exact path='/panel/configuration' component={Configuration}/>
                                <Route exact path='/panel/queuedtasks' component={QueuedTask}/>
                                <Route exact path='/panel/plans' component={Plans}/>
                                <Route exact path='/panel/dashboard' component={Dashboard}/>
                                <Route exact path="**" render={() => (
                                    <Redirect to="/panel/products"/>
                                )}/>
                            </Switch>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

const PanelComponent = new Panel;


