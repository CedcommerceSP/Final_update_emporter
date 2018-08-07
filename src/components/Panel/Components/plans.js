import React, { Component } from 'react';

import { Page,
    Card,
    Select,
    Button,
    Label,
    Modal } from '@shopify/polaris';

export class Plans extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Plans'}]}
                title="Plans">

            </Page>
        );
    }
}