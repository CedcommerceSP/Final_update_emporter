import React, { Component } from 'react';

import { Page,
        AccountConnection,
        Button,
        Card } from '@shopify/polaris';
import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import {faArrowsAltH, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {environment} from "../../../environments/environment";

export class Apps extends Component {

    constructor() {
        super();
        this.getConnectors();
    }

    getConnectors() {
        this.state = {
            apps: [],
            code_usable:[],
        };
        requests.getRequest('connector/get/all')
            .then(data => {
                if (data.success) {
                    let installedApps = [];
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                    }
                    this.setState({
                        apps: installedApps
                    });
                } else {
                    notify.error(data.message);
                }
            });
        // requests.getRequest('connector/get/services', { 'filters[type]': 'importer' })
        //     .then(data => {
        //         if (data.success) {
        //             this.state.code_usable = [];
        //             for (let i = 0; i < Object.keys(data.data).length; i++) {
        //                 let key = Object.keys(data.data)[i];
        //                 if (data.data[key].usable || !environment.isLive) {
        //                     if ( data.data[key].code !== 'shopify_importer' ) {
        //                         if ( data.data[key].code === 'amazon_importer' )
        //                             this.state.code_usable.push('amazonimporter');
        //                         if ( data.data[key].code === 'ebay_importer' )
        //                             this.state.code_usable.push('ebayimporter');
        //                     }
        //                 }
        //             }
        //             this.setState(this.state);
        //         } else {
        //             notify.error(data.message);
        //         }
        //     });
        requests.getRequest('plan/plan/getActive')
            .then(data => {
                if (data.success) {
                    this.state.code_usable = [];
                    data.data.services.forEach(e => {
                        console.log(e.code);
                        if ( e.code === 'amazon_importer' )
                            this.state.code_usable.push('amazonimporter');
                        if ( e.code === 'ebay_importer' )
                            this.state.code_usable.push('ebayimporter');
                    });
                    this.setState(this.state);
                } else {
                    notify.error(data.message);
                }
            });
    }

    render() {
        return (
            <Page
                title="Accounts"
            primaryAction={{content:'Connected Accounts', onClick:() => {
                   this.redirect('/panel/accounts/connect');
                }}}>
                <div className="row">
                    {
                        this.state.apps.map(app => {
                            if (this.state.code_usable.indexOf(app.code) !== -1) {
                                return (
                                    <div className="col-12" key={this.state.apps.indexOf(app)}>
                                        <div className="col-12" key={this.state.apps.indexOf(app)}>
                                            <Card title={app.title}>
                                                <div className="row p-5">
                                                    <div className="col-8">
                                                        <img src={app.image} alt={app.title} height={'100px'}/>
                                                    </div>
                                                    {app['installed'] === 0?
                                                        <div className="col-4 text-right">
                                                            <Button onClick={() => {
                                                                this.installApp(app.code);
                                                            }} primary>
                                                                Connect
                                                            </Button>
                                                        </div>:
                                                        <div className="col-4 d-flex align-items-center justify-content-end">
                                                            <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#5c6ac4"/>
                                                        </div>}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </Page>
        );
    }

    installApp(code) {
        this.redirect('/panel/accounts/install?code=' + code);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}