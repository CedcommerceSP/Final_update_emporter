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

import './create-profile.css';

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
                <div class="row bs-wizard" style="border-bottom:0;">

                    <div class="col-xs-3 bs-wizard-step complete">
                        <div class="text-center bs-wizard-stepnum">Step 1</div>
                        <div class="progress"><div class="progress-bar"></div></div>
                        <a href="#" class="bs-wizard-dot"></a>
                        <div class="bs-wizard-info text-center">Lorem ipsum dolor sit amet.</div>
                    </div>

                    <div class="col-xs-3 bs-wizard-step complete">
                        <div class="text-center bs-wizard-stepnum">Step 2</div>
                        <div class="progress"><div class="progress-bar"></div></div>
                        <a href="#" class="bs-wizard-dot"></a>
                        <div class="bs-wizard-info text-center">Nam mollis tristique erat vel tristique. Aliquam erat volutpat. Mauris et vestibulum nisi. Duis molestie nisl sed scelerisque vestibulum. Nam placerat tristique placerat</div>
                    </div>

                    <div class="col-xs-3 bs-wizard-step active">
                        <div class="text-center bs-wizard-stepnum">Step 3</div>
                        <div class="progress"><div class="progress-bar"></div></div>
                        <a href="#" class="bs-wizard-dot"></a>
                        <div class="bs-wizard-info text-center">Integer semper dolor ac auctor rutrum. Duis porta ipsum vitae mi bibendum bibendum</div>
                    </div>

                    <div class="col-xs-3 bs-wizard-step disabled">
                        <div class="text-center bs-wizard-stepnum">Step 4</div>
                        <div class="progress"><div class="progress-bar"></div></div>
                        <a href="#" class="bs-wizard-dot"></a>
                        <div class="bs-wizard-info text-center"> Curabitur mollis magna at blandit vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae</div>
                    </div>
                </div>
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