import React, {Component} from 'react';
import {Select, Button, Card} from "@shopify/polaris";
import {requests} from "../../services/request";
import {notify} from "../../services/notify";
import {json} from "../../environments/static-json";

class AppsShared extends Component {
    constructor(props) {
        super(props);
        this.getConnectors();
    }

    getConnectors() {
        this.state = {
            apps: [],
            ebay_county_code:'',
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
    handleEbayCountryChange = (val) => {
        this.setState({ebay_county_code:val});
    };
    render() {
        return (
            <div className="row">
                {
                    this.state.apps.map(app => {
                        if (app.code === 'amazonimporter' || app.code === 'ebayimporter') {
                            return (
                                <div className="col-12" key={this.state.apps.indexOf(app)}>
                                    <div className="col-12" key={this.state.apps.indexOf(app)}>
                                        <Card title={app.title}>
                                            <div className="row p-5">
                                                <div className="col-12 text-right">
                                                    <div className="row">
                                                        {app.code === 'ebayimporter'?<div className="col-sm-4 col-12 offset-sm-8 offset-0 mb-4">
                                                            <Select
                                                                options={json.country}
                                                                value={this.state.ebay_county_code}
                                                                onChange={this.handleEbayCountryChange}
                                                                placeholder={'Choose Country'}
                                                                label={''}/>
                                                        </div>:null}
                                                        <div className="col-12">
                                                            <Button
                                                                disabled={this.props.success.success || app['installed'] !==0}
                                                                onClick={() => {
                                                                    this.installApp(app.code);
                                                                }} primary>{!this.props.success.success && app['installed']===0?'Connect':'Connected'}</Button>
                                                        </div>
                                                    </div>
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
        if ( code === 'ebayimporter' )
            this.props.redirectResult(code, this.state.ebay_county_code);
        else
            this.props.redirectResult(code, '');
    }
}

export default AppsShared;