import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect,
    Router,
    withRouter
} from 'react-router-dom';

import { Products } from './Components/products';
import { CreateProduct } from './Components/products-component/create-product';
import { EditProduct } from './Components/products-component/edit-product';
import { Apps } from './Components/apps';
import { InstallApp } from './Components/apps-component/install-app';
import { Header } from './Layout/header';

import { globalState } from '../../services/globalstate';
import history from '../../shared/history';

import './panel.css';

export class Panel extends Component {

    menu = [
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
        }
    ];
    render() {
        // globalState.removeLocalStorage('user_authenticated');
        return (
            <Router history={history}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="app-header">
                                <Header menu={this.menu} selected={1} history={history}></Header>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 app-panel">
                            <Switch>
                                <Route exact path="/panel/" render={() => (
                                    <Redirect to="/panel/products"/>
                                )}/>
                                <Route exact path='/panel/products' component={Products}/>
                                <Route exact path='/panel/products/create' component={CreateProduct}/>
                                <Route path='/panel/products/edit/:id' component={EditProduct}/>
                                <Route exact path='/panel/apps' component={Apps}/>
                                <Route path='/panel/apps/install' component={InstallApp}/>
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
