import React, { Component } from 'react';

import { Page,
        AccountConnection,
        Button,
        Card } from '@shopify/polaris';
import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import {faArrowsAltH, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class Apps extends Component {

    constructor() {
        super();
        this.getConnectors();
    }

    getConnectors() {
        this.state = {
            apps: []
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
                            if (app.code === 'amazonimporter') {
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
                                                        <div className="col-4 text-right">
                                                            <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#0f0"/>
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