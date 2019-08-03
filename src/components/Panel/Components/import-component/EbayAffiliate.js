import React, {Component} from 'react';
import {Card, Collapsible,DisplayText, Icon,
    ResourceList,Filters,Avatar,TextStyle,ChoiceList,TextField,RangeSlider,
    Select, Button,Stack} from "@shopify/polaris";
import {
    CaretDownMinor,CircleChevronDownMinor
} from '@shopify/polaris-icons';
import {isUndefined} from "util";
import { json } from "../../../../environments/static-json";
import { requests } from "../../../../services/request";
import SmartDataTable from "../../../../shared/smartTable";
import {paginationShow} from "../static-functions";

class EbayAffiliate extends Component {
 /*   columnTitles = {
        main_image: {
            title: "Image",
            sortable: false,
            type: "image"
        },
        product_title: {
            title: "Product Title",
            sortable: false,
            type: "string"
        },
        global_id: {
            title: "Global ID",
            sortable: false,
            type: "string"
        },
        price: {
            title: "Price",
            type: "string",
            sortable: false
        },
        selling_status: {
            title: "Selling Status",
            sortable: false
        }
    };*/
    visibleColumns = [
        "main_image",
        "product_title",
        "global_id",
        "price",
        "selling_status"
    ];
    gridSettings = {
        count: "10",
        activePage: 1
    };
    constructor(props) {
        super(props);
        this.state = {
            search_div: false,
            selected: '',
            pagination_show: 0,
            options: this.options,
            button_loader:false,
            listing_name:'',
            condition_name:'',
            filter:{
                queryValue: '',
                select_country:[],
                select_listing_type:[],
                select_condition:[]
            },


        };
    }



    handleToggleClick = () => {
        this.setState((state) => {
            const search_div = !state.search_div;
            return {
                search_div,
            };
        });
    };
    /*handleChangeSelect = (value) => {
        this.setState({selected: value});
    }*/;
    render() {
        // const {search_div} = this.state;
        const {accountStatus, moneySpent, taggedWith, queryValue} = this.state.filter;
        const filters = [
            {
                key: 'accountStatus',
                label: 'Country',
                filter: (
                    <ChoiceList
                        title={'Account status'}
                        titleHidden
                        choices={json.ebay_Country}
                        selected={this.state.filter.select_country}
                        onChange={this.handleChange('select_country')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'taggedWith',
                label: 'Listing Type',
                filter: (
                    <ChoiceList
                        title={'Listing Type'}
                        titleHidden
                        choices={json.listing_type}
                        selected={this.state.filter.select_listing_type}
                        onChange={this.handleChange('select_listing_type')}
                    />
            /*<Select
                label="Listing Type"
                options={json.listing_type}
                onChange={this.handleChange('taggedWith')}
                value={taggedWith}
            />*/
                ),
                shortcut: true,
            },
            {
                key: 'moneySpent',
                label: 'Condition',
                filter: (
                    <ChoiceList
                        title={'Condition'}
                        titleHidden
                        choices={json.condition}
                        selected={this.state.filter.select_condition}
                        onChange={this.handleChange('select_condition')}
                    />
                ),
            },
        ];
        const appliedFilters = Object.keys(this.state.filter)
            .filter((key) => !isEmpty(this.state.filter[key]) && key !== 'queryValue')
            .map((key) => {
                return {
                    key,
                    label: disambiguateLabel(key, this.state.filter[key]),
                    // onRemove: this.handleRemove,
                };
            });
        return (
            <Card sectioned subdued>
                <div>
                    <Stack vertical={"true"}>
                    <div className="col-12 mb-2">
                        <div className="row p-1" >
                            <div className="pl-4 col-11"
                                 style={{cursor: "pointer"}}
                                 onClick={this.handleToggleClick.bind(this.state.search_div)}
                            >
                                <DisplayText size="small">Search</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor}/>
                            </div>
                        </div>
                        <hr/>
                        <Collapsible open={this.state.search_div}>
                            <div style={{height: '568px'}}>
                                <Card>
                                    <ResourceList
                                        resourceName={{singular: 'customer', plural: 'customers'}}
                                        filterControl={
                                            <Filters
                                                queryValue={queryValue}
                                                filters={filters}
                                                 appliedFilters={appliedFilters}
                                                onQueryChange={this.handleChange('queryValue')}
                                                onQueryClear={this.handleQueryClear}
                                                /*onClearAll={this.handleClearAll}*/
                                            />
                                        }
                                        items={[
                                            {

                                            },
                                            {

                                            },
                                        ]}
                                        renderItem={(item) => {}}
                                    />
                                    {console.log(this.state.products)}
                                    <RenderSearchGrid filter={this.state.filter}/>
                                </Card>
                            </div>
                        </Collapsible>
                    </div>
                    </Stack>
                    <Stack vertical={"true"}>
                    <div className="col-12 mb-2">
                        <div className="row p-1">
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">Item ID</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor}/>
                            </div>
                        </div>
                        <hr/>
                    </div>
                    </Stack>
                    <Stack vertical={"true"}>
                    <div className="col-12">
                        <div className="row p-1">
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">URL</DisplayText>
                            </div>
                            <div className="col-1 text-right" children={<Icon source={CaretDownMinor}/>}/>
                        </div>
                        <hr/>
                    </div>
                    </Stack>
                </div>
            </Card>
        );
    }
    handleChange = (key) => (value) => {
        console.log(key,"array")
        this.setState((state) => {

            state.filter[key] = value;
            return state;
        });
    };

    handleQueryClear = () => {
        this.setState({queryValue: ''});
    };

  /*  handleClearAll = () => {
        this.setState({
            accountStatus: null,
            moneySpent: null,
            taggedWith: null,
            queryValue: null,
        });
    };
*/


    /*getOrders = () => {
        const pageSettings = Object.assign({}, this.gridSettings);
        requests
            .getRequest("ebayaffiliate/request/getProducts")
            .then(data => {
                if (data.data.success) {
                    console.log("data of ebayaffiliate",data.data)
                    window.showGridLoader = false;
                    this.setState({
                        totalPage: data.data.count,
                        tempProductData: data.data.rows
                    });
                    /!*if (!isUndefined(data.data.mainCount)) {
                        this.setState({totalMainCount: data.data.mainCount});
                    }*!/
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
                    // notify.error(data.message);
                    this.updateState();
                }
            });
    };*/

    updateState() {
        const state = this.state;
        this.setState(state);
    }

/*    modifyProductsData(data, product_grid_collapsible) {
        this.setState({
            pagination_show: data.length
        })
        let products = [];
        let str = "";
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            if (data !== {} && !isUndefined(data)) {
                if (data[i]['galleryURL']!==''){
                    str=data[i]["galleryURL"];
                    rowData['main_image']= str;
                }
                if (data[i]['title'] !== '') {
                    str = data[i]["title"];
                    rowData["product_title"] = str;
                }
                if (data[i]['globalId']!==''){
                    str = data[i]["globalId"];
                    rowData["global_id"] = str;
                }
                if (data[i]['sellingStatus']['convertedCurrentPrice']['_value']!==''){
                    str = data[i]['sellingStatus']['convertedCurrentPrice']['_value'];
                    rowData["price"] = str;
                }
                if (data[i]['sellingStatus']['sellingState']!==''){
                    str = data[i]['sellingStatus']['sellingState'];
                    rowData["selling_status"] = str;
                }
            }

            products.push(rowData);
        }
        return products;
    }*/

}
function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === '' || value == null;
    }
}
function disambiguateLabel(key, value) {
    switch (key) {
        case 'moneySpent':
            return `Money spent is between $${value[0]} and $${value[1]}`;
        case 'taggedWith':
            return `Tagged with ${value}`;
        case 'accountStatus':
            return value.map((val) => `Customer ${val}`).join(', ');
        default:
            return value;
    }
}

export default EbayAffiliate;

class RenderSearchGrid extends Component {
    columnTitles = {
        main_image: {
            title: "Image",
            sortable: false,
            type: "image"
        },
        product_title: {
            title: "Product Title",
            sortable: false,
            type: "string"
        },
        global_id: {
            title: "Global ID",
            sortable: false,
            type: "string"
        },
        price: {
            title: "Price",
            type: "string",
            sortable: false
        },
        selling_status: {
            title: "Selling Status",
            sortable: false
        }
    };
    visibleColumns = [
        "main_image",
        "product_title",
        "global_id",
        "price",
        "selling_status"
    ];
    gridSettings = {
        count: "10",
        activePage: 1
    };
    constructor(props) {
        super(props);
        this.state = {
            products:[],
            filter:{
                queryValue: '',
                select_country:[],
                select_listing_type:[],
                select_condition:[]
            },
        }
    }

    componentWillReceiveProps(nextProps) {
        if ( nextProps.filter ) {
            this.setState({filter:nextProps.filter});
        }
    }

    operations = (event, data) => {
        console.log(event, data);
    };

    render() {
        return (
            <div className="col-12">
                <div className="p-3">
                    <Button
                        primary={true}
                        loading={this.state.button_loader}
                        onClick={this.onClickSearch}
                    >
                        Search
                    </Button>
                </div>
                {console.log(this.state.products)}
                <SmartDataTable
                    data={this.state.products}
                    uniqueKey="itemId"
                    showLoaderBar={this.state.showLoaderBar}
                    count={this.gridSettings.count}
                    activePage={this.gridSettings.activePage}
                    // hideFilters={this.hideFilters}
                    columnTitles={this.columnTitles}
                    // marketplace={this.filters.marketplace}
                    // multiSelect={true}
                    operations={this.operations} //button
                    selected={this.state.selectedProducts}
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
                            event.data.item.itemId
                        );
                        if (event.isSelected) {
                            if (itemIndex === -1) {
                                this.state.selectedProducts.push(
                                    event.data.item.itemId
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
                    /*       allRowSelected={(event, rows) => {
                     let data = this.state.selectedProducts.slice(0);
                     if (event) {
                     for (let i = 0; i < rows.length; i++) {
                     const itemIndex = this.state.selectedProducts.indexOf(
                     rows[i].source_variant_id
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
                     this.setState({ selectedProducts: data });
                     }}*/
                    /* massAction={event => {
                     switch (event) {
                     case "upload":
                     this.state.selectedProducts.length > 0
                     ? this.handleSelectedUpload("profile")
                     :null /!*notify.info("No Product Selected");*!/
                     break;
                     default:
                     console.log(event, this.state.selectedProducts);
                     }
                     }}*/
                    /*   editRow={row => {
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
        );
    }

    onClickSearch = () => {
        this.setState({
            button_loader:true,
        })
        let search_key = this.state.filter.queryValue;
        let country_globalId = this.state.filter.select_country;
        let listing_type = this.state.filter.select_listing_type;
        let condition = this.state.filter.select_condition;
        let page = 1;
        let count = 10;

        var data = {
            "keyword": search_key,
            "page": page,
            "count": count,
            "global_id": country_globalId[0],
            "itemFilter": Object.keys(this.state.filter)
                .filter((key) => !isEmpty(this.state.filter[key]) && key !== 'queryValue' && key !== 'select_country')
                .map((key) => {
                    return {
                        name:key,
                        value: disambiguateLabel(key, this.state.filter[key])[0],
                        // onRemove: this.handleRemove,
                    };
                })
        };

        requests.postRequest('ebayaffiliate/request/getProducts', data, false, true)
            .then(data => {
                if (data.success) {
                    this.setState({
                        button_loader:false,
                    })
                    console.log("data of ebayaffiliate",data)
                    window.showGridLoader = false;
                    this.setState({
                        totalPage: data.pagination.totalPages,
                        tempProductData: data.items,
                    });
                    /* if (!isUndefined(data.data.mainCount)) {
                     this.setState({totalMainCount: data.data.mainCount});
                     }*/
                    const order = this.modifyProductsData(data.items, "");
                    this.state["products"] = order;
                    this.setState({
                        showLoaderBar : !data.success,
                        hideLoader : data.success,
                        pagination_show : data.pagination.entriesPerPage,
                    });
                    // this.updateState();
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
                    // notify.error(data.message);
                    // this.updateState();
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
            if (data !== {} && !isUndefined(data)) {
                if (data[i]['galleryURL']!==''){
                    str=data[i]["galleryURL"];
                    rowData['main_image']= str;
                }
                if (data[i]['title'] !== '') {
                    str = data[i]["title"];
                    rowData["product_title"] = str;
                }
                if (data[i]['globalId']!==''){
                    str = data[i]["globalId"];
                    rowData["global_id"] = str;
                }
                if (data[i]['sellingStatus']['convertedCurrentPrice']['_value']!==''){
                    str = data[i]['sellingStatus']['convertedCurrentPrice']['_value'];
                    rowData["price"] = str;
                }
                if (data[i]['sellingStatus']['sellingState']!==''){
                    str = data[i]['sellingStatus']['sellingState'];
                    rowData["selling_status"] = str;
                }
            }

            products.push(rowData);
        }
        return products;
    }
}