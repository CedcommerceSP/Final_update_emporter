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
         FilterType } from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import SmartDataTable from '../../../shared/smart-table';

export class Products extends Component {

    productsEndpoint = 'http://192.168.0.48:4500/products';
    filters = {};
    gridSettings = {
      _page: 1,
      _limit: 5
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
    visibleColumns = ['id', 'title', 'price', 'sku', 'quantity', 'sales'];
    constructor() {
        super();
        this.state = {
            products: [],
            appliedFilters: [],
            searchValue: '',
            selectedProducts: [],
            deleteProductData: false,
            toDeleteRow: {}
        };
        this.getProducts();
    }

    getProducts() {
        requests.getRequest(this.productsEndpoint, this.gridSettings, true)
            .then(data => {
                const state = this.state;
                // data = this.modifyProductsData(data);
                state['products'] = data;
                this.setState(state);
            });
    }

    modifyProductsData(data) {
        let products = [];
        data.map((prod) => {
            let prodArr = [];
            for (let i = 0; i < Object.keys(prod).length; i++) {
                prodArr.push(prod[Object.keys(prod)[i]]);
            }
            products.push(prodArr);
        });
        return products;
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
                breadcrumbs={[{content: 'Products'}]}
                primaryAction={{content: 'Add Product', onClick: () => {
                    this.redirect('/panel/products/create');
                }}}
                title="Products List">
                <Card>
                    <ResourceList
                        items={this.state.products}
                        renderItem={item => {}}
                        filterControl={
                            <ResourceList.FilterControl
                                filters={[]}
                                appliedFilters={this.state.appliedFilters}
                                onFiltersChange={(appliedFilters) => {
                                    this.applyFilters(appliedFilters);
                                }}
                                searchValue={this.state.searchValue}
                                onSearchChange={(searchValue) => {
                                    this.addSearchFilter(searchValue);
                                }}
                                additionalAction={{
                                    content: 'Filter',
                                    onAction: () => this.getProducts(),
                                }}
                            />
                        }
                    />
                    <SmartDataTable
                        data={this.state.products}
                        multiSelect={true}
                        selected={this.state.selectedProducts}
                        className='ui compact selectable table'
                        withLinks={true}
                        visibleColumns={this.visibleColumns}
                        actions={this.massActions}
                        showColumnFilters={true}
                        rowActions={{
                            edit: true,
                            delete: true
                        }}
                        userRowSelect={(event) => {
                            const itemIndex = this.state.selectedProducts.indexOf(event.data.id);
                            if (event.isSelected) {
                                if (itemIndex === -1) {
                                    this.state.selectedProducts.push(event.data.id);
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
                                    this.state.selectedProducts.push(rows[i].id);
                                }
                            }
                            const state = this.state;
                            this.setState(state);
                        }}
                        massAction={(event) => {
                            console.log(event);
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
                            console.log(filters);
                        }}
                        sortable
                    />
                    <div className="row mt-3">
                        <div className="col-6 text-right">
                            <Pagination
                                hasPrevious
                                onPrevious={() => {
                                    this.gridSettings._page--;
                                    this.getProducts();
                                }}
                                hasNext
                                onNext={() => {
                                    this.gridSettings._page++;
                                    this.getProducts();
                                }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-2 col-6">
                            <Select
                                options={this.pageLimits}
                                value={this.gridSettings._limit}
                                onChange={this.pageSettingsChange.bind(this)}>
                            </Select>
                        </div>
                    </div>
                </Card>
                {this.state.deleteProductData && this.deleteProductModal()}
            </Page>
        );
    }

    pageSettingsChange(event) {
        this.gridSettings._limit = event;
        this.gridSettings._page = 1;
        this.getProducts();
    }

    addSearchFilter(searchValue) {
        const state = this.state;
        state.searchValue = searchValue;
        this.setState(state);
        if (searchValue !== null &&
            searchValue !== '') {
            this.filters['title'] = searchValue;
            this.getProducts();
        }
    }

    applyFilters(allFilters) {
        const state = this.state;
        for (let i = 0; i < allFilters.length; i++) {
            switch (allFilters[i].key) {
                case 'quantity':
                    if (allFilters[i].value > 0) {
                        allFilters[i]['label'] = 'In stock';
                    } else {
                        allFilters[i]['label'] = 'Out of stock';
                    }
                    break;
            }
        }
        state.appliedFilters = allFilters;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}