import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { TextField, Button, Card } from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import { globalState } from '../../../services/globalstate';

export class Login extends Component {

    fieldErrors = {
        username: false,
        password: false
    };
    fieldValidations = {
        username: /^[A-Za-z0-9_-][A-Za-z0-9_-][A-Za-z0-9_-]+(?:[_-][A-Za-z0-9]+)*$/,
        password: /^.{4,}$/
    };
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        };
    }

    render() {
        return (
            <div className="row pt-5">
                <div className="offset-md-4 offset-sm-2 col-md-4 col-sm-8 col-12 mt-5">
                    <Card>
                        <div className="col-12 mt-5 text-center">
                            <h1 className="d-inline-block">Login</h1>
                        </div>
                        <div className="col-12 mt-1 mb-1">
                            <TextField
                                label="Username"
                                type="text"
                                error={this.fieldErrors.username ? 'Enter valid username' : ''}
                                value={this.state.username}
                                placeholder="Enter username"
                                focused="true"
                                onChange={this.handleChange.bind(this, 'username')}
                            />
                        </div>
                        <div className="col-12 mt-1 mb-1">
                            <TextField
                                label="Password"
                                type="password"
                                error={this.fieldErrors.password ? 'Enter valid password' : ''}
                                value={this.state.password}
                                placeholder="Enter password"
                                onChange={this.handleChange.bind(this, 'password')}
                            />
                        </div>
                        <div className="col-12 text-center mt-2 mb-4">
                            <Button onClick={() => {
                                this.submitLogin();
                            }}>Login</Button>
                            <Link className="float-right mt-3" to="/auth/signup">New User?</Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    handleChange(key, event) {
        const state = Object.assign({}, this.state);
        state[key] = event;
        this.validateForm(event, key);
        this.setState(state);
    }

    validateForm(data, key) {
        this.fieldErrors[key] = !this.fieldValidations[key].test(data);
    }

    isFormValid() {
        for (let i = 0; i < Object.keys(this.state).length; i++) {
            const key = Object.keys(this.state)[i];
            if (!this.fieldValidations[key].test(this.state[key])) {
                return false;
            }
        }
        return true;
    }

    submitLogin() {
        if (this.isFormValid()) {
            requests.getRequest('user/login', this.state)
                .then(data => {
                    if (data.success === true) {
                        notify.success(data.message);
                        globalState.setLocalStorage('user_authenticated', 'true');
                        globalState.setLocalStorage('auth_token', data.data.token);
                        this.redirect('/panel');
                    } else {
                        notify.error(data.message);
                    }
                });
        } else {
            notify.error('Please fill valid credentials');
        }
    }

    redirect(url) {
        this.props.history.push(url);
    }
}