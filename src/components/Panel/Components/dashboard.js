import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Page, Card, Select,} from '@shopify/polaris';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExclamation, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import { requests } from '../../../services/request';
import {isUndefined} from "util";
import {notify} from "../../../services/notify";
import './dashboard/dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.API_CHECK = this.API_CHECK.bind(this);
        this.state = {
            stepData: [], // this will store the current showing step, which is selected from data object
            data: {
                Shopify_Google : [
                    {
                        message: <p> Choose a plan for Shopify-Google Express <NavLink  to="/panel/plans">Integration.</NavLink>
                            If you are <b> buying plan for the first time</b> then, once you buy the plan your
                            <b> 7 days trial</b> will be active for first week, and your <b> payment cycle will start after 7 days</b>.</p>,
                        stepperMessage: 'Choose a plan for Shopify-Google Express', // stepper Small Message
                        API_endpoint: 'connector/get/services', // Api End Point
                        data: 'shopify_importer', // Data Used In API end Point for finding particular step we need to check
                        show: false // used in stepper Check either Completed or not
                    },
                    {
                        message: <p> Link your <b> google merchant center</b> <NavLink  to="/panel/accounts">account.</NavLink>
                            Please make sure that you have <b> verified & claimed</b> website URL in your Merchant Center, that should be
                            <b> same as your Shopify store URL</b>
                        </p>,
                        stepperMessage: 'Google Merchant Center linked',
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <span>Enter default <NavLink  to="/panel/configuration">configurations.</NavLink></span>,
                        stepperMessage: 'Configurations',
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <p>Upload your products on  <NavLink  to="/panel/import">Google Merchant Center.</NavLink></p>,
                        stepperMessage: 'Products Uploaded On Google Merchant Center',
                        API_endpoint: '',
                        hideStatus: true,
                        data: '',
                        show: false
                    },
                ],
                Amazon_Shopify: [
                    {
                        message: <p> Choose a plan for Amazon-Shopify  <NavLink  to="/panel/plans">Integration.</NavLink></p>,
                        stepperMessage: 'Amazon-Shopify Plan Chosen',
                        API_endpoint: 'connector/get/services',
                        data: 'shopify_uploader',
                        show: false
                    },
                    {
                        message:  <p> Link your AWS/MWS <NavLink  to="/panel/accounts">account.</NavLink></p>,
                        stepperMessage: 'AWS/MWS Account Linked',
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <span>Enter default <NavLink  to="/panel/configuration">configurations.</NavLink></span>,
                        stepperMessage: 'Configurations',
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <p> Import your products from amazon to <NavLink  to="/panel/import">shopify.</NavLink></p>,
                        stepperMessage: 'Products Imported From Amazon-Shopify',
                        API_endpoint: '',
                        hideStatus: true,
                        data: '',
                        show: false
                    },
                ],
            },
        }
    }
    state = {
        selected: 'Shopify_Google',
    };
    componentWillMount() {
        this.setState({
            stepData: this.state.data.Shopify_Google,
        });
        Object.keys(this.state.data).map(data => {
            this.state.data[data].forEach(keys => {
                this.API_CHECK(keys,data);
            })
        })
    }

    handleChange = (newValue) => {
        this.setState({
            selected: newValue,
            stepData: this.state.data[newValue]
        });
    };
    API_CHECK(event, key) {
        if (event.API_endpoint !== '' ) {
            requests.getRequest(event.API_endpoint).then(data => {
                if ( data.success ) {
                    if ( data.data !== null && !isUndefined(data.data)  ) {
                        if ( data.data[event.data].usable === 1 ) {
                            let temp = this.state.data;
                            temp[key].forEach(keys => {
                                if ( keys.API_endpoint === event.API_endpoint ) {
                                    keys.show = true;
                                }
                            });
                            this.setState({data: temp});
                        }
                    }
                } else {
                    notify.error(data.message);
                }
            })
        }
    }
    renderStepper() {
        let flag = 1;
        return (
            <div className="container">
                <div className="row bs-wizard" style={{borderBottom:"0"}}>
                    {this.state.stepData.map((data, index) => {
                        let css = 'disabled ';
                        if (data.show) {
                            css = 'complete';
                        } else if (flag === 1) {
                            css = 'active';
                            flag++;
                        }
                        return(<React.Fragment key={index}>
                            <div className={`col-3 bs-wizard-step ${css}`}>
                                <div className="text-center bs-wizard-stepnum">Step {index + 1}</div>
                                <div className="progress">
                                    <div className="progress-bar"/>
                                </div>
                                <a href="javascript:void(0)" className="bs-wizard-dot"/>
                                <div className="bs-wizard-info text-center">{data.stepperMessage}</div>
                            </div>
                        </React.Fragment>);
                    })}
                </div>
            </div>
        );
    }
    renderBody() {
        let flag = 1;
        return(
            Object.keys(this.state.stepData).map(keys => {
                let css = 'divDisabled';
                if ( this.state.stepData[keys].show ) {
                    css = 'divCompleted';
                } else if (flag === 1) {
                    css = 'divActive';
                    flag++;
                }
                return (
                    <div className={`mt-5 ${css}`} key={keys}>
                            <div className="p-5">
                                <div className="row">
                                    <div className="col-12">
                                        <h2>Step {parseInt(keys) +1} :</h2>
                                    </div>
                                    <div className="col-12 p-3 pl-5">
                                        <h4>{this.state.stepData[keys].message}</h4>
                                    </div>
                                </div>
                            </div>
                    </div>
                );
            })
        );
    }
    render() {
        const options = [
            {label: 'Shopify-Google Integration', value: 'Shopify_Google'},
            {label: 'Amazon-Shopify Integration', value: 'Amazon_Shopify'},
        ];
        return (
            <Page
                title="Dashboard">
                <Card >
                    <div className="p-5">
                        <Select
                            label="Step To Follow :-"
                            options={options}
                            onChange={this.handleChange}
                            value={this.state.selected}
                        />
                    </div>
                </Card>
                <Card>
                    {this.renderStepper()}
                </Card>
                    {this.renderBody()}
            </Page>
        );
    }
}

export default Dashboard;