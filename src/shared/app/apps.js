import React, {Component} from 'react';
import {Select, Button, Card} from "@shopify/polaris";
import {requests} from "../../services/request";
import {notify} from "../../services/notify";
import {json} from "../../environments/static-json";
import {faArrowsAltH, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
                                <div className="col-12 mb-4" key={this.state.apps.indexOf(app)}>
                                    <div className="col-12" key={this.state.apps.indexOf(app)}>
                                        <Card title={app.title}>
                                            <div className="row p-5">
                                                <div className="col-4 order-2 text-right">
                                                    <div className="row">
                                                        {app.code === 'ebayimporter' && app['installed']===0?<div className="mb-4 col-12">
                                                            <Select
                                                                options={json.country}
                                                                value={this.state.ebay_county_code}
                                                                onChange={this.handleEbayCountryChange}
                                                                placeholder={'Choose Country'}
                                                                label={''}/>
                                                        </div>:null}
                                                        <div className="col-12">
                                                            {this.props.success.code !== app.code && app['installed']===0?<Button
                                                                disabled={this.props.success.code === app.code || app['installed'] !==0}
                                                                onClick={() => {
                                                                    this.installApp(app.code);
                                                                }} primary>Connect</Button>:<div className="text-right">
                                                                               <FontAwesomeIcon icon={faCheckCircle} size="6x" color="#5c6ac4"/>
                                                                   </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-8 order-1">
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