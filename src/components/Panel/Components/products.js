import React, { Component } from 'react';
import {isUndefined} from "util";
import {NavLink} from "react-router-dom";
import {
    Page,
    Card,
    Select,
    Pagination,
    Label,
    ResourceList,
    Modal,
    TextContainer,
    Tabs, Banner, Button
} from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import {globalState} from "../../../services/globalstate";

import SmartDataTable from '../../../shared/smartTable';

import {capitalizeWord, paginationShow} from "./static-functions";

import {environment} from "../../../environments/environment";

export class Products extends Component {

    filters = {
        full_text_search: '',
        marketplace: 'all',
        single_column_filter: [],
        column_filters: {}
    };
    gridSettings = {
      variantsCount: "10",
      activePage: 1
    };
    pageLimits = [
        {label: 10, value: "10"},
        {label: 20, value: "20"},
        {label: 30, value: "30"},
        {label: 40, value: "40"},
        {label: 50, value: "50"}
    ];
    massActions = [
        // {label: 'Delete', value: 'delete'},
        {label: 'Upload', value: 'upload'},
        // {label: 'Upload All', value: 'upload_all'}
    ];
    visibleColumns = ['main_image','source_variant_id', 'title', 'sku', 'price','quantity','asin'];
    imageColumns = ['main_image'];
    hideFilters = ['main_image' ,'long_description','type', 'asin'];
    customButton = ['asin']; // button
    columnTitles = {
        main_image: {
            title: 'Image',
            sortable: false
        },
        title: {
            title: 'Title',
            sortable: true
        },
        sku: {
            title: 'Sku',
            sortable: true
        },
        price: {
            title: 'Price',
            type: 'int',
            sortable: false
        },
        type: {
            title: 'Type',
            sortable: true
        },
        quantity: {
            title: 'Quantity',
            type: 'int',
            sortable: false
        },
        source_variant_id: {
            title: 'Unique Id',
            sortable:false,
        },
        // asin: {
        //     title: 'Detail',
        //     label:'View', // button Label
        //     id:'asin',
        //     sortable:false,
        // },
    };
    totalProductCount = 0;

    constructor() {
        super();
        this.state = {
            uploadServicesList: [],
            uploaderShopLists: [],
            showUploadProducts: false,
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
            products: [],
            appliedFilters: {},
            installedApps: [],
            selectedApp: 0,
            searchValue: '',
            selectedProducts: [],
            deleteProductData: false,
            toDeleteRow: {},
            totalPage:0,
            totalMainCount:0 ,
            showLoaderBar:true,
            hideLoader: false,
            pagination_show:0,
            selectedUploadModal: false,
            selectUpload:{option:[],value:''},
            selectImporterService:[]
        };
        this.getAllImporterServices();
        // this.getAllUploaderServices();
        this.getProducts();
        this.getInstalledApps();

    }

    getAllImporterServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'importer' }, false, true)
            .then(data => {
                if (data.success) {
                    this.state.importServicesList = [];
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            if ( data.data[key].code !== 'shopify_importer' ) {
                                if ( data.data[key].code !== 'shopify_importer' ) {
                                    if ( data.data[key].code === 'amazon_importer' )
                                        this.state.selectImporterService.push('amazonimporter');
                                    if ( data.data[key].code === 'ebay_importer' )
                                        this.state.selectImporterService.push('ebayimporter');
                                }
                                // this.state.importServicesList.push({
                                //     label: data.data[key].title,
                                //     value: data.data[key].marketplace,
                                //     shops: []//data.data[key].shops
                                // });
                            }
                        }
                    }
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getAllUploaderServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'uploader' })
            .then(data => {
                if (data.success) {
                    this.state.uploadServicesList = [];
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            this.state.uploadServicesList.push({
                                label: data.data[key].title,
                                value: data.data[key].marketplace,
                                shops: data.data[key].shops
                            });
                        }
                    }
                    // this.handleImportChange('shop','shopify');
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    handleProfileSelect(profile) {
        this.state.uploadProductDetails.selected_profile = profile;
        this.updateState();
    }

    getInstalledApps() {
        requests.getRequest('connector/get/getInstalledApps', false, false, true)
            .then(data => {
                this.state.installedApps = [
                    {
                        id: 'all',
                        content: 'All',
                        accessibilityLabel: 'All',
                        panelID: 'all'
                    }
                ];
                if (data.success) {
                    for (let i = 0; i < data.data.length; i++) {
                        if ( data.data[i].code !== 'shopify' ) {
                            this.state.installedApps.push({
                                id: data.data[i].code,
                                content: data.data[i].title,
                                accessibilityLabel: data.data[i].title,
                                panelID: data.data[i].code
                            });
                        }
                    }
                } else {
                    notify.error(data.message);
                }
               this.state.showLoaderBar = data.success;
                this.updateState();
            });
    }

    handleSelectedUpload = (arg,val) => {
        switch (arg) {
            case 'modalClose': this.setState({selectedUploadModal: false}); break;
            case 'profile':
                this.state.selectUpload.option = [];
                for( let i = 0; i < this.state.selectImporterService.length; i++) {
                let data = {
                    target:'shopifygql',
                    source: this.state.selectImporterService[i],
                    target_shop: globalState.getLocalStorage('shop')?globalState.getLocalStorage('shop'):''
                };
                requests.getRequest('connector/profile/getMatchingProfiles', data)
                    .then(data => {
                        if (data.success) {
                            if ( this.state.selectUpload.option.length < 1 ) {
                                this.state.selectUpload.option.push({
                                    label: 'Default Profile',
                                    value: 'default_profile'
                                });
                            }
                            for (let i = 0; i < data.data.length; i++) {
                                this.state.selectUpload.option.push({
                                    label: data.data[i].name,
                                    value: data.data[i].id
                                });
                            }
                            this.state.selectUpload.value = 'default_profile';
                            this.setState({selectedUploadModal: true});
                            this.updateState();
                        } else {
                            notify.error(data.message);
                        }
                    })
            } break;
            case 'Start_Upload':requests.postRequest('connector/product/selectUpload', {
                                    selected_profile:this.state.selectUpload.value,
                                    list_ids:this.state.selectedProducts
                                }).then(data => {
                                    if ( data.success ) {
                                        if ( data.code === 'product_upload_started' ) {
                                            notify.info(data.message)
                                        }
                                        setTimeout(() => {this.redirect('/panel/queuedtasks');},400);
                                    } else {
                                        notify.error(data.message);
                                    }
                                });
            break;
            case 'select': this.state.selectUpload.value = val;
                            this.setState(this.state);break;
            default:notify.info('Case Not Exits');
        }
    };

    getProducts() {
        window.showGridLoader = true;
        this.prepareFilterObject();
        const pageSettings = Object.assign({}, this.gridSettings);
        requests.getRequest('connector/product/getProducts', Object.assign( pageSettings, this.state.appliedFilters),false,true)
            .then(data => {
                if (data.success) {
                    window.showGridLoader = false;
                    this.setState({totalPage:data.data.count});
                    if ( !isUndefined(data.data.mainCount) ) {
                        this.setState({totalMainCount:data.data.mainCount});
                    }
                    const products = this.modifyProductsData(data.data.rows);
                    this.totalProductCount = data.data.count;
                    this.state['products'] = products;
                    this.state.showLoaderBar = data.success;
                    this.state.hideLoader = !data.success;
                    this.state.pagination_show = paginationShow(this.gridSettings.activePage,this.gridSettings.variantsCount,data.data.count,true);
                    this.updateState();
                } else {
                    this.setState({
                        showLoaderBar:false,
                        hideLoader:true,
                        pagination_show: paginationShow(0,0,0,false),
                    });
                    setTimeout(() => {
                        window.handleOutOfControlLoader = true;
                    },3000);
                    notify.error('No products found');
                    this.updateState();
                }
            });
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

    prepareFilterObject() {
        this.state.appliedFilters = {};
        if (this.filters.marketplace !== 'all') {
            this.state.appliedFilters['filter[marketplace][1]'] = this.filters.marketplace;
        }
        if (this.filters.full_text_search !== '') {
            this.state.appliedFilters['search'] = this.filters.full_text_search;
        }
        this.filters.single_column_filter.forEach((e, i) => {
            switch (e.name) {
                case 'type':
                case 'title':
                case 'long_description':
                    this.state.appliedFilters['filter[details.' + e.name + '][' + e.condition + ']'] = e.value;
                    break;
                case 'source_variant_id':
                case 'sku':
                case 'price':
                case 'weight':
                case 'weight_unit':
                case 'main_image':
                case 'quantity':
                    this.state.appliedFilters['filter[variants.' + e.name + '][' + e.condition + ']'] = e.value;
                    break;
            }
        });
        for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
            const key = Object.keys(this.filters.column_filters)[i];
            if (this.filters.column_filters[key].value !== '') {
                switch (key) {
                    case 'type':
                    case 'title':
                    case 'long_description':
                        this.state.appliedFilters['filter[details.' + key + '][' + this.filters.column_filters[key].operator + ']'] = this.filters.column_filters[key].value;
                        break;
                    case 'source_variant_id':
                    case 'sku':
                    case 'price':
                    case 'weight':
                    case 'weight_unit':
                    case 'main_image':
                    case 'quantity':
                        this.state.appliedFilters['filter[variants.' + key + '][' + this.filters.column_filters[key].operator + ']'] = this.filters.column_filters[key].value;
                        break;
                }
            }
        }
        this.updateState();
    }

    modifyProductsData(data) {
        let products = [];
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            if ( data[i].variants !== {} && !isUndefined(data[i].variants) ) {
                rowData['main_image'] = data[i].variants['main_image'];
                rowData['title'] = data[i].details.title;
                rowData['sku'] = data[i].variants['sku'].toString();
                rowData['price'] = data[i].variants['price'].toString();
                rowData['type'] = data[i].details.type;
                rowData['quantity'] = data[i].variants['quantity'] !== null?data[i].variants['quantity'].toString():'0';
                rowData['source_variant_id'] = data[i].variants.source_variant_id.toString();
                // rowData['asin'] = data[i].variants.source_variant_id.toString();
                products.push(rowData);
            }
        }
        return products;
    }

    operations = (event, id) => {
        switch (id) {
            case 'grid':this.redirect('/panel/products/view/' + event['source_variant_id']);break;
            default:console.log('Default Case');
        }
    };

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    closeDeleteProductModal() {
        this.state.toDeleteRow = {};
        this.state.deleteProductData = false;
        const state = this.state;
        this.setState(state);
    }

    deleteProductModal() {
        return (
            <Modal
                open={this.state.deleteProductData}
                onClose={() => {
                    this.closeDeleteProductModal();
                }}
                title="Delete Product?"
                primaryAction={{
                    content: 'Delete',
                    onAction: () => {
                        notify.success(this.state.toDeleteRow.title + ' deleted  successfully');
                        this.closeDeleteProductModal();
                    },
                }}
                secondaryActions={[
                    {
                        content: 'No',
                        onAction: () => {
                            notify.info('No products deleted');
                            this.closeDeleteProductModal();
                        }
                    },
                ]}
            >
                <Modal.Section>
                        <TextContainer>
                            <p>
                                Are you sure, you want to delete {this.state.toDeleteRow.title}?
                            </p>
                        </TextContainer>
                </Modal.Section>
            </Modal>
        );
    }

    render() {
        return (
            <Page
                primaryAction={{content: 'Create Profile', onClick: () => {
                    this.redirect('/panel/profiling/create');
                        // this.state.uploadProductDetails.source = '';
                        // this.state.uploadProductDetails.target = '';
                        // this.state.uploadProductDetails.selected_profile = '';
                        // this.state.uploadProductDetails.profile_type = '';
                        // this.state.showUploadProducts = true;
                        // this.handleUploadChange('target','shopifygql');
                        // this.handleUploadChange('selected_profile','default_profile');
                        // this.updateState();
                    }}} style={{cursor: 'pointer'}}
                title="Products List">
                <Card>
                    <div className="p-5">
                        <ResourceList
                            items={['products']}
                            renderItem={item => {}}
                        />
                        <div className="row">
                            {/*<div className="col-12">*/}
                                {/*<Tabs tabs={this.state.installedApps} selected={this.state.selectedApp} onSelect={this.handleMarketplaceChange.bind(this)}/>*/}
                            {/*</div>*/}
                            <div className="col-12 p-3 text-right">
                                <Label>{this.state.pagination_show} products</Label>
                                <Label>{this.state.totalMainCount && Object.keys(this.filters.column_filters).length <= 0?`Total Main Product ${this.state.totalMainCount}`:''}</Label>
                            </div>
                            <div className="col-12">
                                <SmartDataTable
                                    data={this.state.products}
                                    uniqueKey="source_variant_id"
                                    showLoaderBar={this.state.showLoaderBar}
                                    count={this.gridSettings.variantsCount}
                                    activePage={this.gridSettings.activePage}
                                    hideFilters={this.hideFilters}
                                    columnTitles={this.columnTitles}
                                    multiSelect={true}
                                    customButton={this.customButton} // button
                                    operations={this.operations} //button
                                    selected={this.state.selectedProducts}
                                    className='ui compact selectable table'
                                    withLinks={true}
                                    visibleColumns={this.visibleColumns}
                                    actions={this.massActions}
                                    showColumnFilters={false}
                                    showButtonFilter={true}
                                    imageColumns={this.imageColumns}
                                    rowActions={{
                                        edit: false,
                                        delete: false
                                    }}
                                    getVisibleColumns={(event) => {
                                        this.visibleColumns = event;
                                    }}
                                    userRowSelect={(event) => {
                                        const itemIndex = this.state.selectedProducts.indexOf(event.data.source_variant_id);
                                        if (event.isSelected) {
                                            if (itemIndex === -1) {
                                                this.state.selectedProducts.push(event.data.source_variant_id);
                                            }
                                        } else {
                                            if (itemIndex !== -1) {
                                                this.state.selectedProducts.splice(itemIndex, 1);
                                            }
                                        }
                                        const state = this.state;
                                        this.setState(state);
                                    }}
                                    allRowSelected={(event, rows) => {
                                        // this.state.selectedProducts = [];
                                        let data = this.state.selectedProducts.slice(0);
                                        if (event) {
                                            for (let i = 0; i < rows.length; i++) {
                                                const itemIndex = this.state.selectedProducts.indexOf(rows[i].source_variant_id);
                                                if ( itemIndex === -1 ) {
                                                    data.push(rows[i].source_variant_id);
                                                }
                                            }
                                        } else {
                                            for (let i = 0; i < rows.length; i++) {
                                                if ( data.indexOf(rows[i].source_variant_id) !== -1 ) {
                                                    data.splice(data.indexOf(rows[i].source_variant_id), 1)
                                                }
                                            }
                                        }
                                        this.setState({selectedProducts: data});
                                    }}
                                    massAction={(event) => {
                                        switch (event) {
                                            case 'upload':
                                                this.state.selectedProducts.length > 0?
                                                this.handleSelectedUpload('profile'):notify.info('No Product Selected');
                                                break;
                                            default:console.log(event,this.state.selectedProducts);
                                        }
                                    }}
                                    editRow={(row) => {
                                        this.redirect("/panel/products/edit/" + row.id);
                                    }}
                                    deleteRow={(row) => {
                                        this.state.toDeleteRow = row;
                                        this.state.deleteProductData = true;
                                        const state = this.state;
                                        this.setState(state);
                                    }}
                                    columnFilters={(filters) => {
                                        this.filters.column_filters = filters;
                                        this.getProducts();
                                    }}
                                    singleButtonColumnFilter={(filter) => {
                                        this.filters.single_column_filter = filter;
                                        this.getProducts();
                                    }}
                                    sortable
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6 text-right">
                                <Pagination
                                    hasPrevious={1 < this.gridSettings.activePage}
                                    onPrevious={() => {
                                        if (1 < this.gridSettings.activePage) {
                                            this.gridSettings.activePage--;
                                            this.getProducts();
                                        }
                                    }}
                                    hasNext={this.state.totalPage/this.gridSettings.variantsCount > this.gridSettings.activePage}
                                    nextKeys={[39]}
                                    previousKeys={[37]}
                                    previousTooltip="use Right Arrow"
                                    nextTooltip="use Left Arrow"
                                    onNext={() => {
                                        if (this.state.totalPage/this.gridSettings.variantsCount > this.gridSettings.activePage ) {
                                            this.gridSettings.activePage++;
                                            this.getProducts();
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-md-2 col-sm-2 col-6">
                                <Select
                                    options={this.pageLimits}
                                    value={this.gridSettings.variantsCount}
                                    onChange={this.pageSettingsChange.bind(this)}>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Card>
                <Modal
                    open={this.state.selectedUploadModal}
                    onClose={this.handleSelectedUpload.bind(this,'modalClose')}
                    title={"Upload"}
                    primaryAction={{content:'Accept', onClick:() => { this.handleSelectedUpload('Start_Upload') }}}
                    secondaryActions={{content:'Cancel', onClick:() => {this.handleSelectedUpload('modalClose')}}}
                >
                    <Modal.Section>
                        <div>
                            <Banner title="Please Note" status="info">
                                <Label id={'sUploadLabel'}>
                                    Product Without an profile, will be uploaded via Default Profile.
                                </Label>
                            </Banner>
                            <Select
                                label={'Profile'}
                                options={this.state.selectUpload.option}
                                onChange={this.handleSelectedUpload.bind(this,'select')}
                                value={this.state.selectUpload.value}
                            />
                        </div>
                    </Modal.Section>
                </Modal>
                {this.state.deleteProductData && this.deleteProductModal()}
                {this.renderUploadProductsModal()}
            </Page>
        );
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
                this.state.uploadProductDetails.selected_profile = 'default_profile';
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
                this.state.uploadProductDetails.selected_profile = 'default_profile';
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
                this.state.uploadProductDetails.selected_profile = 'default_profile';
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
                this.state.uploadProductDetails.selected_profile = 'default_profile';
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
                                    label={"Amazon Shop"}
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
                                <Label>You can upload products from the source to target either through our default profile or you can create <NavLink to="/panel/profiling/create">custom profile</NavLink> for products upload.</Label>
                            </Banner>
                        </div>
                        <div className="col-12 pt-1 pb-1">
                            {
                                this.state.uploadProductDetails.profile_type !== 'custom' &&
                                <Select
                                    label="Upload Through"
                                    placeholder="Choose Profile"
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
                                            <Label>No profiles for {this.state.uploadProductDetails.source === 'amazonimporter'?'Amazon':capitalizeWord(this.state.uploadProductDetails.source)} and {this.state.uploadProductDetails.target === 'shopifygql'?'Shopify':capitalizeWord(this.state.uploadProductDetails.target)}</Label>
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
                                    disabled={!(this.state.uploadProductDetails.source !== '')}
                                    primary>
                                Upload Products
                            </Button>
                        </div>
                    </div>
                </Modal.Section>
            </Modal>
        );
    }

    handleMarketplaceChange(event) {
        this.filters.marketplace = this.state.installedApps[event].id;
        this.state.selectedApp = event;
        this.updateState();
        this.getProducts();
    }

    pageSettingsChange(event) {
        this.gridSettings.variantsCount = event;
        this.gridSettings.activePage = 1;
        this.getProducts();
    }

    redirect(url, data) {
        if ( !isUndefined(data) ) {
            this.props.parentProps.history.push(
                '/show/progress',
                {data: data,marketPlace:'amazon',chunk:1}
            );
        } else {
            this.props.parentProps.history.push(url);
        }
    }
}
