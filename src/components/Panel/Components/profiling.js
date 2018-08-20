import React, { Component } from 'react';

import { Page,
         Select,
         Pagination,
         ResourceList,
         Card } from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
import { globalState } from '../../../services/globalstate';
import SmartDataTable from '../../../shared/smart-table';

export class Profiling extends Component {

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
    visibleColumns = ['name', 'source', 'target', 'targetCategory', 'query'];
    columnTitles = {
        name: {
            title: 'Profile Name',
            sortable: true
        },
        source: {
            title: 'Product Import Source',
            sortable: true
        },
        target: {
            title: 'Product Upload Target',
            sortable: true
        },
        targetCategory: {
            title: 'Category',
            sortable: true
        },
        query: {
            title: 'Product Query',
            sortable: true
        }
    };

    constructor() {
        super();
        this.state = {
            profiles: []
        };
        this.getProfiles();
    }

    getProfiles() {
        requests.getRequest('connector/profile/getAllProfiles', Object.assign(this.gridSettings, this.prepareFilterObject()))
            .then(data => {
                if (data.success) {
                    this.state['profiles'] = this.modifyProfilesData(data.data.rows);
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    modifyProfilesData(profiles) {
        let profilesList = [];
        for (let i = 0; i < profiles.length; i++) {
            profilesList.push({
                name: profiles[i].name,
                source: profiles[i].source,
                target: profiles[i].target,
                targetCategory: profiles[i].targetCategory,
                query: profiles[i].query
            });
        }
        return profilesList;
    }

    prepareFilterObject() {
        const filters = {};
        for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
            const key = Object.keys(this.filters.column_filters)[i];
            if (this.filters.column_filters[key].value !== '') {
                filters['filter[' + key + '][' + this.filters.column_filters[key].operator + ']'] = this.filters.column_filters[key].value;
            }
        }
        return filters;
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Profiles'}]}
                primaryAction={{content: 'Create Profile', onClick: () => {
                    this.redirect('/panel/profiling/create');
                }}}
                title="Import Profiles">
                <Card>
                    <SmartDataTable
                        data={this.state.profiles}
                        multiSelect={false}
                        className='ui compact selectable table'
                        visibleColumns={this.visibleColumns}
                        columnTitles={this.columnTitles}
                        showColumnFilters={true}
                        rowActions={{
                            edit: false,
                            delete: false
                        }}
                        columnFilters={(filters) => {
                            this.filters.column_filters = filters;
                            console.log(this.filters);
                            this.getProfiles();
                        }}
                        sortable
                    />
                    <div className="row mt-3">
                        <div className="col-6 text-right">
                            <Pagination
                                hasPrevious
                                onPrevious={() => {
                                    this.gridSettings.activePage--;
                                    this.getProfiles();
                                }}
                                hasNext
                                onNext={() => {
                                    this.gridSettings.activePage++;
                                    this.getProfiles();
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
                </Card>
            </Page>
        );
    }

    pageSettingsChange(event) {
        this.gridSettings.count = event;
        this.gridSettings.activePage = 1;
        this.getProfiles();
    }

    addSearchFilter(searchValue) {
        const state = this.state;
        state.searchValue = searchValue;
        this.setState(state);
        if (searchValue !== null &&
            searchValue !== '') {
            this.filters['title'] = searchValue;
            this.getProfiles();
        }
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}