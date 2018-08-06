import React, { Component } from 'react';

import { Page,
    Card,
    Select,
    Button,
    Label,
    ResourceList,
    Modal,
    TextContainer,
    FilterType } from '@shopify/polaris';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle,
    faArrowAltCircleDown,
    faArrowAltCircleUp,
    faMapSigns,
    faSpinner,
    faCircleNotch} from '@fortawesome/free-solid-svg-icons';

import { notify } from '../../../services/notify';

export class Import extends Component {

    allProfiles = [
        {
            source: 'amazon',
            target: 'shopify',
            title: 'Profile 1',
            code: 'profile_1'
        },
        {
            source: 'ebay',
            target: 'shopify',
            title: 'Profile 2',
            code: 'profile_2'
        },
        {
            source: 'walmart',
            target: 'shopify',
            title: 'Profile 3',
            code: 'profile_3'
        }
    ];
    profilesList = [];
    constructor() {
        super();
        this.state = {
            showImportProducts: false,
            showUploadProducts: false,
            importProductsDetails: {
                source: ''
            },
            uploadProductDetails: {
                source: '',
                target: '',
                selected_profile: '',
                profile_type: ''
            }
        };
    }

    renderImportProductsModal() {
        return (
            <div>
                <Modal
                    open={this.state.showImportProducts}
                    onClose={() => {
                        this.state.showImportProducts = false;
                        this.updateState();
                    }}
                    title="Pull Products"
                >
                    <Modal.Section>
                        <div className="row">
                            <div className="col-12 pt-1 pb-1">
                                <Select
                                    label="Import From"
                                    placeholder="Source"
                                    options={[
                                        {label: 'Amazon', value: 'amazon'},
                                        {label: 'Ebay', value: 'ebay'},
                                        {label: 'Walmart', value: 'walmart'},
                                    ]}
                                    onChange={this.handleImportChange.bind(this, 'source')}
                                    value={this.state.importProductsDetails.source}
                                />
                            </div>
                            <div className="col-12 pt-1 pb-1 text-center">
                                <Button disabled={this.state.importProductsDetails.source === ''}
                                        onClick={() => {
                                            this.importProducts();
                                        }}
                                        primary>
                                    Import Products
                                </Button>
                            </div>
                        </div>
                    </Modal.Section>
                </Modal>
            </div>
        );
    }

    handleImportChange(key, value) {
        this.state.importProductsDetails[key] = value;
        this.updateState();
    }

    importProducts() {
        this.state.showImportProducts = false;
        this.updateState();
        notify.info('Products import process in progress');
    }

    renderUploadProductsModal() {
        return (
            <Modal
                open={this.state.showUploadProducts}
                onClose={() => {
                    this.state.showUploadProducts = false;
                    this.updateState();
                }}
                title="Upload Products"
            >
                <Modal.Section>
                    <div className="row">
                        <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                            <Select
                                label="Upload Products Of"
                                placeholder="Source"
                                options={[
                                    {label: 'Amazon', value: 'amazon'},
                                    {label: 'Ebay', value: 'ebay'},
                                    {label: 'Walmart', value: 'walmart'},
                                ]}
                                onChange={this.handleUploadChange.bind(this, 'source')}
                                value={this.state.uploadProductDetails.source}
                            />
                        </div>
                        <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                            <Select
                                label="Upload Products To"
                                placeholder="Target"
                                options={[
                                    {label: 'Shopify', value: 'shopify'},
                                    {label: 'Magento', value: 'magento'}
                                ]}
                                onChange={this.handleUploadChange.bind(this, 'target')}
                                value={this.state.uploadProductDetails.target}
                            />
                        </div>
                        <div className="col-12 pt-1 pb-1">
                            {
                                this.state.uploadProductDetails.profile_type !== 'custom' &&
                                <Select
                                    label="Upload Through"
                                    options={[
                                        { label: 'Default Profile(Upload products with default attribute mapping)', value: 'default_profile' },
                                        { label: 'Custom Profile(Upload products by providing attribute mapping details by yourself)', value: 'custom_profile' }
                                    ]}
                                    placeholder="Upload Products By"
                                    onChange={this.handleUploadChange.bind(this, 'selected_profile')}
                                    value={this.state.uploadProductDetails.selected_profile}
                                />
                            }
                        </div>
                        {
                            this.state.uploadProductDetails.profile_type === 'custom' &&
                            <div className="col-12 pt-1 pb-1">
                                {
                                    this.profilesList.length > 0 &&
                                    <Select
                                        label="Select Profile"
                                        options={this.profilesList}
                                        placeholder="Custom Profile"
                                        onChange={this.handleProfileSelect.bind(this)}
                                        value={this.state.uploadProductDetails.selected_profile}
                                    />
                                }
                                {
                                    this.profilesList.length === 0 &&
                                        <div className="text-center">
                                            <Label>No profiles for selected import source and upload target</Label>
                                            <div className="text-center mt-2 mb-2">
                                                <Button onClick={() => {
                                                    this.redirect('/panel/profiling/create');
                                                }} primary>
                                                    Create Profile
                                                </Button>
                                            </div>
                                            <div className="text-center mt-2 mb-2">
                                                <Button onClick={() => {
                                                    this.state.uploadProductDetails.profile_type = '';
                                                    this.state.uploadProductDetails.selected_profile = 'default_profile';
                                                    this.updateState();
                                                }} primary>
                                                    Select Default Profile
                                                </Button>
                                            </div>
                                        </div>
                                }
                            </div>

                        }
                        <div className="col-12 text-center pt-3 pb-3">
                            <Button onClick={() => {
                                this.uploadProducts();
                            }}
                                    disabled={!(this.state.uploadProductDetails.source !== '' &&
                                                this.state.uploadProductDetails.target !== '' &&
                                                this.state.uploadProductDetails.selected_profile !== '')}
                                    primary>
                                Upload Products
                            </Button>
                        </div>
                    </div>
                </Modal.Section>
            </Modal>
        );
    }

    handleProfileSelect(profile) {
        this.state.uploadProductDetails.selected_profile = profile;
        this.updateState();
    }

    handleUploadChange(key, value) {
        switch (key) {
            case 'selected_profile':
                if (value === 'custom_profile') {
                    this.getMatchingProfiles();
                    this.state.uploadProductDetails.profile_type = 'custom';
                    this.state.uploadProductDetails[key] = '';
                } else {
                    this.state.uploadProductDetails.profile_type = '';
                    this.state.uploadProductDetails[key] = value;
                }
                break;
            default:
                this.state.uploadProductDetails[key] = value;
                this.state.uploadProductDetails.profile_type = '';
                this.state.uploadProductDetails.selected_profile = '';
                break;
        }
        this.updateState();
    }

    getMatchingProfiles() {
        this.profilesList = [];
        for (let i = 0; i < this.allProfiles.length; i++) {
            if (this.state.uploadProductDetails.source === this.allProfiles[i].source &&
                this.state.uploadProductDetails.target === this.allProfiles[i].target) {
                this.profilesList.push({
                    label: this.allProfiles[i].title,
                    value: this.allProfiles[i].code
                });
            }
        }
    }

    uploadProducts() {
        this.state.showUploadProducts = false;
        this.updateState();
        notify.info('Product upload process in progress');
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Import Products'}]}
                title="Import Products">
                <div className="row">
                    <div className="col-md-6 col-sm-6 col-12">
                        <Card>
                            <div style={{cursor: 'pointer'}}>
                                <div className="text-center pt-5 pb-5">
                                    <FontAwesomeIcon onClick={() => {
                                        this.state.showImportProducts = true;
                                        this.updateState();
                                    }} icon={faArrowAltCircleDown} color="#3f4eae" size="10x" />
                                </div>
                                <div className="text-center pt-2 pb-4">
                                    <span className="h2" style={{color: '#3f4eae'}}>Pull Products</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-6 col-sm-6 col-12">
                        <Card>
                            <div style={{cursor: 'pointer'}}>
                                <div className="text-center pt-5 pb-5">
                                    <FontAwesomeIcon onClick={() => {
                                        this.state.showUploadProducts = true;
                                        this.updateState();
                                    }} icon={faArrowAltCircleUp} color="#3f4eae" size="10x" />
                                </div>
                                <div className="text-center pt-2 pb-4">
                                    <span className="h2" style={{color: '#3f4eae'}}>Upload Products</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                {this.renderImportProductsModal()}
                {this.renderUploadProductsModal()}
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