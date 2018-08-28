import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Page, Card, Select,} from '@shopify/polaris';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExclamation, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import { requests } from '../../../services/request';
import {isUndefined} from "util";
import {notify} from "../../../services/notify";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.API_CHECK = this.API_CHECK.bind(this);
        this.state = {
            stepData: [],
            data: {
                Shopify_Google : [
                    {
                        message: <p> Choose a plan for Shopify-Google Express <NavLink  to="/panel/plans">Integration.</NavLink> If you are <b>buying plan for the first time</b> then, once you buy the plan your <b>7 days trial</b> will be active for first week, and your <b>payment cycle will start after 7 days</b>.</p>,
                        optional: false,
                        API_endpoint: 'connector/get/services',
                        data: 'shopify_importer',
                        show: false
                    },
                    {
                        message: <p> Link your <b>google merchant center</b> <NavLink  to="/panel/accounts">account.</NavLink>
                            Please make sure that you have <b>verified & claimed</b> website URL in your Merchant Center, that should be <b>same as your Shopify store URL</b>
                        </p>,
                        optional: false,
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <span>Enter default <NavLink  to="/panel/configuration">configurations</NavLink> for Google.</span>,
                        optional: false,
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <p><NavLink  to="/panel/import">Import</NavLink> your products <b>from shopify</b> and then <b>upload products</b> on <NavLink  to="/panel/import">Google Merchant Center.</NavLink></p>,
                        optional: false,
                        API_endpoint: '',
                        hideStatus: true,
                        data: '',
                        show: false
                    },
                ],
                Amazon_Shopify: [
                    {
                        message: <p> Choose a plan for Amazon-Shopify  <NavLink  to="/panel/plans">Integration.</NavLink>If you are <b>buying plan for the first time</b> then, once you buy the plan your <b>7 days trial</b> will be active for first week, and your <b>payment cycle will start after 7 days</b>.</p>,
                        optional: false,
                        API_endpoint: 'connector/get/services',
                        data: 'shopify_uploader',
                        show: false
                    },
                    {
                        message:  <p> Link your AWS/MWS <NavLink  to="/panel/accounts">account.</NavLink></p>,
                        optional: false,
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <span>Enter default <NavLink  to="/panel/configuration">configurations</NavLink> for Amazon.</span>,
                        optional: false,
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <p><NavLink  to="/panel/import">Import</NavLink> your products <b>from amazon</b>, and then <NavLink  to="/panel/import">upload to shopify.</NavLink></p>,
                        optional: false,
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
                {Object.keys(this.state.stepData).map(keys => {
                    return (
                        <Card key={keys} title={`Step ${parseInt(keys) +1}:`} subdued={this.state.stepData[keys].optional}>
                            <div className="pb-5 pl-5 pr-5 pt-5 pt-sm-1">
                                <div className="row">
                                    <div className="col-sm-10 col-7 pt-sm-5">
                                        <h4>{this.state.stepData[keys].message} {!this.state.stepData[keys].optional?'':'(Optional)'}</h4>
                                    </div>
                                    {/*{this.API_CHECK(this.state.stepData[keys],keys)}*/}
                                    {this.state.stepData[keys].show?<div className="col-sm-2 col-3 pt-sm-3">
                                        <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#0f0"/>
                                    </div>:<div className="col-sm-2 col-3 pt-sm-3 pl-5">
                                        {!this.state.stepData[keys].hideStatus?<FontAwesomeIcon icon={faExclamation} size="5x" color="#FFFF66"/>:null}
                                    </div>}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </Page>
        );
    }
}

export default Dashboard;