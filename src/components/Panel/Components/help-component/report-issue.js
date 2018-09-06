import React, {Component} from 'react';
import {Page, Card, TextField, Select} from "@shopify/polaris";

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
        console.log(this.state);
    }
    render() {
        const options = [
                {label:'Server',value:'1'},
                {label:'Upload/Import',value:'2'},
                {label:'Account Connection',value:'3'},
                {label:'Other',value:'other'},
                ];
        return (
            <Page
            title="Report Issue"
            primaryAction={{content:'Back', onClick:() => {
                    this.redirect('/panel/help');
                }}}>
                <Card secondaryFooterAction={{content:'Submit', onClick:() => {
                        this.submit();
                    }}}>
                    <div className="p-5">
                        <TextField
                            label="Subject"
                            placeholder="Subject"
                            value={this.state.subject}
                            onChange={this.handleTextChange.bind(this,'subject')}
                        />
                        <div className="mt-4">
                            <Select
                                label="Issue"
                                options={options}
                                onChange={this.handleSelectChange}
                                placeholder="Select here"
                                value={this.state.option}
                            />
                        </div>
                        {this.state.option === 'other'?<div className="mt-4">
                            <TextField
                                label="Other"
                                placeholder="Issue"
                                value={this.state.body}
                                onChange={this.handleTextChange.bind(this,'body')}
                            />
                        </div>:null}
                    </div>
                </Card>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default ReportAnIssue;