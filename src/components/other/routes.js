import MessageShow from './message';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from '@shopify/polaris';
import React, {Component} from 'react';
import PrivatePolicy from "./private_policy";

class OthersRoutes extends Component {
    render() {
        return (
            <Switch>
                <Route path="/show/message" component={MessageShow} />
                <Route exact path="/show/policy" component={PrivatePolicy} />
            </Switch>
        );
    }
}

export default OthersRoutes;