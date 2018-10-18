import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { Page,
    Card,
    Select,
    Button,
    TextField,
    Label,
    Modal,
    Checkbox,
    Banner,
    DisplayText } from '@shopify/polaris';

import './create-profile.css';

import { notify } from '../../../../services/notify';
import { requests } from '../../../../services/request';
import { capitalizeWord } from '../static-functions';
import { isUndefined } from 'util';

import { environment } from '../../../../environments/environment';

export class CreateProfile extends Component {

    isLive = false;
    sourceAttributes = [];
    filteredProducts = {
      runQuery: false,
      totalProducts: 0
    };
    filterConditions = [
        { label: 'Equals', value: '==' },
        { label: 'Not Equals', value: '!=' },
        { label: 'Contains', value: '%LIKE%' },
        { label: 'Does Not Contains', value: '!%LIKE%' },
        { label: 'Greater Then', value: '>' },
        { label: 'Less Then', value: '<' },
        { label: 'Greater Then Equal To', value: '>=' },
        { label: 'Less Then Equal To', value: '<=' }
    ];
    optionMapping = {};
    showOptionMapping = false;
    optionMappingIndex = -1;
    categoryList = [];

    importServices = [];
    uploadServices = [];
    importShopLists = [];
    uploadShopLists = [];

    constructor() {
        super();
        this.state = {
            activeStep: 1,
            filterQuery: {
                primaryQuery: [
                    {
                        key: '',
                        operator: '',
                        value: ''
                    }
                ],
                condition: 'AND',
                position: 1,
                secondaryQuery: {}
            },
            basicDetails: {
                name: '',
                source: '',
                sourceShop: '',
                targetShop: '',
                target: ''
            },
            products_select: {
                query: '',
                targetCategory: '',
                marketplaceAttributes: []
            },
            targetAttributes: [],
            sourceAttributes: [],
        };
        this.getProfile();
    }

    getProfile() {
        requests.getRequest('connector/profile/get')
            .then(data => {
                if (data.success) {
                    if (!isUndefined(data.data.state)) {
                        this.state.basicDetails.name = data.data.name;
                        this.state.basicDetails.source = data.data.source;
                        this.state.basicDetails.target = data.data.target;
                        this.state.basicDetails.sourceShop = data.data.sourceShop;
                        this.state.basicDetails.targetShop = data.data.targetShop;
                        switch (data.data.state) {
                            case 1:
                                this.state.activeStep = 1;
                                this.fetchDataForStepOne();
                                break;
                            case 2:
                                this.state.activeStep = 2;
                                this.state.products_select.query = data.data.query;
                                this.state.products_select.targetCategory = data.data.targetCategory;
                                this.state.products_select.marketplaceAttributes = data.data.marketplaceAttributes;
                                this.fetchDataForSteptwo(true);
                                break;
                        }
                    } else {
                        this.fetchDataForStepOne();
                    }
                } else {
                    this.fetchDataForStepOne();
                }
            });
    }

    fetchDataForStepOne() {
        this.getImportServices();
        this.getUploadServices();
    }

    fetchDataForSteptwo(fetchMarketplaceAttributes) {
        this.getProductCategories();
        this.getSourceAttributes();
        if (isUndefined(fetchMarketplaceAttributes)) {
            this.getMarketplaceAttributes();
        }
    }

    fetchDataForStepThree() {
        this.getTargetAttributes();
        this.getAttributesForSelectedProducts();
    }

    getTargetAttributes() {
        requests.getRequest('connector/get/getAttributes', { marketplace: this.state.basicDetails.target, category: this.state.products_select.targetCategory })
            .then(data => {
                if (data.success) {
                    this.state.targetAttributes = this.modifyAttributesData(data.data);
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getMarketplaceAttributes() {
        requests.getRequest('connector/get/configForm', { marketplace: this.state.basicDetails.target })
            .then(data => {
                if (data.success) {
                    this.state.products_select.marketplaceAttributes = this.modifyConfigFormData(data.data);
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    modifyConfigFormData(data) {
        for (let i = 0; i < data.length; i++) {
            if (!isUndefined(data[i].options) && data[i].options !== null) {
                let options = [];
                for (let j = 0; j < Object.keys(data[i].options).length; j++) {
                    const key = Object.keys(data[i].options)[j];
                    options.push({
                       label: data[i].options[key],
                       value: key
                    });
                }
                data[i].options = options;
            }
        }
        return data;
    }

    getAttributesForSelectedProducts() {
        requests.getRequest('connector/product/getAttributesByProductQuery', { marketplace: this.state.basicDetails.source, query: this.state.products_select.query })
            .then(data => {
                if (data.success) {
                    this.state.sourceAttributes = this.modifyAttributesForSelect(data.data);
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    modifyAttributesForSelect(attributes) {
        let toReturnAttributes = [];
        for (let i = 0; i < attributes.length; i++) {
            let attributeData = {
                value: attributes[i].code,
                label: attributes[i].title
            };
            if (!isUndefined(attributes[i].values)) {
                attributeData['options'] = this.modifyAttributeOptions(attributes[i].values);
            }
            toReturnAttributes.push(attributeData);
        }
        return toReturnAttributes;
    }

    modifyAttributesData(attributes) {
        let toReturnAttributes;
        let requiredAttributes = [];
        let optionalAttributes = [];
        for (let i = 0; i < attributes.length; i++) {
            let attributeData = {
                code: attributes[i].code,
                required: attributes[i].required === 1,
                title: attributes[i].title,
                mappedTo: '',
                defaultValue: ''
            };
            if (!isUndefined(attributes[i].values)) {
                attributeData['options'] = this.modifyAttributeOptions(attributes[i].values);
            }
            if (!isUndefined(attributes[i].mapped)) {
                attributeData['mappedTo'] = attributes[i].mapped;
            }
            if (!isUndefined(attributes[i].system)) {
                attributeData['system'] = (attributeData['system'] === 1);
            }
            if (!isUndefined(attributes[i].visible)) {
                attributeData['visible'] = (attributeData['visible'] === 1);
            }
            if (attributeData.required) {
                requiredAttributes.push(attributeData);
            } else {
                optionalAttributes.push(attributeData);
            }
        }
        toReturnAttributes = [...requiredAttributes, ...optionalAttributes];
        return toReturnAttributes;
    }

    modifyAttributeOptions(options) {
        let toReturnOptions = [];
        for (let i = 0; i < options.length; i++) {
            toReturnOptions.push({
                mappedTo: '',
                label: options[i].title,
                value: options[i].value
            });
        }
        return toReturnOptions;
    }

    getProductCategories() {
        requests.getRequest('connector/get/categories', { marketplace: this.state.basicDetails.target })
            .then(data => {
                if (data.success) {
                    this.categoryList = [
                        {
                            parent_catg_id: false,
                            selected_category: '',
                            categories: this.addLabelInCategories(data.data)
                        }
                    ];
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getSourceAttributes() {
        requests.getRequest('connector/get/getAttributes', { marketplace: this.state.basicDetails.source })
            .then(data => {
                if (data.success) {
                    this.sourceAttributes = [];
                    for (let i = 0; i < data.data.length; i++) {
                        !isUndefined(data.data[i].options)?this.sourceAttributes.push({
                            label: data.data[i].title,
                            value: data.data[i].code,
                            options: data.data[i].options,
                        }):this.sourceAttributes.push({
                            label: data.data[i].title,
                            value: data.data[i].code,
                        });
                    }
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getChildCategories(parentCatg, parentCatgId) {
        requests.getRequest('connector/get/categories', { marketplace: this.state.basicDetails.target, category: parentCatg })
            .then(data => {
                if (data.success) {
                    this.categoryList.push(
                        {
                            parent_catg_id: parentCatgId,
                            selected_category: '',
                            categories: this.addLabelInCategories(data.data)
                        }
                    );
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    addLabelInCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            categories[i]['label'] = categories[i]['code'];
            categories[i]['value'] = categories[i]['code'];
        }
        return categories;
    }

    saveProfileData() {
        let data;
        switch (this.state.activeStep) {
            case 1:
                data = Object.assign({}, this.state.basicDetails);
                requests.postRequest('connector/profile/set', {data: data, step: this.state.activeStep })
                    .then(data => {
                        if (data.success) {
                            notify.success('Step ' + this.state.activeStep + ' completed succesfully.');
                            this.state.activeStep = 2;
                            this.updateState();
                            this.fetchDataForSteptwo();
                        } else {
                            notify.error(data.message);
                        }
                    });
                break;
            case 2:
                data = Object.assign({}, this.state.basicDetails, this.state.products_select);
                requests.postRequest('connector/profile/set', {data: data, step: this.state.activeStep, saveInTable: true})
                    .then(data => {
                        if (data.success) {
                            notify.success('Profile created succesfully');
                                          this.redirect('/panel/profiling');
                            // notify.success('Step ' + this.state.activeStep + ' completed succesfully.');
                            // this.state.activeStep = 3;
                            // this.updateState();
                            // this.fetchDataForStepThree();
                        } else {
                            notify.error(data.message);
                        }
                    });
                break;
            // case 3:
            //     data = Object.assign({}, this.state.basicDetails, this.state.products_select, { attributeMapping: this.state.targetAttributes });
            //     requests.postRequest('connector/profile/set', {data: data, saveInTable: true})
            //         .then(data => {
            //             if (data.success) {
            //                 notify.success('Profile created succesfully');
            //                 this.redirect('/panel/profiling');
            //             } else {
            //                 notify.error(data.message);
            //             }
            //         });
            //     break;
        }
    }

    getImportServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'importer' })
            .then(data => {
                if (data.success === true) {
                    this.importServices = [];
                    let hasService = false;
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            hasService = true;
                            if ( data.data[key].title.toLowerCase() !== 'shopify' ) {
                                this.importServices.push({
                                    label: data.data[key].title,
                                    value: data.data[key].marketplace,
                                    shops: data.data[key].shops
                                });
                            }
                        }
                    }
                    this.state.basicDetails.source !== ''?this.handleBasicDetailsChange('source', this.state.basicDetails.source):null;
                    this.updateState();
                    if (!hasService) {
                    }
                    this.updateState();
                } else {
                    notify.error('You have no available product import service. Please choose a plan.');
                }
            });
    }

    getUploadServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'uploader' })
            .then(data => {
                if (data.success) {
                    this.uploadServices = [];
                    let hasService = false;
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            hasService = true;
                            this.uploadServices.push({
                                label: data.data[key].title,
                                value: data.data[key].marketplace,
                                shops: data.data[key].shops
                            });
                        }
                    }
                    this.handleBasicDetailsChange('target', 'shopifygql');
                    this.updateState();
                    if (!hasService) {
                        notify.info('You have no available product upload service. Please choose a plan for the plan you want to sell product on.');
                    }
                    this.updateState();
                } else {
                    notify.error('You have no available product upload service. Please choose a plan for the plan you want to sell product on.');
                }
            });
    }

    renderQueryBuilder(querySet) {
        return (
            <div className="row">
                {
                    querySet.position === 1 &&
                    this.state.products_select.query !== '' &&
                    <div className="col-12 p-3">
                        <Banner title="Prepared Query" status="info">
                            <Label>{this.state.products_select.query}</Label>
                        </Banner>
                    </div>
                }
                <div className="col-12 p-4">
                    <Card>
                        <Banner title="*Please note" status="info">
                            <Label><h4>{"Add rule corresponds to && (AND) condition"}</h4></Label>
                            <Label><h4>{"Add rule group corresponds to || (OR) condition"}</h4></Label>
                        </Banner>
                        {
                            querySet.primaryQuery.map((query) => {
                                return (
                                    <div key={querySet.primaryQuery.indexOf(query)} className="row p-5">
                                        <div className="col-md-4 col-sm-4 col-6 pt-3">
                                            <Select
                                                label="Attribute"
                                                options={this.sourceAttributes}
                                                placeholder="Select Attribute"
                                                onChange={this.handleQueryBuilderChange.bind(this, querySet.position, querySet.primaryQuery.indexOf(query),'key')}
                                                value={query.key}
                                            />
                                        </div>
                                        <div className="col-md-4 col-sm-4 col-6 pt-3">
                                            <Select
                                                label="Operator"
                                                options={this.filterConditions}
                                                placeholder="Select Operator"
                                                onChange={this.handleQueryBuilderChange.bind(this, querySet.position, querySet.primaryQuery.indexOf(query), 'operator')}
                                                value={query.operator}
                                            />
                                        </div>
                                        <div className="col-md-4 col-sm-4 col-6 pt-3">
                                            {isUndefined(query.options) || query.options.length <= 0?<TextField
                                                label="Value"
                                                value={query.value}
                                                placeholder="Filter Value"
                                                onChange={this.handleQueryBuilderChange.bind(this, querySet.position, querySet.primaryQuery.indexOf(query), 'value')}
                                            />:<Select
                                                label="Value"
                                                options={query.options}
                                                placeholder="Filter Value"
                                                onChange={this.handleQueryBuilderChange.bind(this, querySet.position, querySet.primaryQuery.indexOf(query), 'value')}
                                                onClick={this.handleQueryBuilderChange.bind(this, querySet.position, querySet.primaryQuery.indexOf(query), 'value')}
                                                value={query.value}
                                            />}
                                        </div>
                                        <div className="col-12 text-right pt-3">
                                            {
                                                querySet.primaryQuery.indexOf(query) !== 0 &&
                                                <Button onClick={() => {
                                                    this.handleDeleteRule(querySet.position, querySet.primaryQuery.indexOf(query));
                                                }}>Delete Rule</Button>
                                            }
                                            {
                                                querySet.primaryQuery.indexOf(query) === (querySet.primaryQuery.length - 1) &&
                                                <Button onClick={() => {
                                                    this.handleAddRule(querySet.position);
                                                }} primary>Add Rule</Button>
                                            }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </Card>
                </div>
                {
                    Object.keys(querySet.secondaryQuery).length === 0 &&
                    querySet.position !== 1 &&
                    <div className="col-12 p-2 text-right">
                        <Button onClick={() => {
                            this.handleDeleteGroup(querySet.position);
                        }}>Delete Rule Group</Button>
                    </div>
                }
                {
                    Object.keys(querySet.secondaryQuery).length === 0 &&
                    <div className="col-12 p-2 text-right">
                        <Button onClick={() => {
                            this.handleAddGroup(querySet.position, 'OR');
                        }} primary>Add Rule Group</Button>
                    </div>
                }
                {
                    Object.keys(querySet.secondaryQuery).length > 1 &&
                    <React.Fragment>
                        <div className="col-12">
                            {this.renderQueryBuilder(querySet.secondaryQuery)}
                        </div>
                    </React.Fragment>
                }
            </div>
        );
    }

    handleFilterQueryChange(query) {
        this.state.products_select.query = this.prepareQuery(Object.assign({},query), '');
    }

    prepareQuery(query, preparedQuery) {
        preparedQuery += '(';
        let end = '';
        for (let i = 0; i < query.primaryQuery.length; i++) {
            if (query.primaryQuery[i].key !== '' &&
                query.primaryQuery[i].operator !== '' &&
                query.primaryQuery[i].value !== '') {
                preparedQuery += end + query.primaryQuery[i].key + ' ' + query.primaryQuery[i].operator + ' ' + query.primaryQuery[i].value;
                end = ' && ';
            }
        }
        preparedQuery += ')';
        if (preparedQuery === '()') {
            preparedQuery = '';
        }
        if (Object.keys(query.secondaryQuery).length > 0) {
            const orQuery = this.prepareQuery(query.secondaryQuery, '');
            if (orQuery !== '') {
                preparedQuery += ' || ' + orQuery;
            }
        }
        return preparedQuery;
    }

    handleDeleteRule(position, index) {
        this.state.filterQuery = this.deleteRule(this.state.filterQuery, position, index);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    handleAddRule(position) {
        this.state.filterQuery = this.addRule(this.state.filterQuery, position);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    handleAddGroup(position, condition) {
        this.state.filterQuery = this.addGroup(this.state.filterQuery, position, condition);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    handleDeleteGroup(position) {
        this.state.filterQuery = this.deleteGroup(this.state.filterQuery, position);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    deleteGroup(query, position) {
        if (query.position === position) {
            query = {};
        } else {
            query.secondaryQuery = this.deleteGroup(query.secondaryQuery, position);
        }
        return query;
    }

    addGroup(query, position, condition) {
        if (query.position === position) {
            query.secondaryQuery = {
                primaryQuery: [
                    {
                        key: '',
                        operator: '',
                        value: '',
                    }
                ],
                condition: condition,
                position: position + 1,
                secondaryQuery: {}
            };
        } else {
            query.secondaryQuery = this.addGroup(query.secondaryQuery, position, condition);
        }
        return query;
    }

    deleteRule(query, position, index) {
        if (query.position === position) {
            query.primaryQuery.splice(index, 1);
        } else {
            query.secondaryQuery = this.deleteRule(query.secondaryQuery, position, index);
        }
        return query;
    }

    addRule(query, position) {
        if (query.position === position) {
            query.primaryQuery.push({
                key: '',
                operator: '',
                value: '',
            });
        } else {
            query.secondaryQuery = this.addRule(query.secondaryQuery, position);
        }
        return query;
    }

    handleQueryBuilderChange(position, index, field, value) {
        this.checkForOptions(value);
        this.filteredProducts.runQuery = false;
        if (field === 'key') {
            const options = this.checkForOptions(value);
            if (options !== false) {
                this.state.filterQuery = this.updateQueryFilter(this.state.filterQuery, position, index, field, value, options);
            } else {
                this.state.filterQuery = this.updateQueryFilter(this.state.filterQuery, position, index, field, value);
            }
        } else {
            this.state.filterQuery = this.updateQueryFilter(this.state.filterQuery, position, index, field, value);
        }
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }
    checkForOptions(value) {
        let temp = false;
        this.sourceAttributes.forEach(data => {
            if (data.value === value) {
                if ( !isUndefined(data.options) ) {
                    temp = data.options;
                }
            }
        });
        return temp;
    }

    updateQueryFilter(query, position, index, field, value, options) {
        if (query.position === position) {
            if ( field === 'key' ) {
                query.primaryQuery[index]['value'] = '';
            }
            if ( !isUndefined(options) ) {
                query.primaryQuery[index][field] = value;
                query.primaryQuery[index].options = options;
            } else {
                query.primaryQuery[index][field] = value;
            }
        } else {
            query.secondaryQuery = this.updateQueryFilter(query.secondaryQuery, position, index, field, value, options);
        }
        return query;
    }

    renderProgressBar() {
        return (
            <div className="row bs-wizard" style={{borderBottom: 0}}>

                <div className={(this.state.activeStep === 1) ? 'col-6 bs-wizard-step active' : 'col-6 bs-wizard-step complete'}>
                    <div className="text-center bs-wizard-stepnum">Step 1</div>
                    <div className="progress"><div className="progress-bar"/></div>
                    <a className="bs-wizard-dot"/>
                    <div className="bs-wizard-info text-center">Select product source and Destination</div>
                </div>

                <div className={(this.state.activeStep === 2) ? 'col-6 bs-wizard-step active' : (this.state.activeStep > 2) ? ' col-6 bs-wizard-step complete' : 'col-3 bs-wizard-step disabled'}>
                    <div className="text-center bs-wizard-stepnum">Step 2</div>
                    <div className="progress"><div className="progress-bar"/></div>
                    <a className="bs-wizard-dot"/>
                    <div className="bs-wizard-info text-center">Select products you want to upload</div>
                </div>

                {/*<div className={(this.state.activeStep === 3) ? 'col-4 bs-wizard-step active' : (this.state.activeStep > 3) ? 'col-4 bs-wizard-step complete' : 'col-3 bs-wizard-step disabled'}>*/}
                    {/*<div className="text-center bs-wizard-stepnum">Step 3</div>*/}
                    {/*<div className="progress"><div className="progress-bar"></div></div>*/}
                    {/*<a className="bs-wizard-dot"></a>*/}
                    {/*<div className="bs-wizard-info text-center">Attribute Mapping</div>*/}
                {/*</div>*/}
            </div>
        );
    }

    renderStepOne() {
        return (
            <div className="row">
                <div className="col-12 pt-1 pb-1">
                    <Banner title="General Info" status="info">
                        <Label>Before creating a profile please make sure that you have imported products from the source first. To import your products goto <NavLink to="/panel/import">Import Products</NavLink></Label>
                    </Banner>
                </div>
                <div className="col-12 pt-1 pb-1">
                    <TextField
                        label="Profile Name"
                        placeholder="Enter Profile Name"
                        onChange={this.handleBasicDetailsChange.bind(this, 'name')}
                        value={this.state.basicDetails.name}
                    />
                </div>
                <div className="col-12 pt-1 pb-1">
                    <Select
                        label="Products Imported From"
                        options={this.importServices}
                        placeholder="Product Source"
                        onChange={this.handleBasicDetailsChange.bind(this, 'source')}
                        value={this.state.basicDetails.source}
                    />
                </div>
                {
                    this.state.basicDetails.source !== '' &&
                    this.importShopLists.length > 1 &&
                    <div className="col-12 pt-1 pb-1">
                        <Select
                            label="Shop from which product to send"
                            options={this.importShopLists}
                            onChange={this.handleBasicDetailsChange.bind(this, 'sourceShop')}
                            value={this.state.basicDetails.sourceShop}
                        />
                    </div>
                }
                <div className="col-12 pt-1 pb-1">
                    <Select
                        label="Upload Products To"
                        options={this.uploadServices}
                        placeholder="Product Target"
                        disabled={true}
                        onChange={this.handleBasicDetailsChange.bind(this, 'target')}
                        value={this.state.basicDetails.target}
                    />
                </div>
                {
                    this.state.basicDetails.target !== '' &&
                    this.uploadShopLists.length > 1 &&
                    <div className="col-12 pt-1 pb-1">
                        <Select
                            label="Shop In Which Products Will Be Uploaded"
                            options={this.uploadShopLists}
                            placeholder="Target Shop"
                            onChange={this.handleBasicDetailsChange.bind(this, 'targetShop')}
                            value={this.state.basicDetails.targetShop}
                        />
                    </div>
                }
            </div>
        );
    }

    handleBasicDetailsChange(key, value) {
        this.state.basicDetails[key] = value;
        switch (key) {
            case 'source':
                for (let i = 0; i < this.importServices.length; i++) {
                    if (this.importServices[i].value === value) {
                        this.importShopLists = [];
                        for (let j = 0; j < this.importServices[i].shops.length; j++) {
                            this.importShopLists.push({
                                label: this.importServices[i].shops[j].shop_url,
                                value: this.importServices[i].shops[j].shop_url,
                                shop_id: this.importServices[i].shops[j].id
                            });
                        }
                        this.state.basicDetails.sourceShop = this.importShopLists.length > 0 ? this.importShopLists[0].value : '';
                    }
                }
                break;
            case 'target':
                for (let i = 0; i < this.uploadServices.length; i++) {
                    if (this.uploadServices[i].value === value) {
                        this.uploadShopLists = [];
                        for (let j = 0; j < this.uploadServices[i].shops.length; j++) {
                            this.uploadShopLists.push({
                                label: this.uploadServices[i].shops[j].shop_url,
                                value: this.uploadServices[i].shops[j].shop_url,
                                shop_id: this.uploadServices[i].shops[j].id
                            });
                        }
                        this.state.basicDetails.targetShop = this.uploadShopLists.length > 0 ? this.uploadShopLists[0].value : '';
                    }
                }
                break;
        }
        this.updateState();
    }

    renderStepTwo() {
        return (
            <div className="row">
                {
                    this.state.products_select.marketplaceAttributes.map(attribute => {
                        return (
                            <div className="col-12 pt-1 pb-1" key={this.state.products_select.marketplaceAttributes.indexOf(attribute)}>
                                {
                                    isUndefined(attribute.options) &&
                                    <React.Fragment>
                                        <TextField
                                            placeholder={attribute.title}
                                            label={attribute.title}
                                            onChange={this.handleMarketplaceAttributesChange.bind(this, this.state.products_select.marketplaceAttributes.indexOf(attribute))}
                                            value={attribute.value}
                                        />
                                        {attribute.required?
                                            <div>
                                            <p style={{color:'green'}}>*Required</p>
                                            </div>:null}
                                    </React.Fragment>
                                }
                                {
                                    !isUndefined(attribute.options) &&
                                    attribute.type === 'select' &&
                                    <React.Fragment>
                                        <Select
                                            options={attribute.options}
                                            placeholder={attribute.title}
                                            label={attribute.title}
                                            onChange={this.handleMarketplaceAttributesChange.bind(this, this.state.products_select.marketplaceAttributes.indexOf(attribute))}
                                            value={attribute.value}
                                        />
                                        {attribute.required?
                                            <div>
                                                <p style={{color:'green'}}>*Required</p>
                                            </div>:null}
                                    </React.Fragment>
                                }
                                {
                                    !isUndefined(attribute.options) &&
                                    attribute.type === 'checkbox' &&
                                    <div className="row p-3">
                                        <div className="col-12 p-1">
                                            <Label>{attribute.title}</Label>
                                        </div>
                                        {
                                            attribute.options.map(option => {
                                                return (
                                                    <div className="col-md-6 col-sm-6 col-12 p-1" key={attribute.options.indexOf(option)}>
                                                        <Checkbox
                                                            checked={attribute.value.indexOf(option.value) !== -1}
                                                            label={option.value}
                                                            onChange={this.handleMarketplaceAttributesCheckboxChange.bind(this, this.state.products_select.marketplaceAttributes.indexOf(attribute), attribute.options.indexOf(option))}
                                                        />
                                                    </div>
                                                );
                                            })
                                        }
                                        {attribute.required?
                                            <div className="col-12">
                                                <p style={{color:'green'}}>*Required</p>
                                            </div>:null}
                                    </div>
                                }
                            </div>
                        );
                    })
                }
                <div className="col-12 pt-4">
                    <Label>Select Category In Which You Want To Upload Products</Label>
                </div>
                <div className="col-12 pb-1 pl-4">
                    {this.renderCategoryTree()}
                </div>
                <div className="col-12 pt-1 pb-1">
                    <Label>Prepare Query To Select Products You Want To Upload</Label>
                </div>
                <div className="col-12 pt-1 pb-1">
                    {this.renderQueryBuilder(this.state.filterQuery)}
                </div>
                <div className="col-12 pt-1 pb-1 text-center">
                    {
                        this.state.products_select.query !== '' &&
                        <Button onClick={() => {
                            this.runFilterQuery();
                        }} primary>Run Query</Button>
                    }
                </div>
                {
                    this.filteredProducts.runQuery &&
                    <div className="col-12 pt-2 pb-2">
                        <Banner title="Selected Products Count" status="success">
                            <Label>Total {this.filteredProducts.totalProducts} products selected under this query : {this.state.products_select.query}</Label>
                        </Banner>
                    </div>
                }
            </div>
        );
    }

    handleMarketplaceAttributesCheckboxChange(index, optionIndex, value) {
        let option = this.state.products_select.marketplaceAttributes[index].options[optionIndex].value;
        let optIndex = this.state.products_select.marketplaceAttributes[index].value.indexOf(option);
        if (value) {
            if (optIndex === -1) {
                this.state.products_select.marketplaceAttributes[index].value.push(option);
            }
        } else {
            if (optIndex !== -1) {
                this.state.products_select.marketplaceAttributes[index].value.splice(optIndex, 1);
            }
        }
        this.updateState();
    }

    handleMarketplaceAttributesChange(index, value) {
        this.state.products_select.marketplaceAttributes[index].value = value;
        this.updateState();
    }

    renderCategoryTree() {
        return (
            <div className="row">
                {
                    this.state.products_select.targetCategory !== '' &&
                    <div className="col-12 p-3">
                        <Banner title={"Selected " + capitalizeWord(this.state.basicDetails.target) + " category"} status="info">
                            <Label>{this.state.products_select.targetCategory}</Label>
                        </Banner>
                    </div>
                }
                {
                    this.categoryList.map(category => {
                        return (
                            <div className="col-6 p-3" key={this.categoryList.indexOf(category)}>
                                <Select
                                    options={category.categories}
                                    placeholder="Product Category"
                                    onChange={this.handleProductsSelectChange.bind(this, this.categoryList.indexOf(category))}
                                    value={category.selected_category}
                                />
                                <p style={{color:'green'}}>{category.required?'*Required':null}</p>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    runFilterQuery() {
        if (this.state.products_select.query !== '') {
            requests.postRequest('connector/product/getProductsByQuery', { marketplace: this.state.basicDetails.source, query: this.state.products_select.query, sendCount: true })
                .then(data => {
                    if (data.success) {
                        this.filteredProducts = {
                            runQuery: true,
                            totalProducts: data.data
                        };
                    } else {
                        notify.error(data.message);
                    }
                    this.updateState();
                });
        } else {
            notify.info('Please prepare a custom query to select products');
        }
    }

    handleProductsSelectChange(categoryIndex, value) {
        this.categoryList[categoryIndex].selected_category = value;
        this.state.products_select.targetCategory = value;
        this.categoryList = this.categoryList.splice(0, categoryIndex + 1);
        const parentCatgId = this.checkHasChildCategories(this.categoryList[categoryIndex].categories, value);
        if (parentCatgId) {
            this.getChildCategories(value, parentCatgId);
        } else {
            this.updateState();
        }
    }

    checkHasChildCategories(catgList, parentCatg) {
        for (let i = 0; i < catgList.length; i++) {
            if (catgList[i].value === parentCatg) {
                if (catgList[i].child_exist) {
                    return catgList[i].category_id;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    renderStepThree() {
        return (
            <div className="row">
                <div className="col-12 pt-1 pb-1">
                    <div className="row">
                        <div className="col-6 p-3 text-center">
                            <Label>{capitalizeWord(this.state.basicDetails.target)} Atrributes</Label>
                        </div>
                        <div className="col-6 p-3 text-center">
                            <Label>{capitalizeWord(this.state.basicDetails.source)} Atrributes</Label>
                        </div>
                        <div className="col-12 p-4">
                            {
                                this.state.targetAttributes.map(attribute => {
                                    if (isUndefined(attribute.visible) ||
                                        attribute.visible) {
                                        return (
                                            <div className="row" key={this.state.targetAttributes.indexOf(attribute)}>
                                                <div className="col-6 p-3">
                                                    <DisplayText size="small" className="mt-2 mb-2">{attribute.title}</DisplayText>
                                                    <Label>{attribute.code}</Label>
                                                </div>
                                                <div className="col-6 p-3">
                                                    <Card>
                                                        {
                                                            attribute.required &&
                                                            <div className="w-100 text-right">
                                                                <strong>*</strong>
                                                            </div>
                                                        }
                                                        <div className="p-3 w-100">
                                                            <Select
                                                                options={this.state.sourceAttributes}
                                                                placeholder={capitalizeWord(this.state.basicDetails.source) + " Attributes"}
                                                                onChange={this.handleMapAttributes.bind(this, this.state.targetAttributes.indexOf(attribute))}
                                                                value={attribute.mappedTo}
                                                                disabled={attribute.system}
                                                            />
                                                        </div>
                                                        {
                                                            !isUndefined(attribute.sourceOptions) &&
                                                            attribute.sourceOptions.length > 0 &&
                                                            <div className="w-100 p-4 text-right">
                                                                <Button onClick={() => {
                                                                    this.showOptionMappingModal(this.state.targetAttributes.indexOf(attribute));
                                                                }} primary>Map Options</Button>
                                                            </div>
                                                        }
                                                        {
                                                            isUndefined(attribute.options) &&
                                                            <div className="p-3 w-100">
                                                                <TextField
                                                                    label="Set Default Value"
                                                                    placeholder={"Default Value For " + attribute.code}
                                                                    value={attribute.defaultValue}
                                                                    onChange={this.handleDefaultValueChange.bind(this, this.state.targetAttributes.indexOf(attribute))}
                                                                />
                                                            </div>
                                                        }
                                                        {
                                                            !isUndefined(attribute.options) &&
                                                            attribute.options.length > 0 &&
                                                            <div className="p-3 w-100">
                                                                <Select
                                                                    label="Set Default Value"
                                                                    options={attribute.options}
                                                                    placeholder={"Default Value For " + attribute.code}
                                                                    value={attribute.defaultValue}
                                                                    onChange={this.handleDefaultValueChange.bind(this, this.state.targetAttributes.indexOf(attribute))}
                                                                />
                                                            </div>
                                                        }
                                                    </Card>
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            }
                        </div>
                        <div className="col-12">
                            {this.renderOptionMappingModal()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderOptionMappingModal() {
        return (
            <Modal
                open={this.showOptionMapping}
                onClose={() => {
                    this.showOptionMapping = false;
                    this.optionMappingIndex = -1;
                    this.optionMapping = {};
                    this.updateState();
                }}
                title="Value Mapping"
                primaryAction={{
                    content: 'Save Mapping',
                    onAction: () => {
                        this.saveOptionMapping();
                    },
                }}
            >
                <Modal.Section>
                        <div className="row">
                            <div className="col-6 text-center">
                                <Label>{this.optionMapping.code} Options</Label>
                            </div>
                            <div className="col-6  text-center">
                                <Label>{this.optionMapping.mappedTo} Options</Label>
                            </div>
                            {
                                !isUndefined(this.optionMapping.options) &&
                                this.optionMapping.options.map(option => {
                                    return (
                                        <React.Fragment key={this.optionMapping.options.indexOf(option)}>
                                            <div className="col-6 p-3">
                                                <Label>{option.code}</Label>
                                            </div>
                                            <div className="col-6 p-3">
                                                <Select
                                                    options={this.optionMapping.sourceOptions}
                                                    placeholder="Target Attribute option"
                                                    onChange={this.handleMapOption.bind(this, this.optionMapping.options.indexOf(option))}
                                                    value={option.mappedTo}
                                                />
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            }
                        </div>
                </Modal.Section>
            </Modal>
        );
    }

    handleDefaultValueChange(index, defaultValue) {
        this.state.targetAttributes[index].defaultValue = defaultValue;
        this.updateState();
    }

    handleMapOption(index, value) {
        this.optionMapping.options[index].mappedTo = value;
        this.updateState();
    }

    saveOptionMapping() {
        this.state.targetAttributes[this.optionMappingIndex] = Object.assign({}, this.optionMapping);
        this.showOptionMapping = false;
        this.optionMapping = {};
        this.optionMappingIndex = -1;
        this.updateState();
    }

    handleMapAttributes(index, attr) {
        this.state.targetAttributes[index].mappedTo = attr;
        if (!isUndefined(this.state.targetAttributes[index].options)) {
            const targetAttr = this.getSelectedTargetAttribute(attr);
            if (!isUndefined(targetAttr.options) && targetAttr.options.length > 0) {
                this.state.targetAttributes[index].sourceOptions = targetAttr.options;
            }
        }
        this.updateState();
    }

    getSelectedTargetAttribute(attr) {
        for (let i = 0; i < this.state.sourceAttributes.length; i++) {
            if (this.state.sourceAttributes[i].value === attr) {
                return this.state.sourceAttributes[i];
            }
        }
    }

    showOptionMappingModal(index) {
        this.optionMapping = this.state.targetAttributes[index];
        this.showOptionMapping = true;
        this.optionMappingIndex = index;
        this.updateState();

    }

    renderNextStepButton() {
        return (
            <React.Fragment>
                {
                    this.state.activeStep < 2 &&
                    <Button onClick={() => {
                        this.saveDataAndMoveToNextStep();
                    }} primary>Save And Move to Next Step</Button>
                }
                {
                    this.state.activeStep === 2 &&
                    <Button onClick={() => {
                        this.saveDataAndMoveToNextStep();
                    }} primary>Create Profile</Button>
                }
            </React.Fragment>
        );
    }

    renderBackStepButton() {
        return (
            <React.Fragment>
                {
                    this.state.activeStep > 1 &&
                    <Button primary onClick={() => {
                        this.moveToPreviousStep();
                    }}>Back</Button>
                }
            </React.Fragment>
        );
    }

    render() {
        return (
            <Page
                primaryAction={{content: 'Back', onClick: () => {
                    this.redirect('/panel/profiling');
                }}}
                title="Create Profile">
                <div className="row">
                    <div className="col-12">
                        <Card>
                            <div className="p-5">
                                {this.renderProgressBar()}
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 mt-4">
                        <Card>
                            <div className="row p-5">
                                <div className="col-12 text-center pt-3 pb-3">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center pt-3 pb-3">
                                            {this.renderBackStepButton()}
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-12 text-md-right text-sm-right text-center pt-3 pb-3">
                                            {this.renderNextStepButton()}
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.activeStep === 1 &&
                                    <div className="col-12 pt-3 pb-3">
                                        {this.renderStepOne()}
                                    </div>
                                }
                                {
                                    this.state.activeStep === 2 &&
                                    <div className="col-12 pt-3 pb-3">
                                        {this.renderStepTwo()}
                                    </div>
                                }
                                {/*{*/}
                                    {/*this.state.activeStep === 3 &&*/}
                                    {/*<div className="col-12 pt-3 pb-3">*/}
                                        {/*{this.renderStepThree()}*/}
                                    {/*</div>*/}
                                {/*}*/}
                                {/*{*/}
                                    {/*this.state.activeStep === 4 &&*/}
                                    {/*<div className="col-12 pt-3 pb-3">*/}
                                        {/*{this.renderStepFour()}*/}
                                    {/*</div>*/}
                                {/*}*/}
                                <div className="col-12 text-center pt-3 pb-3">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center pt-3 pb-3">
                                            {this.renderBackStepButton()}
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-12 text-md-right text-sm-right text-center pt-3 pb-3">
                                            {this.renderNextStepButton()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Page>
        );
    }

    moveToPreviousStep() {
        switch (this.state.activeStep) {
            case 3:
                this.state.activeStep = 2;
                this.fetchDataForSteptwo(true);
                break;
            case 2:
                this.state.products_select.query = '';
                this.state.products_select.targetCategory = '';
                this.state.activeStep = 1;
                this.fetchDataForStepOne();
                break;
        }
    }

    saveDataAndMoveToNextStep() {
        switch (this.state.activeStep) {
            case 1:
                if (this.validateStepOne()) {
                    this.saveProfileData();
                } else {
                    notify.error('Please fill all the required fields.');
                }
                break;
            case 2:
                if (this.validateStepTwo()) {
                    this.saveProfileData();
                } else {
                    notify.error('Please choose product target Location, and add query to select products to upload.');
                }
                break;
            // case 3:
            //     if (this.validateStepThree()) {
            //         this.saveProfileData();
            //     } else {
            //         notify.error('Please map all required attributes first.');
            //     }
            //     break;
        }
        this.updateState();
    }

    validateStepOne() {
        if (this.state.basicDetails.source === '' ||
            this.state.basicDetails.name === '' ||
            this.state.basicDetails.target === '') {
            return false;
        } else {
            return true;
        }
    }

    validateStepTwo() {
        if (this.state.products_select.query === '') {
            return false;
        } else {
            for (let i = 0; i < this.state.products_select.marketplaceAttributes.length; i++) {
                if (this.state.products_select.marketplaceAttributes[i].required &&
                    this.state.products_select.marketplaceAttributes[i].value === '') {
                    return false;
                }
            }
            return true;
        }
    }

    validateStepThree() {
        for (let i = 0; i < this.state.targetAttributes.length; i++) {
            if (this.state.targetAttributes[i].required &&
                this.state.targetAttributes[i].mappedTo === '' &&
                this.state.targetAttributes[i].defaultValue === '' &&
                !isUndefined(this.state.targetAttributes[i].visible) &&
                this.state.targetAttributes[i].visible) {
                return false;
            }
        }
        return true;
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}
