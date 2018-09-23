import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import { Page,
         Card,
         Select,
         Pagination,
         Label,
         ResourceList,
         Modal,
         TextContainer,
         Tabs } from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import SmartDataTable from '../../../shared/smart-table';
import {isUndefined} from "util";

export class Products extends Component {

    filters = {
        full_text_search: '',
        marketplace: 'all',
        column_filters: {}
    };
    gridSettings = {
      variantsCount: 10,
      activePage: 1
    };
    pageLimits = [
        {label: 10, value: 10},
        {label: 20, value: 20},
        {label: 30, value: 30},
        {label: 40, value: 40},
        {label: 50, value: 50}
    ];
    massActions = [
        {label: 'Delete', value: 'delete'},
        // {label: 'Upload', value: 'upload'}
    ];
    visibleColumns = ['source_product_id', 'main_image', 'title', 'sku', 'price','quantity','asin'];
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
            sortable: false
        },
        type: {
            title: 'Type',
            sortable: true
        },
        quantity: {
            title: 'Quantity',
            sortable: false
        },
        source_product_id: {
            title: 'ASIN',
            sortable:false,
        },
        asin: {
            title: 'Detail',
            label:'View', // button Label
            id:'asin',
            sortable:false,
        },
    };
    totalProductCount = 0;

    constructor() {
        super();
        this.state = {
            products: [],
            appliedFilters: {},
            installedApps: [],
            selectedApp: 0,
            searchValue: '',
            selectedProducts: [],
            deleteProductData: false,
            toDeleteRow: {},
            totalPage:0
        };
        this.getProducts();
        this.getInstalledApps();
    }

    getInstalledApps() {
        requests.getRequest('connector/get/getInstalledApps')
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
                        this.state.installedApps.push({
                            id: data.data[i].code,
                            content: data.data[i].title,
                            accessibilityLabel: data.data[i].title,
                            panelID: data.data[i].code
                        });
                    }
                } else {
                    notify.error(data.message);
                }
                this.updateState();
            });
    }

    getProducts() {
        this.prepareFilterObject();
        const pageSettings = Object.assign({}, this.gridSettings);
        requests.getRequest('connector/product/getProducts', Object.assign( pageSettings, this.state.appliedFilters))
            .then(data => {
                if (data.success) {
                    this.setState({totalPage:data.data.count});
                    const products = this.modifyProductsData(data.data.rows);
                    this.totalProductCount = data.data.count;
                    this.state['products'] = products;
                    this.updateState();
                } else {
                    notify.error('No products found');
                }

            });
    }

    prepareFilterObject() {
        this.state.appliedFilters = {};
        if (this.filters.marketplace !== 'all') {
            this.state.appliedFilters['marketplace'] = this.filters.marketplace;
        }
        if (this.filters.full_text_search !== '') {
            this.state.appliedFilters['search'] = this.filters.full_text_search;
        }
        for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
            const key = Object.keys(this.filters.column_filters)[i];
            if (this.filters.column_filters[key].value !== '') {
                switch (key) {
                    case 'type':
                    case 'title':
                    case 'long_description':
                    case 'source_product_id':
                        this.state.appliedFilters['filter[details.' + key + '][' + this.filters.column_filters[key].operator + ']'] = this.filters.column_filters[key].value;
                        break;
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
                rowData['source_product_id'] = data[i].variants.source_variant_id.toString();
                rowData['asin'] = data[i].variants.source_variant_id.toString();
                products.push(rowData);
            }
        }
        return products;
    }
    operations = (event, id) => {
        switch (id) {
            case 'asin':this.redirect('/panel/products/view/' + event);break;
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
                primaryAction={{content: 'Analytics', onClick: () => {
                        this.redirect('/panel/products/analysis');
                    }}}
                title="Products List">
                <Card>
                    <div className="p-5">
                        <ResourceList
                            items={['products']}
                            renderItem={item => {}}
                        />
                        <div className="row">
                            <div className="col-12">
                                <Tabs tabs={this.state.installedApps} selected={this.state.selectedApp} onSelect={this.handleMarketplaceChange.bind(this)}/>
                            </div>
                            <div className="col-12 p-3 text-right">
                                <Label>Total {this.totalProductCount} products</Label>
                            </div>
                            <div className="col-12">
                                <SmartDataTable
                                    data={this.state.products}
                                    uniqueKey="sku"
                                    count={this.gridSettings.variantsCount}
                                    activePage={this.gridSettings.activePage}
                                    hideFilters={this.hideFilters}
                                    columnTitles={this.columnTitles}
                                    multiSelect={false}
                                    customButton={this.customButton} // button
                                    operations={this.operations} //button
                                    selected={this.state.selectedProducts}
                                    className='ui compact selectable table'
                                    withLinks={true}
                                    visibleColumns={this.visibleColumns}
                                    // actions={this.massActions}
                                    showColumnFilters={true}
                                    imageColumns={this.imageColumns}
                                    rowActions={{
                                        edit: false,
                                        delete: false
                                    }}
                                    getVisibleColumns={(event) => {
                                        this.visibleColumns = event;
                                    }}
                                    userRowSelect={(event) => {
                                        const itemIndex = this.state.selectedProducts.indexOf(event.data.sku);
                                        if (event.isSelected) {
                                            if (itemIndex === -1) {
                                                this.state.selectedProducts.push(event.data.sku);
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
                                                const itemIndex = this.state.selectedProducts.indexOf(rows[i].sku);
                                                if ( itemIndex === -1 ) {
                                                    data.push(rows[i].sku);
                                                }
                                            }
                                        } else {
                                            for (let i = 0; i < rows.length; i++) {
                                                if ( data.indexOf(rows[i].sku) !== -1 ) {
                                                    data.splice(data.indexOf(rows[i].sku), 1)
                                                }
                                            }
                                        }
                                        this.setState({selectedProducts: data});
                                    }}
                                    massAction={(event) => {
                                        switch (event) {
                                            case 'upload':this.redirect('/show/progress',this.state.selectedProducts);break;
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
                                    sortable
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6 text-right">
                                <Pagination
                                    hasPrevious={1 < this.gridSettings.activePage}
                                    onPrevious={() => {
                                        this.gridSettings.activePage--;
                                        this.getProducts();
                                    }}
                                    hasNext={this.state.totalPage/this.gridSettings.variantsCount > this.gridSettings.activePage}
                                    nextKeys={[75]}
                                    nextTooltip="k"
                                    onNext={() => {
                                        this.gridSettings.activePage++;
                                        this.getProducts();
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
                {this.state.deleteProductData && this.deleteProductModal()}
            </Page>
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
            console.log(this.props);
            this.props.parentProps.history.push(url);
        }
    }
}