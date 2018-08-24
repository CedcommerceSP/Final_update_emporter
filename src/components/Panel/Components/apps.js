import React, { Component } from 'react';

import { Button,
         Page,
         Card ,
    AccountConnection,
    AppProvider} from '@shopify/polaris';
import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';



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
                    console.log(installedApps);
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
                title="Accounts">
                <div className="row">
                    {
                        this.state.apps.map(app => {
                            return (
                                <div className="col-sm-6 col-12 mt-1 mb-1" key={this.state.apps.indexOf(app)}>
                                    <AccountConnection
                                        accountName={app.code}
                                        connected={false}
                                        title={app.title}
                                        action={{
                                            content:app['installed']==0?'Connect':'ReConnect',
                                            onClick: this.installApp.bind(this,app.code)
                                        }}
                                        details={app['installed']==0?'Connect Now':'Already Connected'}
                                        termsOfService={<img src={app.image} alt={app.title}/>}
                                    />

                                    {/*<Card title={app.title} sectioned>*/}
                                        {/*<img src={app.image} alt={app.title} />*/}
                                        {/*{*/}
                                            {/*app.title === 'Shopify' &&*/}
                                            {/*<div className="text-center">*/}
                                                {/*<Button onClick={() => {*/}
                                                        {/*this.installApp(app.code);*/}
                                                    {/*}}>Get App</Button>*/}
                                            {/*</div>*/}
                                        {/*}*/}
                                        {/*{*/}
                                            {/*app.title !== 'Shopify' &&*/}
                                            {/*<div className="text-center">*/}
                                                {/*<Button onClick={() => {*/}
                                                    {/*this.installApp(app.code);*/}
                                                {/*}}>Link Your Account</Button>*/}
                                            {/*</div>*/}
                                        {/*}*/}
                                    {/*</Card>*/}
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
