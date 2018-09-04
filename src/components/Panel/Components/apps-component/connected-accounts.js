import React, {Component} from 'react';
import {Page, Card, Banner} from "@shopify/polaris";

class ConnectedAccounts extends Component {
    render() {
        return (
            <Page title="Accounts" primaryAction={{content:'Back', onClick:() => {
                    this.redirect('/panel/accounts');
                }}}>
                <Card title="Amazon">
                    <div className="p-5">
                        <Banner title="Amazon"  status="info" icon="checkmark">
                                <h3>https://connector.com/marketplace-logos/shopify.png</h3>
                                <h5>5 sept, 2018</h5>
                        </Banner>
                    </div>
                </Card>
                <Card title="Google">
                    <div className="p-5">
                        <div className="row">
                            <div className="col-12 text-center mb-5 p-5" style={{backgroundColor:'rgb(238, 249, 249)',color:'#303030'}}>
                                <h3>https://connector.com/marketplace-logos/shopify.png</h3>
                                <h5>5 sept, 2018</h5>
                            </div>
                            <div className="col-12 text-center p-5" style={{backgroundColor:'rgb(238, 249, 249)',color:'#303030'}}>
                                <h3>https://connector.com/marketplace-logos/shopify.png</h3>
                                <h5>5 sept, 2018</h5>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card title="Shopify">
                    <div className="p-5 m-5" style={{backgroundColor:'rgb(238, 249, 249)',color:'#303030'}}>
                        <div className="row ">
                            <div className="col-12 text-center p-5" style={{backgroundColor:'rgb(238, 249, 249)',color:'#303030'}}>
                                <h3>https://connector.com/marketplace-logos/shopify.png</h3>
                                <h5>5 sept, 2018</h5>
                            </div>
                        </div>
                    </div>
                </Card>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default ConnectedAccounts;