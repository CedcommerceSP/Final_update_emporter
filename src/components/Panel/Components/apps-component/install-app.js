import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { Banner,
         TextField,
         Button,
         Page } from '@shopify/polaris';

import * as queryString  from 'query-string';
import { isUndefined } from 'util';

import { requests } from '../../../../services/request';
import { notify } from '../../../../services/notify';

export class InstallApp extends Component {
    queryParams;
    constructor(props) {
        super();
        this.queryParams = queryString.parse(props.location.search);
        this.getInstallationForm();
    }

    getInstallationForm() {
        if (!isUndefined(this.queryParams.code)) {
            this.state = {
                code: this.queryParams.code
            };
            this.getAppInstallationForm();
        } else {
            this.state = {
                code: false
            };
        }
    }

    render() {
        if (this.state.code) {
            return (
                <Page
                    breadcrumbs={[{content: 'Install App'}]}
                    title="Install App">
                    <div className="row">
                        <div className="col-12 mt-4 mb-4">
                            <Banner title={this.state.code.toUpperCase() + ' INSTALLATION'}>
                            </Banner>
                        </div>
                        <div className="col-12 mt-1">
                            <div className="row">
                                {   !isUndefined(this.state.schema) &&
                                this.state.schema.map((field) => {
                                    return (
                                        <div className="col-12" key={this.state.schema.indexOf(field)}>
                                            <TextField
                                                label={field.title}
                                                type={field.type}
                                                value={field.value}
                                                onChange={this.handleChange.bind(this, field.key)}
                                            />
                                        </div>
                                    );
                                })
                                }
                                <div className="col-12 text-center mt-3">
                                    <Button onClick={() => {
                                        this.onSubmit();
                                    }}>Submit</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Page>
            );
        } else {
            return (
                <Redirect to="/panel"></Redirect>
            );
        }
    }

    handleChange(key, event) {
        for (let i = 0; i < this.state.schema.length; i++) {
            if (this.state.schema[i].key === key) {
                const state = this.state;
                state.schema[i].value = event;
                this.setState(state);
                break;
            }
        }
    }

    onSubmit() {
        console.log(this.state);
    }

    getAppInstallationForm() {
        let win = window.open('', '_blank', 'location=yes,height=600,width=550,scrollbars=yes,status=yes');
        requests.getRequest('connector/get/installationForm', {code: this.state.code })
            .then(data => {
                if (data.success === true) {
                    if (data.data.post_type === 'redirect') {
                        win.location = data.data.action;
                        this.redirect();
                    } else {
                        if (win !== null) {
                            win.close();
                        }
                        let schema = [
                            {
                                key: 'consumer_id',
                                title: 'Consumer ID',
                                type: 'text',
                                value: ''
                            },
                            {
                                key: 'secret_key',
                                title: 'Consumer Secret Key',
                                type: 'text',
                                value: ''
                            }
                        ];
                        this.setInstallationForm(schema);
                    }
                } else {
                    notify.error(data.message);
                    this.redirect();
                }
            });
    }

    setInstallationForm(formSchema) {
        const state = this.state;
        state['schema'] = formSchema;
        this.setState(state);
    }

    redirect() {
        this.setState({
            code: false
        });
    }

}