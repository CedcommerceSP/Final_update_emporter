import React, {Component} from 'react';
import {Page, Card, Button, DataTable} from "@shopify/polaris";
import './plan.css';

class BillingHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            open_plan: false,
            data: [
                ['28 march 2018 1:59 PM','Starter Plan','Withdrawal','$99'],
                ['12 sept 2018 4:48','Advance Plan','Withdrawal','$199'],
                ['28 march 2018 1:59 PM','Starter Plan','Withdrawal','$99'],
                ['12 sept 2018 4:48','Advance Plan','Withdrawal','$199'],
            ],
            data_secondary: [
                ['12 sept 2018 4:48','Advance Plan','Withdrawal','$199'],
                ['28 march 2018 1:59 PM','Starter Plan','Withdrawal','$99']
            ],
            data_plan: [
                ['28 march 2018 1:59 PM','Starter Plan','$99','28','Active'],
                ['12 sept 2018 4:48','Advance Plan','$199','28','Expire'],
                ['28 march 2018 1:59 PM','Starter Plan','$99','28','Expire'],
                ['12 sept 2018 4:48','Advance Plan','$199','28','Expire'],
            ],
        };
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }
    handleToggleClick() {
        this.setState({open : !this.state.open});
        const value = this.state.data_secondary;
        setTimeout(() => {
            let data = this.state.data;
            if ( this.state.open ) {
                value.forEach(e => data.push(e))
            } else {
                data.splice(4, data.length);
            }
            this.setState({data:data});
        })
    }
    render() {
        return (
            <Page
                title="Billing History"
                primaryAction={{content: 'Back', onClick: () => {
                        this.redirect('/panel/plans');
                    }}}>
                <Card title="Billing History">
                    <div className="p-5">
                        <DataTable
                            columnContentTypes={[
                                'text',
                                'text',
                                'text',
                                'numeric',
                            ]}
                            headings={[
                                'Date',
                                'Detail',
                                'status',
                                'Price'
                            ]}
                            rows={this.state.data}
                        />
                        <div className={"mt-5 ml-5"}>
                            <Button primary={true} onClick={this.handleToggleClick}>
                                {!this.state.open?"Show More History":"Show Less History"}
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card title="Purchased Plans History">
                    <div className="p-5">
                        <DataTable
                            columnContentTypes={[
                                'text',
                                'text',
                                'numeric',
                                'numeric',
                                'text',
                            ]}
                            headings={[
                                'Start At',
                                'Plan',
                                'price',
                                'Validity',
                                'status',
                            ]}
                            rows={this.state.data_plan}
                        />
                    </div>
                </Card>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default BillingHistory;