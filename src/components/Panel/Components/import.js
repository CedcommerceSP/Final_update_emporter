import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { Page,
    Card,
    Select,
    Button,
    Label,
    Modal,
    Banner } from '@shopify/polaris';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown,
    faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';

import { notify } from '../../../services/notify';
import { requests } from '../../../services/request';

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
            importServicesList: [],
            importerShopLists: [],
            uploadServicesList: [],
            uploaderShopLists: [],
            showImportProducts: false,
            showUploadProducts: false,
            importProductsDetails: {
                source: '',
                shop: '',
                shop_id: ''
            },
            uploadProductDetails: {
                source: '',
                source_shop: '',
                source_shop_id: '',
                target: '',
                target_shop: '',
                target_shop_id: '',
                selected_profile: '',
                profile_type: ''
            }
        };
        this.getAllImporterServices();
        this.getAllUploaderServices();
    }

    getAllImporterServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'importer' })
            .then(data => {
               if (data.success === true) {
                   this.state.importServicesList = [];
                   for (let i = 0; i < Object.keys(data.data).length; i++) {
                       let key = Object.keys(data.data)[i];
                       if (!data.data[key].usable) {
                           this.state.importServicesList.push({
                               label: data.data[key].title,
                               value: data.data[key].marketplace,
                               shops: data.data[key].shops
                           });
                       }
                   }
                   this.updateState();
               } else {
                   notify.error('You have no available services');
               }
            });
    }

    getAllUploaderServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'uploader' })
            .then(data => {
               if (data.success === true) {
                   this.state.uploadServicesList = [];
                   for (let i = 0; i < Object.keys(data.data).length; i++) {
                       let key = Object.keys(data.data)[i];
                       if (!data.data[key].usable) {
                           this.state.uploadServicesList.push({
                               label: data.data[key].title,
                               value: data.data[key].marketplace,
                               shops: data.data[key].shops
                           });
                       }
                   }
                   this.updateState();
               } else {
                   notify.error('You have no available services');
               }
            });
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
                                    options={this.state.importServicesList}
                                    onChange={this.handleImportChange.bind(this, 'source')}
                                    value={this.state.importProductsDetails.source}
                                />
                            </div>
                            <div className="col-12 pt-1 pb-1">
                                {
                                    this.state.importProductsDetails.source !== '' &&
                                    this.state.importerShopLists.length > 1 &&
                                    <Select
                                        label="Shop"
                                        placeholder="Source Shop"
                                        options={this.state.importerShopLists}
                                        onChange={this.handleImportChange.bind(this, 'shop')}
                                        value={this.state.importProductsDetails.shop}
                                    />
                                }
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
        if (key === 'source') {
            this.state.importerShopLists = [];
            this.state.importProductsDetails.shop = '';
            this.state.importProductsDetails.shop_id = '';
            for (let i = 0; i < this.state.importServicesList.length; i++) {
                if (this.state.importServicesList[i].value === value) {
                    for (let j = 0; j < this.state.importServicesList[i].shops.length; j++) {
                        this.state.importerShopLists.push({
                            label: this.state.importServicesList[i].shops[j].shop_url,
                            value: this.state.importServicesList[i].shops[j].shop_url,
                            shop_id: this.state.importServicesList[i].shops[j].id
                        });
                    }
                    break;
                }
            }
            if (this.state.importerShopLists.length > 0) {
                this.state.importProductsDetails.shop = this.state.importerShopLists[0].value;
                this.state.importProductsDetails.shop_id = this.state.importerShopLists[0].shop_id;
            }
        } else if (key === 'shop') {
            for (let i = 0; i < this.state.importerShopLists.length; i++) {
                if (this.state.importerShopLists[i].value === value) {
                    this.state.importProductsDetails.shop_id = this.state.importerShopLists[i].shop_id;
                    break;
                }
            }
        }
        this.updateState();
    }

    importProducts() {
        requests.getRequest('connector/product/import',
            {
                marketplace: this.state.importProductsDetails.source,
                shop: this.state.importProductsDetails.shop,
                shop_id: this.state.importProductsDetails.shop_id
            })
            .then(data => {
                this.state.showImportProducts = false;
                this.updateState();
                if (data.success === true) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
            });
    }

    capitalizeWord(string) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
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
                                placeholder="Product Source"
                                options={this.state.importServicesList}
                                onChange={this.handleUploadChange.bind(this, 'source')}
                                value={this.state.uploadProductDetails.source}
                            />
                        </div>
                        {
                            this.state.uploadProductDetails.source !== '' &&
                            this.state.importerShopLists.length > 1 &&
                            <Select
                                label={this.capitalizeWord(this.state.uploadProductDetails.source) + " Shop"}
                                placeholder="Source Shop"
                                options={this.state.importerShopLists}
                                onChange={this.handleImportChange.bind(this, 'shop')}
                                value={this.state.uploadProductDetails.source_shop}
                            />
                        }
                        <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                            <Select
                                label="Upload Products To"
                                placeholder="Target"
                                options={this.state.uploadServicesList}
                                onChange={this.handleUploadChange.bind(this, 'target')}
                                value={this.state.uploadProductDetails.target}
                            />
                        </div>
                        {
                            this.state.uploadProductDetails.target !== '' &&
                            this.state.uploaderShopLists.length > 1 &&
                            <Select
                                label={this.capitalizeWord(this.state.uploadProductDetails.target) + " Shop"}
                                placeholder="Target Shop"
                                options={this.state.uploaderShopLists}
                                onChange={this.handleImportChange.bind(this, 'target_shop')}
                                value={this.state.uploadProductDetails.target_shop}
                            />
                        }
                        <div className="col-12 pt-1 pb-1">
                            <Banner status="info">
                                <Label>You can upload products from the source to target either through our default profile or you can create an <NavLink to="/panel/profiling/create">custom profile</NavLink> for products upload. To know more about profiling and default profile visit our <NavLink to="/panel/faq">FAQ</NavLink> section.</Label>
                            </Banner>
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
                                        label="Select Custom Profile"
                                        options={this.profilesList}
                                        placeholder="Custom Profile"
                                        onChange={this.handleProfileSelect.bind(this)}
                                        value={this.state.uploadProductDetails.selected_profile}
                                    />
                                }
                                {
                                    this.profilesList.length === 0 &&
                                        <div className="text-center">
                                            <Banner status="warning">
                                                <Label>No profiles for {this.capitalizeWord(this.state.uploadProductDetails.source)} and {this.capitalizeWord(this.state.uploadProductDetails.target)} integration</Label>
                                            </Banner>
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
                    if (this.state.uploadProductDetails.source === '' ||
                        this.state.uploadProductDetails.target === '') {
                        notify.info('Please choose product import source and product upload target first');
                    } else {
                        this.getMatchingProfiles();
                        this.state.uploadProductDetails.profile_type = 'custom';
                        this.state.uploadProductDetails[key] = '';
                    }
                } else {
                    this.state.uploadProductDetails.profile_type = '';
                    this.state.uploadProductDetails[key] = value;
                }
                break;
            case 'source':
                this.state.importerShopLists = [];
                this.state.uploadProductDetails.source = value;
                this.state.uploadProductDetails.profile_type = '';
                this.state.uploadProductDetails.selected_profile = '';
                this.state.uploadProductDetails.source_shop = '';
                this.state.uploadProductDetails.source_shop_id = '';
                for (let i = 0; i < this.state.importServicesList.length; i++) {
                    if (this.state.importServicesList[i].value === value) {
                        for (let j = 0; j < this.state.importServicesList[i].shops.length; j++) {
                            this.state.importerShopLists.push({
                                label: this.state.importServicesList[i].shops[j].shop_url,
                                value: this.state.importServicesList[i].shops[j].shop_url,
                                shop_id: this.state.importServicesList[i].shops[j].id
                            });
                        }
                        break;
                    }
                }
                if (this.state.importerShopLists.length > 0) {
                    this.state.uploadProductDetails.source_shop = this.state.importerShopLists[0].value;
                    this.state.uploadProductDetails.source_shop_id = this.state.importerShopLists[0].shop_id;
                }
                break;
            case 'target':
                this.state.uploaderShopLists = [];
                this.state.uploadProductDetails.target = value;
                this.state.uploadProductDetails.profile_type = '';
                this.state.uploadProductDetails.selected_profile = '';
                this.state.uploadProductDetails.target_shop = '';
                this.state.uploadProductDetails.target_shop_id = '';
                for (let i = 0; i < this.state.uploadServicesList.length; i++) {
                    if (this.state.uploadServicesList[i].value === value) {
                        for (let j = 0; j < this.state.uploadServicesList[i].shops.length; j++) {
                            this.state.uploaderShopLists.push({
                                label: this.state.uploadServicesList[i].shops[j].shop_url,
                                value: this.state.uploadServicesList[i].shops[j].shop_url,
                                shop_id: this.state.uploadServicesList[i].shops[j].id
                            });
                        }
                        break;
                    }
                }
                if (this.state.uploaderShopLists.length > 0) {
                    this.state.uploadProductDetails.target_shop = this.state.uploaderShopLists[0].value;
                    this.state.uploadProductDetails.target_shop_id = this.state.uploaderShopLists[0].shop_id;
                }
                break;
            case 'source_shop':
                this.state.uploadProductDetails.profile_type = '';
                this.state.uploadProductDetails.selected_profile = '';
                for (let i = 0; i < this.state.importerShopLists.length; i++) {
                    if (this.state.importerShopLists[i].value === value) {
                        this.state.uploadProductDetails.source_shop_id = this.state.importerShopLists[i].shop_id;
                        break;
                    }
                }
                break;
            case 'target_shop':
                this.state.uploadProductDetails.profile_type = '';
                this.state.uploadProductDetails.selected_profile = '';
                for (let i = 0; i < this.state.uploaderShopLists.length; i++) {
                    if (this.state.uploaderShopLists[i].value === value) {
                        this.state.uploadProductDetails.target_shop_id = this.state.uploaderShopLists[i].shop_id;
                        break;
                    }
                }
                break;
        }
        this.updateState();
    }

    getMatchingProfiles() {
        this.profilesList = [];
        const data = {
            source: this.state.uploadProductDetails.source,
            target: this.state.uploadProductDetails.target
        };
        if (this.state.uploadProductDetails.source_shop !== '' &&
            this.state.uploadProductDetails.source_shop !== null) {
            data['source_shop'] = this.state.uploadProductDetails.source_shop;
        }
        if (this.state.uploadProductDetails.target_shop !== '' &&
            this.state.uploadProductDetails.target_shop !== null) {
            data['target_shop'] = this.state.uploadProductDetails.target_shop;
        }
        requests.getRequest('connector/profile/getMatchingProfiles', data)
            .then(data => {
                if (data.success) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.profilesList.push({
                            label: data.data[i].name,
                            value: data.data[i].id
                        });
                    }
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    uploadProducts() {
        const data = Object.assign({}, this.state.uploadProductDetails);
        data['marketplace'] = data['target'];
        requests.postRequest('connector/product/upload', data)
            .then(data => {
                this.state.showUploadProducts = false;
               if (data.success) {
                   notify.success(data.message);
               } else {
                   notify.error(data.message);
                   if (data.code === 'link_your_account') {
                       setTimeout(() => {
                           this.redirect('/panel/accounts');
                       }, 1200);
                   }
               }
               this.updateState();
            });
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Upload Products'}]}
                title="Upload Products">
                <div className="row">
                    <div className="col-12 p-3">
                        <Banner title="Please Read" status="info">
                            <Label>In order to upload your products from source marketplace to the marketplace on which you want to upload, kindly import your products from the source by clicking on 'Import Products', and then upload your products by clicking on 'Upload Products'.</Label>
                        </Banner>
                    </div>
                    <div className="col-12 p-3">
                        <Banner status="warning">
                            <Label>Please make sure that you have bought the desired plan before uploading your products to the marketplace you want. You can check your active integrations <NavLink to="/panel/integration">here</NavLink>. You can choose a plan for your requirement from <NavLink to="/panel/plans">here</NavLink>.</Label>
                        </Banner>
                    </div>
                    <div className="col-md-6 col-sm-6 col-12 p-3">
                        <Card>
                            <div style={{cursor: 'pointer'}}>
                                <div className="text-center pt-5 pb-5">
                                    <FontAwesomeIcon onClick={() => {
                                        this.state.importProductsDetails.source = '';
                                        this.state.importProductsDetails.shop = '';
                                        this.state.importProductsDetails.shop_id = '';
                                        this.state.showImportProducts = true;
                                        this.updateState();
                                    }} icon={faArrowAltCircleDown} color="#3f4eae" size="10x" />
                                </div>
                                <div className="text-center pt-2 pb-4">
                                    <span className="h2" style={{color: '#3f4eae'}}>Import Products</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-6 col-sm-6 col-12 p-3">
                        <Card>
                            <div style={{cursor: 'pointer'}}>
                                <div className="text-center pt-5 pb-5">
                                    <FontAwesomeIcon onClick={() => {
                                        this.state.uploadProductDetails.source = '';
                                        this.state.uploadProductDetails.target = '';
                                        this.state.uploadProductDetails.selected_profile = '';
                                        this.state.uploadProductDetails.profile_type = '';
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