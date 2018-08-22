import MessageShow from './message';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from '@shopify/polaris';
import React, {Component} from 'react';

class OthersRoutes extends Component {
    render() {
        return (
            <AppProvider>
                <Switch>
                    <Route path="/show/message" component={MessageShow} />
                </Switch>
            </AppProvider>
        );
    }
}

export default OthersRoutes;