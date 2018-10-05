import React, {Component} from 'react';
import {AccountConnection, Button, Card} from "@shopify/polaris";
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
                        if (app.code === 'amazonimporter') {
                            return (
                                <div className="col-12" key={this.state.apps.indexOf(app)}>
                                    <div className="col-12" key={this.state.apps.indexOf(app)}>
                                        <Card title={app.title}>
                                            <div className="row p-5">
                                                <div className="col-12 text-right">
                                                    <Button
                                                        disabled={this.props.success || app['installed'] !==0}
                                                        onClick={() => {
                                                        this.installApp(app.code);
                                                    }} primary>{!this.props.success && app['installed']===0?'Connect':'Connected'}</Button>
                                                </div>
                                                <div className="col-12">
                                                    <img src={app.image} alt={app.title}/>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            );
                        }
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