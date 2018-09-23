import React, {Component} from 'react';
import {Page, Card, DataTable, Label} from "@shopify/polaris";
import * as queryString from "query-string";
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";
import {faArrowsAltH, faMinus} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class ViewProfile extends Component {
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
            attributeMapping: [],
            marketplaceAttributes:[],
        }
    }
    componentWillMount() {
        requests.postRequest('connector/profile/getProfile', this.state.queryParams).then(data => {
            if ( data.success ) {
                this.prepareData(data.data);
            } else {
                notify.error(data.message);
            }
        })
    }
    prepareData(value) {
        let basicInfo = this.state.data;
        let attributeMapping = this.state.attributeMapping;
        let marketplaceAttributes = this.state.marketplaceAttributes;
        basicInfo.name.value = value.name;
        basicInfo.source.value = value.source;
        basicInfo.target.value = value.target;
        basicInfo.cat.value = value.targetCategory;
        basicInfo.query.value = value.query;
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
        value.marketplaceAttributes.forEach(e => {
            if ( typeof e.value !== 'object') {
                marketplaceAttributes.push({title: e.title,value:e.value});
            } else {
                let _e = e.value.map(data => {
                    return data;
                }).join(', ');
                marketplaceAttributes.push({title: e.title,value:_e});
            }
        });
        this.setState({
            data: basicInfo,
            attributeMapping:attributeMapping,
            marketplaceAttributes:marketplaceAttributes
        });
    }
    render() {
        return (
            <Page title="View" primaryAction={{content:'Back', onClick:() => {this.redirect('/panel/profiling')}}}>
                <Card>
                    <div className="p-5">
                        <Card title="Products Details">
                            <div className="row p-5">
                                {Object.keys(this.state.data).map((data, index) => {
                                    return (
                                        <div className="col-6 mb-4" key={index}>
                                            <Label id={this.state.data[data].name}>
                                                <h3><b>{this.state.data[data].name}</b></h3>
                                                <h4>{this.state.data[data].value}</h4>
                                            </Label>
                                        </div>
                                    );
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
                            </div>
                        </Card>
                    </div>
                </Card>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default ViewProfile;