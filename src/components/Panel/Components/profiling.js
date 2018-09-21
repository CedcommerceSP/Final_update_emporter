import React, { Component } from 'react';

import { Page,
         Select,
         Pagination,
         Card } from '@shopify/polaris';

import { requests } from '../../../services/request';
import { notify } from '../../../services/notify';
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
    visibleColumns = ['name', 'source', 'target', 'query','profile_id'];
    customButton = ['profile_id']; // button
    hideFilters= ['profile_id'];
    columnTitles = {
        name: {
            title: 'Name',
            sortable: true
        },
        source: {
            title: 'Source',
            sortable: true
        },
        target: {
            title: 'Target',
            sortable: true
        },
        targetCategory: {
            title: 'Category',
            sortable: true
        },
        query: {
            title: 'Query',
            sortable: true
        },
        profile_id: {
            title: 'Detail',
            label:'View', // button Label
            id:'profile_id',
            sortable:false,
        }
    };

    constructor() {
        super();
        this.state = {
            profiles: [],
            totalPage:0
        };
        this.getProfiles();
        this.operations = this.operations.bind(this);
    }
    operations(event, id) {
        switch (id) {
            case 'profile_id':this.redirect('/panel/profiling/view?id=' + event);break;
            default:console.log('Default Case');
        }
    }

    getProfiles() {
        requests.getRequest('connector/profile/getAllProfiles', Object.assign({}, this.gridSettings, this.prepareFilterObject()))
            .then(data => {
                if (data.success) {
                    this.setState({totalPage:data.data.count});
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
                query: profiles[i].query,
                profile_id: profiles[i].profile_id
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
                primaryAction={{content: 'Create Profile', onClick: () => {
                    this.redirect('/panel/profiling/create');
                }}}
                title="Import Profiles">
                <Card>
                    <div className="p-5">
                        <SmartDataTable
                            data={this.state.profiles}
                            multiSelect={false}
                            className='ui compact selectable table'
                            count={this.gridSettings.variantsCount}
                            activePage={this.gridSettings.activePage}
                            visibleColumns={this.visibleColumns}
                            customButton={this.customButton} // button
                            operations={this.operations} //button
                            getVisibleColumns={(event) => {
                                this.visibleColumns = event;
                            }}
                            hideFilters={this.hideFilters}
                            columnTitles={this.columnTitles}
                            showColumnFilters={true}
                            rowActions={{
                                edit: false,
                                delete: false
                            }}
                            columnFilters={(filters) => {
                                this.filters.column_filters = filters;
                                this.getProfiles();
                            }}
                            sortable
                        />
                        <div className="row mt-3">
                            <div className="col-6 text-right">
                                <Pagination
                                    hasPrevious={1 < this.gridSettings.activePage}
                                    onPrevious={() => {
                                        this.gridSettings.activePage--;
                                        this.getProfiles();
                                    }}
                                    hasNext={this.state.totalPage/this.gridSettings.count > this.gridSettings.activePage}
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

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}