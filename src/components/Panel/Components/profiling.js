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

    productsEndpoint = 'http://192.168.0.48:4500/profiles';
    filters = {};
    gridSettings = {
        _page: 1,
        _limit: 5
    };
    pageLimits = [
        {label: 5, value: 5},
        {label: 10, value: 10},
        {label: 15, value: 15},
        {label: 20, value: 20},
        {label: 25, value: 25}
    ];
    massActions = [
        {label: 'Upload', value: 'upload'}
    ];
    visibleColumns = ['id', 'name', 'source', 'target', 'total_products'];

    constructor() {
        super();
        this.state = {
            profiles: [],
            appliedFilters: [],
            searchValue: '',
            selectedProfiles: []
        };
        this.getProfiles();
    }

    getProfiles() {
        requests.getRequest(this.productsEndpoint, this.gridSettings, true)
            .then(data => {
                const state = this.state;
                // data = this.modifyProductsData(data);
                state['profiles'] = data;
                this.setState(state);
            });
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
                    <ResourceList
                        items={this.state.profiles}
                        renderItem={item => {}}
                        filterControl={
                            <ResourceList.FilterControl
                                filters={[]}
                                appliedFilters={this.state.appliedFilters}
                                searchValue={this.state.searchValue}
                                onSearchChange={(searchValue) => {
                                    this.addSearchFilter(searchValue);
                                }}
                                additionalAction={{
                                    content: 'Filter',
                                    onAction: () => this.getProfiles(),
                                }}
                            />
                        }
                    />
                    <SmartDataTable
                        data={this.state.profiles}
                        multiSelect={true}
                        selected={this.state.selectedProfiles}
                        className='ui compact selectable table'
                        withLinks={true}
                        visibleColumns={this.visibleColumns}
                        actions={this.massActions}
                        showColumnFilters={true}
                        rowActions={{
                            edit: false,
                            delete: false
                        }}
                        userRowSelect={(event) => {
                            const itemIndex = this.state.selectedProfiles.indexOf(event.data.id);
                            if (event.isSelected) {
                                if (itemIndex === -1) {
                                    this.state.selectedProfiles.push(event.data.id);
                                }
                            } else {
                                if (itemIndex !== -1) {
                                    this.state.selectedProfiles.splice(itemIndex, 1);
                                }
                            }
                            const state = this.state;
                            this.setState(state);
                        }}
                        allRowSelected={(event, rows) => {
                            this.state.selectedProfiles = [];
                            if (event) {
                                for (let i = 0; i < rows.length; i++) {
                                    this.state.selectedProfiles.push(rows[i].id);
                                }
                            }
                            const state = this.state;
                            this.setState(state);
                        }}
                        massAction={(event) => {
                            console.log(event);
                        }}
                        columnFilters={(filters) => {
                            console.log(filters);
                        }}
                        sortable
                    />
                    <div className="row mt-3">
                        <div className="col-6 text-right">
                            <Pagination
                                hasPrevious
                                onPrevious={() => {
                                    this.gridSettings._page--;
                                    this.getProfiles();
                                }}
                                hasNext
                                onNext={() => {
                                    this.gridSettings._page++;
                                    this.getProfiles();
                                }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-2 col-6">
                            <Select
                                options={this.pageLimits}
                                value={this.gridSettings._limit}
                                onChange={this.pageSettingsChange.bind(this)}>
                            </Select>
                        </div>
                    </div>
                </Card>
            </Page>
        );
    }

    pageSettingsChange(event) {
        this.gridSettings._limit = event;
        this.gridSettings._page = 1;
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

    redirect(url) {
        this.props.history.push(url);
    }
}