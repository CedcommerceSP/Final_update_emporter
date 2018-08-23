import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Page,
    Card,
    Select,
    Button,
    Label,
    Checkbox, Tooltip, Link, Icon } from '@shopify/polaris';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExclamation, faCheckCircle} from '@fortawesome/free-solid-svg-icons';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stepData: [],
            data: {
                Shopify_Google : [
                    {message: ' Choose a plan for Shopify-Google Express ',link: <NavLink  to="/panel/plans">Integration.</NavLink>,optional: false},
                    {message:  `Link your google merchant center`,link: <NavLink  to="/panel/accounts">account.</NavLink>,optional: false},
                    {message: `Enter default`,link: <NavLink  to="/panel/configuration">configurations.</NavLink>,optional: true},
                    {message: `Upload your products on ` ,link: <NavLink  to="/panel/import">Google Merchant Center.</NavLink>,optional: false},
                ],
                Amazon_Shopify: [
                    {message: ' Choose a plan for Amazon-Shopify ',link: <NavLink  to="/panel/plans">Integration.</NavLink>,optional: false},
                    {message:  `Link your AWS/MWS`,link: <NavLink  to="/panel/accounts">account.</NavLink>,optional: false},
                    {message: `Enter default`,link: <NavLink  to="/panel/configuration">configurations.</NavLink>,optional: true},
                    {message: `Import your products from amazon to ` ,link: <NavLink  to="/panel/import">shopify.</NavLink>,optional: false},
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
    }

    handleChange = (newValue) => {
        this.setState({
            selected: newValue,
            stepData: this.state.data[newValue]
        });
    };
    render() {
        const options = [
            {label: 'Shopify-Google Integration', value: 'Shopify_Google'},
            {label: 'Amazon-Shopify Integration', value: 'Amazon_Shopify'},
        ];
        return (
            <Page
                breadcrumbs={[{content: 'Dashboard'}]}
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
                                        <h4>{this.state.stepData[keys].message} {this.state.stepData[keys].link} {!this.state.stepData[keys].optional?'':'(Optional)'}</h4>
                                    </div>
                                    <div className="col-sm-2 col-3 pt-sm-3">
                                        <FontAwesomeIcon icon={!this.state.stepData[keys].optional?faCheckCircle:faExclamation} size="5x" color={!this.state.stepData[keys].optional?'#0f0':'#FFFF66'}/>
                                    </div>
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