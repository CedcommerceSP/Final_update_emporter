import React, { Component } from 'react';

import { Page,
    Card,
    Select,
    Button,
    TextStyle,
    ResourceList,
    Modal,
    TextContainer,
    FilterType } from '@shopify/polaris';

import { notify } from '../../../../services/notify';

export class CreateProfile extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Create Profile'}]}
                primaryAction={{content: 'Back', onClick: () => {
                    this.redirect('/panel/profiling');
                }}}
                title="Create Profile">
            </Page>
        );
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}