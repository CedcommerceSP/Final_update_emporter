import React, {Component} from 'react';
import {Select, Button, Card} from "@shopify/polaris";
import {requests} from "../../services/request";
import {notify} from "../../services/notify";
import {json} from "../../environments/static-json";
import {environment} from "../../environments/environment";

class AppsShared extends Component {
    constructor(props) {
        super(props);
        this.getConnectors();
    }

    getConnectors() {
        this.state = {
            apps: [],
            ebay_county_code:'',
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
        requests.getRequest('connector/get/services', { 'filters[type]': 'importer' })
            .then(data => {
                if (data.success) {
                    this.state.code_usable = [];
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            if ( data.data[key].code !== 'shopify_importer' ) {
                                if ( data.data[key].code === 'amazon_importer' )
                                    this.state.code_usable.push('amazonimporter');
                                if ( data.data[key].code === 'ebay_importer' )
                                    this.state.code_usable.push('ebayimporter');
                            }
                        }
                    }
                    this.setState(this.state);
                    setTimeout(() => {this.props.importerServices(this.state.code_usable)},500);
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
                        if (this.state.code_usable.indexOf(app.code) !== -1) {
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
                                                                disabled={this.props.success.code === app.code || app['installed'] !==0}
                                                                onClick={() => {
                                                                    this.installApp(app.code);
                                                                }} primary>{this.props.success.code !== app.code && app['installed']===0?'Connect':'Connected'}</Button>
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
            if ( this.state.ebay_county_code !== '' ) {
                this.props.redirectResult(code, this.state.ebay_county_code);
            } else {
                notify.info('Country is not selected');
            }
        else
            this.props.redirectResult(code, '');
    }
}

export default AppsShared;