import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import { Signup } from './Components/signup';
import { Login } from './Components/login';

export class Auth extends Component {

    render() {
        return (
            <div className="container-fluid">
                <Switch>
                    <Route exact path="/auth/" render={() => (
                        <Redirect to="/auth/login"/>
                    )}/>
                    <Route path='/auth/login' component={Login}/>
                    <Route path='/auth/signup' component={Signup}/>
                </Switch>
            </div>
        );
    }
}
