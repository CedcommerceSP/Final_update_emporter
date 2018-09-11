import React, {Component} from 'react';
import {AccountConnection} from "@shopify/polaris";
import {requests} from "../../services/request";
import {notify} from "../../services/notify";

class AppsShared extends Component {
    constructor(props) {
        super(props);
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
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    installApp(code) {
        this.props.redirectResult(code);
    }
}

export default AppsShared;