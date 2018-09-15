import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import { Page,
         Card,
         Select,
         Pagination,
         TextStyle,
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
        {label: 5, value: 5},
        {label: 10, value: 10},
        {label: 15, value: 15},
        {label: 20, value: 20},
        {label: 25, value: 25}
    ];
    massActions = [
        {label: 'Delete', value: 'delete'},
        {label: 'Upload', value: 'upload'}
    ];
    visibleColumns = ['source_product_id', 'main_image', 'long_description', 'title', 'sku', 'price',];
    imageColumns = ['main_image'];
    hideFilters = ['main_image' ,'long_description'];
    read_more = ['long_description'];
    columnTitles = {
        source_product_id: {
            title: 'ID',
            sortable: false
        },
        main_image: {
            title: 'Image',
            sortable: false
        },
        title: {
            title: 'Title',
            sortable: false
        },
        long_description: {
            title: 'Description',
            sortable: false
        },
        type: {
            title: 'Type',
            sortable: false
        },
        quantity: {
            title: 'Quantity',
            sortable: false
        },
        sku: {
            title: 'Sku',
            sortable: false
        },
        price: {
            title: 'Price',
            sortable: false
        },
        weight: {
            title: 'Weight',
            sortable: false
        },
        weight_unit: {
            title: 'Weight Unit',
            sortable: false
        },
    };

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
            rowData['source_product_id'] = data[i].details.source_product_id;
            rowData['main_image'] = data[i].variants['main_image'];
            rowData['title'] = data[i].details.title;
            rowData['long_description'] = data[i].details.long_description;
            rowData['sku'] = data[i].variants['sku'];
            rowData['price'] = data[i].variants['price'];
            rowData['type'] = data[i].details.type;
            rowData['quantity'] = data[i].variants['quantity'];
            rowData['weight'] = data[i].variants['weight'];
            rowData['weight_unit'] = data[i].variants['weight_unit'];
            products.push(rowData);
        }
        return products;
    }

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
                // primaryAction={{content: 'Add Product', onClick: () => {
                //     this.redirect('/panel/products/create');
                // }}}
                primaryAction={{content: 'Analytics', onClick: () => {
                        this.redirect('/panel/products/analysis');
                    }}}
                title="Products List">
                <Card>
                    <div className="p-5">
                        <ResourceList
                            items={['products']}
                            renderItem={item => {}}
                            filterControl={
                                <ResourceList.FilterControl
                                    searchValue={this.filters.full_text_search}
                                    onSearchChange={(searchValue) => {
                                        this.filters.full_text_search = searchValue;
                                        this.updateState();
                                    }}
                                    additionalAction={{
                                        content: 'Search',
                                        onAction: () => this.getProducts()
                                    }}
                                />
                            }
                        />
                        <div className="row">
                            <div className="col-12">
                                <Tabs tabs={this.state.installedApps} selected={this.state.selectedApp} onSelect={this.handleMarketplaceChange.bind(this)}/>
                            </div>
                            <div className="col-12">
                                <SmartDataTable
                                    data={this.state.products}
                                    uniqueKey="sku"
                                    read_more={this.read_more}
                                    hideFilters={this.hideFilters}
                                    columnTitles={this.columnTitles}
                                    multiSelect={true}
                                    selected={this.state.selectedProducts}
                                    className='ui compact selectable table'
                                    withLinks={true}
                                    visibleColumns={this.visibleColumns}
                                    actions={this.massActions}
                                    showColumnFilters={true}
                                    imageColumns={this.imageColumns}
                                    rowActions={{
                                        edit: false,
                                        delete: false
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
                                        this.state.selectedProducts = [];
                                        if (event) {
                                            for (let i = 0; i < rows.length; i++) {
                                                this.state.selectedProducts.push(rows[i].sku);
                                            }
                                        }
                                        const state = this.state;
                                        this.setState(state);
                                    }}
                                    massAction={(event) => {
                                        switch (event) {
                                            case 'upload':this.redirect('/show/progress',this.state.selectedProducts);break;
                                            default:console.log(event);
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
                                    hasNext={this.state.totalPage/this.gridSettings.count > this.gridSettings.activePage}
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
                {data: data,marketPlace:'amazon',chunk:10}
            );
        } else {
            this.props.history.push(url);
        }
    }
}