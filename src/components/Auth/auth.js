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

export class Auth extends Component {

    constructor() {
        super();
        this.removeLocalStorage();
    }

    removeLocalStorage() {
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('auth_token');
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
                    <Route path='/auth/resetpassword' component={ResetPassword}/>
                </Switch>
            </div>
        );
    }
}
