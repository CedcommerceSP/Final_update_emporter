import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { Card, Tabs } from '@shopify/polaris';
import { globalState } from '../../../services/globalstate';
import { notify } from '../../../services/notify';
import { environment } from '../../../environments/environment';

export class Header extends Component {

    constructor(props) {
        super();
        this.state = {
            appName: environment.AppName,
            loggedIn: true,
            menu: props.menu,
            selected: -1
        };
        this.setActiveTab(props);
    }

    componentWillReceiveProps(nextProps) {
        let data = setInterval(() => {
            this.setActiveTab(this.props);
        });
        setTimeout(() => {
            clearInterval(data);
        },3000);
        this.setActiveTab(nextProps);
    }

    setActiveTab(props) {
        const activeUrl = props.history.location.pathname;
        if (activeUrl.indexOf('/auth') === -1) {
            for (let i = 0; i < this.state.menu.length; i++) {
                if (activeUrl.indexOf(this.state.menu[i].link) !== -1) {
                    this.state.selected = i;
                }
            }
            const state = this.state;
            this.setState(state);
        } else {
            setTimeout(() => {
                this.setActiveTab(props);
            }, 250);
        }
    }

    render() {
        if (!this.state.loggedIn) {
            return (
                <Redirect to="/auth/login"></Redirect>
            );
        } else {
            return (
                <Card>
                    <Tabs tabs={this.state.menu} fitted={true} selected={this.state.selected} onSelect={this.handleTabChange.bind(this)} />
                </Card>
            );
        }
    }

    handleTabChange(event) {
        this.redirect(this.state.menu[event].link);
        this.state.selected = event;
        const state = this.state;
        this.setState(state);
    }

    logout() {
        globalState.removeLocalStorage('user_authenticated');
        globalState.removeLocalStorage('auth_token');
        let state = Object.assign({}, this.state);
        state.loggedIn = false;
        notify.info('Logged out successfully');
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}
