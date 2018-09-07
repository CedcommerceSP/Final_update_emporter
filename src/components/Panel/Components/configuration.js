import React, { Component } from 'react';

import { Page,
        Heading,
        Card,
        Select,
        Label,
        Button,
        TextField,
        Checkbox,
        Layout } from '@shopify/polaris';

import { notify } from '../../../services/notify';
import { requests } from '../../../services/request';
import { modifyOptionsData } from './static-functions';

import { isUndefined } from 'util';

export class Configuration extends Component {

    googleConfigurationData = [];

    constructor() {
        super();
        this.state = {
          account_information: {
              username: '',
              email: ''
          },
          google_configuration: {},
          google_configuration_updated: false,
          account_information_updated: false
        };
        this.getUserDetails();
        this.getGoogleConfigurations();
        this.getShopifyConfigurations();
    }

    getUserDetails() {
        requests.getRequest('user/getDetails')
            .then(data => {
                if (data.success) {
                    this.state.account_information = {
                        username: data.data.username,
                        email: data.data.email
                    };
                    if (!isUndefined(data.data.phone)) {
                        this.state.account_information['phone'] = data.data.phone;
                    }
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getGoogleConfigurations() {
        requests.getRequest('connector/get/config', { marketplace: 'google' })
            .then(data => {
                if (data.success) {
                    console.log(data);
                    this.googleConfigurationData = this.modifyGoogleConfigData(data.data);
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getShopifyConfigurations() {
        requests.getRequest('connector/get/config', { marketplace: 'shopify' })
            .then(data => {
                console.log(data);
                if (data.success) {
                    console.log(data);
                    /*this.googleConfigurationData = this.modifyGoogleConfigData(data.data);
                    this.updateState();*/
                } else {
                    notify.error(data.message);
                }
            });
    }

    modifyGoogleConfigData(data) {
        for (let i = 0; i < data.length; i++) {
            this.state.google_configuration[data[i].code] = data[i].value;
            data[i].options = modifyOptionsData(data[i].options);
        }
        return data;
    }

    render() {
        return (
            <Page
                title="Configuration">
                <Layout>
                    <Layout.Section>
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                                <Heading>Account Information</Heading>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12">
                                <Card>
                                    <div className="row p-5">
                                        <div className="col-12 pt-2 pb-2">
                                            <Label>Username</Label>
                                            <Label>{this.state.account_information.username}</Label>
                                        </div>
                                        <div className="col-12 pt-2 pb-2">
                                            <TextField
                                                label="Email"
                                                onChange={this.accountInfoChange.bind(this, 'email')}
                                                value={this.state.account_information.email}
                                            />
                                        </div>
                                        {
                                            !isUndefined(this.state.account_information.phone) &&
                                            <div className="col-12 pt-2 pb-2">
                                                <TextField
                                                    label="Phone no."
                                                    onChange={this.accountInfoChange.bind(this, 'phone')}
                                                    value={this.state.account_information.phone}
                                                />
                                            </div>
                                        }
                                        <div className="col-12 text-right pt-2 pb-2">
                                            <Button
                                                disabled={!this.state.account_information_updated}
                                                onClick={() => {
                                                    this.saveProfileData();
                                                }}
                                                primary>Save</Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Layout.Section>
                    <Layout.Section>
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                                <Heading>Google Configuration</Heading>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12">
                                <Card>
                                    <div className="row p-5">
                                        {
                                            this.googleConfigurationData.map(config => {
                                                switch(config.type) {
                                                    case 'select':
                                                        return (
                                                            <div className="col-12 pt-2 pb-2" key={this.googleConfigurationData.indexOf(config)}>
                                                                <Select
                                                                    options={config.options}
                                                                    label={config.title}
                                                                    placeholder={config.title}
                                                                    value={this.state.google_configuration[config.code]}
                                                                    onChange={this.googleConfigurationChange.bind(this, this.googleConfigurationData.indexOf(config))}>
                                                                </Select>
                                                            </div>
                                                        );
                                                        break;
                                                    case 'checkbox':
                                                        return (
                                                            <div className="col-12 pt-2 pb-2" key={this.googleConfigurationData.indexOf(config)}>
                                                                <Label>{config.title}</Label>
                                                                <div className="row">
                                                                    {
                                                                        config.options.map(option => {
                                                                            return (
                                                                                <div className="col-md-6 col-sm-6 col-12 p-1" key={config.options.indexOf(option)}>
                                                                                    <Checkbox
                                                                                        checked={this.state.google_configuration[config.code].indexOf(option.value) !== -1}
                                                                                        label={option.value}
                                                                                        onChange={this.googleConfigurationCheckboxChange.bind(this, this.googleConfigurationData.indexOf(config), config.options.indexOf(option))}
                                                                                    />
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        );
                                                        break;
                                                    default:
                                                        return (
                                                            <div className="col-12 pt-2 pb-2" key={this.googleConfigurationData.indexOf(config)}>
                                                                <TextField
                                                                    label={config.title}
                                                                    placeholder={config.title}
                                                                    value={this.state.google_configuration[config.code]}
                                                                    onChange={this.googleConfigurationChange.bind(this, this.googleConfigurationData.indexOf(config))}>
                                                                </TextField>
                                                            </div>
                                                        );
                                                        break;
                                                }

                                            })
                                        }
                                        <div className="col-12 text-right pt-2 pb-1">
                                            <Button
                                                disabled={!this.state.google_configuration_updated}
                                                onClick={() => {
                                                    this.saveGoogleConfigData();
                                                }}
                                                primary>Save</Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    googleConfigurationChange(index, value) {
        this.state.google_configuration_updated = true;
        this.state.google_configuration[this.googleConfigurationData[index].code] = value;
        this.updateState();
    }

    googleConfigurationCheckboxChange(index, optionIndex, value) {
        this.state.google_configuration_updated = true;
        const option = this.googleConfigurationData[index].options[optionIndex].value;
        const valueIndex = this.state.google_configuration[this.googleConfigurationData[index].code].indexOf(option);
        if (value) {
            if (valueIndex === -1) {
                this.state.google_configuration[this.googleConfigurationData[index].code].push(option);
            }
        } else {
            if (valueIndex !== -1) {
                this.state.google_configuration[this.googleConfigurationData[index].code].splice(valueIndex, 1);
            }
        }
        this.updateState();
    }

    saveGoogleConfigData() {
        requests.postRequest('connector/get/saveConfig', { marketplace: 'google', data: this.state.google_configuration })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getGoogleConfigurations();
            });
    }

    saveProfileData() {
        requests.getRequest('core/user/updateuser', this.state.account_information)
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getUserDetails();
            });
    }

    importConfigurationChange(key, value) {
        this.state.importer_configuration_updated = true;
        this.state.importer_configuration[key] = value;
        this.updateState();
    }

    defaultProfileChange(value, event) {
        this.state.importer_configuration_updated = true;
        const itemIndex = this.state.importer_configuration.default_profile_settings.indexOf(value);
        if (event) {
            if (itemIndex === -1) {
                this.state.importer_configuration.default_profile_settings.push(value);
            }
        } else {
            if (itemIndex !== -1) {
                this.state.importer_configuration.default_profile_settings.splice(itemIndex, 1);
            }
        }
        this.updateState();
    }

    accountInfoChange(key, value) {
        this.state.account_information[key] = value;
        this.state.account_information_updated = true;
        this.updateState();
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }
}