// Import modules
import React from 'react'
import PropTypes from 'prop-types'
// Import components
import ErrorBoundary from './ErrorBoundary'
import TableCell from './TableCell'
import Toggles from './Toggles'
import Paginate from './Paginate'
// Import functions
import {
    fetchData,
    parseDataForColumns,
    parseDataForRows,
    parseHeader,
    sortData,
    updateColumnVisibility,
    getColumnFilters,
    columnFilterName,
} from './functions'
// Import styles
import './css/basic.css'
import './css/additional.css'

import { isUndefined } from 'util';

// Polaris components
import {
    Checkbox,
    Select,
    TextField,
    Button,
    Label,
    Icon, SkeletonBodyText, Spinner, SkeletonDisplayText,
    EmptyState, Card, FormLayout, Popover, Tag, DatePicker
} from '@shopify/polaris';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {PageLoader} from "../loader";
import Loader from "react-loader-spinner";

class SmartDataTablePlain extends React.Component {
    allSelected = false;
    filterConditions = [
        {label: 'equals', value: "1"},
        {label: 'not equals', value: "2"},
        {label: 'contains', value: "3"},
        {label: 'does not contains', value: "4"},
        {label: 'starts with', value: "5"},
        {label: 'ends with', value: "6"}
    ];
    filterInt = [
        {label: 'equals', value: "1"},
        {label: 'not equals', value: "2"}
    ];
    defaultColumns = [];
    defaultFilters = {};
    totalSelected = 0;
    stopinterval = '';
    constructor(props) {
        super(props);
        let today_date = new Date();
        this.state = {
            asyncData: [],
            colProperties: {},
            sorting: {
                key: '',
                dir: '',
            },
            currentPage: 1,
            isLoading: false,
            showLoaderBar: !isUndefined(props.showLoaderBar)?props.showLoaderBar:false,
            count: isUndefined(props.count) ? false : props.multiSelect,
            hideResetFilter: isUndefined(props.hideResetFilter) ? false : props.hideResetFilter,
            activePage: isUndefined(props.activePage) ? false : props.multiSelect,
            datePicker: isUndefined(props.datePicker) ? false : props.datePicker,
            vieworderaction: isUndefined(props.vieworderaction) ? false : props.vieworderaction,
            multiSelect: isUndefined(props.multiSelect) ? false : props.multiSelect,
            selected: isUndefined(props.selected) ? [] : props.selected,
            columnTitles: isUndefined(props.columnTitles) ? {} : props.columnTitles,
            imageColumns: isUndefined(props.imageColumns) ? [] : props.imageColumns,
            uniqueKey: isUndefined(props.uniqueKey) ? 'id' : props.uniqueKey,
            actions: isUndefined(props.actions) ? [] : props.actions,
            read_more: isUndefined(props.read_more) ? [] : props.read_more,
            customButton: isUndefined(props.customButton) ? [] : props.customButton,
            hideFilters: isUndefined(props.hideFilters) ? [] : props.hideFilters,
            visibleColumns: isUndefined(props.visibleColumns) ? false : props.visibleColumns,
            rowActions: isUndefined(props.rowActions) ? {
                edit: false,
                delete: false
            } : props.rowActions,
            columnFilters: {},
            showColumnFilters: isUndefined(props.showColumnFilters) ? false : props.showColumnFilters,
            showButtonFilter: isUndefined(props.showButtonFilter) ? false : props.showButtonFilter,
            columnFilterName: columnFilterName(props.columnTitles, props.hideFilters, !isUndefined(props.datePicker)),
            columnFilterNameValue:{name:'',condition:'',value:''},
            columnFilterNameArray:[],
            today: {
                end:new Date(),
                start:new Date(),
            },
            dd: today_date.getDate(),
            mm: today_date.getMonth(), //January is 0!
            yyyy: today_date.getFullYear(),
        };
        this.prepareDefaultColumns();
        this.handleColumnToggle = this.handleColumnToggle.bind(this);
        this.handleOnPageClick = this.handleOnPageClick.bind(this);
        this.stopinterval = setInterval(() => {
            if ( !isUndefined(window.handleOutOfControlLoader) && window.handleOutOfControlLoader ) {
                window.handleOutOfControlLoader = false;
                this.setState({showLoaderBar: false});
            }
        },1000);
    }
    componentWillUnmount() {
        clearInterval(this.stopinterval);
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        if (!isUndefined(nextProps.count) && !isUndefined(nextProps.activePage)) {
            if (nextProps.count !== this.props.count || nextProps.activePage !== this.props.activePage) {
                this.allSelected = false;
                if ( !isUndefined(nextProps.showLoaderBar)) {
                    this.setState({showLoaderBar:true});
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if ( !isUndefined(nextProps.datePicker) ) {
            let columnFilterNameValue = {name:'', condition:'', value:'', isInt: false};
            this.setState({
                columnFilterName: columnFilterName(nextProps.columnTitles, nextProps.hideFilters, nextProps.datePicker),
                columnFilterNameValue: columnFilterNameValue
            });
        }
        if ( !isUndefined(nextProps.multiSelect) ) {
            this.setState({multiSelect: nextProps.multiSelect});
            // setTimeout(() => {
            //     this.setState({showLoaderBar: false});
            // },1000);
        }
        if (!isUndefined(nextProps.selected)) {
            this.state.selected = nextProps.selected;
            this.totalSelected = nextProps.selected.length;
        }
        if ( !isUndefined(nextProps.data) ) {
            if ( this.props.data !== nextProps.data ) {
                this.setState({showLoaderBar:false});
                if (!isUndefined(nextProps.selected)) {
                    let flag = true;
                    nextProps.data.forEach((e,index) => {
                        if ( nextProps.selected.indexOf(e[this.state.uniqueKey]) === -1 ) { flag = false;
                        }
                    });
                    if (flag && nextProps.data.length > 0) { this.allSelected = true }
                }
            }
        }
        if ( !isUndefined(nextProps.hideLoader) ) {
            if ( nextProps.hideLoader ) {
                this.setState({showLoaderBar:false});
            }
        }
    }

    prepareDefaultColumns() {
        this.defaultColumns = [];
        for (let i = 0; i < this.state.visibleColumns.length; i++) {
            this.defaultColumns.push({
                key: this.state.visibleColumns[i],
                title: isUndefined(this.state.columnTitles[this.state.visibleColumns[i]]) ? parseHeader(this.state.visibleColumns[i]) : this.state.columnTitles[this.state.visibleColumns[i]].title,
                visible: true,
                sortable: isUndefined(this.state.columnTitles[this.state.visibleColumns[i]]) ? true : this.state.columnTitles[this.state.visibleColumns[i]].sortable,
                filterable: true,
                // type: isUndefined(this.state.columnTitles[this.state.visibleColumns[i]].type) ? 'string': 'int'
            });
        }
    }

    componentDidMount() {
        this.showWarnings();
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        const {data} = this.props;
        const {data: prevData} = prevProps;
        if (typeof data === 'string'
            && (typeof data !== typeof prevData || data !== prevData)) {
            this.fetchData()
        }
    }

    fetchData() {
        const {data, dataKey} = this.props
        if (typeof data === 'string') {
            this.setState({isLoading: true})
            fetchData(data, dataKey)
                .then(asyncData => this.setState({asyncData, isLoading: false}))
                .catch(console.log)
        }
    }

    applyColumnFilters(field, key, value) {
        this.state.columnFilters[key][field] = value;
        const state = this.state;
        this.setState(state);
        if ( !isUndefined(this.props.showLoaderBar) ) {
            this.setState({showLoaderBar:this.props.showLoaderBar});
        }
        this.defaultFilters = Object.assign({}, this.state.columnFilters);
        this.props.columnFilters(this.state.columnFilters);
    }

    showWarnings() {
        const {styled} = this.props;
        const styledError = '[SmartDataTable] The styled prop has been deprecated in v0.5 and is no longer valid.'
        if (styled) console.error(styledError)
    }

    handleColumnToggle(key) {
        const {colProperties} = this.state
        if (!colProperties[key]) {
            colProperties[key] = {}
        }
        colProperties[key].invisible = !colProperties[key].invisible
        this.setState({colProperties})
    }

    handleOnPageClick(nextPage) {
        this.setState({currentPage: nextPage})
    }

    handleSortChange(column) {
        const {sorting} = this.state
        const {key} = column
        let dir = ''
        if (key !== sorting.key) sorting.dir = ''
        if (sorting.dir) {
            if (sorting.dir === 'ASC') {
                dir = 'DESC'
            } else {
                dir = ''
            }
        } else {
            dir = 'ASC'
        }
        this.setState({
            sorting: {
                key,
                dir,
            },
        })
    }

    renderSorting(column) {
        const {sorting} = this.state
        let sortingIcon = 'rsdt-sortable-icon'
        if (sorting.key === column.key) {
            if (sorting.dir) {
                if (sorting.dir === 'ASC') {
                    sortingIcon = 'rsdt-sortable-asc'
                } else {
                    sortingIcon = 'rsdt-sortable-desc'
                }
            }
        }
        return (
            <i
                className={`rsdt ${sortingIcon}`}
                onClick={() => this.handleSortChange(column)}
                onKeyDown={() => this.handleSortChange(column)}
                role='button'
                tabIndex={0}
            />
        )
    }

    renderHeader(columns) {
        const {colProperties} = this.state
        const {sortable} = this.props;
        if (columns.length === 0) {
            columns = this.defaultColumns.slice(0);
            this.state.columnFilters = Object.assign({}, this.defaultFilters);
        }
        const headers = columns.map((column) => {
            const showCol = column.visible;
            if (showCol) {
                return (
                    <th key={column.key} style={{verticalAlign: 'top'}} className="pl-4">
                        <div style={{'height': '30px'}}>
              <span>
                 {column.title}
              </span>
                            {/*<span className='rsdt rsdt-sortable'>
                             {sortable && column.sortable ? this.renderSorting(column) : null}
                             </span>*/}
                        </div>
                        <div  >
                            {this.state.showColumnFilters && Object.keys(this.state.columnFilters).length > 0 && this.state.hideFilters.indexOf(column.key) === -1 &&
                            <div style={{'height': '50px'}}>
                                {this.renderColumnFilters(column)}
                            </div>}
                        </div>
                    </th>
                )
            }
            return null
        })
        return (
            <tr >
                {
                    columns.length > 0 && this.state.multiSelect &&
                    <td style={{verticalAlign: 'bottom'}}>
                        <span>
                          <Checkbox
                              checked={this.allSelected}
                              onChange={this.allRowSelected.bind(this)}>
                          </Checkbox>
                        </span>
                    </td>
                }
                {
                    (this.state.rowActions.edit || this.state.rowActions.delete) &&
                    <th style={{verticalAlign: 'top'}}>
                          <span>
                            Action
                          </span>
                    </th>
                }
                {headers}
                {
                    (this.state.vieworderaction) &&
                    <td style={{verticalAlign: 'top'}} className="pl-4 text-center">
                      <span>
                        Order Action
                      </span>
                    </td>
                }
            </tr>
        )
    }

    renderRow(columns, row, i) {
        const {colProperties} = this.state;
        const {withLinks, filterValue} = this.props;
        const columnWithoutColumns = columns.map((column, j) => {
            const thisColProps = colProperties[column.key]
            const showCol = column.visible;
            if (showCol) {
                return (
                    this.state.showLoaderBar
                        ?<td key={`row-${i}-column-${j}`}>
                            {this.state.imageColumns.indexOf(column.key) !== -1?
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <Spinner size="small" color="teal" />
                                    </div>
                                </div>
                            :this.state.imageColumns.indexOf(column.key) === -1 && this.state.customButton.indexOf(column.key) !== -1?
                                    <SkeletonDisplayText size="small"/>:
                                    <SkeletonBodyText size="small" lines={2}/>}
                        </td>:
                            this.state.imageColumns.indexOf(column.key) === -1 && this.state.customButton.indexOf(column.key) !== -1 ?<td key={`row-${i}-column-${j}`} className="table-filers">
                                <Button primary
                                        onClick={this.props.operations.bind(this, row[column.key], this.state.columnTitles[column.key].id)}>
                                    {this.state.columnTitles[column.key].label}
                                </Button>
                        </td>:<td key={`row-${i}-column-${j}`} className="table-filers" onClick={this.props.operations.bind(this, row, 'grid')}>
                        {
                            this.state.imageColumns.indexOf(column.key) !== -1 &&
                            <img src={row[column.key]} style={{width: '50px'}}/>
                        }
                        {
                            this.state.imageColumns.indexOf(column.key) === -1 && this.state.read_more.indexOf(column.key) !== -1 &&
                            this.state.customButton.indexOf(column.key) === -1 &&
                            typeof row[column.key] === 'string' ?
                                <div className="scroll">
                                    <span dangerouslySetInnerHTML={{__html: row[column.key]}}/>
                                </div> :
                                this.state.imageColumns.indexOf(column.key) === -1 && this.state.customButton.indexOf(column.key) === -1 &&
                                <Label><ErrorBoundary>
                                    {/*<TableCell withLinks={withLinks} filterValue={filterValue}>*/}
                                    <p style={{overflow: 'hidden',
                                        display: '-webkit-box',
                                        'WebkitLineClamp': '1',
                                        'WebkitBoxOrient': 'vertical'}}
                                    >
                                        {row[column.key]}
                                    </p>
                                    {/*</TableCell>*/}
                                </ErrorBoundary></Label>
                        }
                    </td>
                )
            }
            return null
        });
        return columnWithoutColumns;
    }

    renderBody(columns, rows) {
        const visibleRows = rows;
        const tableRows = visibleRows.map((row, i) => (
            <tr key={`row-${i}`}>
                {
                    this.state.multiSelect &&
                    <td style={{verticalAlign: 'middle'}}>
                        <Checkbox
                            checked={this.state.selected.indexOf(row[this.state.uniqueKey]) !== -1}
                            onChange={this.userRowSelect.bind(this, row)}>
                        </Checkbox>
                    </td>
                }
                {
                    (this.state.rowActions.edit || this.state.rowActions.delete) &&
                    <td style={{verticalAlign: 'middle'}}>
                      <span>
                          {this.renderGridRowActions(row)}
                      </span>
                    </td>
                }
                {this.renderRow(columns, row, i)}
                {
                    (this.state.vieworderaction) &&
                    <td>
                        <div className='row'>
                            <div className="col-12 col-md-6 mt-2">
                                <Button fullWidth primary
                                        disabled={row['all_data.quantity_canceled'] >= row['all_data.quantity_ordered'] ? true : false}
                                        onClick={this.props.operations.bind(this, row, 'cancel')}>Cancel</Button>
                            </div>
                            <div className="col-12 col-md-6 mt-2">
                                <Button fullWidth primary
                                        disabled={row['all_data.quantity_pending'] <= 0 ? true : false}
                                        onClick={this.props.operations.bind(this, row, 'ship')}>Ship</Button>
                            </div>
                        </div>
                    </td>
                }
            </tr>
        ))
        return (
            <tbody>
            {tableRows}
            </tbody>
        )
    }

    renderGridRowActions(row) {
        return (
            <ul className="list-inline actions-list">
                {
                    this.state.rowActions.edit &&
                    <li className="list-inline-item">
                        <FontAwesomeIcon icon={faEdit} size="lg" color="#3f4eae" onClick={() => {
                            this.props.editRow(row);
                        }}/>
                    </li>
                }
                {
                    this.state.rowActions.delete &&
                    <li className="list-inline-item">
                        <FontAwesomeIcon icon={faTrash} size="lg" color="#3f4eae" onClick={() => {
                            this.props.deleteRow(row);
                        }}/>
                    </li>
                }
            </ul>
        );
    }

    renderColumnFilters(column) {
        return (
            <div className="row" style={{minWidth:'100px',maxWidth:'400px'}}>
                <div className="mt-1 col-7 p-0" >
                    <TextField
                        placeholder={column.title}
                        value={this.state.columnFilters[column.key].value}
                        onChange={this.applyColumnFilters.bind(this, 'value', column.key)}/>
                </div>
                <div className="mt-1 col-5 p-0" style={{maxWidth:'35px',marginRight:'3px'}}>
                    <Select
                        options={column.type === 'int'?this.filterInt:this.filterConditions}
                        value={this.state.columnFilters[column.key].operator}
                        onChange={this.applyColumnFilters.bind(this, 'operator', column.key)}
                    />
                </div>
            </div>
        );
    }

    renderFooter(columns) {
        const {footer} = this.props
        return footer ? this.renderHeader(columns) : null
    }

    renderToggles(columns) {
        const {colProperties} = this.state
        const {withToggles} = this.props
        return withToggles ? (
            <ErrorBoundary>
                <Toggles columns={columns} colProperties={colProperties} handleColumnToggle={this.handleColumnToggle}/>
            </ErrorBoundary>
        ) : null
    }

    renderPagination(rows) {
        const {perPage} = this.props
        const {currentPage} = this.state
        return perPage && perPage > 0 ? (
            <ErrorBoundary>
                <Paginate rows={rows} currentPage={currentPage} perPage={perPage} onPageClick={this.handleOnPageClick}/>
            </ErrorBoundary>
        ) : null
    }

    renderEnableColumns(columns) {
        return (
            <div className="row">
                {
                    columns.map((column) => {
                        if (column.key.includes('all_data') == false) {
                            return (
                                <div className="col-md-3 col-sm-4 col-6" key={columns.indexOf(column)}>
                                    <Checkbox
                                        checked={this.state.visibleColumns.indexOf(column.key) !== -1}
                                        label={column.title}
                                        disabled={this.state.visibleColumns.length < 2 && this.state.visibleColumns.indexOf(column.key) != -1}
                                        onChange={this.manageVisibleColumns.bind(this, column.key)}/>
                                </div>
                            );
                        }
                    })
                }
            </div>
        );
    }

    userRowSelect(row, event) {
        const data = {
            isSelected: event,
            data: row
        };
        this.allSelected = false;
        const itemIndex = this.state.selected.indexOf(row[this.state.uniqueKey]);
        if (event) {
            if (itemIndex === -1) {
                this.state.selected.push(row[this.state.uniqueKey]);
            }
        } else {
            if (itemIndex !== -1) {
                this.state.selected.splice(itemIndex, 1);
            }
        }
        const state = this.state;
        this.setState(state);
        this.props.userRowSelect(data);
    }

    allRowSelected(event) {
        this.allSelected = event;
        const rows = this.getRows();
        this.state.selected = [];
        if (event) {
            for (let i = 0; i < rows.length; i++) {
                this.state.selected.push(rows[i][this.state.uniqueKey]);
            }
        }
        const state = this.state;
        this.setState(state);
        this.props.allRowSelected(event, rows);
    }

    massAction(event) {
        this.props.massAction(event);
    }

    manageVisibleColumns(key, event) {
        const keyIndex = this.state.visibleColumns.indexOf(key);
        if (event) {
            if (keyIndex === -1) {
                this.state.visibleColumns.push(key);
            }
        } else {
            if (keyIndex !== -1) {
                this.state.visibleColumns.splice(keyIndex, 1);
            }
        }
        const state = this.state;
        this.setState(state);
        this.props.getVisibleColumns(this.state.visibleColumns);
    }

    getColumns() {
        const {asyncData} = this.state;
        const {data} = this.props;
        if (typeof data === 'string') {
            let columns = parseDataForColumns(asyncData, this.state.columnTitles);
            if (this.state.visibleColumns) {
                columns = updateColumnVisibility(columns, this.state.visibleColumns);
            }
            this.state.columnFilters = getColumnFilters(columns, this.state.columnFilters);
            return columns;
        }
        let columns = parseDataForColumns(data, this.state.columnTitles);
        if (this.state.visibleColumns) {
            columns = updateColumnVisibility(columns, this.state.visibleColumns);
        }
        this.state.columnFilters = getColumnFilters(columns, this.state.columnFilters);
        if (columns.length <= 0) {
            Object.keys(this.state.columnTitles).forEach(e => {
                if (this.state.visibleColumns.indexOf(e) !== -1) {
                    columns.push({
                        key: e,
                        title: this.state.columnTitles[e].title,
                        visible: true,
                        type:this.state.columnTitles[e].type,
                        sortable: this.state.columnTitles[e].sortable,
                        filterable: true
                    })
                } else {
                    columns.push({
                        key: e,
                        title: this.state.columnTitles[e].title,
                        visible: false,
                        type:this.state.columnTitles[e].type,
                        sortable: this.state.columnTitles[e].sortable,
                        filterable: true
                    })
                }
            })
        }
        return columns;
    }

    getRows() {
        const {asyncData, sorting} = this.state;
        const {data, filterValue} = this.props;
        if (typeof data === 'string') {
            return sortData(filterValue, sorting, parseDataForRows(asyncData))
        }
        return sortData(filterValue, sorting, parseDataForRows(data))
    }
    togglePopover = () => {
        this.setState(({active}) => {
            return {active: !active};
        });
    };
    handleButtonFilterChange = (fieldName, value) => {
        let { columnFilterNameValue } = this.state;
        let { columnFilterName } = this.state;
        console.log(columnFilterName);
        columnFilterName.forEach(key => {
            if ( key.value === value ) {
                if ( key.type === 'int' && fieldName === 'name') {
                    columnFilterNameValue.isInt = true;
                    columnFilterNameValue.condition = '';
                } else {
                    columnFilterNameValue.isInt = false;
                }
            }
        });
        columnFilterNameValue[fieldName] = value;
        this.setState({columnFilterNameValue: columnFilterNameValue});
    };
    handleButtonFilterSubmit = () => {
        let { columnFilterNameValue } = this.state;
        let { columnFilterNameArray } = this.state;
        columnFilterNameArray.push(columnFilterNameValue);
        this.props.singleButtonColumnFilter(columnFilterNameArray);
        columnFilterNameValue = {name:'', condition:'', value:'', isInt: false};
        this.setState({
            columnFilterNameValue: columnFilterNameValue,
            columnFilterNameArray: columnFilterNameArray
        });
        if ( !isUndefined(this.props.showLoaderBar) ) {
            this.setState({showLoaderBar:this.props.showLoaderBar});
        }
        this.togglePopover();
    };
    handleFilterRemove = (data) => {
        let { columnFilterNameArray } = this.state;
        columnFilterNameArray.splice(columnFilterNameArray.indexOf(data),1);
        this.props.singleButtonColumnFilter(columnFilterNameArray);
        this.setState({columnFilterNameArray: columnFilterNameArray});
        if ( !isUndefined(this.props.showLoaderBar) ) {
            this.setState({showLoaderBar:this.props.showLoaderBar});
        }
    };
    handleChange = value => {
        let { columnFilterNameValue } = this.state;
        let start = new Date(value.start);
        let end = new Date(value.end);
        let month_start = start.getMonth() + 1;
        let day_start = start.getDate();
        let month_end = end.getMonth() + 1;
        let day_end = end.getDate();
        if ( month_start < 10 ) {
            month_start = '0' + month_start;
        }
        if ( day_start < 10 ) {
            day_start = '0' + day_start;
        }
        if ( month_end < 10 ) {
            month_end = '0' + month_end;
        }
        if ( day_end < 10 ) {
            day_end = '0' + day_end;
        }
        start = start.getFullYear() + '-' + month_start + '-' + day_start;
        end = end.getFullYear() + '-' + month_end + '-' + day_end;
        let query = 'date from ' + start + ' to ' + end;
        columnFilterNameValue['condition'] = start;
        columnFilterNameValue['value'] = end;
        console.log(query);
        this.setState({ today: value ,columnFilterNameValue:columnFilterNameValue});
    };

    handleMonthChange = (month, year) => {
        this.setState({
            mm:month,
            yyyy: year
        });
    };
    render() {
        const {
            name, className, withHeaders, loader,
        } = this.props;
        const {isLoading} = this.state;
        let { columnFilterNameArray } = this.state;
        const columns = this.getColumns();
        const rows = this.getRows();
        return !isLoading ? (
            <div>
                <div className="row p-4">
                    {
                        this.state.actions.length > 0 && this.totalSelected > 0 &&
                        <div className="col-12 col-sm-3 order-2 order-sm-1 mb-sm-0 mb-4">
                            <Select
                                options={this.state.actions}
                                placeholder={"Actions (" + this.totalSelected + ' ' + "selected)"}
                                onChange={this.massAction.bind(this)}>
                            </Select>
                        </div>

                    }
                    <div className="col-6 col-sm-3 order-2 order-sm-1">
                        {this.state.showButtonFilter?<Popover
                            active={this.state.active}
                            activator={<Button onClick={this.togglePopover} disclosure>
                                Filter
                            </Button>}
                            onClose={this.togglePopover}
                        >
                            <Card>
                                <div className="p-3">
                                    <FormLayout>
                                        <Select
                                            label="Title"
                                            placeholder={"Please Select"}
                                            options={this.state.columnFilterName}
                                            value={this.state.columnFilterNameValue.name}
                                            onChange={this.handleButtonFilterChange.bind(this,'name')}
                                        />
                                        {this.state.columnFilterNameValue.name === 'datePicker' ? <DatePicker
                                            month={this.state.mm}
                                            year={this.state.yyyy}
                                            multiMonth={false}
                                            allowRange={true}
                                            selected={this.state.today}
                                            onChange={this.handleChange}
                                            onMonthChange={this.handleMonthChange}
                                        /> :this.state.columnFilterNameValue.name !== '' && <Select
                                            label="Condition"
                                            disabled={this.state.columnFilterNameValue.name === ''}
                                            placeholder={"select contains"}
                                            options={!this.state.columnFilterNameValue.isInt?this.filterConditions:this.filterInt}
                                            value={this.state.columnFilterNameValue.condition}
                                            onChange={this.handleButtonFilterChange.bind(this,'condition')}
                                        />}
                                        {this.state.columnFilterNameValue.name !== 'datePicker' && this.state.columnFilterNameValue.condition !== '' && <TextField
                                            label="Value"
                                            disabled={this.state.columnFilterNameValue.condition === ''}
                                            placeholder={"Enter Value"}
                                            value={this.state.columnFilterNameValue.value}
                                            onChange={this.handleButtonFilterChange.bind(this,'value')}
                                            readOnly={false}/>}
                                        <Button size="slim"
                                                primary
                                                disabled={
                                                this.state.columnFilterNameValue.name === '' ||
                                                this.state.columnFilterNameValue.condition === '' ||
                                                this.state.columnFilterNameValue.value.trim() === ''
                                                }
                                                onClick={this.handleButtonFilterSubmit}
                                        >
                                            Add filter
                                        </Button>
                                    </FormLayout>
                                </div>
                            </Card>
                        </Popover>:null}
                    </div>
                    <div className="col order-1 order-sm-2 d-flex justify-content-sm-end justify-content-start mb-sm-0 mb-4">
                        {this.state.showColumnFilters ? <Button onClick={() => {
                            for (let i = 0; i < Object.keys(this.state.columnFilters).length; i++) {
                                const key = Object.keys(this.state.columnFilters)[i];
                                this.state.columnFilters[key] = {
                                    operator: 1,
                                    value: ''
                                };
                                this.defaultFilters[key] = {
                                    operator: 1,
                                    value: ''
                                };
                            }
                            const state = this.state;
                            this.setState(state);
                            if ( !isUndefined(this.props.showLoaderBar) ) {
                                this.setState({showLoaderBar:true});
                            }
                            this.props.columnFilters(this.state.columnFilters);
                        }}>Reset Filters</Button> : null}
                        {
                            this.state.visibleColumns &&
                            <div className="ml-2">
                                <Button onClick={() => {
                                    document.getElementById('data-toggle-button').click();
                                }} primary>View Columns</Button>
                                <button id="data-toggle-button" data-toggle="collapse" data-target="#column-section"
                                        hidden/>
                            </div>
                        }
                    </div>
                </div>
                <div className="col-12 mb-4">
                    {columnFilterNameArray.map((e, i) => {
                        let condition = 'equals';
                        switch (e.condition) {
                            case '2' : condition = 'not equals';break;
                            case '3' : condition = 'contains';break;
                            case '4' : condition = 'does not contains';break;
                            case '5' : condition = 'start with';break;
                            case '6' : condition = 'end with';break;
                            default : condition = 'equals';
                        }
                        if ( e.name === 'datePicker' ) {
                            condition = 'from ' + e.condition;
                        }
                        return (<React.Fragment key={i}>
                            <span className="mr-3"><Tag onRemove={this.handleFilterRemove.bind(this,e)}>{e.name} {condition} to {e.value}</Tag></span>
                        </React.Fragment>)
                    })}
                </div>
                <div className="col-12 mt-2 mb-2 collapse" id="column-section">
                    {
                        this.state.visibleColumns &&
                        this.renderEnableColumns(columns)
                    }
                </div>
                <div className='rsdt rsdt-container'>
                    {this.renderToggles(columns)}
                    <table data-table-name={name} className={ ` ${className} table-sm table-hover`  } style={{cursor:'pointer'}}>
                        {withHeaders && (
                            <thead>
                            {this.renderHeader(columns)}
                            </thead>
                        )}
                        {this.renderBody(columns, rows)}
                        <tfoot>
                        {this.renderFooter(columns)}
                        </tfoot>
                    </table>
                    <div className="w-75 m-auto">
                        {
                            rows.length === 0 && window.showGridLoader ?
                            <div className="row mt-5 mb-5 p-5">
                                <div className="col-12 mt-5 text-center">
                                    <Loader height="100" width="100" type="Bars" color="#3f4eae" />
                                </div>
                            </div>:
                                rows.length === 0 &&
                            <EmptyState
                                heading="No Data Found"
                                action={{
                                    content: 'Reset Filters', onAction: () => {
                                        for (let i = 0; i < Object.keys(this.state.columnFilters).length; i++) {
                                            const key = Object.keys(this.state.columnFilters)[i];
                                            this.state.columnFilters[key] = {
                                                operator: 1,
                                                value: ''
                                            };
                                            this.defaultFilters[key] = {
                                                operator: 1,
                                                value: ''
                                            };
                                        }
                                        this.props.singleButtonColumnFilter([]);
                                        this.setState({columnFilterNameArray: []});
                                        const state = this.state;
                                        this.setState(state);
                                        this.props.columnFilters(this.state.columnFilters);
                                    }
                                }}
                                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                            >
                            </EmptyState>
                        }
                    </div>
                    {this.renderPagination(rows)}
                </div>
            </div>
        ) : loader
    }
}

// Wrap the component with an Error Boundary
const SmartDataTable = props => (
    <ErrorBoundary>
        <SmartDataTablePlain {...props} />
    </ErrorBoundary>
)

// Defines the type of data expected in each passed prop
SmartDataTablePlain.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]).isRequired,
    dataKey: PropTypes.string,
    columns: PropTypes.array,
    name: PropTypes.string,
    footer: PropTypes.bool,
    sortable: PropTypes.bool,
    withToggles: PropTypes.bool,
    withLinks: PropTypes.bool,
    withHeaders: PropTypes.bool,
    filterValue: PropTypes.string,
    perPage: PropTypes.number,
    className: PropTypes.string,
    loader: PropTypes.node,
}

// Defines the default values for not passing a certain prop
SmartDataTablePlain.defaultProps = {
    dataKey: 'data',
    columns: [],
    name: 'reactsmartdatatable',
    footer: false,
    sortable: false,
    withToggles: false,
    withLinks: false,
    withHeaders: true,
    filterValue: '',
    perPage: 0,
    className: '',
    loader: null,
}

export default SmartDataTable
