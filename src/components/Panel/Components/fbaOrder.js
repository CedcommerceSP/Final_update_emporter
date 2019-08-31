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
    Badge,
    Button
} from "@shopify/polaris";

import {requests} from "../../../services/request";
import {notify} from "../../../services/notify";

import SmartDataTable from "../../../shared/smartTable";

import {paginationShow} from "./static-functions";
export class FbaOrder extends Component {
    filters = {
        full_text_search: "",
        marketplace: "all",
        single_column_filter: [],
        column_filters: {}
    };
    customButton = ["button_order"]; // button
    columnTitles = {
        shopify_order_name: {
            title: "Shopify Order",
            sortable: false,
            type: "string"
        },
        created_at: {
            title: "Created at",
            sortable: false,
            type: "string"
        },
        financial_status: {
            title: "Order Status shopify",
            type: "string",
            sortable: false
        },
        processing_status: {
            title: "Amazon order status",
            sortable: false
        },
        button_order: {
            title: "Create Order on FBA",
            label: "Create", // button Label
            id: "button_order",
            sortable: false
        }

    };
    gridSettings = {
        count: "10",
        activePage: 1
    };
    visibleColumns = [
        "shopify_order_name",
        "created_at",
        "financial_status",
        "processing_status",
        "button_order"
    ];

    /*predefineFilters = [
        { label: "Title", value: "title", type: "string", special_case: "no" },
        { label: "SKU", value: "sku", type: "string", special_case: "no" },
        { label: "Price", value: "price", type: "int", special_case: "no" },
        { label: "Quantity", value: "quantity", type: "int", special_case: "no" },
        { label:"Type", value:"type", type:"type", special_case:"yes"},
        {
            label: "Date Picker",
            value: "datePicker",
            type: "date-picker",
            special_case: "yes"
        },
        {
            label: "Status",
            value: "uploaded",
            type: "uploaded",
            special_case: "yes"
        }
    ];*/
    constructor(props) {
        super(props);
        this.state = {
            pagination_show: 0,
            order: [],
            selectedProducts: [],
            single_column_filter: [],
            button_create_disable: false,
            create_button_loader: false,
            appliedFilters:{}

        }
        this.getOrders();
        this.checkingOrderManuallyCreate();
    }

    prepareFilterObject() {
        this.state.appliedFilters = {};
        if (this.filters.full_text_search !== "") {
            this.state.appliedFilters["search"] = this.filters.full_text_search;
        }
        this.filters.single_column_filter.forEach((e, i) => {
            switch (e.name) {
                case "shopify_order_name":
                case "created_at":
                    this.state.appliedFilters[
                    "filter[" + e.name + "][" + e.condition + "]"
                        ] = e.value;
                    break;
                case "financial_status":
                case "processing_status":
                    this.state.appliedFilters[
                    "filter[" + e.name + "][" + e.condition + "]"
                        ] = e.value;
                    break;
                }
        });
        for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
            const key = Object.keys(this.filters.column_filters)[i];
            if (this.filters.column_filters[key].value !== "") {
                switch (key) {
                    case "shopify_order_name":
                    case "created_at":
                    case "financial_status":
                        /*this.state.appliedFilters[
                        "filter[details." +
                        key +
                        "][" +
                        this.filters.column_filters[key].operator +
                        "]"
                            ] = this.filters.column_filters[key].value;
                        break;*/
                    case "processing_status":
                    /*case "sku":
                    case "price":
                    case "weight":
                    case "weight_unit":
                    case "main_image":
                    case "quantity":
                        this.state.appliedFilters[
                        "filter[variants." +
                        key +
                        "][" +
                        this.filters.column_filters[key].operator +
                        "]"
                            ] = this.filters.column_filters[key].value;
                        break;*/
                }
            }
        }
        this.updateState();
    }

    getOrders = () => {
        console.log("hello000000000",this.state.appliedFilters);
        this.prepareFilterObject();
        // const pageSettings = Object.assign({}, this.gridSettings);
        requests
            .getRequest("fba/test/cronHitting",Object.assign(this.state.appliedFilters),
                false,
                true)
            .then(data => {
                if (data.success) {
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

    createOrderOnFba(ordername) {
        requests.postRequest('fba/test/manuallyOrderCreateButtonHit', {data: ordername}, false, true).then(response1 => {
            if (response1.success) {
                notify.success(response1.message)
            }
            else {
                notify.error(response1.message)
            }
        });
    }


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
                    rowData["shopify_order_name"] = str;
                }
                if (
                    data[i]["created_at"] !== ""
                ) {
                    str = data[i]["created_at"];
                    rowData["created_at"] = str;
                }
                if (data[i]["financial_status"] !== '') {
                    if (data[i]["financial_status"] === "paid") {
                        rowData["financial_status"] = (
                            <React.Fragment>
                                <Badge status="success">Paid</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]["financial_status"] === "refunded") {
                        rowData["financial_status"] = (
                            <React.Fragment>
                                <Badge status="info">Refunded</Badge>
                            </React.Fragment>
                        );
                    }


                    else {
                        rowData["financial_status"] = (
                            <React.Fragment>
                                <Badge status="attention">Unpaid</Badge>
                            </React.Fragment>
                        );
                    }
                }
                if (data[i]["processing_status"] !== '') {
                    if (data[i]["processing_status"] === "Processing") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="success">Processing</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]["processing_status"] === "Fulfilled") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="success">Complete</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === "Pending") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="info">Pending</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === "Denied") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Denied</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === 'CANCELLED By Fba' || data[i]['processing_status'] === 'Cancelled'
                        || data[i]['processing_status'] === 'Canceled') {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Cancelled</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === 'COMPLETE_PARTIALLED') {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Cancelled</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === 'not yet created') {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="info">Not Yet Created</Badge>
                            </React.Fragment>
                        );
                    }
                    else {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Pending</Badge>
                            </React.Fragment>
                        );
                    }

                }
                if (data[i]['processing_status'] === 'not yet created') {
                    str = <Button
                        disabled={false}
                        primary
                        onClick={() => {
                            this.createOrderOnFba(data[i]['shopify_order_name']);
                        }}
                    >
                        Create
                    </Button>
                    rowData["button_order"] = str;
                }
                else {
                    str = <Button
                        disabled={true}
                        primary
                        onClick={() => {
                            this.createOrderOnFba(data[i]['shopify_order_name']);
                        }}
                    >
                        Create
                    </Button>
                    rowData["button_order"] = str;
                }
            }

            products.push(rowData);
        }
        return products;
    }

    operations(event, id) {
        switch (id) {
            case "button_order":
                break;
            default:
        }
    }

    checkingOrderManuallyCreate() {
        requests
            .getRequest("fba/test/toBeCreateOrderManually")
            .then(data => {
                if (data.success) {
                    if (data.data[0]['value'] === "no") {
                        this.setState({
                            button_create_disable: true
                        })
                    }
                }
            });
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
        console.log(this.filters.single_column_filter);
        console.log(this.state.appliedFilters);
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
                                    uniqueKey="shopify_order_name"
                                    showLoaderBar={this.state.showLoaderBar}
                                    count={this.gridSettings.count}
                                    activePage={this.gridSettings.activePage}
                                    hideFilters={this.hideFilters}
                                    columnTitles={this.columnTitles}
                                    customButton={this.customButton} // button
                                    //marketplace={this.filters.marketplace}
                                    // multiSelect={true}
                                    operations={this.operations} //button
                                    // selected={this.state.selectedProducts}
                                    className="ui compact selectable table"
                                    withLinks={true}
                                    visibleColumns={this.visibleColumns}
                                    actions={this.massActions}
                                    showColumnFilters={false}
                                    predefineFilters={this.predefineFilters}
                                    showButtonFilter={true}
                                    columnFilterNameArray={this.filters.single_column_filter}
                                    rowActions={{
                                        edit: false,
                                        delete: false
                                    }}
                                    getVisibleColumns={event => {
                                        this.visibleColumns = event;
                                    }}
                                    userRowSelect={event => {
                                        const itemIndex = this.state.selectedProducts.indexOf(
                                            event.data.shopify_order_name
                                        );
                                        if (event.isSelected) {
                                            if (itemIndex === -1) {
                                                this.state.selectedProducts.push(
                                                    event.data.shopify_order_name
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
                                                    rows[i].shopify_order_name
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
                                    columnFilters={filters => {
                                        this.filters.column_filters = filters;
                                        this.getOrders();
                                    }}
                                    singleButtonColumnFilter={filter => {
                                        this.filters.single_column_filter = filter;
                                        this.getOrders();
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