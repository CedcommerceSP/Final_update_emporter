import React, { Component } from 'react';

import { Page,
    Card,
    Select,
    Button,
    TextField,
    Label,
    Modal,
    Banner,
    TextContainer,
    DisplayText } from '@shopify/polaris';

import './create-profile.css';

import { notify } from '../../../../services/notify';
import { requests } from '../../../../services/request';
import { isUndefined } from 'util';

export class CreateProfile extends Component {

    sourceAttributes = [
        { label: 'Title', value: 'title' },
        { label: 'Price', value: 'price' },
        { label: 'Sku', value: 'sku' },
        { label: 'Description', value: 'description' }
    ];
    filteredProducts = {
      runQuery: false,
      totalProducts: 0
    };
    productCategories = [
        { label: 'Apparels & Accessories', value: 'Apparels & Accessories' },
        { label: 'Product Handlooms', value: 'Product Handlooms' },
        { label: 'Food Products', value: 'Food Products' }
    ];
    filterConditions = [
        { label: 'Equals', value: '==' },
        { label: 'Not Equals', value: '!=' },
        { label: 'Greater Then', value: '>' },
        { label: 'Less Then', value: '<' },
        { label: 'Greater Then Equal To', value: '>=' },
        { label: 'Less Then Equal To', value: '<=' }
    ];
    optionMapping = {};
    showOptionMapping = false;
    optionMappingIndex = -1;
    categoryList = [];

    tempCatg = [
        {
            category_id: 4,
            title: 'Apparel & Accessories \ Clothes',
            code: 'Apparel & Accessories \ Clothes',
            path: 'Apparel & Accessories \ Clothes',
            label: 'Apparel & Accessories \ Clothes',
            value: 'Apparel & Accessories \ Clothes',
            child_exists: true,
            children: []
        },
        {
            category_id: 5,
            title: 'Arts & Entertainment \ Music',
            code: 'Arts & Entertainment \ Music',
            path: 'Arts & Entertainment \ Music',
            label: 'Arts & Entertainment \ Music',
            value: 'Arts & Entertainment \ Music',
            child_exists: false
        }
    ];

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
                source: '',
                sourceShop: '',
                targetShop: '',
                target: ''
            },
            products_select: {
                query: '',
                targetCategory: ''
            },
            targetAttributes: [
                {
                    code: 'title',
                    mappedTo: '',
                    description: 'Title of the product',
                    defaultValue: '',
                    required: true
                },
                {
                    code: 'sku',
                    mappedTo: '',
                    description: 'Sku of the product',
                    defaultValue: '',
                    required: true
                },
                {
                    code: 'price',
                    mappedTo: '',
                    description: 'Price of the product',
                    defaultValue: '',
                    required: true
                },
                {
                    code: 'size',
                    mappedTo: '',
                    options: [
                        {
                            code: 'small',
                            mappedTo: '',
                            label: 'small',
                            value: 'small'
                        },
                        {
                            code: 'medium',
                            mappedTo: '',
                            label: 'medium',
                            value: 'medium'
                        },
                        {
                            code: 'large',
                            mappedTo: '',
                            label: 'large',
                            value: 'large'
                        },
                        {
                            code: 'x-large',
                            mappedTo: '',
                            label: 'x-large',
                            value: 'x-large'
                        }
                    ],
                    description: 'Size of the product',
                    sourceOptions: [],
                    defaultValue: '',
                    required: false
                }
            ],
            sourceAttributes: [
                {
                    label: 'Title',
                    value: 'Title'
                },
                {
                    label: 'Sku',
                    value: 'Sku'
                },
                {
                    label: 'Price',
                    value: 'Price'
                },
                {
                    label: 'Size',
                    value: 'Size',
                    options: [
                        {
                            label: 's',
                            value: 's'
                        },
                        {
                            label: 'm',
                            value: 'm'
                        },
                        {
                            label: 'l',
                            value: 'l'
                        },
                        {
                            label: 'xl',
                            value: 'xl'
                        }
                    ]
                }
            ]
        };
        this.getProfile();
    }

    getProfile() {
        requests.getRequest('connector/profile/get')
            .then(data => {
                if (data.success) {
                    if (!isUndefined(data.data.step)) {
                        switch (data.data.step) {
                            case 1:
                                this.state.basicDetails.source = data.data.source;
                                this.state.basicDetails.target = data.data.target;
                                this.state.basicDetails.sourceShop = data.data.sourceShop;
                                this.state.basicDetails.targetShop = data.data.targetShop;
                                this.fetchDataForStepOne();
                                break;
                            case 2:
                                this.state.basicDetails.source = data.data.source;
                                this.state.basicDetails.target = data.data.target;
                                this.state.basicDetails.sourceShop = data.data.sourceShop;
                                this.state.basicDetails.targetShop = data.data.targetShop;
                                this.state.products_select.query = data.data.query;
                                this.state.products_select.targetCategory = data.data.targetCategory;
                                break;
                            case 3:
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

    fetchDataForSteptwo() {
        console.log('step two active');
        this.getProductCategories();
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
        switch (this.state.activeStep) {
            case 1:
                const data = Object.assign({}, this.state.basicDetails);
                data['step'] = 1;
                requests.postRequest('connector/profile/set', {data: data})
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
                break;
        }
    }

    getImportServices() {
        requests.getRequest('connector/get/services', { 'filters[type]': 'importer' })
            .then(data => {
                if (data.success === true) {
                    let hasService = false;
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (!data.data[key].usable) {
                            hasService = true;
                            this.importServices.push({
                                label: data.data[key].title,
                                value: data.data[key].marketplace,
                                shops: data.data[key].shops
                            });
                        }
                    }
                    this.updateState();
                    if (!hasService) {
                        notify.error('You have no available product import service. Please choose a plan.');
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
                if (data.success === true) {
                    let hasService = false;
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (!data.data[key].usable) {
                            hasService = true;
                            this.uploadServices.push({
                                label: data.data[key].title,
                                value: data.data[key].marketplace,
                                shops: data.data[key].shops
                            });
                        }
                    }
                    this.updateState();
                    if (!hasService) {
                        notify.error('You have no available product upload service. Please choose a plan for the plan you want to sell product on.');
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
                    <div className="col-12 p-4">
                        <Card>
                            <div className="p-4">
                                <Label>
                                    {this.state.products_select.query}
                                </Label>
                            </div>
                        </Card>
                    </div>
                }
                <div className="col-12 p-4">
                    <Card>
                        {
                            querySet.primaryQuery.map((query) => {
                                return (
                                    <div key={querySet.primaryQuery.indexOf(query)} className="row">
                                        <div className="col-md-4 col-sm-4 col-6 pt-3">
                                            <Select
                                                label="Attribute"
                                                options={this.sourceAttributes}
                                                placeholder="Select Attribute"
                                                onChange={this.handleQueryBuilderChange.bind(this, querySet.position, querySet.primaryQuery.indexOf(query), 'key')}
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
                                            <TextField
                                                label="Value"
                                                value={query.value}
                                                placeholder="Filter Value"
                                                onChange={this.handleQueryBuilderChange.bind(this, querySet.position, querySet.primaryQuery.indexOf(query), 'value')}
                                            />
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
                            this.handleAddGroup(querySet.position, 'OR');
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
        this.state.products_select.query = this.prepareQuery(query, '');
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
            query.secondaryQuery = this.addGroup(query.secondaryQuery, position);
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
                        value: ''
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
                value: ''
            });
        } else {
            query.secondaryQuery = this.addRule(query.secondaryQuery, position);
        }
        return query;
    }

    handleQueryBuilderChange(position, index, field, value) {
        this.state.filterQuery = this.updateQueryFilter(this.state.filterQuery, position, index, field, value);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    updateQueryFilter(query, position, index, field, value) {
        if (query.position === position) {
            query.primaryQuery[index][field] = value;
        } else {
            query.secondaryQuery = this.updateQueryFilter(query.secondaryQuery, position, index, field, value);
        }
        return query;
    }

    renderProgressBar() {
        return (
            <div className="row bs-wizard" style={{borderBottom: 0}}>

                <div className={(this.state.activeStep === 1) ? 'col-4 bs-wizard-step active' : 'col-4 bs-wizard-step complete'}>
                    <div className="text-center bs-wizard-stepnum">Step 1</div>
                    <div className="progress"><div className="progress-bar"></div></div>
                    <a className="bs-wizard-dot"></a>
                    <div className="bs-wizard-info text-center">Select product source and where to upload products</div>
                </div>

                <div className={(this.state.activeStep === 2) ? 'col-4 bs-wizard-step active' : (this.state.activeStep > 2) ? ' col-4 bs-wizard-step complete' : 'col-3 bs-wizard-step disabled'}>
                    <div className="text-center bs-wizard-stepnum">Step 2</div>
                    <div className="progress"><div className="progress-bar"></div></div>
                    <a className="bs-wizard-dot"></a>
                    <div className="bs-wizard-info text-center">Select products you want to upload</div>
                </div>

                <div className={(this.state.activeStep === 3) ? 'col-4 bs-wizard-step active' : (this.state.activeStep > 3) ? 'col-4 bs-wizard-step complete' : 'col-3 bs-wizard-step disabled'}>
                    <div className="text-center bs-wizard-stepnum">Step 3</div>
                    <div className="progress"><div className="progress-bar"></div></div>
                    <a className="bs-wizard-dot"></a>
                    <div className="bs-wizard-info text-center">Attribute Mapping</div>
                </div>
            </div>
        );
    }

    renderStepOne() {
        return (
            <div className="row">
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
                            placeholder="Source Shop"
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
                <div className="col-12 pt-1 pb-1">
                    <Label>Select Category In Which You Want To Upload Products</Label>
                </div>
                <div className="col-12 pt-1 pb-1">
                    {this.renderCategoryTree()}
                </div>
                <div className="col-12 pt-1 pb-1">
                    <Label>Prepare Query To Select Products You Want To Upload</Label>
                </div>
                <div className="col-12 pt-1 pb-1">
                    {this.renderQueryBuilder(this.state.filterQuery)}
                </div>
                <div className="col-12 pt-1 pb-1 text-center">
                    <Button onClick={() => {
                        this.runFilterQuery();
                    }} primary>Run Query</Button>
                </div>
                {
                    this.filteredProducts.runQuery &&
                    <div className="col-12 pt-2 pb-2">
                        <Banner title="Selected Products Count">
                            <Label>Total {this.filteredProducts.totalProducts} products selected under this query : {this.state.products_select.query}</Label>
                        </Banner>
                    </div>
                }
            </div>
        );
    }

    renderCategoryTree() {
        return (
            <div className="row">
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
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    runFilterQuery() {
        if (this.state.products_select.query !== '') {
            this.filteredProducts = {
                runQuery: true,
                totalProducts: 1417
            };
            this.updateState();
        } else {
            notify.info('Please prepare a custom query to select products');
        }
    }

    handleProductsSelectChange(categoryIndex, value) {
        this.categoryList[categoryIndex].selected_category = value;
        this.state.products_select.targetCategory = value;
        this.categoryList.slice(0, categoryIndex + 1);
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
                            <Label>{this.capitalizeWord(this.state.basicDetails.target)} Atrributes</Label>
                        </div>
                        <div className="col-6 p-3 text-center">
                            <Label>{this.capitalizeWord(this.state.basicDetails.source)} Atrributes</Label>
                        </div>
                        <div className="col-12 p-4">
                            {
                                this.state.targetAttributes.map(attribute => {
                                    return (
                                        <div className="row" key={this.state.targetAttributes.indexOf(attribute)}>
                                            <div className="col-6 p-3">
                                                <DisplayText size="small" className="mt-2 mb-2">{attribute.code}</DisplayText>
                                                <Label>Description: {attribute.description}</Label>
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
                                                            placeholder="Target Attribute"
                                                            onChange={this.handleMapAttributes.bind(this, this.state.targetAttributes.indexOf(attribute))}
                                                            value={attribute.mappedTo}
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

    capitalizeWord(string) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
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
                    this.state.activeStep < 3 &&
                    <Button onClick={() => {
                        this.saveDataAndMoveToNextStep();
                    }} primary>Save And Move to Next Step</Button>
                }
                {
                    this.state.activeStep === 3 &&
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
                    <Button onClick={() => {
                        this.moveToPreviousStep();
                    }}>Back</Button>
                }
            </React.Fragment>
        );
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Create Profile'}]}
                primaryAction={{content: 'Back', onClick: () => {
                    this.redirect('/panel/profiling');
                }}}
                title="Create Profile">
                <div className="row">
                    <div className="col-12">
                        <Card>
                            <div className="p-4">
                                {this.renderProgressBar()}
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 p-2">
                        <Card>
                            <div className="row p-4">
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
                                {
                                    this.state.activeStep === 3 &&
                                    <div className="col-12 pt-3 pb-3">
                                        {this.renderStepThree()}
                                    </div>
                                }
                                {
                                    this.state.activeStep === 4 &&
                                    <div className="col-12 pt-3 pb-3">
                                        {this.renderStepFour()}
                                    </div>
                                }
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

    }

    saveDataAndMoveToNextStep() {
        switch (this.state.activeStep) {
            case 1:
                if (this.validateStepOne()) {
                    this.saveProfileData();
                } else {
                    notify.error('Please choose product source, and where to upload product.');
                }
                break;
            case 2:
                if (this.validateStepTwo()) {
                    notify.success('Step ' + this.state.activeStep + ' completed succesfully.');
                    this.state.activeStep = 3;
                } else {
                    notify.error('Please choose product target category, and add query to select products to upload.');
                }
                break;
            case 3:
                if (this.validateStepThree()) {
                    console.log(this.state);
                    notify.success('Profile created succesfully.');
                    this.redirect('/panel/profiling')
                } else {
                    notify.error('Please map all required attributes first.');
                }
                break;
        }
        this.updateState();
    }

    validateStepOne() {
        if (this.state.basicDetails.source === '' ||
            this.state.basicDetails.target === '') {
            return false;
        } else {
            return true;
        }
    }

    validateStepTwo() {
        if (this.state.products_select.targetCategory === '' ||
            this.state.products_select.query === '') {
            return false;
        } else {
            return true;
        }
    }

    validateStepThree() {
        for (let i = 0; i < this.state.targetAttributes.length; i++) {
            if (this.state.targetAttributes[i].required &&
                this.state.targetAttributes[i].mappedTo === '' &&
                this.state.targetAttributes[i].defaultValue === '') {
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