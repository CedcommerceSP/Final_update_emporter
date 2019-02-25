import React, { Component } from 'react';

import {
    Page,
    AccountConnection,
    Button,
    Card, Select, Modal
} from '@shopify/polaris';
import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import {faArrowsAltH, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {environment} from "../../../environments/environment";
import {json} from "../../../environments/static-json";
import AppsShared from "../../../shared/app/apps";
import {isUndefined} from "util";
import InstallAppsShared from "../../../shared/app/install-apps";

export class Apps extends Component {

    constructor(props) {
        super(props);
        this.state = {
            API_code: ['google'], // connector/get/installationForm, method -> get, eg: { code : 'google' }
            account_linked: [], // merchant center account. linked type
            modalOpen: false,
            data3Check:{},
            importerServices:[],
        };
        // this.getConnectors();
    }

    checkLinkedAccount() {
        requests.postRequest('frontend/app/checkAccount', {code:this.state.importerServices}).then(data => {
            if ( data.success ) {
                if ( data.data.account_connected ) {
                    notify.success('Account Connected Successfully');
                } else {
                    notify.info('Please Connect Your Account First');
                }
            } else {
                notify.error(data.message);
            }
        });
    }
    openNewWindow = (code, val) => {
        this.setState({modalOpen: !this.state.modalOpen, code: code, additional_data: val});
    }; // Open Modal And A new Small Window For User
    handleImporterService = (arg) => {
        this.setState({importerServices:arg});
    };
    redirectResult = (code, val) => {
        if ( isUndefined(val) ) { val = '' }
        this.openNewWindow(code, val);
    }; // used in step 3 to get child data and send back to new child
    renderAccountInfo = () => {
        return <div className="">
                <AppsShared history={this.props.history} importerServices={this.handleImporterService} redirectResult={this.redirectResult} success={this.state.data3Check}/>
                </div>;
    };
    handleModalChange = (event) => {
        if (event === 'init_modal') {
            notify.info("Please Select A Integration First")
        } else {
            this.setState({modalOpen: !this.state.modalOpen});
        } // if he/she cancel or close the modal
    };
    render() {
        return (
          <React.Fragment>
              <Page
                  title={"Accounts"}
                  primaryAction={{content:'Connected Accounts', onClick:() => {
                      this.redirect('/panel/accounts/connect');
                  }}}>
                  {this.renderAccountInfo()}
                  <Modal
                      open={this.state.modalOpen}
                      onClose={this.handleModalChange.bind(this,'no',this.state.active_step)}
                      title="Connect Account"
                  >
                      <Modal.Section>
                          <InstallAppsShared
                              history={this.props.history}
                              redirect={this.redirectResult}
                              code={this.state.code}
                              additional_data={this.state.additional_data}
                              success3={this.handleLinkedAccount}
                          />
                      </Modal.Section>
                  </Modal> {/* Open For Step 3 to see Connected Account */}
              </Page>
          </React.Fragment>
        );
    }
    handleLinkedAccount = (event) => {
        this.setState({data3Check:event});
    };
    redirect(url) {
        this.props.history.push(url);
    }

    // getConnectors() {
    //     this.state = {
    //         apps: [],
    //         code_usable:[],
    //     };
    //     requests.getRequest('connector/get/all')
    //         .then(data => {
    //             if (data.success) {
    //                 let installedApps = [];
    //                 for (let i = 0; i < Object.keys(data.data).length; i++) {
    //                     installedApps.push(data.data[Object.keys(data.data)[i]]);
    //                 }
    //                 this.setState({
    //                     apps: installedApps
    //                 });
    //             } else {
    //                 notify.error(data.message);
    //             }
    //         });
    //     // requests.getRequest('connector/get/services', { 'filters[type]': 'importer' })
    //     //     .then(data => {
    //     //         if (data.success) {
    //     //             this.state.code_usable = [];
    //     //             for (let i = 0; i < Object.keys(data.data).length; i++) {
    //     //                 let key = Object.keys(data.data)[i];
    //     //                 if (data.data[key].usable || !environment.isLive) {
    //     //                     if ( data.data[key].code !== 'shopify_importer' ) {
    //     //                         if ( data.data[key].code === 'amazon_importer' )
    //     //                             this.state.code_usable.push('amazonimporter');
    //     //                         if ( data.data[key].code === 'ebayimporter' )
    //     //                             this.state.code_usable.push('ebayimporter');
    //     //                     }
    //     //                 }
    //     //             }
    //     //             this.setState(this.state);
    //     //         } else {
    //     //             notify.error(data.message);
    //     //         }
    //     //     });
    //     requests.getRequest('plan/plan/getActive')
    //         .then(data => {
    //             if (data.success) {
    //                 this.state.code_usable = [];
    //                 data.data.services.forEach(e => {
    //                     console.log(e.code);
    //                     if ( e.code === 'amazon_importer' )
    //                         this.state.code_usable.push('amazonimporter');
    //                     if ( e.code === 'ebayimporter' )
    //                         this.state.code_usable.push('ebayimporter');
    //                 });
    //                 this.setState(this.state);
    //             } else {
    //                 notify.error(data.message);
    //             }
    //         });
    // }
    // handleEbayCountryChange = (val) => {
    //     this.setState({ebay_county_code:val});
    // };
    // render() {
    //     return (
    //         <Page
    //             title="Accounts"
    //         primaryAction={{content:'Connected Accounts', onClick:() => {
    //                this.redirect('/panel/accounts/connect');
    //             }}}>
    //             <div className="row">
    //                 {
    //                     this.state.apps.map(app => {
    //                         if (this.state.code_usable.indexOf(app.code) !== -1) {
    //                             return (
    //                                 <div className="col-12" key={this.state.apps.indexOf(app)}>
    //                                     <div className="col-12" key={this.state.apps.indexOf(app)}>
    //                                         <Card title={app.title}>
    //                                             <div className="row p-5">
    //                                                 <div className="col-8">
    //                                                     <img src={app.image} alt={app.title} height={'100px'}/>
    //                                                 </div>
    //                                                 {app['installed'] === 0?
    //                                                     <div className="col-4 text-right">
    //                                                         {app.code === 'ebayimporter'?<div className="col-sm-4 col-12 offset-sm-8 offset-0 mb-4">
    //                                                             <Select
    //                                                                 options={json.country}
    //                                                                 value={this.state.ebay_county_code}
    //                                                                 onChange={this.handleEbayCountryChange}
    //                                                                 placeholder={'Choose Country'}
    //                                                                 label={''}/>
    //                                                         </div>:null}
    //                                                         <Button onClick={() => {
    //                                                             this.installApp(app.code);
    //                                                         }} primary>
    //                                                             Connect
    //                                                         </Button>
    //                                                     </div>:
    //                                                     <div className="col-4 d-flex align-items-center justify-content-end">
    //                                                         <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#5c6ac4"/>
    //                                                     </div>}
    //                                             </div>
    //                                         </Card>
    //                                     </div>
    //                                 </div>
    //                             );
    //                         }
    //                     })
    //                 }
    //             </div>
    //         </Page>
    //     );
    // }
    //
    // installApp(code) {
    //     this.redirect('/panel/accounts/install?code=' + code);
    // }
    //
    // redirect(url) {
    //     this.props.history.push(url);
    // }
}