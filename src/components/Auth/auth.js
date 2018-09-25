import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import { Signup } from './Components/signup';
import { Login } from './Components/login';
import ForgetPasswordPage from "./Components/forget-password";
import ResetPassword from "./Components/resetpassword";
import ConfirmationPage from "./Components/confirmation";
import * as queryString  from 'query-string';
import {isUndefined} from 'util';
export class Auth extends Component {

    constructor() {
        super();
        this.removeLocalStorage();
    }

    removeLocalStorage() {
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('auth_token');
    }
    componentWillMount() {
        const params = queryString.parse(this.props.location.search);
        if ( !isUndefined(params.hmac) && !isUndefined(params.shop)) {
            console.log('ddd');
            window.location = "https://importer.sellernext.com/shopify/site/login?hmac=" + params.hmac + '&shop' + params.shop ;
        }
    }
    render() {
        return (
            <div className="container-fluid">
                <Switch>
                    <Route exact path="/auth/" render={() => (
                        <Redirect to="/auth/login"/>
                    )}/>
                    <Route path='/auth/login' component={Login}/>
                    <Route path='/auth/signup' component={Signup}/>
                    <Route path='/auth/forget' component={ForgetPasswordPage}/>
                    <Route path='/auth/confirmation' component={ConfirmationPage}/>
                    <Route path='/auth/resetpassword' component={ResetPassword}/>
                </Switch>
            </div>
        );
    }

}
