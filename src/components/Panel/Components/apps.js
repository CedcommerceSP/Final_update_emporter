import React, { Component } from 'react';

import { Button,
         Page,
         Card ,
    AccountConnection,
    AppProvider} from '@shopify/polaris';
import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import AppsShared from "../../../shared/app/apps";
import history from '../../../shared/history';



export class Apps extends Component {

    render() {
        return (
            <Page
                title="Accounts"
            primaryAction={{content:'Connected Accounts', onClick:() => {
                   this.redirect('/panel/accounts/connect');
                }}}>
                <AppsShared history={history}/>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}
