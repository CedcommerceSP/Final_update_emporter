import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './import-component/import.css';

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
import { environment } from '../../../environments/environment';
import { capitalizeWord } from './static-functions';

export class Import extends Component {

    profilesList = [];
    constructor() {
        super();
        this.state = {
            listing_type: 'all',
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
            },
            openModal: false,
        };
        this.getAllImporterServices();
        this.getAllUploaderServices();
        this.handleModalChange = this.handleModalChange.bind(this);
    }

    getAllImporterServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'importer' })
            .then(data => {
               if (data.success === true) {
                   this.state.importServicesList = [];
                   for (let i = 0; i < Object.keys(data.data).length; i++) {
                       let key = Object.keys(data.data)[i];
                       if (!data.data[key].usable || !environment.isLive) {
                           if ( data.data[key].code !== 'shopify_importer' ) {
                               this.state.importServicesList.push({
                                   label: data.data[key].title,
                                   value: data.data[key].marketplace,
                                   shops: data.data[key].shops
                               });
                           }
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
                       if (!data.data[key].usable || !environment.isLive) {
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
                                    <Select
                                        label="Product Listing Type"
                                        options={[{label:'Active Products',value:'active'},
                                            {label:'Inactive Products',value:'inactive'},
                                            {label:'All Products',value:'all'}]}
                                        onChange={this.handleImportChange.bind(this, 'listing_type')}
                                        value={this.state.listing_type}
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
        } else if ( key === 'listing_type' ) {
            this.state.listing_type =  value;
        }
        this.updateState();
    }

    importProducts() {
        requests.getRequest('connector/product/import',
            {
                marketplace: this.state.importProductsDetails.source,
                shop: this.state.importProductsDetails.shop,
                shop_id: this.state.importProductsDetails.shop_id,
                listing_type: this.state.listing_type
            })
            .then(data => {
                this.state.showImportProducts = false;
                this.updateState();
                if (data.success === true) {
                    if (data.code === 'product_import_started' || data.code === 'import_started') {
                        notify.info('Import process started. Check progress in activities section.');
                        setTimeout(() => {
                            this.redirect('/panel/queuedtasks');
                        }, 1000);
                    } else {
                        notify.success(data.message);
                    }
                } else {
                    notify.error(data.message);
                }
            });
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
                                <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                                    <Select
                                        label={capitalizeWord(this.state.uploadProductDetails.source) + " Shop"}
                                        placeholder="Source Shop"
                                        options={this.state.importerShopLists}
                                        onChange={this.handleUploadChange.bind(this, 'source_shop')}
                                        value={this.state.uploadProductDetails.source_shop}
                                    />
                                </div>
                            }
                            <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                                <Select
                                    label="Upload Products To"
                                    placeholder="Target"
                                    disabled={true}
                                    options={this.state.uploadServicesList}
                                    onChange={this.handleUploadChange.bind(this, 'target')}
                                    value={this.state.uploadProductDetails.target}
                                />
                            </div>
                            {
                                this.state.uploadProductDetails.target !== '' &&
                                this.state.uploaderShopLists.length > 1 &&
                                <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                                    <Select
                                        label={"Shopify Shop"}
                                        placeholder="Target Shop"
                                        options={this.state.uploaderShopLists}
                                        onChange={this.handleUploadChange.bind(this, 'target_shop')}
                                        value={this.state.uploadProductDetails.target_shop}
                                    />
                                </div>
                            }
                            <div className="col-12 pt-1 pb-1">
                                <Banner status="info">
                                    <Label>You can upload products from the source to target either through our default profile or you can create an <NavLink to="/panel/profiling/create">custom profile</NavLink> for products upload.</Label>
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
                                                <Label>No profiles for {capitalizeWord(this.state.uploadProductDetails.source)} and {capitalizeWord(this.state.uploadProductDetails.target)} integration</Label>
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
                        this.state.uploadProductDetails.source_shop = this.state.importerShopLists[i].value;
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
                        this.state.uploadProductDetails.target_shop = this.state.uploaderShopLists[i].value;
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
                   if (data.code === 'product_upload_started') {
                       notify.info('Upload process started. Check progress in activities section.');
                       setTimeout(() => {
                           this.redirect('/panel/queuedtasks');
                       }, 1000);
                   } else {
                       notify.success(data.message);
                   }
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
                title="Upload Products">
                <div className="row">
                    <div className="col-12 p-3">
                        <Banner title="Please Read" status="info">
                            <Label>In order to upload your products from source marketplace to Shopify, kindly import your products from the source by clicking on 'Import Products', and then upload your products on Shopify by clicking on 'Upload Products'.<a href="javascript:void(0)" onClick={this.handleModalChange}>Click Here</a></Label>
                        </Banner>
                    </div>
                    <div className="col-12 p-3">
                        <Banner status="warning">
                            <Label>Please make sure that you have selected a plan to import your products. You can choose a plan for your requirement from <NavLink to="/panel/plans">here</NavLink> and you can check your active plan from <NavLink to='/panel/plans/current'>here</NavLink></Label>
                        </Banner>
                    </div>
                    <div className="col-md-6 col-sm-6 col-12 p-3">
                        <Card>
                            <div onClick={() => {
                                this.state.importProductsDetails.source = '';
                                this.state.importProductsDetails.shop = '';
                                this.state.importProductsDetails.shop_id = '';
                                this.state.showImportProducts = true;
                                this.updateState();
                            }} style={{cursor: 'pointer'}}>
                                <div className="text-center pt-5 pb-5">
                                    <FontAwesomeIcon icon={faArrowAltCircleDown} color="#3f4eae" size="10x" />
                                </div>
                                <div className="text-center pt-2 pb-4">
                                    <span className="h2" style={{color: '#3f4eae'}}>Import Products</span>
                                    <Label>(Import From Source To App)</Label>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-6 col-sm-6 col-12 p-3">
                        <Card>
                            <div onClick={() => {
                                this.state.uploadProductDetails.source = '';
                                this.state.uploadProductDetails.target = '';
                                this.state.uploadProductDetails.selected_profile = '';
                                this.state.uploadProductDetails.profile_type = '';
                                this.state.showUploadProducts = true;
                                this.handleUploadChange('target','shopifygql');
                                this.handleUploadChange('selected_profile','default_profile');
                                this.updateState();
                            }} style={{cursor: 'pointer'}}>
                                <div className="text-center pt-5 pb-5">
                                    <FontAwesomeIcon icon={faArrowAltCircleUp} color="#3f4eae" size="10x" />
                                </div>
                                <div className="text-center pt-2 pb-4">
                                    <span className="h2" style={{color: '#3f4eae'}}>Upload Products</span>
                                    <Label>(Import From App To Shopify)</Label>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                {this.renderImportProductsModal()}
                {this.renderUploadProductsModal()}
                {this.renderHelpModal()}
                <input type="hidden" id="openHelpModal" className="btn btn-primary" data-toggle="modal"
                        data-target="#exampleModalCenter"/>
            </Page>
        );
    }
    /*******************       *********************/
    renderHelpModal() {
        return (
            <React.Fragment>
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title" id="exampleModalLongTitle">How to Import/Upload Products</h2>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{fontSize:'30px'}}>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" >
                                <div className="row">
                                    <div className="col-12">
                                        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" data-interval="4000">
                                            <ol className="carousel-indicators">
                                                <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"/>
                                                <li data-target="#carouselExampleIndicators" data-slide-to="1"/>
                                                <li data-target="#carouselExampleIndicators" data-slide-to="2"/>
                                                <li data-target="#carouselExampleIndicators" data-slide-to="3"/>
                                                <li data-target="#carouselExampleIndicators" data-slide-to="4"/>
                                                <li data-target="#carouselExampleIndicators" data-slide-to="5"/>
                                                <li data-target="#carouselExampleIndicators" data-slide-to="6"/>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img className="d-block w-100" src={require("../../../assets/img/step_1.jpg")} alt="First slide" height={480}/>
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 1</h2>
                                                        <h3 className="cation-back">Choose Import To Start The Import Process</h3>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100" src={require("../../../assets/img/step_2.1.jpg")} alt="Second slide" height={480}/>
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 2</h2>
                                                        <h3 className="cation-back">Choose The Source Destination.</h3>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100" src={require("../../../assets/img/step_2.2.jpg")} alt="Third slide" height={480}/>
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 3</h2>
                                                        <h3 className="cation-back">Now Import Product From Source Destination</h3>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100" src={require("../../../assets/img/step_2.5.jpg")} alt="Third slide" height={480}/>
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 4</h2>
                                                        <h3 className="cation-back">In this page you can see the progress of your operations</h3>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100" src={require("../../../assets/img/step_3.1.jpg")} alt="Third slide" height={480}/>
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 5</h2>
                                                        <h3 className="cation-back">All Completed Task Are Shown Here</h3>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100" src={require("../../../assets/img/step_4.1.jpg")} alt="Third slide" height={480}/>
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 6</h2>
                                                        <h3 className="cation-back">Now You can Upload Products</h3>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img className="d-block w-100" src={require("../../../assets/img/step_4.2.jpg")} alt="Third slide" height={480}/>
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 7</h2>
                                                        <h3 className="cation-back">Fill The Form And Click Upload To start The Process</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button"
                                               data-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"/>
                                                <span className="sr-only">Previous</span>
                                            </a>
                                            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button"
                                               data-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"/>
                                                <span className="sr-only">Next</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="pb-5">*/}
                                {/*<div className="d-none text-center d-md-block text-dark">*/}
                                    {/*<h2>Step 1</h2>*/}
                                    {/*<h3>Choose Import To Start The Import Process</h3>*/}
                                {/*</div>*/}
                            { /*</div>*/}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
    handleModalChange() {
       // this.setState({openModal: !this.state.openModal});
        document.getElementById('openHelpModal').click();
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}