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
import AmazonInstallationForm from "../../../shared/app/amazon-form";

export class Configuration extends Component {

    shopifyConfigurationData = [];
    amazonImporterConfigurationData = [];
    amazonCredentialsData = [];
    ebayConfigurationData = [];
    etsyConfigurationData = [];

    constructor(props) {
        super(props);
        this.state = {
            account_information: {
              username: '',
              email: '',
              skype_id: '',
              full_name: '',
              mobile: ''
            },
            google_configuration: {},
            amazon_credentials:{},
            amazon_credentials_error:{},
            amazon_plan_buy: false,
            ebay_plan_buy: false,
            shopify_configuration: {},
            show_shopify_child_component: {},
            amazon_importer_configuration: {},
            google_configuration_updated: false,
            shopify_configuration_updated: false,
            amazon_importer_configuration_updated: false,
            account_information_updated: false,
            amazon_credentials_updated: false,
            ebay_configuration:{},
            ebay_configuration_updated: false,
            etsy_configuration_updated: false,
            show_ebay_child_component: {},
        };
        this.getUserDetails();
        this.getShopifyConfigurations();
        this.getAmazonImporterConfigurations();
        // this.amazonCredentials();
        // this.getEbayConfig();
        // this.getEtsyConfig();
    }

    getUserDetails() {
        requests.getRequest('user/getDetails')
            .then(data => {
                if (data.success) {
                    this.state.account_information = {
                        username: data.data.username,
                        email: data.data.email,
                        skype_id: data.data.skype_id,
                        full_name: data.data.full_name,
                        mobile: data.data.mobile
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

    getAmazonImporterConfigurations() {
        requests.getRequest('connector/get/config', { marketplace: 'amazonimporter' })
            .then(data => {
                if (data.success) {
                    this.amazonImporterConfigurationData = this.modifyConfigData(data.data, 'amazon_importer_configuration');
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getEbayConfig() {
        requests.getRequest('connector/get/config', { marketplace: 'ebayimporter' }).then(data => {
            if (data.success) {
                this.ebayConfigurationData = this.modifyConfigData(data.data, 'ebay_configuration');
                this.updateState();
            } else {
                // notify.error(data.message);
            }
        })
    }

    getEtsyConfig() {
        requests.getRequest('connector/get/config', { marketplace: 'etsyimporter' }).then(data => {
            if (data.success) {
                this.etsyConfigurationData = this.modifyConfigData(data.data, 'etsy_configuration');
                this.updateState();
            } else {
                // notify.error(data.message);
            }
        })
    }

    getShopifyConfigurations() {
        requests.getRequest('connector/get/config', { marketplace: 'shopify' })
            .then(data => {
                if (data.success) {
                    this.shopifyConfigurationData = this.modifyConfigData(data.data, 'shopify_configuration');
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    amazonCredentials() {
        requests.getRequest('amazonimporter/config/getCredentials').then(data => {
            if ( data.success ) {
                // this.amazonCredentialsData = this.modifyAmazonCredentialData(data.data, 'amazon_credentials');
                this.amazonCredentialsData = data.data;
                this.setState({amazon_data: data.data});
                this.updateState();
            } else {
                notify.info('Amazon Account Not Connected!');
            }
        })
    }

    modifyConfigData(data, configKey) {
        for (let i = 0; i < data.length; i++) {
            if ( typeof this.state[configKey] !== 'object')
                this.state[configKey] = {};
            this.state[configKey][data[i].code] = data[i].value;
            if (!isUndefined(data[i].options)) {
                data[i].options = modifyOptionsData(data[i].options);
            }
            if ( !isUndefined(data[i]['is_parent']) ) {
                this.state.show_shopify_child_component[data[i]['is_parent']] = data[i].value !== 'enable';
            }
        }
        return data;
    }

    modifyAmazonCredentialData(data, configKey) {
        for (let i = 0; i < data.length; i++) {
            this.state[configKey][data[i].key] = data[i].value === null? '' :data[i].value ;
            this.state[configKey + '_error'][data[i].key] = false ;
            if (!isUndefined(data[i].options)) {
                data[i].options = modifyOptionsData(data[i].options);
            }
        }
        return data;
    }

    renderUserConfigurationSection() {
        return (
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
                                !isUndefined(this.state.account_information.full_name) &&
                                <div className="col-12 pt-2 pb-2">
                                    <TextField
                                        label="Full name"
                                        onChange={this.accountInfoChange.bind(this, 'full_name')}
                                        value={this.state.account_information.full_name}
                                    />
                                </div>
                            }
                            {
                                !isUndefined(this.state.account_information.mobile) &&
                                <div className="col-12 pt-2 pb-2">
                                    <TextField
                                        label="Phone no."
                                        onChange={this.accountInfoChange.bind(this, 'mobile')}
                                        value={this.state.account_information.mobile}
                                    />
                                </div>
                            }
                            {
                                !isUndefined(this.state.account_information.skype_id) &&
                                <div className="col-12 pt-2 pb-2">
                                    <TextField
                                        label="Skype ID"
                                        onChange={this.accountInfoChange.bind(this, 'skype_id')}
                                        value={this.state.account_information.skype_id}
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
        )
    }

    renderAmazonCredentials() {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                    <Heading>Amazon Credentials</Heading>
                </div>
                <div className="col-md-6 col-sm-6 col-12">
                    <Card>
                        <div className="p-4">
                            {isUndefined(this.state.amazon_data) ? <Button primary fullWidth onClick={this.redirect.bind(this, '/panel/accounts')}>Connect Now</Button>:
                            <AmazonInstallationForm page={'config'} amazon_data={this.state.amazon_data}/>}
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    renderShopifyConfigurationSection() {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                    <Heading>Shopify Configuration</Heading>
                </div>
                <div className="col-md-6 col-sm-6 col-12">
                    <Card>
                        <div className="row p-5">
                            {
                                this.shopifyConfigurationData.map(config => {
                                    if (!this.state.show_shopify_child_component[config['is_child']])
                                    switch(config.type) {
                                        case 'select':
                                            return (
                                                <div className="col-12 pt-2 pb-2" key={this.shopifyConfigurationData.indexOf(config)}>
                                                    <Select
                                                        options={config.options}
                                                        label={config.title}
                                                        placeholder={config.title}
                                                        value={this.state.shopify_configuration[config.code]}
                                                        onChange={this.shopifyConfigurationChange.bind(this, this.shopifyConfigurationData.indexOf(config))}>
                                                    </Select>
                                                </div>
                                            );
                                            break;
                                        case 'checkbox':
                                            return (
                                                <div className="col-12 pt-2 pb-2" key={this.shopifyConfigurationData.indexOf(config)}>
                                                    <Label>{config.title}</Label>
                                                    <div className="row">
                                                        {
                                                            config.options.map(option => {
                                                                return (
                                                                    <div className="col-md-6 col-sm-6 col-12 p-1" key={config.options.indexOf(option)}>
                                                                        <Checkbox
                                                                            checked={this.state.shopify_configuration[config.code].indexOf(option.value) !== -1}
                                                                            label={option.label}
                                                                            onChange={this.shopifyConfigurationCheckboxChange.bind(this, this.shopifyConfigurationData.indexOf(config), config.options.indexOf(option))}
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
                                                <div className="col-12 pt-2 pb-2" key={this.shopifyConfigurationData.indexOf(config)}>
                                                    <TextField
                                                        label={config.title}
                                                        placeholder={config.title}
                                                        value={this.state.shopify_configuration[config.code]}
                                                        onChange={this.shopifyConfigurationChange.bind(this, this.shopifyConfigurationData.indexOf(config))}>
                                                    </TextField>
                                                </div>
                                            );
                                            break;
                                    }
                                })
                            }
                            <div className="col-12 text-right pt-2 pb-1">
                                <Button
                                    disabled={!this.state.shopify_configuration_updated}
                                    onClick={() => {
                                        this.saveShopifyConfigData();
                                    }}
                                    primary>Save</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    renderAmazonImporterConfigurationSection() {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                    <Heading>Amazon Importer Sync Settings</Heading>
                </div>
                <div className="col-md-6 col-sm-6 col-12">
                    <Card>
                        <div className="row p-5">
                            {
                                this.amazonImporterConfigurationData.map(config => {
                                    switch(config.type) {
                                        case 'select':
                                            return (
                                                <div className="col-12 pt-2 pb-2" key={this.amazonImporterConfigurationData.indexOf(config)}>
                                                    <Select
                                                        options={config.options}
                                                        label={config.title}
                                                        placeholder={config.title}
                                                        value={this.state.amazon_importer_configuration[config.code]}
                                                        onChange={this.amazonImporterConfigurationChange.bind(this, this.amazonImporterConfigurationData.indexOf(config))}>
                                                    </Select>
                                                </div>
                                            );
                                            break;
                                        case 'checkbox':
                                            return (
                                                <div className="col-12 pt-2 pb-2" key={this.amazonImporterConfigurationData.indexOf(config)}>
                                                    <Label>{config.title}</Label>
                                                    <div className="row">
                                                        {
                                                            config.options.map(option => {
                                                                return (
                                                                    <div className="col-md-6 col-sm-6 col-12 p-1" key={config.options.indexOf(option)}>
                                                                        <Checkbox
                                                                            checked={this.state.amazon_importer_configuration[config.code].indexOf(option.value) !== -1}
                                                                            label={option.label}
                                                                            onChange={this.amazonImporterConfigurationCheckboxChange.bind(this, this.amazonImporterConfigurationData.indexOf(config), config.options.indexOf(option))}
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
                                                <div className="col-12 pt-2 pb-2" key={this.amazonImporterConfigurationData.indexOf(config)}>
                                                    <TextField
                                                        label={config.title}
                                                        placeholder={config.title}
                                                        value={this.state.amazon_importer_configuration[config.code]}
                                                        onChange={this.amazonImporterConfigurationChange.bind(this, this.amazonImporterConfigurationData.indexOf(config))}>
                                                    </TextField>
                                                </div>
                                            );
                                            break;
                                    }

                                })
                            }
                            <div className="col-12 text-right pt-2 pb-1">
                                <Button
                                    disabled={!this.state.amazon_importer_configuration_updated}
                                    onClick={() => {
                                        this.saveAmazonImporterConfigData();
                                    }}
                                    primary>Save</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    renderEbayConfig() {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                    <Heading>Ebay Configuration</Heading>
                </div>
                <div className="col-md-6 col-sm-6 col-12">
                    <Card>
                        <div className="row p-5">
                            {
                                this.ebayConfigurationData.map(config => {
                                    if (!this.state.show_ebay_child_component[config['is_child']])
                                        switch(config.type) {
                                            case 'select':
                                                return (
                                                    <div className="col-12 pt-2 pb-2" key={this.ebayConfigurationData.indexOf(config)}>
                                                        <Select
                                                            options={config.options}
                                                            label={config.title}
                                                            placeholder={config.title}
                                                            value={this.state.ebay_configuration[config.code]}
                                                            onChange={this.ebayConfigurationChange.bind(this, this.ebayConfigurationData.indexOf(config))}>
                                                        </Select>
                                                    </div>
                                                );
                                                break;
                                            case 'checkbox':
                                                return (
                                                    <div className="col-12 pt-2 pb-2" key={this.ebayConfigurationData.indexOf(config)}>
                                                        <Label>{config.title}</Label>
                                                        <div className="row">
                                                            {
                                                                config.options.map(option => {
                                                                    return (
                                                                        <div className="col-md-6 col-sm-6 col-12 p-1" key={config.options.indexOf(option)}>
                                                                            <Checkbox
                                                                                checked={this.state.ebay_configuration[config.code].indexOf(option.value) !== -1}
                                                                                label={option.label}
                                                                                onChange={this.ebayConfigurationCheckboxChange.bind(this, this.ebayConfigurationData.indexOf(config), config.options.indexOf(option))}
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
                                                    <div className="col-12 pt-2 pb-2" key={this.ebayConfigurationData.indexOf(config)}>
                                                        <TextField
                                                            label={config.title}
                                                            placeholder={config.title}
                                                            value={this.state.ebay_configuration[config.code]}
                                                            onChange={this.ebayConfigurationChange.bind(this, this.ebayConfigurationData.indexOf(config))}>
                                                        </TextField>
                                                    </div>
                                                );
                                                break;
                                        }

                                })
                            }
                            <div className="col-12 text-right pt-2 pb-1">
                                <Button
                                    disabled={!this.state.ebay_configuration_updated}
                                    onClick={() => {
                                        this.saveEbayConfigData();
                                    }}
                                    primary>Save</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    renderEtsyConfig() {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                    <Heading>Etsy Configuration</Heading>
                </div>
                <div className="col-md-6 col-sm-6 col-12">
                    <Card>
                        <div className="row p-5">
                            {
                                this.etsyConfigurationData.map(config => {
                                        switch(config.type) {
                                            case 'select':
                                                return (
                                                    <div className="col-12 pt-2 pb-2" key={this.etsyConfigurationData.indexOf(config)}>
                                                        <Select
                                                            options={config.options}
                                                            label={config.title}
                                                            placeholder={config.title}
                                                            value={this.state.etsy_configuration[config.code]}
                                                            onChange={this.etsyConfigurationChange.bind(this, this.etsyConfigurationData.indexOf(config))}>
                                                        </Select>
                                                    </div>
                                                );
                                                break;
                                            case 'checkbox':
                                                return (
                                                    <div className="col-12 pt-2 pb-2" key={this.etsyConfigurationData.indexOf(config)}>
                                                        <Label>{config.title}</Label>
                                                        <div className="row">
                                                            {
                                                                config.options.map(option => {
                                                                    return (
                                                                        <div className="col-md-6 col-sm-6 col-12 p-1" key={config.options.indexOf(option)}>
                                                                            <Checkbox
                                                                                checked={this.state.etsy_configuration[config.code].indexOf(option.value) !== -1}
                                                                                label={option.label}
                                                                                onChange={this.etsyConfigurationCheckboxChange.bind(this, this.etsyConfigurationData.indexOf(config), config.options.indexOf(option))}
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
                                                    <div className="col-12 pt-2 pb-2" key={this.etsyConfigurationData.indexOf(config)}>
                                                        <TextField
                                                            label={config.title}
                                                            placeholder={config.title}
                                                            value={this.state.etsy_configuration[config.code]}
                                                            onChange={this.etsyConfigurationChange.bind(this, this.etsyConfigurationData.indexOf(config))}>
                                                        </TextField>
                                                    </div>
                                                );
                                                break;
                                        }

                                })
                            }
                            <div className="col-12 text-right pt-2 pb-1">
                                <Button
                                    disabled={!this.state.etsy_configuration_updated}
                                    onClick={() => {
                                        this.saveEtsyConfigData();
                                    }}
                                    primary>Save</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Page
                title="Configuration">
                <Layout>
                    <Layout.Section>
                        {this.renderUserConfigurationSection()}
                    </Layout.Section>
                    <Layout.Section>
                        {this.renderShopifyConfigurationSection()}
                    </Layout.Section>
                    {/*<Layout.Section>*/}
                        {/*{this.renderEbayConfig()}*/}
                    {/*</Layout.Section>*/}
                    {/*<Layout.Section>*/}
                        {/*{this.renderEtsyConfig()}*/}
                    {/*</Layout.Section>*/}
                    {/*<Layout.Section>*/}
                        {/*{this.renderAmazonCredentials()}*/}
                    {/*</Layout.Section>*/}
                    <Layout.Section>
                        {this.renderAmazonImporterConfigurationSection()}
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    amazonImporterConfigurationChange(index, value) {
        this.state.amazon_importer_configuration_updated = true;
        this.state.amazon_importer_configuration[this.amazonImporterConfigurationData[index].code] = value;
        this.updateState();
    }

    amazonImporterConfigurationCheckboxChange(index, optionIndex, value) {
        this.state.amazon_importer_configuration_updated = true;
        const option = this.amazonImporterConfigurationData[index].options[optionIndex].value;
        const valueIndex = this.state.amazon_importer_configuration[this.amazonImporterConfigurationData[index].code].indexOf(option);
        if (value) {
            if (valueIndex === -1) {
                this.state.amazon_importer_configuration[this.amazonImporterConfigurationData[index].code].push(option);
            }
        } else {
            if (valueIndex !== -1) {
                this.state.amazon_importer_configuration[this.amazonImporterConfigurationData[index].code].splice(valueIndex, 1);
            }
        }
        this.updateState();
    }

    saveAmazonImporterConfigData() {
        requests.postRequest('connector/get/saveConfig', { marketplace: 'amazonimporter', data: this.state.amazon_importer_configuration })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getAmazonImporterConfigurations();
            });
    }

    shopifyConfigurationChange(index, value) {
        if ( value === 'disable' || value === 'enable' ) {
            this.state.show_shopify_child_component['sync_field'] = value !== 'enable';
        }
        this.state.shopify_configuration_updated = true;
        this.state.shopify_configuration[this.shopifyConfigurationData[index].code] = value;
        this.updateState();
    }

    shopifyConfigurationCheckboxChange(index, optionIndex, value) {
        console.log(index, optionIndex, value, this.state.shopify_configuration, this.shopifyConfigurationData[index].code);
        this.state.shopify_configuration_updated = true;
        const option = this.shopifyConfigurationData[index].options[optionIndex].value;
        const valueIndex = this.state.shopify_configuration[this.shopifyConfigurationData[index].code].indexOf(option);
        if (value) {
            if (valueIndex === -1) {
                this.state.shopify_configuration[this.shopifyConfigurationData[index].code].push(option);
            }
        } else {
            if (valueIndex !== -1) {
                this.state.shopify_configuration[this.shopifyConfigurationData[index].code].splice(valueIndex, 1);
            }
        }
        this.updateState();
    }

    saveShopifyConfigData() {
        requests.postRequest('connector/get/saveConfig', { marketplace: 'shopify', data: this.state.shopify_configuration })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getShopifyConfigurations();
            });
    }

    ebayConfigurationChange(index, value) {
        if ( value === 'disable' || value === 'enable' ) {
            this.state.show_ebay_child_component['sync_field'] = value !== 'enable';
        }
        this.state.ebay_configuration_updated = true;
        this.state.ebay_configuration[this.ebayConfigurationData[index].code] = value;
        this.updateState();
    }

    ebayConfigurationCheckboxChange(index, optionIndex, value) {
        console.log(index, optionIndex, value, this.state.ebay_configuration, this.ebayConfigurationData[index].code);
        this.state.ebay_configuration_updated = true;
        const option = this.ebayConfigurationData[index].options[optionIndex].value;
        const valueIndex = this.state.ebay_configuration[this.ebayConfigurationData[index].code].indexOf(option);
        if (value) {
            if (valueIndex === -1) {
                this.state.ebay_configuration[this.ebayConfigurationData[index].code].push(option);
            }
        } else {
            if (valueIndex !== -1) {
                this.state.ebay_configuration[this.ebayConfigurationData[index].code].splice(valueIndex, 1);
            }
        }
        this.updateState();
    }


    etsyConfigurationChange(index, value) {
        if ( value === 'disable' || value === 'enable' ) {
            this.state.show_etsy_child_component['sync_field'] = value !== 'enable';
        }
        this.state.etsy_configuration_updated = true;
        this.state.etsy_configuration[this.etsyConfigurationData[index].code] = value;
        this.updateState();
    }

    etsyConfigurationCheckboxChange(index, optionIndex, value) {
        console.log(index, optionIndex, value, this.state.etsy_configuration, this.etsyConfigurationData[index].code);
        this.state.etsy_configuration_updated = true;
        const option = this.etsyConfigurationData[index].options[optionIndex].value;
        const valueIndex = this.state.etsy_configuration[this.etsyConfigurationData[index].code].indexOf(option);
        if (value) {
            if (valueIndex === -1) {
                this.state.etsy_configuration[this.etsyConfigurationData[index].code].push(option);
            }
        } else {
            if (valueIndex !== -1) {
                this.state.etsy_configuration[this.etsyConfigurationData[index].code].splice(valueIndex, 1);
            }
        }
        this.updateState();
    }

    saveProfileData() {
        requests.getRequest('core/user/updateuser', this.state.account_information)
            .then(data => {
                if (data.success) {
                    this.state.account_information_updated = false;
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getUserDetails();
            });
    }

    accountInfoChange(key, value) {
        this.state.account_information[key] = value;
        this.state.account_information_updated = true;
        this.updateState();
    }

    saveEtsyConfigData() {
        requests.postRequest('connector/get/saveConfig', { marketplace: 'etsyimporter', data: this.state.etsy_configuration })
            .then(data => {
                if (data.success) {
                    this.setState({etsy_configuration_updated:false});
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getEtsyConfig();
            });
    }

    saveEbayConfigData() {
        requests.postRequest('connector/get/saveConfig', { marketplace: 'ebayimporter', data: this.state.ebay_configuration })
            .then(data => {
                if (data.success) {
                    this.setState({ebay_configuration_updated:false});
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getEbayConfig();
            });
    }

    redirect(url) {
        this.props.history.push(url);
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }
}