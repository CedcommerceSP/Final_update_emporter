import React, { Component } from 'react';
import {
    Card,
    Collapsible,
    DisplayText,
    Icon,
    ResourceList,
    Filters,
    ChoiceList,
    TextField,
    Button,
    Stack,
} from '@shopify/polaris';
import { CaretDownMinor } from '@shopify/polaris-icons';
import { isUndefined } from 'util';
import { json } from '../../../../environments/static-json';
import { requests } from '../../../../services/request';
import SmartDataTable from '../../../../shared/smartTable';
import { paginationShow } from '../static-functions';

class EbayAffiliate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsible : {
                search_div: true,
                itemId:false,
                url : false,
            },
            itemID: '',
            urls: '',
            filter: {
                queryValue: '',
                select_country: [],
                ListingType: [],
                Condition: [],
            },
        };
    }

    handleToggleClick = (key) => {
        this.setState(state => {
            state.collapsible[key] = !state.collapsible[key];
            return state;
        });
    };

    render() {
        const {
            select_country,
            ListingType,
            Condition,
            queryValue,
        } = this.state.filter;
        const filters = [
            {
                key: 'select_country',
                label: 'Country',
                filter: (
                    <ChoiceList
                        title={'Account status'}
                        titleHidden
                        choices={json.ebay_Country}
                        selected={select_country}
                        onChange={this.handleChange('select_country')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'ListingType',
                label: 'Listing Type',
                filter: (
                    <ChoiceList
                        title={'Listing Type'}
                        titleHidden
                        choices={json.listing_type}
                        selected={ListingType}
                        onChange={this.handleChange('ListingType')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'Condition',
                label: 'Condition',
                filter: (
                    <ChoiceList
                        title={'Condition'}
                        titleHidden
                        choices={json.condition}
                        selected={Condition}
                        onChange={this.handleChange('Condition')}
                    />
                ),
            },
        ];
        const appliedFilters = Object.keys(this.state.filter)
            .filter(key => !isEmpty(this.state.filter[key]) && key !== 'queryValue')
            .map(key => {
                return {
                    key,
                    label: disambiguateLabel(key, this.state.filter[key]),
                    onRemove: this.handleRemove,
                };
            });
        return (
            <Card sectioned subdued>
                <br/>
                <br/>
                <Stack vertical={'true'}>
                    <div className="col-12 mb-2">
                        <div className="row p-1" style={{ cursor: 'pointer' }} onClick={this.handleToggleClick.bind(this,'itemId')}>
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">Item ID</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor} />
                            </div>
                        </div>
                        <hr />
                        <Collapsible open={this.state.collapsible.itemId} id="itemId">
                            <Card sectioned title="Search Using Item ID">
                                <TextField
                                    label=""
                                    clearButton
                                    onClearButtonClick={() => {this.setState({itemID:''})}}
                                    onChange={(value) => {this.setState({itemID:value});}}
                                    labelHidden value={this.state.itemID}
                                    helpText={"For Multiple add comma ',' between them e.g. : 156748416168,15645643134"}
                                    readOnly={false}/>
                                <br/>
                                <Button primary>Import Now</Button>
                            </Card>
                        </Collapsible>
                    </div>
                </Stack>
                <Stack vertical={'true'}>
                    <div className="col-12">
                        <div className="row p-1" style={{ cursor: 'pointer' }} onClick={this.handleToggleClick.bind(this,'url')}>
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">URL</DisplayText>
                            </div>
                            <div
                                className="col-1 text-right"
                                children={<Icon source={CaretDownMinor} />}
                            />
                        </div>
                        <hr />
                        <Collapsible open={this.state.collapsible.url} id="url">
                            <Card sectioned title="Search Using URL">
                                <TextField
                                    label=""
                                    clearButton
                                    onClearButtonClick={() => {this.setState({url:''})}}
                                    onChange={(value) => {this.setState({url:value});}}
                                    labelHidden value={this.state.url}
                                    helpText={"For Multiple add comma ',' between them e.g. : https://ebay.com***,https://ebay.com***"}
                                    readOnly={false}/>
                                <br/>
                                <Button primary>Import Now</Button>
                            </Card>
                        </Collapsible>
                    </div>
                </Stack>
                <Stack vertical={'true'}>
                    <div className="col-12 mb-2">
                        <div className="row p-1" style={{ cursor: 'pointer' }} onClick={this.handleToggleClick.bind(this,'search_div')}>
                            <div className="pl-4 col-11">
                                <DisplayText size="small">Search</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor} />
                            </div>
                        </div>
                        <hr />
                        <Collapsible open={this.state.collapsible.search_div} id="ggg">
                            <Card>
                                <ResourceList
                                    resourceName={{
                                        singular: 'customer',
                                        plural: 'customers',
                                    }}
                                    filterControl={
                                        <Filters
                                            queryValue={queryValue}
                                            filters={filters}
                                            appliedFilters={appliedFilters}
                                            onQueryChange={this.handleChange('queryValue')}
                                            onQueryClear={this.handleQueryClear}
                                            onClearAll={this.handleClearAll}
                                        />
                                    }
                                    items={[{}, {}]}
                                    renderItem={item => {}}
                                />
                                <RenderSearchGrid filter={this.state.filter} />
                            </Card>
                        </Collapsible>
                    </div>
                </Stack>
            </Card>
        );
    }

    handleChange = key => value => {
        this.setState(state => {
            state.filter[key] = value;
            return state;
        });
    };

    handleQueryClear = () => {
        this.setState(state => {
            state.filter['queryValue'] = '';
            return state;
        });
    };

    handleRemove = (key) => {
        console.log(key);
        this.setState(state => {
            console.log(state.filter);
            state.filter[key] = '';
            return state;
        });
    };

    handleClearAll = () => {
        this.setState(state => {
            Object.keys(state.filter)
                .filter(key => !isEmpty(this.state.filter[key]) && key !== 'queryValue')
                .forEach(key => {
                state.filter[key] = '';
            });
            return state;
        });
    };
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
        case 'Condition':
            return `${value[0]} Condition`;
        case 'ListingType':
            return `Listing Type ${value}`;
        case 'select_country':
            return `Selected Country ${value}`;
        default:
            return value;
    }
}

export default EbayAffiliate;

class RenderSearchGrid extends Component {
    columnTitles = {
        main_image: {
            title: 'Image',
            sortable: false,
            type: 'image',
        },
        itemId: {
            title: 'ItemId',
            sortable: false,
            type: 'string',
        },
        product_title: {
            title: 'Product Title',
            sortable: false,
            type: 'string',
        },
        global_id: {
            title: 'Global ID',
            sortable: false,
            type: 'string',
        },
        price: {
            title: 'Price',
            type: 'string',
            sortable: false,
        },
        selling_status: {
            title: 'Selling Status',
            sortable: false,
        },
        import : {
            title: 'Import Now',
            sortable: false,
            label:'Import',
            type: 'button',
        }
    };
    visibleColumns = [
        'main_image',
        'product_title',
        'global_id',
        'price',
        'import'
    ];
    gridSettings = {
        count: '10',
        activePage: 1,
    };
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            filter: {
                queryValue: '',
                select_country: [],
                ListingType: [],
                Condition: [],
            },
        };
        this.importNowAction = this.importNowAction.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filter) {
            this.setState({ filter: nextProps.filter });
        }
    }

    operations = (event, id,data) => {
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
                <SmartDataTable
                    data={this.state.products}
                    uniqueKey="itemId"
                    showLoaderBar={this.state.showLoaderBar}
                    count={this.gridSettings.count}
                    activePage={this.gridSettings.activePage}
                    columnTitles={this.columnTitles}
                    operations={this.operations} //button
                    selected={this.state.selectedProducts}
                    className="ui compact selectable table"
                    withLinks={true}
                    visibleColumns={this.visibleColumns}
                    actions={this.massActions}
                    rowActions={{
                        edit: false,
                        delete: false,
                    }}
                    getVisibleColumns={event => {
                        this.visibleColumns = event;
                    }}
                    userRowSelect={event => {
                        const itemIndex = this.state.selectedProducts.indexOf(
                            event.data.item.itemId,
                        );
                        if (event.isSelected) {
                            if (itemIndex === -1) {
                                this.state.selectedProducts.push(event.data.item.itemId);
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
                                    rows[i].source_variant_id,
                                );
                                if (itemIndex === -1) {
                                    data.push(rows[i].source_variant_id);
                                }
                            }
                        } else {
                            for (let i = 0; i < rows.length; i++) {
                                if (data.indexOf(rows[i].source_variant_id) !== -1) {
                                    data.splice(data.indexOf(rows[i].source_variant_id), 1);
                                }
                            }
                        }
                        this.setState({ selectedProducts: data });
                    }}
                    massAction={event => {
                        switch (event) {
                            case 'upload':
                                this.state.selectedProducts.length > 0
                                    ? this.handleSelectedUpload('profile')
                                    : null; /*notify.info("No Product Selected");*/
                                break;
                            default:
                                console.log(event, this.state.selectedProducts);
                        }
                    }}
                    sortable
                />
            </div>
        );
    }

    onClickSearch = () => {
        this.setState({
            button_loader: true,
        });
        let search_key = this.state.filter.queryValue;
        let country_globalId = this.state.filter.select_country;
        let page = 1;
        let count = 10;

        let data = {
            keyword: search_key,
            page: page,
            count: count,
            global_id: country_globalId[0],
            itemFilter: Object.keys(this.state.filter)
                .filter(
                    key =>
                        !isEmpty(this.state.filter[key]) &&
                        key !== 'queryValue' &&
                        key !== 'select_country',
                )
                .map(key => {
                    return {
                        name: key,
                        value: this.state.filter[key][0],
                    };
                }),
        };

        requests
            .postRequest('ebayaffiliate/request/getProducts', data)
            .then(data => {
                if (data.success) {
                    window.showGridLoader = false;
                    this.setState({
                        totalPage: data.pagination.totalPages,
                        tempProductData: data.items,
                    });
                    this.setState({
                        products: this.modifyProductsData(data.items),
                        showLoaderBar: !data.success,
                        hideLoader: data.success,
                        pagination_show: data.pagination.entriesPerPage,
                    });
                } else {
                    this.setState({
                        showLoaderBar: false,
                        hideLoader: true,
                        pagination_show: paginationShow(0, 0, 0, false),
                    });
                    window.showGridLoader = false;
                    setTimeout(() => {
                        window.handleOutOfControlLoader = true;
                    }, 3000);
                }
                this.setState({
                    button_loader: false,
                });
            });
    };

    importNowAction(itemID) {

    }

    modifyProductsData(data) {
        this.setState({
            pagination_show: data.length,
        });
        let products = [];
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            if (data !== {} && !isUndefined(data)) {
                rowData['main_image'] = data[i]['galleryURL'];
                rowData['itemId'] = data[i]['itemId'];
                rowData['product_title'] = data[i]['title'];
                rowData['global_id'] = data[i]['globalId'];
                rowData['price'] = data[i]['sellingStatus']['convertedCurrentPrice']['_value'];
                rowData['selling_status'] = data[i]['sellingStatus']['sellingState'];
                rowData['import'] =  'Import';
            }
            products.push(rowData);
        }
        return products;
    }

}