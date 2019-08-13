/**
 * Created by cedcoss on 17/6/19.
 */
import React, {Component} from "react";
import {isUndefined} from "util";
import {
    Page,
    Card,
    Select,
    Pagination,
    Label,
    ResourceList,
    Modal,
    TextContainer,
    Tabs,
    Banner,
    Badge
} from "@shopify/polaris";

import {requests} from "../../../services/request";
import {notify} from "../../../services/notify";

import SmartDataTable from "../../../shared/smartTable";

import {paginationShow} from "./static-functions";
export class FbaOrder extends Component {
    columnTitles = {
        shopify_order: {
            title: "Shopify Order",
            sortable: false,
            type: "string"
        },
        created_at: {
            title: "Created at",
            sortable: false,
            type: "string"
        },
        order_status_shopify: {
            title: "Order Status shopify",
            type: "string",
            sortable: false
        },
        amazon_order_status: {
            title: "Amazon order status",
            sortable: false
        },
    };
    gridSettings = {
        count: "10",
        activePage: 1
    };
    visibleColumns = [
        "shopify_order",
        "created_at",
        "order_status_shopify",
        "amazon_order_status",
    ];

    constructor(props) {
        super(props);
        this.state = {
            pagination_show: 0,
            order: [],
            selectedProducts: [],
            single_column_filter: [],

        }
        this.getOrders();
    }

    getOrders = () => {
        const pageSettings = Object.assign({}, this.gridSettings);
        requests
            .getRequest("fba/test/cronHitting")
            .then(data => {
                if (data.data.success) {
                    window.showGridLoader = false;
                    this.setState({
                        totalPage: data.data.count,
                        tempProductData: data.data.rows
                    });
                    if (!isUndefined(data.data.mainCount)) {
                        this.setState({totalMainCount: data.data.mainCount});
                    }
                    const order = this.modifyProductsData(data.data.rows, "");
                    this.state["order"] = order;
                    this.state.showLoaderBar = !data.success;
                    this.state.hideLoader = data.success;
                    this.state.pagination_show = data.data.count;
                    ;
                    this.updateState();
                } else {
                    this.setState({
                        showLoaderBar: false,
                        hideLoader: true,
                        pagination_show: paginationShow(0, 0, 0, false)
                    });
                    window.showGridLoader = false;
                    setTimeout(() => {
                        window.handleOutOfControlLoader = true;
                    }, 3000);
                    notify.error(data.message);
                    this.updateState();
                }
            });
    };


    modifyProductsData(data, product_grid_collapsible) {
        this.setState({
            pagination_show: data.length
        })
        let products = [];
        let str = "";
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            if (data[i] !== {} && !isUndefined(data[i])) {
                if (
                    data[i]["shopify_order_name"] !== ""
                ) {
                    str = data[i]["shopify_order_name"];
                    rowData["shopify_order"] = str;
                }
                if (
                    data[i]["created_at"] !== ""
                ) {
                    str = data[i]["created_at"];
                    rowData["created_at"] = str;
                }
                if (data[i]["financial_status"] !== '') {
                    if (data[i]["financial_status"] === "paid") {
                        rowData["order_status_shopify"] = (
                            <React.Fragment>
                                <Badge status="success">Paid</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]["financial_status"] === "refunded") {
                        rowData["order_status_shopify"] = (
                            <React.Fragment>
                                <Badge status="info">Refunded</Badge>
                            </React.Fragment>
                        );}


                    else {
                        rowData["order_status_shopify"] = (
                            <React.Fragment>
                                <Badge status="attention">Unpaid</Badge>
                            </React.Fragment>
                        );
                    }
                }
                if (data[i]["processing_status"] !== '') {
                    if (data[i]["processing_status"] === "Processing") {
                        rowData["amazon_order_status"] = (
                            <React.Fragment>
                                <Badge status="success">Shipped</Badge>
                            </React.Fragment>
                        );
                    }
                        else if (data[i]["processing_status"] === "Fulfilled") {
                            rowData["amazon_order_status"] = (
                                <React.Fragment>
                                    <Badge status="success">Complete</Badge>
                                </React.Fragment>
                            );
                        }
                    else if (data[i]['processing_status'] === "Pending") {
                        rowData["amazon_order_status"] = (
                            <React.Fragment>
                                <Badge status="info">Pending</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === "Denied"){
                        rowData["amazon_order_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Denied</Badge>
                            </React.Fragment>
                        );
                    }
                    else if ( data[i]['processing_status'] === 'CANCELLED By Fba' || data[i]['processing_status'] === 'Cancelled'
                    || data[i]['processing_status'] === 'Canceled'){
                        rowData["amazon_order_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Cancelled</Badge>
                            </React.Fragment>
                        );
                    }
                    else {
                        rowData["amazon_order_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Pending</Badge>
                            </React.Fragment>
                        );
                    }
                }
            }

            products.push(rowData);
        }
        return products;
    }

    /*    handleToggleClick = product_grid_collapsible => {
     if (this.state.product_grid_collapsible === product_grid_collapsible) {
     this.setState({ product_grid_collapsible: "" });
     } else {
     this.setState({ product_grid_collapsible: product_grid_collapsible });
     }
     const products = this.modifyProductsData(
     this.state.tempProductData,
     product_grid_collapsible
     );
     this.setState({ order: products });
     };*/

    render() {
        return (
            <Page title="FBA Orders">
                <Card>
                    <div className="p-5">
                        <div className="row">
                            <div className="col-12 p-3 text-right">
                                <Label>{this.state.pagination_show} Orders</Label>
                            </div>
                            <div className="col-12">
                                {/*    <SmartDataTable
                                 data={this.state.order}
                                 columnTitles={this.columnTitles}
                                 visibleColumns={this.visibleColumns}
                                 getVisibleColumns={event => {
                                 this.visibleColumns = event;
                                 }}
                                 columnFilters={filters => {
                                 this.filters.column_filters = filters;
                                 this.getOrders();
                                 }}
                                 />*/}
                                <SmartDataTable
                                    data={this.state.order}
                                    uniqueKey="shopify_order"
                                    showLoaderBar={this.state.showLoaderBar}
                                    count={this.gridSettings.count}
                                    activePage={this.gridSettings.activePage}
                                    hideFilters={this.hideFilters}
                                    columnTitles={this.columnTitles}
                                    //marketplace={this.filters.marketplace}
                                    // multiSelect={true}
                                    operations={this.operations} //button
                                    // selected={this.state.selectedProducts}
                                    className="ui compact selectable table"
                                    withLinks={true}
                                    visibleColumns={this.visibleColumns}
                                    actions={this.massActions}
                                    // showColumnFilters={false}
                                    // predefineFilters={this.predefineFilters}
                                    // showButtonFilter={true}
                                    // columnFilterNameArray={this.filters.single_column_filter}
                                    rowActions={{
                                        edit: false,
                                        delete: false
                                    }}
                                    getVisibleColumns={event => {
                                        this.visibleColumns = event;
                                    }}
                                    userRowSelect={event => {
                                        const itemIndex = this.state.selectedProducts.indexOf(
                                            event.data.shopify_order
                                        );
                                        if (event.isSelected) {
                                            if (itemIndex === -1) {
                                                this.state.selectedProducts.push(
                                                    event.data.shopify_order
                                                );
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
                                        let data = this.state.selectedProducts.slice(0);
                                        if (event) {
                                            for (let i = 0; i < rows.length; i++) {
                                                const itemIndex = this.state.selectedProducts.indexOf(
                                                    rows[i].shopify_order
                                                );
                                                if (itemIndex === -1) {
                                                    data.push(rows[i].source_variant_id);
                                                }
                                            }
                                        } else {
                                            for (let i = 0; i < rows.length; i++) {
                                                if (data.indexOf(rows[i].source_variant_id) !== -1) {
                                                    data.splice(
                                                        data.indexOf(rows[i].source_variant_id),
                                                        1
                                                    );
                                                }
                                            }
                                        }
                                        this.setState({selectedProducts: data});
                                    }}
/*                                    massAction={event => {
                                        switch (event) {
                                            case "upload":
                                                this.state.selectedProducts.length > 0
                                                    ? this.handleSelectedUpload("profile")
                                                    : notify.info("No Product Selected");
                                                break;
                                            default:
                                                console.log(event, this.state.selectedProducts);
                                        }
                                    }}
                                    editRow={row => {
                                        this.redirect("/panel/products/edit/" + row.id);
                                    }}
                                    deleteRow={row => {
                                        this.state.toDeleteRow = row;
                                        this.state.deleteProductData = true;
                                        const state = this.state;
                                        this.setState(state);
                                    }}
                                    columnFilters={filters => {
                                        this.filters.column_filters = filters;
                                        this.getProducts();
                                    }}
                                      singleButtonColumnFilter={filter => {
                                     this.filters.single_column_filter = filter;
                                     this.getProducts();
                                     }}*/
                                    sortable
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </Page>
        )
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }


}