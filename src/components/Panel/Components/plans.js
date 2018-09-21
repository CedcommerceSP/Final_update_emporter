import React, { Component } from 'react';
import './plans-component/plan.css';
import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import { Page,  Button,} from '@shopify/polaris';
import PlanBody from "../../../shared/plans/plan-body";
import {globalState} from "../../../services/globalstate";
export class Plans extends Component {

    constructor(props) {
        super(props);
    }
    paymentStatus(event) {
        if ( event === 'Confirmation' ) {
            // this.setState({modalOpen: !this.state.modalOpen});
        } else if ( event === 'trial') {
            requests.getRequest('amazonimporter/config/activateTrial').then(data => {
                if(data.success) {
                    if (data.code === 'UNDER_TRIAL') {
                        notify.success(data.message);
                    } else {
                        notify.info(data.message);
                    }
                } else {
                    notify.error(data.message);
                }
            });
        } else {
            notify.info(event);
        }
    }
    componentWillUnmount() {
        if ( globalState.getLocalStorage('trial') ) {
            requests.getRequest('plan/plan/getActive').then(status => {
                if ( status.success ) {
                    globalState.removeLocalStorage('trial');
                }
            });
        }
    }
    render() {
        return (
            <Page
                title="Plans"
                primaryAction={{content: 'Billing History', onClick: () => {
                        this.redirect('/panel/plans/history');
                    }}}>
                    <div className="row">
                        <div className="col-12 text-center mb-5"> {/*tittle*/}
                            <span style={{'fontSize':'40px'}}><b>Choose the best offer</b></span>
                            <h3>If you already have an existing plan you can upgrade or downgrade your plan</h3>
                        </div>
                        <div className="col-12 mb-4">
                            <div className="d-flex justify-content-center">
                                <Button primary={true} onClick={() => this.redirect('/panel/plans/current')}>Show Active Plan</Button>
                            </div>
                        </div>
                    </div>
                    <PlanBody paymentStatus={this.paymentStatus} />
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
    updateState() {
        const state = this.state;
        this.setState(state);
    }
}