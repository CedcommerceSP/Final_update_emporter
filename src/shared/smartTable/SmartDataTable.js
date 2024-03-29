// Import modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReadMoreReact from "read-more-react";
// Import components
import ErrorBoundary from "./ErrorBoundary";
import TableCell from "./TableCell";
import Toggles from "./Toggles";
import Paginate from "./Paginate";
// Import functions
import {
	fetchData,
	parseDataForColumns,
	parseDataForRows,
	parseHeader,
	sortData,
	updateColumnVisibility,
	getColumnFilters,
	columnFilterName
} from "./functions";
// Import styles
import "./css/basic.css";
import "./css/additional.css";

import { isUndefined } from "util";

// Polaris components
import {
	Checkbox,
	Select,
	TextField,
	Button,
	Label,
	Icon,
	SkeletonBodyText,
	Spinner,
	SkeletonDisplayText,
	Stack,
	EmptyState,
	Card,
	FormLayout,
	Popover,
	Tag,
	Thumbnail,
	Badge
} from "@shopify/polaris";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import Filter from "./filter";

class SmartDataTablePlain extends React.Component {
	allSelected = false;
	filterConditions = [
		{ label: "equals", value: "1" },
		{ label: "not equals", value: "2" },
		{ label: "contains", value: "3" },
		{ label: "does not contains", value: "4" },
		{ label: "starts with", value: "5" },
		{ label: "ends with", value: "6" }
	];
	filterInt = [
		{ label: "equals", value: "1" },
		{ label: "not equals", value: "2"},
		{label: "greater than equal to", value: "3"},
        {label: "less than equal to", value: "4"},

	];
	defaultColumns = [];
	defaultFilters = {};
	totalSelected = 0;
	stopinterval = "";
	filterKey = 3;

	constructor(props) {
		super(props);
		this.state = {
			asyncData: [],
			colProperties: {},
			sorting: {
				key: "",
				dir: ""
			},
			currentPage: 1,
			isLoading: false,
			showLoaderBar: !isUndefined(props.showLoaderBar)
				? props.showLoaderBar
				: false,
			count: isUndefined(props.count) ? false : props.multiSelect,
			hideResetFilter: isUndefined(props.hideResetFilter)
				? false
				: props.hideResetFilter,
			activePage: isUndefined(props.activePage) ? false : props.multiSelect,
			vieworderaction: isUndefined(props.vieworderaction)
				? false
				: props.vieworderaction,
			multiSelect: isUndefined(props.multiSelect) ? false : props.multiSelect,
			selected: isUndefined(props.selected) ? [] : props.selected,
			columnTitles: isUndefined(props.columnTitles) ? {} : props.columnTitles,
			uniqueKey: isUndefined(props.uniqueKey) ? "id" : props.uniqueKey,
			actions: isUndefined(props.actions) ? [] : props.actions,
			hideFilters: isUndefined(props.hideFilters) ? [] : props.hideFilters,
			visibleColumns: isUndefined(props.visibleColumns)
				? false
				: props.visibleColumns,
			marketplace: isUndefined(props.marketplace) ? "all" : props.marketplace,
			rowActions: isUndefined(props.rowActions)
				? {
						edit: false,
						delete: false
				  }
				: props.rowActions,
			columnFilters: isUndefined(props.columnFiltersValue)
				? {}
				: props.columnFiltersValue,
			showColumnFilters: isUndefined(props.showColumnFilters)
				? false
				: props.showColumnFilters,
			showButtonFilter: isUndefined(props.showButtonFilter)
				? false
				: props.showButtonFilter,
			columnFilterName: columnFilterName(props.columnTitles, props.hideFilters),
			predefineFilters: isUndefined(props.predefineFilters)
				? undefined
				: props.predefineFilters,
			columnFilterNameValue: { name: "", condition: "", value: "" },
			columnFilterNameArray: []
		};
		this.prepareDefaultColumns();
		this.handleColumnToggle = this.handleColumnToggle.bind(this);
		this.handleOnPageClick = this.handleOnPageClick.bind(this);
		this.stopinterval = setInterval(() => {
			if (
				!isUndefined(window.handleOutOfControlLoader) &&
				window.handleOutOfControlLoader
			) {
				window.handleOutOfControlLoader = false;
				this.setState({ showLoaderBar: false });
			}
			if (!isUndefined(window.showGridLoader) && window.showGridLoader) {
				this.setState({ showLoaderBar: window.showGridLoader });
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.stopinterval);
	}

	componentWillUpdate(nextProps, nextState, nextContext) {
		if (!isUndefined(nextProps.selected)) {
			this.state.selected = nextProps.selected;
			this.totalSelected = nextProps.selected.length;
		}
		if (!isUndefined(nextProps.count) && !isUndefined(nextProps.activePage)) {
			if (
				nextProps.count !== this.props.count ||
				nextProps.activePage !== this.props.activePage
			) {
				this.allSelected = false;
				if (!isUndefined(nextProps.showLoaderBar)) {
					this.setState({ showLoaderBar: true });
				}
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isUndefined(nextProps.selected)) {
			this.setState({selected:nextProps.selected,totalSelected:nextProps.selected.length});
		}
		if (this.state.columnFilters !== nextProps.columnFiltersValue) {
			this.setState({
				columnFilters: Object.assign({}, nextProps.columnFiltersValue)
			});
			this.defaultFilters = Object.assign({}, nextProps.columnFiltersValue);
		}

		if (!isUndefined(nextProps.marketplace)) {
			this.setState({ marketplace: nextProps.marketplace });
		}

		if (
			nextProps.columnFilterNameArray !== undefined &&
			nextProps.columnFilterNameArray !== this.state.columnFilterNameArray
		) {
			this.setState({ columnFilterNameArray: nextProps.columnFilterNameArray });
		}
		if (!isUndefined(nextProps.data)) {
			if (this.props.data !== nextProps.data) {
				this.setState({ showLoaderBar: false });
				if (!isUndefined(nextProps.selected)) {
					let flag = true;
					nextProps.data.forEach((e, index) => {
						if (nextProps.selected.indexOf(e[this.state.uniqueKey]) === -1) {
							flag = false;
						}
					});
					if (flag && nextProps.data.length > 0) {
						this.allSelected = true;
					}
				}
			}
		}
		if (!isUndefined(nextProps.hideLoader)) {
			if (nextProps.hideLoader) {
				this.setState({ showLoaderBar: false });
			}
		}
	}

	prepareDefaultColumns() {
		this.defaultColumns = [];
		for (let i = 0; i < this.state.visibleColumns.length; i++) {
			this.defaultColumns.push({
				key: this.state.visibleColumns[i],
				title: isUndefined(
					this.state.columnTitles[this.state.visibleColumns[i]]
				)
					? parseHeader(this.state.visibleColumns[i])
					: this.state.columnTitles[this.state.visibleColumns[i]].title,
				visible: true,
				sortable: isUndefined(
					this.state.columnTitles[this.state.visibleColumns[i]]
				)
					? true
					: this.state.columnTitles[this.state.visibleColumns[i]].sortable,
				filterable: true
				// type: isUndefined(this.state.columnTitles[this.state.visibleColumns[i]].type) ? 'string': 'int'
			});
		}
	}

	componentDidMount() {
		this.showWarnings();
		this.fetchData();
	}

	componentDidUpdate(prevProps) {
		const { data } = this.props;
		const { data: prevData } = prevProps;
		if (
			typeof data === "string" &&
			(typeof data !== typeof prevData || data !== prevData)
		) {
			this.fetchData();
		}
	}

	fetchData() {
		const { data, dataKey } = this.props;
		if (typeof data === "string") {
			this.setState({ isLoading: true });
			fetchData(data, dataKey)
				.then(asyncData => {
					this.setState({ asyncData, isLoading: false });
				})
				.catch(console.log);
		}
	}

	applyColumnFilters(field, key, value) {
		// this.state.columnFilters[key][field] = value;
		// const state = this.state;
		// this.setState(state);
		// if ( !isUndefined(this.props.showLoaderBar) ) {
		//     this.setState({showLoaderBar:this.props.showLoaderBar});
		// }
		// this.defaultFilters = Object.assign({}, this.state.columnFilters);
		// this.props.columnFilters(this.state.columnFilters);
		if (!isUndefined(this.props.showLoaderBar)) {
			this.setState({ showLoaderBar: this.props.showLoaderBar });
		}
		this.defaultFilters = Object.assign({}, this.state.columnFilters);
		this.props.columnFilters(this.state.columnFilters);
	}

	applyDelayForColumnFilter(field, key, value) {
		this.state.columnFilters[key][field] = value;
		const state = this.state;
		this.setState(state);
		this.filtersChanged = true;
		setTimeout(() => {
			if (this.filtersChanged) {
				this.applyColumnFilters(field, key, value);
				this.filtersChanged = false;
			}
		}, 2000);
	}

	showWarnings() {
		const { styled } = this.props;
		const styledError =
			"[SmartDataTable] The styled prop has been deprecated in v0.5 and is no longer valid.";
		if (styled) console.error(styledError);
	}

	handleColumnToggle(key) {
		const { colProperties } = this.state;
		if (!colProperties[key]) {
			colProperties[key] = {};
		}
		colProperties[key].invisible = !colProperties[key].invisible;
		this.setState({ colProperties });
	}

	handleOnPageClick(nextPage) {
		this.setState({ currentPage: nextPage });
	}

	handleSortChange(column) {
		const { sorting } = this.state;
		const { key } = column;
		let dir = "";
		if (key !== sorting.key) sorting.dir = "";
		if (sorting.dir) {
			if (sorting.dir === "ASC") {
				dir = "DESC";
			} else {
				dir = "";
			}
		} else {
			dir = "ASC";
		}
		this.setState({
			sorting: {
				key,
				dir
			}
		});
	}

	renderSorting(column) {
		const { sorting } = this.state;
		let sortingIcon = "rsdt-sortable-icon";
		if (sorting.key === column.key) {
			if (sorting.dir) {
				if (sorting.dir === "ASC") {
					sortingIcon = "rsdt-sortable-asc";
				} else {
					sortingIcon = "rsdt-sortable-desc";
				}
			}
		}
		return (
			<i
				className={`rsdt ${sortingIcon}`}
				onClick={() => this.handleSortChange(column)}
				onKeyDown={() => this.handleSortChange(column)}
				role="button"
				tabIndex={0}
			/>
		);
	}

	renderHeader(columns) {
		const { colProperties } = this.state;
		const { sortable } = this.props;
		if (columns.length === 0) {
			columns = this.defaultColumns.slice(0);
			this.state.columnFilters = Object.assign({}, this.defaultFilters);
		}
		const headers = columns.map(column => {
			const showCol = column.visible;
			if (showCol) {
				return (
					<th
						key={column.key}
						style={{ verticalAlign: "top" }}
						className="pl-4"
					>
						<div style={{ height: "30px" }}>
							<span>{column.title}</span>
							{/*<span className='rsdt rsdt-sortable'>
                             {sortable && column.sortable ? this.renderSorting(column) : null}
                             </span>*/}
						</div>
						<div>
							{this.state.showColumnFilters &&
								Object.keys(this.state.columnFilters).length > 0 &&
								this.state.hideFilters.indexOf(column.key) === -1 && (
									<div style={{ height: "50px" }}>
										{this.renderColumnFilters(column)}
									</div>
								)}
						</div>
					</th>
				);
			}
			return null;
		});
		return (
			<tr>
				{columns.length > 0 && this.state.multiSelect && (
					<td style={{ verticalAlign: "bottom" }}>
						<span>
							<Checkbox
								checked={this.allSelected}
								onChange={this.allRowSelected.bind(this)}
							/>
						</span>
					</td>
				)}
				{(this.state.rowActions.edit || this.state.rowActions.delete) && (
					<th style={{ verticalAlign: "top" }}>
						<span>Action</span>
					</th>
				)}
				{headers}
				{this.state.vieworderaction && (
					<td style={{ verticalAlign: "top" }} className="pl-4 text-center">
						<span>Order Action</span>
					</td>
				)}
			</tr>
		);
	}

	renderRow(columns, row, i) {
		const columnWithoutColumns = columns.map((column, j) => {
			const showCol = column.visible;
			const type = column.type;
			if (this.state.showLoaderBar && showCol) {
				switch (type) {
					case "image":
						return (
							<td key={`row-${i}-column-${j}`} style={{ cursor: "pointer" }}>
								<div className="row">
									<div className="col-12 text-center">
										<Spinner size="small" color="teal" />
									</div>
								</div>
							</td>
						);
					case "button":
						return (
							<td key={`row-${i}-column-${j}`}>
								<div>
									<SkeletonDisplayText size="large" />
								</div>
							</td>
						);
					default:
						return (
							<td key={`row-${i}-column-${j}`}>
								<SkeletonBodyText size="small" lines={3} />
							</td>
						);
				}
			}
			if (showCol) {
				switch (type) {
					case "image":
						return (
							<td
								key={`row-${i}-column-${j}`}
								className="table-filers"
								onClick={this.props.operations.bind(this, row, "grid")}
								style={{ cursor: "pointer" }}
							>
								<Thumbnail source={row[column.key]} alt={""} />
							</td>
						);
					case "html":
						return (
							<td key={`row-${i}-column-${j}`} className="table-filers">
								<div className="scroll">
									<span dangerouslySetInnerHTML={{ __html: row[column.key] }} />
								</div>
							</td>
						);
					case "int":
						return (
							<td key={`row-${i}-column-${j}`} className="table-filers">
								<Label>{row[column.key]}</Label>
							</td>
						);
					case "read-more":
						return (
							<td key={`row-${i}-column-${j}`} className="table-filers">
								<Label>
									<ErrorBoundary>
										<ReadMoreReact
											text={row[column.key]}
											min={40}
											ideal={40}
											max={100}
										/>
									</ErrorBoundary>
								</Label>
							</td>
						);
					case "string":
						return (
							<td key={`row-${i}-column-${j}`} className="table-filers">
								<Label>{row[column.key]}</Label>
							</td>
						);
					case "button":
						return (
							<td key={`row-${i}-column-${j}`} className="table-filers">
								<Button
									primary
									onClick={this.props.operations.bind(
										this,
										row[column.key],
										this.state.columnTitles[column.key].id,
										row
									)}
									size={"slim"}
									disabled={row[column.key] === "disable_button"}
								>
									{this.state.columnTitles[column.key].label}
								</Button>
							</td>
						);
					case "react":
						return (
							<td key={`row-${i}-column-${j}`} className="table-filers">
								{row[column.key]}
							</td>
						);
						
					
					default:
						return (
							<td
								key={`row-${i}-column-${j}`}
								className="table-filers"
								onClick={this.props.operations.bind(this, row, "grid")}
							>
								{row[column.key]}
							</td>
						);
				}
			}
			return null;
		});
		return columnWithoutColumns;
	}

	renderBody(columns, rows) {
		const visibleRows = rows;
		const tableRows = visibleRows.map((row, i) => (
			<tr key={`row-${i}`}
				// onClick={this.props.operations.bind(this, row, "single_row")}
				/*style={{cursor:'pointer'}}*/>
				{this.state.multiSelect && (
					<td style={{ verticalAlign: "middle" }}>
						<Checkbox
							checked={
								this.state.selected.indexOf(row[this.state.uniqueKey]) !== -1
							}
							onChange={this.userRowSelect.bind(this, row)}
						/>
					</td>
				)}
				{(this.state.rowActions.edit || this.state.rowActions.delete) && (
					<td style={{ verticalAlign: "middle" }}>
						<span>{this.renderGridRowActions(row)}</span>
					</td>
				)}
				{this.renderRow(columns, row, i)}
				{this.state.vieworderaction && (
					<td>
						<div className="row">
							<div className="col-12 col-md-6 mt-2">
								<Button
									fullWidth
									primary
									disabled={
										row["all_data.quantity_canceled"] >=
										row["all_data.quantity_ordered"]
											? true
											: false
									}
									onClick={this.props.operations.bind(this, row, "cancel")}
								>
									Cancel
								</Button>
							</div>
							<div className="col-12 col-md-6 mt-2">
								<Button
									fullWidth
									primary
									disabled={
										row["all_data.quantity_pending"] <= 0 ? true : false
									}
									onClick={this.props.operations.bind(this, row, "ship")}
								>
									Ship
								</Button>
							</div>
						</div>
					</td>
				)}
			</tr>
		));
		return <tbody>{tableRows}</tbody>;
	}

			renderGridRowActions(row) {
		return (
			<ul className="list-inline actions-list">
				{this.state.rowActions.edit && (
					<li className="list-inline-item">
						<FontAwesomeIcon
							icon={faEdit}
							size="lg"
							color="#3f4eae"
							onClick={() => {
								this.props.editRow(row);
							}}
						/>
					</li>
				)}
				{this.state.rowActions.delete && (
					<li className="list-inline-item">
						<FontAwesomeIcon
							icon={faTrash}
							size="lg"
							color="#3f4eae"
							onClick={() => {
								this.props.deleteRow(row);
							}}
						/>
					</li>
				)}
			</ul>
		);
	}

	renderColumnFilters(column) {
		return (
			<div className="row" style={{ minWidth: "100px", maxWidth: "400px" }}>
				<div className="mt-1 col-7 p-0">
					<TextField
						placeholder={column.title}
						value={this.state.columnFilters[column.key].value}
						onChange={this.applyDelayForColumnFilter.bind(
							this,
							"value",
							column.key
						)}
					/>
				</div>
				<div
					className="mt-1 col-5 p-0"
					style={{ maxWidth: "35px", marginRight: "3px" }}
				>
					<Select
						options={
							column.type === "int" ? this.filterInt : this.filterConditions
						}
						value={this.state.columnFilters[column.key].operator}
						onChange={this.applyDelayForColumnFilter.bind(
							this,
							"operator",
							column.key
						)}
					/>
				</div>
			</div>
		);
	}

	renderFooter(columns) {
		const { footer } = this.props;
		return footer ? this.renderHeader(columns) : null;
	}

	renderToggles(columns) {
		const { colProperties } = this.state;
		const { withToggles } = this.props;
		return withToggles ? (
			<ErrorBoundary>
				<Toggles
					columns={columns}
					colProperties={colProperties}
					handleColumnToggle={this.handleColumnToggle}
				/>
			</ErrorBoundary>
		) : null;
	}

	renderPagination(rows) {
		const { perPage } = this.props;
		const { currentPage } = this.state;
		return perPage && perPage > 0 ? (
			<ErrorBoundary>
				<Paginate
					rows={rows}
					currentPage={currentPage}
					perPage={perPage}
					onPageClick={this.handleOnPageClick}
				/>
			</ErrorBoundary>
		) : null;
	}

	renderEnableColumns(columns) {
		return (
			<div className="row">
				{columns.map(column => {
					if (column.key.includes("all_data") == false) {
						return (
							<div
								className="col-md-3 col-sm-4 col-6"
								key={columns.indexOf(column)}
							>
								<Checkbox
									checked={this.state.visibleColumns.indexOf(column.key) !== -1}
									label={column.title}
									disabled={
										this.state.visibleColumns.length < 2 &&
										this.state.visibleColumns.indexOf(column.key) != -1
									}
									onChange={this.manageVisibleColumns.bind(this, column.key)}
								/>
							</div>
						);
					}
				})}
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
		const { asyncData } = this.state;
		const { data } = this.props;
		if (typeof data === "string") {
			let columns = parseDataForColumns(asyncData, this.state.columnTitles);
			if (this.state.visibleColumns) {
				columns = updateColumnVisibility(columns, this.state.visibleColumns);
			}
			this.state.columnFilters = getColumnFilters(
				columns,
				this.state.columnFilters,
				this.filterKey
			);
			return columns;
		}
		let columns = parseDataForColumns(data, this.state.columnTitles);
		if (this.state.visibleColumns) {
			columns = updateColumnVisibility(columns, this.state.visibleColumns);
		}
		this.state.columnFilters = getColumnFilters(
			columns,
			this.state.columnFilters,
			this.filterKey
		);
		if (columns.length <= 0) {
			Object.keys(this.state.columnTitles).forEach(e => {
				if (this.state.visibleColumns.indexOf(e) !== -1) {
					columns.push({
						key: e,
						title: this.state.columnTitles[e].title,
						visible: true,
						type: this.state.columnTitles[e].type,
						sortable: this.state.columnTitles[e].sortable,
						filterable: true
					});
				} else {
					columns.push({
						key: e,
						title: this.state.columnTitles[e].title,
						visible: false,
						type: this.state.columnTitles[e].type,
						sortable: this.state.columnTitles[e].sortable,
						filterable: true
					});
				}
			});
		}
		return columns;
	}

	getRows() {
		const { asyncData, sorting } = this.state;
		const { data, filterValue } = this.props;
		if (typeof data === "string") {
			return sortData(filterValue, sorting, parseDataForRows(asyncData));
		}
		return sortData(filterValue, sorting, parseDataForRows(data));
	}

	handleFilterEvent = event => {
		this.props.singleButtonColumnFilter(event);
		if (!isUndefined(this.props.showLoaderBar)) {
			this.setState({ showLoaderBar: this.props.showLoaderBar });
		}
		this.setState({ columnFilterNameArray: event });
	};

	handleFilterRemove = data => {
		let { columnFilterNameArray } = this.state;
		columnFilterNameArray.splice(columnFilterNameArray.indexOf(data), 1);
		this.props.singleButtonColumnFilter(columnFilterNameArray);
		this.setState({ columnFilterNameArray: columnFilterNameArray });
		if (!isUndefined(this.props.showLoaderBar)) {
			this.setState({ showLoaderBar: this.props.showLoaderBar });
		}
	};

	render() {
		const { name, className, withHeaders, loader } = this.props;
		const { isLoading } = this.state;
		let { columnFilterNameArray } = this.state;
		const columns = this.getColumns();
		const rows = this.getRows();
		return !isLoading ? (
			<div>
				<div className="row p-4">
					{this.state.actions.length > 0 && this.totalSelected > 0 && (
						<div className="col-12 col-sm-3 order-2 order-sm-1 mb-sm-0 mb-4">
							<Select
								options={this.state.actions}
								placeholder={
									"Actions (" + this.totalSelected + " " + "selected)"
								}
								onChange={this.massAction.bind(this)}
							/>
						</div>
					)}
					<div className="col-6 col-sm-6 order-2 order-sm-1">
						{this.state.showButtonFilter ? (
							<Filter
								marketplace={this.state.marketplace}
								columnFilterName={this.state.columnFilterName}
								predefineFilters={this.state.predefineFilters}
								handleFilterEvent={this.handleFilterEvent}
							/>
						) : null}
					</div>
					<div className="col order-1 order-sm-2 d-flex justify-content-sm-end justify-content-start mb-sm-0 mb-4">
						{this.state.showColumnFilters ? (
							<Button
								onClick={() => {
									// for (let i = 0; i < Object.keys(this.state.columnFilters).length; i++) {
									//     const key = Object.keys(this.state.columnFilters)[i];
									columns.forEach(e => {
										if (e.type === "int") {
											this.state.columnFilters[e.key] = {
												operator: 1,
												value: ""
											};
											this.defaultFilters[e.key] = {
												operator: 1,
												value: ""
											};
										} else {
											this.state.columnFilters[e.key] = {
												operator: this.filterKey,
												value: ""
											};
											this.defaultFilters[e.key] = {
												operator: this.filterKey,
												value: ""
											};
										}
									});
									// }
									const state = this.state;
									this.setState(state);
									if (!isUndefined(this.props.showLoaderBar)) {
										this.setState({ showLoaderBar: true });
									}
									this.props.columnFilters(this.state.columnFilters);
								}}
							>
								Reset Filters
							</Button>
						) : null}
						{this.state.visibleColumns && (
							<div className="ml-2">
								<Button
									onClick={() => {
										document.getElementById("data-toggle-button").click();
									}}
									primary
									icon={"view"}
								>
									Columns
								</Button>
								<button
									id="data-toggle-button"
									data-toggle="collapse"
									data-target="#column-section"
									hidden
								/>
							</div>
						)}
					</div>
				</div>
				<div className="col-12 mb-4">
					{columnFilterNameArray.map((e, i) => {
						let condition = "equals";
						switch (e.condition) {
							case "2":
								condition = "not equals";
								break;
							case "3":
								condition = "contains";
								break;
							case "4":
								condition = "does not contains";
								break;
							case "5":
								condition = "start with";
								break;
							case "6":
								condition = "end with";
								break;
							default:
								condition = "equals";
						}
						if (e.name === "datePicker") {
							condition = "from " + e.condition;
						}
						if (e.name === "uploaded") {
							if (e.value === "1") {
								condition = "Uploaded products";
								return (
									<React.Fragment key={i}>
										<span className="mr-3">
											<Tag onRemove={this.handleFilterRemove.bind(this, e)}>
												{condition}
											</Tag>
										</span>
									</React.Fragment>
								);
							} else {
								condition = "Not Uploaded Products";
								return (
									<React.Fragment key={i}>
										<span className="mr-3">
											<Tag onRemove={this.handleFilterRemove.bind(this, e)}>
												{condition}
											</Tag>
										</span>
									</React.Fragment>
								);
							}
						}
						return (
							<React.Fragment key={i}>
								<span className="mr-3">
									<Tag onRemove={this.handleFilterRemove.bind(this, e)}>
										{e.name} {condition} to {e.value}
									</Tag>
								</span>
							</React.Fragment>
						);
					})}
				</div>
				<div className="col-12 mt-2 mb-2 collapse" id="column-section">
					{this.state.visibleColumns && this.renderEnableColumns(columns)}
				</div>
				<div className="rsdt rsdt-container">
					{this.renderToggles(columns)}
					<table
						data-table-name={name}
						// onClick={this.props.operations.bind(this, rows, "grid")}
						className={` ${className} table-sm table-hover`} /*style={{cursor:'pointer'}}*/
					>
						{withHeaders && <thead>{this.renderHeader(columns)}</thead>}
						{this.renderBody(columns, rows)}
						<tfoot>{this.renderFooter(columns)}</tfoot>
					</table>
					<div className="w-75 m-auto">
						{rows.length === 0 && window.showGridLoader ? (
							<div className="row mt-5 mb-5 p-5">
								<div className="col-12 mt-5 text-center">
									<Loader
										height="100"
										width="100"
										type="Bars"
										color="#3f4eae"
									/>
								</div>
							</div>
						) : (
							rows.length === 0 && (
								<EmptyState
									heading="No Data Found"
									// action={{
									// 	content: "Reset Grid",
									// 	onAction: () => {
									// 		// for (
									// 		// 	let i = 0;
									// 		// 	i < Object.keys(this.state.columnFilters).length;
									// 		// 	i++
									// 		// ) {
									// 		// 	const key = Object.keys(this.state.columnFilters)[i];
									// 		// 	columns.forEach(e => {
									// 		// 		if (e.key === key && e.key === "int") {
									// 		// 			this.state.columnFilters[key] = {
									// 		// 				operator: 1,
									// 		// 				value: ""
									// 		// 			};
									// 		// 			this.defaultFilters[key] = {
									// 		// 				operator: 1,
									// 		// 				value: ""
									// 		// 			};
									// 		// 		} else {
									// 		// 			this.state.columnFilters[key] = {
									// 		// 				operator: this.filterKey,
									// 		// 				value: ""
									// 		// 			};
									// 		// 			this.defaultFilters[key] = {
									// 		// 				operator: this.filterKey,
									// 		// 				value: ""
									// 		// 			};
									// 		// 		}
									// 		// 	});
									// 		// }
									// 		// if (!isUndefined(this.props.singleButtonColumnFilter))
									// 		// 	this.props.singleButtonColumnFilter([]);
									// 		// this.setState({ columnFilterNameArray: [] });
									// 		// const state = this.state;
									// 		// this.setState(state);
									// 		// this.props.columnFilters(this.state.columnFilters);
									// 	}
									// }}
									image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
								/>
							)
						)}
					</div>
					{this.renderPagination(rows)}
				</div>
			</div>
		) : (
			loader
		);
	}
}

// Wrap the component with an Error Boundary
const SmartDataTable = props => (
	<ErrorBoundary>
		<SmartDataTablePlain {...props} />
	</ErrorBoundary>
);

// Defines the type of data expected in each passed prop
SmartDataTablePlain.propTypes = {
	data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
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
	loader: PropTypes.node
};

// Defines the default values for not passing a certain prop
SmartDataTablePlain.defaultProps = {
	dataKey: "data",
	columns: [],
	name: "reactsmartdatatable",
	footer: false,
	sortable: false,
	withToggles: false,
	withLinks: false,
	withHeaders: true,
	filterValue: "",
	perPage: 0,
	className: "",
	loader: null
};

export default SmartDataTable;
