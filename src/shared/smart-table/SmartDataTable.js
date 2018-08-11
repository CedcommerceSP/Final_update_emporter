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
    getColumnFilters
} from './functions'
// Import styles
import './css/basic.css'
import './css/additional.css'

import { isUndefined } from 'util';

// Polaris components
import { Checkbox,
         Select,
         TextField,
         Button } from '@shopify/polaris';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

class SmartDataTablePlain extends React.Component {
  allSelected = false;
  filterConditions = [
      {label: 'equals', value: 1},
      {label: 'not equals', value: 2},
      {label: 'contains', value: 3},
      {label: 'does not contains', value: 4},
      {label: 'starts with', value: 5},
      {label: 'ends with', value: 6}
  ];
  defaultColumns = [];
  constructor(props) {
    super(props)

    this.state = {
      asyncData: [],
      colProperties: {},
      sorting: {
        key: '',
        dir: '',
      },
      currentPage: 1,
      isLoading: false,
      multiSelect: isUndefined(props.multiSelect) ? false : props.multiSelect,
      selected: isUndefined(props.selected) ? [] : props.selected,
      columnTitles: isUndefined(props.columnTitles) ? {} : props.columnTitles,
      imageColumns: isUndefined(props.imageColumns) ? [] : props.imageColumns,
      uniqueKey: isUndefined(props.uniqueKey) ? 'id' : props.uniqueKey,
      actions: isUndefined(props.actions) ? [] : props.actions,
      visibleColumns: isUndefined(props.visibleColumns) ? false : props.visibleColumns,
      rowActions: isUndefined(props.rowActions) ? {
        edit: false,
        delete: false
      } : props.rowActions,
      columnFilters: {},
      showColumnFilters: isUndefined(props.showColumnFilters) ? false : props.showColumnFilters
    };
    this.prepareDefaultColumns();
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
    this.handleOnPageClick = this.handleOnPageClick.bind(this);
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
          });
      }
  }

  componentDidMount() {
    this.showWarnings()
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props
    const { data: prevData } = prevProps
    if (typeof data === 'string'
    && (typeof data !== typeof prevData || data !== prevData)) {
      this.fetchData()
    }
  }

  fetchData() {
    const { data, dataKey } = this.props
    if (typeof data === 'string') {
      this.setState({ isLoading: true })
      fetchData(data, dataKey)
        .then(asyncData => this.setState({ asyncData, isLoading: false }))
        .catch(console.log)
    }
  }

  applyColumnFilters(field, key, value) {
    this.state.columnFilters[key][field] = value;
    const state = this.state;
    this.setState(state);
    this.props.columnFilters(this.state.columnFilters);
  }

  showWarnings() {
    const { styled } = this.props
    const styledError = '[SmartDataTable] The styled prop has been deprecated in v0.5 and is no longer valid.'
    if (styled) console.error(styledError)
  }

  handleColumnToggle(key) {
    const { colProperties } = this.state
    if (!colProperties[key]) {
      colProperties[key] = {}
    }
    colProperties[key].invisible = !colProperties[key].invisible
    this.setState({ colProperties })
  }

  handleOnPageClick(nextPage) {
    this.setState({ currentPage: nextPage })
  }

  handleSortChange(column) {
    const { sorting } = this.state
    const { key } = column
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
    const { sorting } = this.state
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
    const { colProperties } = this.state
    const { sortable } = this.props;
    if (columns.length === 0) {
        columns = this.defaultColumns.slice(0);
    }
    const headers = columns.map((column) => {
      const showCol = column.visible;
      if (showCol) {
        return (
          <th key={column.key}>
            <span>
              {column.title}
            </span>
            <span className='rsdt rsdt-sortable'>
              {sortable && column.sortable ? this.renderSorting(column) : null}
            </span>
              {this.state.showColumnFilters && Object.keys(this.state.columnFilters).length > 0 &&
              this.renderColumnFilters(column)}
          </th>
        )
      }
      return null
    })
    return (
      <tr>
          {
              columns.length > 0 && this.state.multiSelect &&
              <th>
                <span>
                  <Checkbox
                      checked={this.allSelected}
                      onChange={this.allRowSelected.bind(this)}>
                  </Checkbox>
                  <span className="d-block" style={{fontSize: '9px'}}>
                      {this.state.selected.length} {this.state.selected.length > 1 ? 'rows' : 'row'} selected
                  </span>
                </span>
              </th>
          }
          {
              (this.state.rowActions.edit || this.state.rowActions.delete) &&
                <th>
                  <span>
                    Action
                  </span>
                </th>
          }
          {headers}
      </tr>
    )
  }

  renderRow(columns, row, i) {
    const { colProperties } = this.state;
    const { withLinks, filterValue } = this.props;
    const columnWithoutColumns = columns.map((column, j) => {
        const thisColProps = colProperties[column.key]
        const showCol = column.visible;
        if (showCol) {
            return (
                <td key={`row-${i}-column-${j}`}>
                    {
                      this.state.imageColumns.indexOf(column.key) !== -1 &&
                      <img src={row[column.key]} style={{width: '100px', height: '100px'}} />
                    }
                    {
                      this.state.imageColumns.indexOf(column.key) === -1 &&
                      <ErrorBoundary>
                        <TableCell withLinks={withLinks} filterValue={filterValue}>
                            {row[column.key]}
                        </TableCell>
                      </ErrorBoundary>
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
            <td>
              <Checkbox
                  checked={this.state.selected.indexOf(row[this.state.uniqueKey]) !== -1}
                  onChange={this.userRowSelect.bind(this, row)}>
              </Checkbox>
            </td>
          }
          {
              (this.state.rowActions.edit || this.state.rowActions.delete) &&
              <td>
                  <span>
                      {this.renderGridRowActions(row)}
                  </span>
              </td>
          }
        {this.renderRow(columns, row, i)}
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
                  <FontAwesomeIcon icon={faEdit} size="sm" color="#3f4eae" onClick={() => {
                      this.props.editRow(row);
                  }}/>
                </li>
            }
            {
                this.state.rowActions.delete &&
                <li className="list-inline-item">
                  <FontAwesomeIcon icon={faTrash} size="sm" color="#3f4eae" onClick={() => {
                      this.props.deleteRow(row);
                  }}/>
                </li>
            }
        </ul>
    );
  }

  renderColumnFilters(column) {
    return (
        <div>
          <div className="mt-1">
            <Select
                options={this.filterConditions}
                value={this.state.columnFilters[column.key].operator}
                onChange={this.applyColumnFilters.bind(this, 'operator', column.key)}
            />
          </div>
          <div className="mt-1">
            <TextField
                placeholder={column.title}
                value={this.state.columnFilters[column.key].value}
                onChange={this.applyColumnFilters.bind(this, 'value', column.key)}>
            </TextField>
          </div>
        </div>
    );
  }

  renderFooter(columns) {
    const { footer } = this.props
    return footer ? this.renderHeader(columns) : null
  }

  renderToggles(columns) {
    const { colProperties } = this.state
    const { withToggles } = this.props
    return withToggles ? (
      <ErrorBoundary>
        <Toggles columns={columns} colProperties={colProperties} handleColumnToggle={this.handleColumnToggle} />
      </ErrorBoundary>
    ) : null
  }

  renderPagination(rows) {
    const { perPage } = this.props
    const { currentPage } = this.state
    return perPage && perPage > 0 ? (
      <ErrorBoundary>
        <Paginate rows={rows} currentPage={currentPage} perPage={perPage} onPageClick={this.handleOnPageClick} />
      </ErrorBoundary>
    ) : null
  }

  renderEnableColumns(columns) {
    return (
        <div className="row">
            {
                columns.map((column) => {
                    return (
                        <div className="col-md-3 col-sm-4 col-6" key={columns.indexOf(column)}>
                          <Checkbox
                              checked={this.state.visibleColumns.indexOf(column.key) !== -1}
                              label={column.title}
                              disabled={this.state.visibleColumns.length < 2}
                              onChange={this.manageVisibleColumns.bind(this, column.key)}></Checkbox>
                        </div>
                    );
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
    const itemIndex = this.state.selected.indexOf(row.id);
    if (event) {
        if (itemIndex === -1) {
            this.state.selected.push(row.id);
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
              this.state.selected.push(rows[i].id);
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
  }

  getColumns() {
    const { asyncData } = this.state;
    const { data } = this.props;
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
    return columns;
  }

  getRows() {
    const { asyncData, sorting } = this.state
    const { data, filterValue } = this.props
    if (typeof data === 'string') {
      return sortData(filterValue, sorting, parseDataForRows(asyncData))
    }
    return sortData(filterValue, sorting, parseDataForRows(data))
  }

  render() {
    const {
      name, className, withHeaders, loader,
    } = this.props;
    const { isLoading } = this.state
    const columns = this.getColumns();
    const rows = this.getRows();
    return !isLoading ? (
      <div>
        <div className="row p-4">
          <div className="col-md-2 col-sm-4 col-4">
              {
                  this.state.actions.length > 0 &&
                  <Select
                      options={this.state.actions}
                      placeholder="Actions"
                      onChange={this.massAction.bind(this)}>
                  </Select>
              }
          </div>
          <div className="offset-md-6 col-md-2 col-sm-4 col-4">
            <Button onClick={() => {
                for (let i = 0; i < Object.keys(this.state.columnFilters).length; i++) {
                    const key = Object.keys(this.state.columnFilters)[i];
                    this.state.columnFilters[key] = {
                        operator: 1,
                        value: ''
                    };
                }
                const state = this.state;
                this.setState(state);
                this.props.columnFilters(this.state.columnFilters);
            }}>Reset Filters</Button>
          </div>
          <div className="col-md-2 col-sm-4 col-4">
              {
                  this.state.visibleColumns &&
                  <div>
                    <Button onClick={() => {
                        document.getElementById('data-toggle-button').click();
                    }} primary>View Columns</Button>
                    <button id="data-toggle-button" data-toggle="collapse" data-target="#column-section" hidden></button>
                  </div>
              }
          </div>
          <div className="col-12 mt-2 mb-2 collapse" id="column-section">
              {
                  this.state.visibleColumns &&
                  this.renderEnableColumns(columns)
              }
          </div>
        </div>
        <div className='rsdt rsdt-container'>
            {this.renderToggles(columns)}
          <table data-table-name={name} className={className}>
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
