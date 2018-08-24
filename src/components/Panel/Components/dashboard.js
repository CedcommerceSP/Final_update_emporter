import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Page, Card, Select,} from '@shopify/polaris';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExclamation, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import { requests } from '../../../services/request';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.API_CHECK = this.API_CHECK.bind(this);
        this.state = {
            stepData: [],
            data: {
                Shopify_Google : [
                    {
                        message: <p> Choose a plan for Shopify-Google Express <NavLink  to="/panel/plans">Integration.</NavLink></p>,
                        optional: false,
                        API_endpoint: 'connector/get/services',
                        data: 'shopify_importer',
                        show: false
                    },
                    {
                        message: <p> Link your google merchant center <NavLink  to="/panel/accounts">account.</NavLink>
                        Please Make sure that you have verified & claimed Store URL in your Merchant Center, that should be same as your Shop URL
                        </p>,
                        optional: false,
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <span>Enter default <NavLink  to="/panel/configuration">configurations.</NavLink></span>,
                        optional: true,
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <p>Upload your products on  <NavLink  to="/panel/import">Google Merchant Center.</NavLink></p>,
                        optional: false,
                        API_endpoint: '',
                        hideStatus: true,
                        data: '',
                        show: false
                    },
                ],
                Amazon_Shopify: [
                    {
                        message: <p> Choose a plan for Amazon-Shopify  <NavLink  to="/panel/plans">Integration.</NavLink></p>,
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
                        message: <span>Enter default <NavLink  to="/panel/configuration">configurations.</NavLink></span>,
                        optional: true,
                        API_endpoint: '',
                        data: '',
                        show: false
                    },
                    {
                        message: <p> Import your products from amazon to <NavLink  to="/panel/import">shopify.</NavLink></p>,
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
                console.log(data);
                if ( data.data[event.data].usable === 1 ) {
                  let temp = this.state.data;
                  temp[key].forEach(keys => {
                     if ( keys.API_endpoint === event.API_endpoint ) {
                         keys.show = true;
                     }
                  });
                  this.setState({data: temp});
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