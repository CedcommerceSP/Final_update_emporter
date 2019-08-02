import React, {Component} from 'react';
import {Card, Collapsible,DisplayText, Icon,
    ResourceList,Filters,Avatar,TextStyle,ChoiceList,TextField,RangeSlider,
    Select, Button,Stack} from "@shopify/polaris";
import {
    CaretDownMinor,CircleChevronDownMinor
} from '@shopify/polaris-icons';
import { json } from "../../../../environments/static-json";
import { requests } from "../../../../services/request";
import SmartDataTable from "../../../../shared/smartTable";

class EbayAffiliate extends Component {
    gridSettings = {
        count: "10",
        activePage: 1
    };
    constructor(props) {
        super(props);
        this.state = {
            search_div: false,
            selected: '',
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
                <div className="row pt-5">
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
                        <Collapsible open={this.state.search_div}

                                >
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
                                    <div className="p-3">
                                        <Button
                                            primary={true}
                                            loading={this.state.button_loader}
                                            onClick={this.onClickSearch}
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </Collapsible>
                    </div>
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
                    <div className="col-12">
                        <div className="row p-1">
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">URL</DisplayText>
                            </div>
                            <div className="col-1 text-right" children={<Icon source={CaretDownMinor}/>}/>
                        </div>
                        <hr/>
                    </div>
                </div>
            </Card>
        );
    }
    handleChange = (key) => (value) => {
        console.log(key, value);
        this.setState((state) => {

            state.filter[key] = value;
            return state;
        });
    };
    handleChange2 = (key,value) => {
        console.log(key, value);
        this.setState((state) => {

            state.filter[key] = value;
            return state;
        });
    };
   /* handleRemove = key => {
        this.setState({ [key]: null });
    };*/

    handleQueryClear = () => {
        this.setState({queryValue: ''});
    };

    handleClearAll = () => {
        this.setState({
            accountStatus: null,
            moneySpent: null,
            taggedWith: null,
            queryValue: null,
        });
    };


    onClickSearch = () => {
        console.log(this.state.filter.queryValue);
        console.log(this.state.filter.select_country);
        console.log(this.state.filter.select_listing_type);
        console.log(this.state.filter.select_condition);
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

        console.log(data);
        requests.postRequest('ebayaffiliate/request/getProducts', data, false, true).then(response1 => {
            if (response1.success) {
                console.log(response1)
            }
            else {
                console.log("Failed")
            }
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