// Import modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReadMoreReact from "read-more-react";
// Import components
import ErrorBoundary from "./ErrorBoundary";
import TableCell from "./TableCell";
import Toggles from "./Toggles";
import Paginate from "./Paginate";
import $ from "jquery";
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
} from "./functions";
// Import styles
import "./css/basic.css";
import "./css/additional.css";
import { requests } from "../../services/request";
import { isUndefined } from "util";
import Modalsectiondata from "./Modalsectiondata";
// Polaris components
import {
  Scrollable,
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
  TextContainer,
  Tag,
  Thumbnail,
  Badge,
  Modal,
} from "@shopify/polaris";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import Filter from "./filter";
import { request } from "http";
import { disabled } from "glamor";
// import { Modal } from "bootstrap";
// import { Button,Modal } from 'react-bootstrap'

class SmartDataTablePlain extends React.Component {
  allSelected = false;
  filterConditions = [
    { label: "equals", value: "1" },
    { label: "not equals", value: "2" },
    { label: "contains", value: "3" },
    { label: "does not contains", value: "4" },
    { label: "starts with", value: "5" },
    { label: "ends with", value: "6" },
  ];
  filterInt = [
    { label: "equals", value: "1" },
    { label: "not equals", value: "2" },
    { label: "greater than equal to", value: "3" },
    { label: "less than equal to", value: "4" },
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
      // allproduct_typemodal = "",
      colProperties: {},
      sorting: {
        key: "",
        dir: "",
      },
      long_descriptionmodal: "",
      product_typemodal: "",
      typemodal: "",
      primary_category_name: "",
      vendormodal: "",
      imagePosition: 0,
      modalmainImage: "",
      listing_typemodal: "",
      tempImagemodal: [],
      source_marketplacemodal: "",
      active: false,
      Titlemodal: "",
      img: [],
      source_product_idmodal: "",
      pricepro: 0,
      main_imagemodal: "",
      currentPage: 1,
      datamodal: {},
      prductmodalarray: [],
      isLoading: false,
      productallmodal: !isUndefined(props.productallmodal)
        ? props.productallmodal
        : null,
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
            delete: false,
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
      columnFilterNameArray: [],
    };
    // this.handleeditdata=this.handleeditdata.bind(this);
    this.prepareDefaultColumns();
    this.handleChange = this.handleChange.bind(this);
    this.handleupdatemodaldata = this.handleupdatemodaldata.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
    this.handlechangeprice = this.handlechangeprice.bind(this);
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
      this.setState({
        selected: nextProps.selected,
        totalSelected: nextProps.selected.length,
      });
    }
    if (this.state.columnFilters !== nextProps.columnFiltersValue) {
      this.setState({
        columnFilters: Object.assign({}, nextProps.columnFiltersValue),
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
  handledescriptiondata(e) {
    this.setState({
      long_descriptionmodal: e.target.value,
    });
  }
  handleeditdata(row) {
    // console.log(row);
   
    let tempimage = [];
    let temp = this.state;
    requests
      .postRequest("connector/product/getProductById", {
        source_product_id: row.source_variant_id,
      })
      .then((data) => {
        // console.log(data.data);
        // console.log(data.data.details)
        if (data.data.details.long_description != undefined) {
          this.setState({
            long_descriptionmodal: data.data.details.long_description,
          });
        }
      });
    
    let dataobj = this.props.productallmodal;
    // console.log(dataobj);
    let rowdata = [];
    let prodata = [];
    temp.img = [];
    dataobj.forEach((ele) => {
      if (ele.details.source_product_id == row.source_variant_id) {
        // console.log(ele);
        let description = ele.details;
        // console.log(description['additional_images']);
        if (!isUndefined(description["additional_image"]) && description["additional_image"] !== null) {
          Object.keys(description["additional_image"]).forEach(e => {
            if (!isUndefined(description["additional_image"])) {
              temp.img.push(description["additional_image"]);
            }
          });

                  } 
        else if (!isUndefined(description["additional_images"] ) && description["additional_images"] !== null)
         {
          Object.keys(description["additional_images"]).forEach(e => {
            if (!isUndefined(description["additional_images"])) {
              temp.img.push(description["additional_images"]);
            }
          });
        }
        // console.clear();
        this.setState(temp);

        for (let j = 0; j < Object.keys(description).length; j++) {
          if (description["title"] != undefined) {
            this.setState({ Titlemodal: description["title"] });
          }
          if (description["source_product_id"] != undefined) {
            this.setState({
              source_product_idmodal: description["source_product_id"],
            });
          }
          if (description["type"] != undefined) {
            this.setState({ typemodal: description["type"] });
          }
          if (description["vendor"] != undefined) {
            this.setState({ vendormodal: description["vendor"] });
          }
          if (description["listing_type"] != undefined) {
            this.setState({ listing_typemodal: description["listing_type"] });
          }
          if (description["product_type"] != undefined) {
            this.setState({ product_typemodal: description["product_type"] });
          }
          // if (description["additional_images"] != undefined) {
          //   for (
          //     let i = 0;
          //     i < Object.keys(description["additional_images"]).length;
          //     i++
          //   ) {
          //     // console.log(description['additional_images']);
          //     //  tempimage.push(description['additional_images'][i]);
          //     temp.img.push(description["additional_images"]);
          //   }
          //   // console.log(temp.img);
          //   this.setState(temp);
          // }

          if (description["primary_category_name"] != undefined) {
            this.setState({
              primary_category_name: description["primary_category_name"],
            });
          }
        }
        this.setState({ source_marketplacemodal: ele["source_marketplace"] });

        // this.setState({product_typemodal:description['product_type']});
        let objvari = ele.variants;
        for (let i = 0; i < Object.keys(objvari).length; i++) {
          rowdata.push({
            Title: objvari[i]["Title"],
            main_image: objvari[i]["main_image"],
            source_product_id: ele.details.source_product_id,
            price: objvari[i]["price"],
            sku: objvari[i]["sku"],
            quantity: objvari[i]["quantity"],
            source_variant_id: objvari[i]["source_variant_id"],
          });
          this.setState({ pricepro: objvari[i]["price"] });
        }
        prodata.push(rowdata);
      }
    });
    // console.log(prodata);
    this.setState({ active: !this.state.active });
    this.setState({ main_imagemodal: row["main_image"] });
    // this.setState({ modalmainImage: row["main_image"]});
  }
  handleChange() {
    // console.log("Click modal");
    this.setState({ active: !this.state.active });
  }
  handleDeletedata(row) {
    let input = {
      source_product_id: row.source_variant_id,
      shopid:this.props.merchant_id
    };
    let confrimdata=window.confirm("Are you Sure want to delete ");
    
    if(confrimdata){
    $.ajax({
      url:
        "http://importer.sellernext.com/frontend/test/updateVariantsOfScrapping",
      method: "POST",
      data: input,
      success: function(result) {
        console.log(result);
      },
    });
  }
}
  handlechangeprice(e) {
    this.setState({ pricepro: e.target.value });
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
        .then((asyncData) => {
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
  handleupdatemodaldata() {
    // console.log("hii update modal data");
    let protype = $("#protype").val();
    let marketplacemodal = $("#marketplacemodal").val();
    let vensermodalid = $("#vensermodalid").val();
    let typepro = $("#typepro").val();
    let titlemodal = $("#titlemodal").val();
    let source_product_idmodal = $("#source_product_idmodal").text();
    let description = $("#textareamodal").val();
    //  console.log(source_product_idmodal);
    let input = {
      title: titlemodal,
      vender: vensermodalid,
      source_marketplace: marketplacemodal,
      type: typepro,
      product_type: protype,
      source_product_id: source_product_idmodal,
      description: description,
      shop_id:this.props.merchant_id
    };
    $.ajax({
      url:
        "http://importer.sellernext.com/frontend/test/updateVariantsOfScrapping",
      method: "POST",
      data: input,
      success: function(result) {
        console.log(result);
      },
    });
  }
  handletitleedit(e) {
    this.setState({ Titlemodal: e.target.value });
  }
  hadleproduct_type(e) {
    this.setState({ product_typemodal: e.target.value });
  }
  handlevendormodal(e) {
    this.setState({ vendormodal: e.target.value });
  }

  // handletempimage(){
  //  return(<React.Fragment>
  //    {this.state.tempImagemodal.forEach(ele=>{
  //      return(
  //        <div>
  //     <img src={this.state.tempImagemodal[ele]} />
  //     </div>
  //      )
  //   })}
  //  </React.Fragment>)
  // }
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
        dir,
      },
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
  
  handleImageChange = (index) => {
    console.log(index);
    this.setState({ imagePosition: index });
  };
  pressLeftShift() {
    if (this.state.imagePosition != 0) {
      this.setState({
        imagePosition: this.state.imagePosition - 1,
      });
    }
  }
  pressRightShift = (count) => {
    if (this.state.imagePosition < count - 1) {
      this.setState({
        imagePosition: this.state.imagePosition + 1,
      });
    }
  };

  renderHeader(columns) {
    const { colProperties } = this.state;
    const { sortable } = this.props;
    if (columns.length === 0) {
      columns = this.defaultColumns.slice(0);
      this.state.columnFilters = Object.assign({}, this.defaultFilters);
    }
    const headers = columns.map((column) => {
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
                  <div style={{ height: "60px" }}>
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
      // console.log(row);

      // console.log(this.state.showLoaderBar)
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
      <tr
        key={`row-${i}`}
        // onClick={this.props.operations.bind(this, row, "single_row")}
        /*style={{cursor:'pointer'}}*/
      >
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
              <div className="col-12 col-md-5 mt-2">
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
        <td>
          <Button onClick={this.handleeditdata.bind(this, row)} primary id="editbtnmargin">Edit</Button>
          <Button onClick={this.handleDeletedata.bind(this, row)} destructive>
            Delete
          </Button>
        </td>
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
    // console.log(column);
    return (
      <div className="row" style={{ minWidth: "100px", maxWidth: "600px" }}>
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
          style={{ maxWidth: "30px", marginRight: "3px" }}
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
    // console.log(columns);
    return (
      <div className="row">
        {columns.map((column) => {
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
      data: row,
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
    
      
      Object.keys(this.state.columnTitles).forEach((e) => {
        if (this.state.visibleColumns.indexOf(e) !== -1) {
          columns.push({
            key: e,
            title: this.state.columnTitles[e].title,
            visible: true,
            type: this.state.columnTitles[e].type,
            sortable: this.state.columnTitles[e].sortable,
            filterable: true,
          });
        } else {
          columns.push({
            key: e,
            title: this.state.columnTitles[e].title,
            visible: false,
            type: this.state.columnTitles[e].type,
            sortable: this.state.columnTitles[e].sortable,
            filterable: true,
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

  handleFilterEvent = (event) => {
    this.props.singleButtonColumnFilter(event);
    if (!isUndefined(this.props.showLoaderBar)) {
      this.setState({ showLoaderBar: this.props.showLoaderBar });
    }
    this.setState({ columnFilterNameArray: event });
  };

  handleFilterRemove = (data) => {
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
                  columns.forEach((e) => {
                    if (e.type === "int") {
                      this.state.columnFilters[e.key] = {
                        operator: 1,
                        value: "",
                      };
                      this.defaultFilters[e.key] = {
                        operator: 1,
                        value: "",
                      };
                    } else {
                      this.state.columnFilters[e.key] = {
                        operator: this.filterKey,
                        value: "",
                      };
                      this.defaultFilters[e.key] = {
                        operator: this.filterKey,
                        value: "",
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
        <div id="mainmaodalsectioneditbtn">
        <Modal 
          open={this.state.active}
          onClose={this.handleChange}
          title={
            <div className="titlemodalchange">
              <p className="title_header">Parent ID</p>
              <p id="source_product_idmodal">
                {this.state.source_product_idmodal}
              </p>
            </div>
          }
          primaryAction={{
            content: "Update",
            onAction: this.handleupdatemodaldata,
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: this.handleChange,
              
            },
          ]}
        >
          
          <Modal.Section>
            <div className="cardclsmodalsection">
              <label className="modaldatalabel">Description</label>
              <textarea
                type="text"
                name="description"
                id="textareamodal"
                value={this.state.long_descriptionmodal}
                onChange={this.handledescriptiondata.bind(this)}
              />
            </div>
            <form encType="multipart/form-data">
              <div className="productmodaldes">
                <label className="modaldatalabel">Title</label>
                <input
                  value={this.state.Titlemodal}
                  id="titlemodal"
                  onChange={this.handletitleedit.bind(this)}
                  name="source_product_idmodal"
                  type="text"
                />
                <div className="flexclassdiv">
                  <div className="flexunderdiv">
                    <label className="modaldatalabel">Product Type</label>
                    <input
                      value={this.state.product_typemodal}
                      name="product_typemodal"
                      id="protype"
                      type="text"
                      onChange={this.hadleproduct_type.bind(this)}
                    />
                  </div>
                  <div>
                    <label className="modaldatalabel">Type </label>
                    <input
                      value={this.state.typemodal}
                      name="typepro"
                      id="typepro"
                      type="text"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flexclassdiv">
                  <div className="flexunderdiv">
                    <label className="modaldatalabel">Vender</label>
                    {this.state.vendormodal ? (
                      <input
                        value={this.state.vendormodal}
                        name="Vender"
                        id="vensermodalid"
                        type="text"
                        onChange={this.handlevendormodal.bind(this)}
                      />
                    ) : (
                      <input
                        value={
                          this.state.vendormodal
                            ? this.state.vendormodal
                            : "disable"
                        }
                        name="Vender"
                        id="vensermodalid"
                        type="text"
                        readOnly
                      />
                    )}
                  </div>
                </div>
                
              </div>
            </form>
            {this.state.img.length > 1 && (
							<div className="col-12 mb-5">
								<span>
									<div className="row p-5 d-flex justify-content-center">
										<div className="col-1 mt-5 pt-5 justify-content-center"
												style={{ cursor: "pointer" }}
												onClick={this.pressLeftShift.bind(this)}
											>
											<span>
												<img style={{height: '35px', width: '35px'}}
													 src={require("../../assets/img/leftShift.png")}/>
											</span>

										</div>
										<div className="col-8 col-sm-4">
											<div className="pb-5">
												<Thumbnail
													// source={this.state.img[this.state.imagePosition]}
													source={this.state.img[0][this.state.imagePosition]}
													alt={""}
													size={"extralarge"}
												/>
												<div className="text-center">
													<p style={{ color: "#585858" }}>
														({this.state.img.length} images)
													</p>
												</div>
											</div>
										</div>
										<div className="col-1 mt-5 pt-5 justify-content-center"
											 style={{ cursor: "pointer" }}
											 onClick={this.pressRightShift.bind(this,this.state.img.length)}
										>
											<span>
												<img style={{height: '35px', width: '35px'}}
													 src={require("../../assets/img/rigthShift.png")}/>
											</span>

										</div>

										<div className={"col-12"}>
											<div className="row d-flex justify-content-center">
												{this.state.img.map((e, i) => {
													// console.log(this.state.img);
													if (
														this.state.imagePosition < i + 5 &&
														this.state.imagePosition > i - 5
													) {
														// console.log(e)
														// console.log(i)
														// console.log(this.state.img[0][0])
														return (
															<div
																key={i}
																style={{ cursor: "pointer" }}
																className="col-3 col-sm-1 mb-1"
																onClick={this.handleImageChange.bind(this, i)}
															>
																<span>
																	<Thumbnail source={this.state.img[0][i]} alt={""} />
																</span>
																{this.state.imagePosition === i ? (
																	<div className="mt-1 bg-info p-1" />
																) : (
																	<div
																		style={{ color: "#585858" }}
																		className="text-center"
																	>
																		{i + 1}
																	</div>
																)}
															</div>
														);
													}
												})}
											</div>
										</div>
									</div>
								</span>
							</div>
						)}
                        {this.state.img.length == 1 && (
							<div className="col-12 mb-5">
								<span>
									<div className="row p-5 d-flex justify-content-center">
										<div className="col-12 col-sm-5">
											<div className="pb-5 pr-5">
												<Thumbnail
													source={this.state.img[this.state.imagePosition]}
													alt={""}
													size={"extralarge"}
												/>
												<div className="text-center">
													<p style={{ color: "#585858" }}>
														({this.state.img.length} image)
													</p>
												</div>
											</div>
										</div>
										<div className={"col-12"}>
											<div className="row d-flex justify-content-center">
												{this.state.img.map((e, i) => {
                                                    if (
                                                        this.state.imagePosition < i + 5 &&
                                                        this.state.imagePosition > i - 5
                                                    ) {
                                                        return (
															<div
																key={i}
																style={{ cursor: "pointer" }}
																className="col-3 col-sm-1 mb-1"
																onClick={this.handleImageChange.bind(this, i)}
															>
																<span>
																	<Thumbnail source={e} alt={""} />
																</span>
                                                                {this.state.imagePosition === i ? (
																	<div className="mt-1 bg-info p-1" />
                                                                ) : (
																	<div
																		style={{ color: "#585858" }}
																		className="text-center"
																	>
                                                                        {i + 1}
																	</div>
                                                                )}
															</div>
                                                        );
                                                    }
                                                })}
											</div>
										</div>
									</div>
								</span>
							</div>
                        )}
            
          </Modal.Section>
        </Modal>
        </div>
      </div>
    ) : (
      loader
    );
  }
}

// Wrap the component with an Error Boundary
const SmartDataTable = (props) => (
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
  loader: PropTypes.node,
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
  loader: null,
};

export default SmartDataTable;
