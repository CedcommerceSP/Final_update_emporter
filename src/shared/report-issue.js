import React, {Component} from 'react';
import './report-issue.css';
import {Card, Button, TextField, Modal} from "@shopify/polaris";

class ReportIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            subject: '',
            body: '',
        };
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        window.showReportIssue = false;
        this.setState({open: false});
    }
    handleModalChange() {
        this.setState({
            open: !this.state.open
        });
    }
    handleTextChange(key,event) {
        console.log(key,event);
        this.setState({
            [key]: event
        });
    }
    render() {
        return (
            <div className="report-button">
                <Modal
                    open={this.state.open}
                    title="Report An Issue"
                onClose={this.handleChange}
                primaryAction={{content: 'submit', onClick:() => {
                        this.handleChange();
                }}}>
                    <Modal.Section>
                        <div className="p-5">
                            <TextField
                                label="Subject"
                                placeholder="Subject"
                                value={this.state.subject}
                                onChange={this.handleTextChange.bind(this,'subject')}
                            />
                            <div className="mt-4">
                                <TextField
                                    label="Issue"
                                    placeholder="Issue"
                                    value={this.state.body}
                                    onChange={this.handleTextChange.bind(this,'body')}
                                />
                            </div>
                        </div>
                    </Modal.Section>
                </Modal>
                <Button primary={true} onClick={this.handleModalChange}>
                    Report An Issue
                </Button>
            </div>
        );
    }
}

export default ReportIssue;