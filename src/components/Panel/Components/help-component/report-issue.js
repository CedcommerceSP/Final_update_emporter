import React, {Component} from 'react';
import {Page, Card, TextField, Select} from "@shopify/polaris";
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";

class ReportAnIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: '',
            body: '',
            option:'',
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
    handleTextChange(key,event) {
        this.setState({
            [key]: event
        });
    }
    handleSelectChange(event) {
        this.setState({
            option:event
        });
    }
    submit() {
        let data = {
            body:'',
            subject:''
        };
        if ( this.state.option !== 'other' ) {
            data.body = this.state.body;
            data.subject = 'We have Received Your Issue Related to ' + this.state.option;
        } else {
            data.body = this.state.body;
            data.subject = 'We have Received Your Issue ';
        }
        if ( data.body !== '' && data.subject !== '') {
            requests.postRequest('frontend/app/submitReport',data).then(e => {
                if (e.success) {
                    notify.success(e.message);
                } else {
                    notify.error(e.message);
                }
            });
        } else {
            notify.info('Field Are Empty');
        }
    }
    render() {
        const options = [
            {label:'Issue in regarding Amazon or Ebay seller panel',value:'Amazon/Ebay Seller Panel'},
            {label:'Issue regarding product import or product upload to Shopify',value:'Import/Upload'},
            {label:'Issue Regarding pricing plan',value:'Pricing Plan'},
            {label:'Issue Regarding profiling',value:'Profiling'},
            {label:'Other',value:'other'},
        ];
        return (
            <Page
                title="Contact Us"
                primaryAction={{content:'Back', onClick:() => {
                        this.redirect('/panel/help');
                    }}}>
                <div className="row">
                    <div className="col-12 col-sm-8 order-2 order-sm-1">
                        <Card secondaryFooterAction={{content:'Submit', onClick:() => {
                                this.submit();
                            }}} title={"Have an issue?"}>
                            <div className="p-5">
                                <div className="mt-4 mb-4">
                                    <Select
                                        label="Issue"
                                        options={options}
                                        onChange={this.handleSelectChange}
                                        placeholder="Select here"
                                        value={this.state.option}
                                    />
                                </div>
                                <TextField
                                    label="Description"
                                    placeholder="Eg. how to config setting"
                                    value={this.state.body}
                                    onChange={this.handleTextChange.bind(this,'body')}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-sm-4 order-1 order-sm-2 mb-4">
                        <Card>
                            <div className="row">
                                <div className="col-12 p-5 text-center">
                                    <img src={require('../../../../assets/img/contact-us.png')} height={"165px"}/>
                                    <h5><b>Email:</b> </h5>
                                    <h5>apps@cedcommerce.com</h5>
                                    <hr/>
                                    <h5><b>Phone:</b></h5>
                                    <h5>(+1) 888-882-0953</h5>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default ReportAnIssue;