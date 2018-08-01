import React, { Component } from 'react';

import { Button,
         Page,
         Card } from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import { globalState } from '../../../services/globalstate';

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
                breadcrumbs={[{content: 'Apps'}]}
                title="Apps List">
                <div className="row">
                    {
                        this.state.apps.map(app => {
                            return (
                                <div className="col-sm-6 col-12 mt-1 mb-1" key={this.state.apps.indexOf(app)}>
                                    <Card title={app.title} sectioned>
                                        <img src={app.image} alt={app.title} />
                                        {
                                            app.title === 'Shopify' &&
                                            <div className="text-center">
                                                <Button onClick={() => {
                                                        this.installApp(app.code);
                                                    }}>Get App</Button>
                                            </div>
                                        }
                                        {
                                            app.title !== 'Shopify' &&
                                            <div className="text-center">
                                                <Button onClick={() => {
                                                    this.installApp(app.code);
                                                }}>Link Your Account</Button>
                                            </div>
                                        }
                                    </Card>
                                </div>
                            );
                        })
                    }
                </div>
            </Page>
        );
    }

    installApp(code) {
        this.redirect('/panel/apps/install?code=' + code);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}
