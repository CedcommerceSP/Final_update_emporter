import React, { Component } from 'react';

import { Page,
    DataTable } from '@shopify/polaris';

import { requests } from '../../../../services/request';
import { notify } from '../../../../services/notify';
import { Formbuilder } from '../../../../shared/formbuilder';

import { isUndefined } from 'util';

export class EditProduct extends Component {

    productsEndpoint = 'http://192.168.0.48:4500/forms';
    filters = {};

    constructor(props) {
        super();
        const params = props.match.params;
        if (!isUndefined(params.id)) {
            this.state = {
                form: [],
                productId: params.id
            };
            this.getProductForm();
        } else {
            props.history.push('/panel/products');
        }
    }

    getProductForm() {
        requests.getRequest(this.productsEndpoint, this.filters, true)
            .then(data => {
                const state = this.state;
                state['form'] = data;
                this.setState(state);
            });
    }

    render() {
        return (
            <Page
                primaryAction={{content: 'Back', onClick: () => {
                    this.redirect('/panel/products');
                }}}
                title="Edit Product">
                <div className="row p-5">
                    <div className="col-12 p-5">
                        <Formbuilder form={this.state.form} onSubmit={(data) => {
                            console.log(data);
                        }}></Formbuilder>
                    </div>
                </div>
            </Page>
        );
    }

    redirect(url) {
        this.props.history.push(url);
    }
}