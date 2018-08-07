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

export class Configuration extends Component {

    importFrequencyOptions = [
        { label: 'Onetime import', value: 'onetime_import' },
        { label: 'Auto sync products', value: 'auto_sync' }
    ];

    constructor() {
        super();
        this.state = {
          importer_configuration: {
              import_frequency: '',
              default_profile_settings: []
          },
          account_information: {
              shop_name: 'satyaprakashcedcoss.myshopify.com',
              username: 'importer-satya',
              phone: '9876543210'
          },
          importer_configuration_updated: false,
          account_information_updated: false
        };
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Configuration'}]}
                title="Configuration">
                <Layout>
                    <Layout.Section>
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center">
                                <Heading>Importer Configuration</Heading>
                                <p className="pt-3">
                                    Manage default settings for your imports and default profile
                                </p>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12">
                                <Card>
                                    <div className="row p-5">
                                        <div className="col-12 pt-2 pb-2">
                                            <Select
                                                options={this.importFrequencyOptions}
                                                label="Product Import Settings"
                                                placeholder="Import Frequency"
                                                value={this.state.importer_configuration.import_frequency}
                                                onChange={this.importConfigurationChange.bind(this, 'import_frequency')}>
                                            </Select>
                                        </div>
                                        <div className="col-12 pt-2 pb-2">
                                            <Label>
                                                Default Profile Settings
                                            </Label>
                                            <div className="row">
                                                <div className="col-6 pt-1 pb-1">
                                                    <Checkbox
                                                        label="Map shopify collection and product_type with source category"
                                                        checked={this.state.importer_configuration.default_profile_settings.indexOf('map_collection_with_category') !== -1}
                                                        id="map_collection_with_category"
                                                        name="map_collection_with_category"
                                                        onChange={this.defaultProfileChange.bind(this, 'map_collection_with_category')}></Checkbox>
                                                </div>
                                                <div className="col-6 pt-1 pb-1">
                                                    <Checkbox
                                                        label="Give inventory variation"
                                                        checked={this.state.importer_configuration.default_profile_settings.indexOf('give_inventory_variation') !== -1}
                                                        id="give_inventory_variation"
                                                        name="give_inventory_variation"
                                                        onChange={this.defaultProfileChange.bind(this, 'give_inventory_variation')}></Checkbox>
                                                </div>
                                                <div className="col-6 pt-1 pb-1">
                                                    <Checkbox
                                                        label="Give inventory variation"
                                                        checked={this.state.importer_configuration.default_profile_settings.indexOf('give_price_variation') !== -1}
                                                        id="give_price_variation"
                                                        name="give_price_variation"
                                                        onChange={this.defaultProfileChange.bind(this, 'give_price_variation')}></Checkbox>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 text-right pt-2 pb-1">
                                            <Button
                                                disabled={!this.state.importer_configuration_updated}
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
                                <Heading>Account Information</Heading>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12">
                                <Card>
                                    <div className="row p-5">
                                        <div className="col-12 pt-2 pb-2">
                                            <Label>Shop Name</Label>
                                            <Label>{this.state.account_information.shop_name}</Label>
                                        </div>
                                        <div className="col-12 pt-2 pb-2">
                                            <TextField
                                                label="Username"
                                                onChange={this.accountInfoChange.bind(this, 'username')}
                                                value={this.state.account_information.username}
                                            />
                                        </div>
                                        <div className="col-12 pt-2 pb-2">
                                            <TextField
                                                label="Phone no."
                                                onChange={this.accountInfoChange.bind(this, 'phone')}
                                                value={this.state.account_information.phone}
                                            />
                                        </div>
                                        <div className="col-12 text-right pt-2 pb-2">
                                            <Button
                                                disabled={!this.state.account_information_updated}
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