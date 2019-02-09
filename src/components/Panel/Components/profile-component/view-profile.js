import React, {Component} from 'react';
import {Page, Card, Pagination, Select, Label} from "@shopify/polaris";
import * as queryString from "query-string";
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";
import {faArrowsAltH, faMinus} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isUndefined} from "util";
import {paginationShow} from "../static-functions";
import SmartDataTable from "../../../../shared/smart-table";

class ViewProfile extends Component {

    filters = {
        column_filters: {}
    };
    gridSettings = {
        activePage: 1,
        count: 5
    };
    pageLimits = [
        {label: 5, value: 5},
        {label: 10, value: 10},
        {label: 15, value: 15},
        {label: 20, value: 20},
        {label: 25, value: 25}
    ];
    visibleColumns = ['source_product_id', 'main_image', 'title', 'sku', 'price'];
    imageColumns = ['main_image'];
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
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            queryParams: queryString.parse(props.location.search),
            data: {
                name:{name:'Name',value:''},
                source:{name:'Source',value:''},
                target:{name:'Target',value:''},
                cat:{name:'Category',value:''},
                query:{name:'Query',value:''},
            },
            products: [],
            attributeMapping: [],
            marketplaceAttributes:[],
            totalPage: 0,
            pagination_show: 0,
        };
        this.getProducts();
    }
    getProducts = () => {
        requests.postRequest('connector/profile/getProfile', {id:this.state.queryParams.id,activePage:this.gridSettings.activePage,count:this.gridSettings.count}).then(data => {
            if ( data.success ) {
                this.prepareData(data.data);
                const products = this.modifyProductsData(data.data.products_data);
                this.setState({
                    products:products,
                    totalPage:data.data.products_data_count,
                    pagination_show: paginationShow(this.gridSettings.activePage,this.gridSettings.count,data.data.products_data_count,true)
                });
            } else {
                notify.error(data.message);
                this.setState({
                    pagination_show: paginationShow(0,0,0,false),
                });
            }
        })
    }

    prepareData(value) {
        let basicInfo = this.state.data;
        let attributeMapping = this.state.attributeMapping;
        let marketplaceAttributes = this.state.marketplaceAttributes;
        basicInfo.name.value = value.name;
        basicInfo.source.value = value.source === 'amazonimporter'?'Amazon':value.source;
        basicInfo.target.value = value.target === 'shopifygql'?'Shopify':value.target;
        basicInfo.cat.value = value.targetCategory;
        basicInfo.query.value = this.preapreUser(value.query);
        if ( !isUndefined(value.attributeMapping) && value.attributeMapping !== null ){
            value.attributeMapping.forEach(e => {
                if ( e.mappedTo !== '' || e.defaultValue !== '' ) {
                    if ( e.mappedTo !== '' ) {
                        attributeMapping.push({ target: e.code,source:e.mappedTo, default:'-' })
                    } else if ( e.defaultValue !== '' ) {
                        e.options.forEach(t => {
                            if ( t.value === e.defaultValue ) {
                                attributeMapping.push({ target: e.code,source:'-', default:t.label + ' (' + e.defaultValue + ')' })
                            }
                        })
                    }
                }
            });
        }
        if ( !isUndefined(value.marketplaceAttributes) && value.marketplaceAttributes !== null ){
            value.marketplaceAttributes.forEach(e => {
                if ( typeof e.value !== 'object') {
                    if ( e.value !== null && e.value !== '' ) {
                        marketplaceAttributes.push({title: e.title,value:e.value});
                    }
                } else {
                    let _e = e.value.map(data => {
                        return data;
                    }).join(', ');
                    if ( _e !== '' && _e !== null ) {
                        marketplaceAttributes.push({title: e.title,value:_e});
                    }
                }
            });
        }
        this.setState({
            data: basicInfo,
            attributeMapping:attributeMapping,
            marketplaceAttributes:marketplaceAttributes
        });
    }

    modifyProductsData(data) {
        let products = [];
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            rowData['source_product_id'] = data[i].details.source_product_id.toString();
            rowData['main_image'] = data[i].variants['main_image'];
            rowData['title'] = data[i].details.title;
            rowData['sku'] = data[i].variants['sku'].toString();
            rowData['price'] = data[i].variants['price'].toString();
            rowData['quantity'] = isUndefined(data[i].variants['quantity']) || data[i].variants['quantity'] === null ?'':data[i].variants['quantity'].toString();
            // rowData['type'] = data[i].details.type;
            // rowData['weight'] = isUndefined(data[i].variants['weight']) || data[i].variants['weight'] === null?'':data[i].variants['weight'].toString();
            // rowData['weight_unit'] = data[i].variants['weight_unit'];
            products.push(rowData);
        }
        return products;
    }

    preapreUser = (str) => {
        let equals = '==';
        let nequals = '!=';
        let like = '%LIKE%';
        let nlike = '!%LIKE%';
        let gt = '<';
        let lt = '>';
        let gte = '<=';
        let lte = '>=';
        str = str.replace(new RegExp(equals, 'g'), "Equals");
        str = str.replace(new RegExp(nequals, 'g'), "Not Equals");
        str = str.replace(new RegExp(nlike, 'g'), "Not Contains");
        str = str.replace(new RegExp(like, 'g'), "Contains");
        str = str.replace(new RegExp(gt, 'g'), "greater then");
        str = str.replace(new RegExp(gte, 'g'), "greater then equals to");
        str = str.replace(new RegExp(lte, 'g'), "less then equals to");
        str = str.replace(new RegExp(lt, 'g'), "less then");
        str = str.replace(new RegExp("&&", 'g'), "And");
        return str;
    };

    render() {
        return (
            <Page title="View" primaryAction={{content:'Back', onClick:() => {this.redirect('/panel/profiling')}}}>
                <Card>
                    <div className="p-5">
                        <Card title="Products Details">
                            <div className="row p-5">
                                {Object.keys(this.state.data).map((data, index) => {
                                    if ( this.state.data[data].value !== null && this.state.data[data].value !== '' ) {
                                        return (
                                            <div className="col-6 mb-4" key={index}>
                                                <Label id={this.state.data[data].name}>
                                                    <h3><b>{this.state.data[data].name}</b></h3>
                                                    <h4>{this.state.data[data].value}</h4>
                                                </Label>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                            {
                                this.state.attributeMapping.length > 0 &&
                                <div className="p-5">
                                    <Card title="Attribute Mapping">
                                        <div className="row pr-5 pl-5 pt-5">
                                            <div className="col-3 text-center d-none d-sm-block">
                                                <h3>Shopify</h3>
                                            </div>
                                            <div className="offset-1 col-3 text-center d-none d-sm-block">
                                                <h3>Amazon</h3>
                                            </div>
                                            <div className="offset-1 col-3 text-center d-none d-sm-block">
                                                <h3>Default Value</h3>
                                            </div>
                                            <div className="col-12 d-none d-sm-block">
                                                <hr/>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            {this.state.attributeMapping.map((data, key) => {
                                                return (
                                                    <React.Fragment key={key}>
                                                        <Card>
                                                            <div className="row p-4 text-center">
                                                                <div className="col-sm-3 col-12">
                                                                    <h4>{data.target}</h4>
                                                                    <span className="d-block d-sm-none" style={{color:'#b4afb0'}}>
                                                                    <h6>(Google)</h6>
                                                                </span>
                                                                </div>
                                                                <div className="col-sm-1 col-12 text-center">
                                                                    <FontAwesomeIcon icon={faArrowsAltH} size="2x" color="#000"/>
                                                                </div>
                                                                <div className="col-sm-3 col-12 text-center">
                                                                    {data.source !== '-'?<h4>{data.source}</h4>:<FontAwesomeIcon icon={faMinus} size="2x" color="#cccccc"/>}
                                                                    <span className="d-block d-sm-none" style={{color:'#b4afb0'}}>
                                                                    <h6>(Shopify)</h6>
                                                                </span>
                                                                </div>
                                                                <div className="col-sm-1 col-12 text-center">
                                                                    <FontAwesomeIcon icon={faArrowsAltH} size="2x" color="#000"/>
                                                                </div>
                                                                <div className="col-sm-3 col-12 text-center">
                                                                    {data.default !== '-'?<h4>{data.default}</h4>:<FontAwesomeIcon icon={faMinus} size="2x" color="#cccccc"/>}
                                                                    <span className="d-block d-sm-none" style={{color:'#b4afb0'}}>
                                                                    <h6>(Default Value)</h6>
                                                                </span>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                </div>
                            }
                            {this.state.marketplaceAttributes.length > 0?
                                <div className="p-5">
                                    <Card title="MarketPlace Mapping">
                                        <div className="p-5">
                                            {this.state.marketplaceAttributes.map((data, key) => {
                                                return (
                                                    <React.Fragment key={key}>
                                                        <Card>
                                                            <div className="row p-4 text-center">
                                                                <div className="col-5 text-center">
                                                                    <h4>{data.title}</h4>
                                                                </div>
                                                                <div className="col-1 text-center">
                                                                    <FontAwesomeIcon icon={faArrowsAltH} size="2x" color="#000"/>
                                                                </div>
                                                                <div className="col-5 text-center">
                                                                    <h4>{data.value}</h4>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                </div>:null}
                        </Card>
                        {this.state.products.length > 0 ? <Card title="Product Data">
                            <div className="p-5">
                                <div className="row">
                                    <div className="col-12 text-right">
                                        <h5 className="mr-5">{this.state.pagination_show} Products</h5>
                                        <hr/>
                                    </div>
                                    <div className="col-12">
                                        <SmartDataTable
                                            data={this.state.products}
                                            uniqueKey="sku"
                                            columnTitles={this.columnTitles}
                                            className='ui compact selectable table'
                                            withLinks={true}
                                            visibleColumns={this.visibleColumns}
                                            imageColumns={this.imageColumns}
                                            getVisibleColumns={(event) => {
                                                this.visibleColumns = event;
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
                                            value={this.gridSettings.count}
                                            onChange={this.pageSettingsChange.bind(this)}>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </Card>:null}
                    </div>
                </Card>
            </Page>
        );
    }

    pageSettingsChange(event) {
        this.gridSettings.count = event;
        this.gridSettings.activePage = 1;
        this.getProducts();
    }

    redirect(url) {
        this.props.history.push(url);
    }
}

export default ViewProfile;