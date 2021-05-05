import React, { Component } from "react";
import { isUndefined } from "util";
import {
  Page,
  Card,
  Select,
  Pagination,
  Label,
  ResourceList,
  Modal,
  TextContainer,
  Tabs,
  Banner,
  Badge,
  Button,
  Icon,
  Thumbnail,
} from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
} from "@fortawesome/free-solid-svg-icons";

import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";

import SmartDataTable from "../../../shared/smartTable";

import { paginationShow } from "./static-functions";
import FileImporter from "./import-component/fileimporter";

import FileImporterBulkUpdate from "./import-component/fileimporterbulkupdate";
const imageExists = require("image-exists");

export class Products extends Component {
  filters = {
    full_text_search: "",
    marketplace: "all",
    single_column_filter: [],
    column_filters: {},
  };

  gridSettings = {
    count: "20",
    activePage: 1,
  };

  pageLimits = [
    { label: 10, value: "10" },
    { label: 20, value: "20" },
    { label: 30, value: "30" },
    { label: 40, value: "40" },
    { label: 50, value: "50" },
    { label: 500, value: "500" },
    { label: 2000, value: "2000" },
  ];

  massActions = [{ label: "Upload", value: "upload" }];

  visibleColumns = [
    "main_image",
    "title",
    "sku",
    "inventory",
    "quantity",
    "upload_status",
    "action_editdelete",
  ];

  predefineFilters = [
    { label: "Title", value: "title", type: "string", special_case: "no" },
    { label: "SKU", value: "sku", type: "string", special_case: "no" },
    {
      label: "ASIN",
      value: "source_variant_id",
      type: "string",
      special_case: "no",
    },
    { label: "Price", value: "price", type: "int", special_case: "no" },
    { label: "Quantity", value: "quantity", type: "int", special_case: "no" },
    { label: "Type", value: "type", type: "type", special_case: "yes" },
    { label: "Country", value: "site", type: "string", special_case: "yes" },
    {
      label: "Date Picker",
      value: "datePicker",
      type: "date-picker",
      special_case: "yes",
    },
    {
      label: "Status",
      value: "uploaded",
      type: "uploaded",
      special_case: "yes",
    },
  ];

  hideFilters = [
    "main_image",
    "long_description",
    "type",
    "upload_status",
    "inventory",
  ];

  columnTitles = {
    main_image: {
      title: "Image",
      sortable: false,
      type: "image",
    },
    title: {
      title: "Title",
      sortable: true,
      type: "string",
    },
    inventory: {
      title: "Inventory",
      type: "int",
      sortable: false,
    },
    type: {
      title: "Type",
      sortable: true,
    },
    source_variant_id: {
      title: "Parent Id",
      sortable: false,
    },
    upload_status: {
      title: "Status",
      sortable: false,
      type: "react",
    },
    action_editdelete: {
      title: "Action",
      id: "action",
      sortable: false,
      
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      productallmodal: [],
      product_grid_collapsible: "",
      tempProductData: [],
      products: [],
      appliedFilters: {},
      installedApps: [],
      selectedApp: 0,
      selectedProducts: [],
      deleteProductData: false,
      toDeleteRow: {},
      totalPage: 0,
      totalMainCount: 0,
      source_product_idmodal:"",
      showLoaderBar: true,
      bulkUpdateModal: false,
      selectedMarketplace: "",
      shownMarketplace: [],
      hideLoader: false,
      siteContry: "",
      imagePosition: 0,
      img: [],
      typemodal:"",
      vendormodal:"",
      currentproduct_id:"",
      product_typemodal:"",
      activemodalsection: false,
      merchant_id: "",
      Titlemodal:"",
      product_id_global:"",
      long_descriptionmodal:"",
      pagination_show: 0,
      selectedUploadModal: false,
      selectUpload: { option: [], value: "" },
      parent_sku: 0,
      child_sku: 0,
      requiredParamNotRecieved: true,
      csvUrl: "",
      uploadcsvModal: false,
    };
    this.handleupdatemodaldata = this.handleupdatemodaldata.bind(this);
    this.handlechangeprice = this.handlechangeprice.bind(this);
    this.handleChange = this.handleChange.bind(this);

    if (
      props.necessaryInfo.account_connected !== undefined &&
      props.necessaryInfo.account_connected.length > 0
    ) {
      setTimeout(() => {
        this.prepareHeader(JSON.parse(JSON.stringify(props)));
      });
    } else {
      setTimeout(() => {
        if (this.state.requiredParamNotRecieved) {
          this.prepareHeader(JSON.parse(JSON.stringify(props)));
        }
      }, 2000);
    }
    // this.handleeditdata=this.handleeditdata.bind(this);
    this.handleDeletedata=this.handleDeletedata.bind(this);
  }

  handleImageChange = (index) => {
    // console.log(index);
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

  handletitleedit(e) {
    this.setState({ Titlemodal: e.target.value });
  }
  hadleproduct_type(e) {
    this.setState({ product_typemodal: e.target.value });
  }
  handlevendormodal(e) {
    this.setState({ vendormodal: e.target.value });
  }
  handledescriptiondata(e) {
    this.setState({
      long_descriptionmodal: e.target.value,
    });
  }

  handleChange() {
    // console.log("Click modal");
    this.setState({ activemodalsection: !this.state.activemodalsection });
  }

  handlechangeprice(e) {
    this.setState({ pricepro: e.target.value });
  }
 

  componentWillReceiveProps(nextPorps) {
    if (
      nextPorps.necessaryInfo !== undefined &&
      this.state.requiredParamNotRecieved &&
      nextPorps.necessaryInfo.account_connected !== undefined
    ) {
      this.setState({ necessaryInfo: nextPorps.necessaryInfo });
      this.prepareHeader(JSON.parse(JSON.stringify(nextPorps)));
      this.setState({ requiredParamNotRecieved: false });
    }
  }

  handleeditproductdata(row) {

    requests
      .postRequest("connector/product/getProductById", {
    	source_product_id: row,
      })
    .then((data) => {
    let temp = this.state;

    temp.img = [];
    if (!isUndefined(data.data.details["additional_image"]) && data.data.details["additional_image"] !== null) {
      Object.keys(data.data.details["additional_image"]).forEach(e => {
        if (!isUndefined(data.data.details["additional_image"])) {
          temp.img.push(data.data.details["additional_image"]);
        }
      });

              } 
    else if (!isUndefined(data.data.details["additional_images"] ) && data.data.details["additional_images"] !== null)
     {
      Object.keys(data.data.details["additional_images"]).forEach(e => {
        if (!isUndefined(data.data.details["additional_images"])) {
          temp.img.push(data.data.details["additional_images"]);
        }
      });
    }
this.setState(temp);  
      if(!isUndefined(data.data.details.source_product_id) && data.data.details.source_product_id !== null){
this.setState({source_product_idmodal:data.data.details.source_product_id});
      
      }
if(!isUndefined(data.data.details.title) && data.data.details.title !== null){
  this.setState({Titlemodal:data.data.details.title});
}
if(!isUndefined(data.data.details.long_description) && data.data.details.long_description !== null){
this.setState({long_descriptionmodal:data.data.details.long_description})
  }
  if(!isUndefined(data.data.details.product_type) && data.data.details.product_type !== null){
    this.setState({product_typemodal:data.data.details.product_type})
      }
    
    if(!isUndefined(data.data.details.type) && data.data.details.type !== null){
      this.setState({typemodal:data.data.details.type})
        }
        if(!isUndefined(data.data.details.vender) && data.data.details.vender !== null){
          this.setState({vendormodal:data.data.details.vender})
            }
      })

this.setState({activemodalsection:!this.state.activemodalsection});
  }

  deletedatasection=(data)=>{
    {
    
      this.setState({currentproduct_id:data})  ;
      confirmAlert({
        title: 'Confirm to Delete This Product ',
        message: 'Are you sure to delete this product ',
        buttons: [
          {
            label: 'Yes',
            style:{"background-color":"red"},
            onClick: this.handleDeletedata,
            
            
          },
          {
            label: 'No',
            onClick: () => console.log()
          }
        ]
      });
    };

  }
  handleupdatemodaldata(){
  
    let input = {
      source_product_id: this.state.source_product_idmodal,
      UserID:this.state.merchant_id,
      long_description:this.state.long_descriptionmodal,
      title:this.state.Titlemodal,
      product_type:this.state.product_typemodal,
      type:this.state.typemodal,
      vendor:this.state.vendormodal
    };
    requests
      .postRequest(
        "frontend/test/updateVariantsOfScrapping",
        input ,false,false 
      )
      .then((response1) => {
       console.log(response1);
      });
  }
  handleDeletedata() {
    // console.log(row);
     let input = {
       source_product_id: this.state.currentproduct_id,
       UserID:this.state.merchant_id
     };
   
     requests
       .postRequest(
         "frontend/test/updateVariantsOfScrapping",
         input  
       )
       .then((response1) => {
        console.log(response1);
       });
     
   }
  prepareHeader = (props) => {
    // console.log(props);
    if (
      !isUndefined(this.props.location) &&
      !isUndefined(this.props.location.state) &&
      Object.keys(this.props.location.state).length > 0
    ) {
      this.manageStateChange(this.props.location.state["parent_props"]);
    } else if (
      props.necessaryInfo.account_connected !== undefined &&
      props.necessaryInfo.account_connected.length > 0
    ) {
      let installedApps = [];
      this.setState({merchant_id:props.necessaryInfo.credits.merchant_id});
      props.necessaryInfo.account_connected.forEach((e) => {
        // console.log(e);
        if (e.code !== "fba") {
          if (e.code == "amazonaffiliate") {
            installedApps.push({
              id: e.code,
              content: "Amazon Dropshipping",
              accessibilityLabel: e.title,
              panelID: e.code,
            });
          } else if (e.code !== "ebayaffiliate") {
            installedApps.push({
              id: e.code,
              content: e.title,
              accessibilityLabel: e.title,
              panelID: e.code,
            });
          } else {
            installedApps.push({
              id: e.code,
              content: "Ebay Dropshipping",
              accessibilityLabel: e.title,
              panelID: e.code,
            });
          }
        }
      });
      this.setState({
        installedApps: installedApps,
        requiredParamNotRecieved: false,
      });
    }

    setTimeout(() => {
      this.handleMarketplaceStateChange(this.state.selectedApp);
    });
  };

  handleSelectedUpload = (arg, val) => {
    // console.log(arg);
    // console.log(val);
    console.log(this.state.selectedProducts);
    switch (arg) {
      case "modalClose":
        this.setState({ selectedUploadModal: false });
        break;
      case "profile":
        this.state.selectUpload.option = [];
        let data = {
          list_ids: this.state.selectedProducts,
        };
        requests.postRequest("frontend/app/getSKUCount", data).then((data) => {
          // console.log(data)
          if (data.success) {
            if (
              !isUndefined(data.data.parent) &&
              !isUndefined(data.data.child)
            ) {
              this.setState({
                selectedUploadModal: true,
                parent_sku: data.data.parent,
                child_sku: data.data.child,
              });
            } else {
              notify.warn("Something Went Wrong.Not Found");
            }
          } else {
            notify.error(data.message);
          }
        });
        break;
      case "Start_Upload":
        requests
          .getRequest(
            "frontend/app/getShopID?marketplace=shopifygql&source=" +
              this.filters.marketplace
          )
          .then((e) => {
            if (e.success) {
              console.log(e);
              let source_shop_id = e.data.source_shop_id;
              let target_shop_id = e.data.target_shop_id;
              requests
                .postRequest("connector/product/selectProductAndUpload", {
                  marketplace: "shopifygql",
                  source: this.filters.marketplace,
                  source_shop_id: source_shop_id,
                  target_shop_id: target_shop_id,
                  selected_profile: this.state.selectUpload.value,
                  selected_products: this.state.selectedProducts,
                })
                .then((data) => {
                  if (data.success) {
                    if (data.code === "product_upload_started") {
                      notify.info(data.message);
                    }
                    setTimeout(() => {
                      this.redirect("/panel/queuedtasks");
                    }, 400);
                  } else {
                    notify.error(data.message);
                  }
                });
            } else {
              notify.error(e.message);
            }
          });
        break;
      case "select":
        let selectUpload = this.state.selectUpload;
        selectUpload.value = val;
        this.setState({ selectUpload: selectUpload });
        break;
      default:
        notify.info("Case Not Exits");
    }
  };

  getProducts = () => {
    // const controller = new AbortController();
    window.showGridLoader = true;
    this.prepareFilterObject();
    const pageSettings = Object.assign({}, this.gridSettings);
    // this.state.appliedFilters['uploaded'] = 0;
    // console.log(this.state.appliedFilters);
    // console.log(this.gridSettings);
    requests
      .getRequest(
        "connector/product/getProducts",
        Object.assign(pageSettings, this.state.appliedFilters),
        false,
        true
      )
      .then((data) => {
        // console.log(data);

        if (data.success) {
          window.showGridLoader = false;
          this.setState({
            totalPage: data.data.count,
            tempProductData: data.data.rows,
          });
          if (!isUndefined(data.data.mainCount)) {
            this.setState({ totalMainCount: data.data.mainCount });
          }
          const products = this.modifyProductsData(data.data.rows, "");
          // console.log(products);
          this.state["products"] = products;
          this.setState({ productallmodal: data.data.rows });
          // console.log(this.state.productallmodal);
          this.state.showLoaderBar = !data.success;
          this.state.hideLoader = data.success;
          this.state.pagination_show = paginationShow(
            this.gridSettings.activePage,
            this.gridSettings.count,
            data.data.count,
            true
          );
          this.updateState();
        } else {
          this.setState({
            showLoaderBar: false,
            hideLoader: true,
            pagination_show: paginationShow(0, 0, 0, false),
          });
          window.showGridLoader = false;
          setTimeout(() => {
            window.handleOutOfControlLoader = true;
          }, 3000);
          notify.error(data.message);
          this.updateState();
        }
      });
  };

  prepareFilterObject() {
    this.state.appliedFilters = {};
    if (this.filters.marketplace !== "all") {
      this.state.appliedFilters[
        "filter[source_marketplace][1]"
      ] = this.filters.marketplace;
    }
    if (this.filters.full_text_search !== "") {
      this.state.appliedFilters["search"] = this.filters.full_text_search;
    }
    // console.log(this.filters.single_column_filter);
    this.filters.single_column_filter.forEach((e, i) => {
      // console.log(e)
      switch (e.name) {
        case "title":
        case "site":
        case "long_description":
          this.state.appliedFilters[
            "filter[details." + e.name + "][" + e.condition + "]"
          ] = e.value;
          break;
        case "source_variant_id":
        case "sku":
        case "price":
        case "weight":
        case "weight_unit":
        case "main_image":
        case "quantity":
          this.state.appliedFilters[
            "filter[variants." + e.name + "][" + e.condition + "]"
          ] = e.value;
          break;
        case "datePicker":
          this.state.appliedFilters["filter[details.created_at][7][from]"] =
            e.condition; // start date
          this.state.appliedFilters["filter[details.created_at][7][to]"] =
            e.value; // end date
          break;
        case "uploaded":
          this.state.appliedFilters["uploaded"] = e.value;
          break;
        case "type":
          this.state.appliedFilters["filter[details.type][1]"] = e.value;
          break;
        case "Action":
          this.state.appliedFilters["filter[details.type][1]"] = e.value;
          break;
      }
    });
    // console.log(this.filters.single_column_filter);

    for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
      const key = Object.keys(this.filters.column_filters)[i];
      if (this.filters.column_filters[key].value !== "") {
        switch (key) {
          case "asin":
          case "type":
          case "title":
          case "long_description":
            this.state.appliedFilters[
              "filter[details." +
                key +
                "][" +
                this.filters.column_filters[key].operator +
                "]"
            ] = this.filters.column_filters[key].value;
            break;
          case "source_variant_id":
          case "sku":
          case "price":
          case "weight":
          case "weight_unit":
          case "main_image":
          case "quantity":
            this.state.appliedFilters[
              "filter[variants." +
                key +
                "][" +
                this.filters.column_filters[key].operator +
                "]"
            ] = this.filters.column_filters[key].value;
            break;
        }
      }
    }
    this.updateState();
  }

  modifyProductsData(data, product_grid_collapsible) {
    let products = [];
    let str = "";

    for (let i = 0; i < data.length; i++) {
      // console.log(data);
      let rowData = {};
      if (
        Object.keys(data[i].variants).length > 0 &&
        !isUndefined(data[i].variants)
      ) {
        if (
          data[i]["details"]["type"] === "simple" ||
          Object.keys(data[i]["variants"]).length === 1
        ) {
          str = data[i].variants[0]["main_image"];
          if (str !== undefined && this.checkImage(str)) {
            str = data[i].variants[0]["main_image"];
          } else if (
            typeof data[i]["details"]["additional_images"] === "object" &&
            !isUndefined(data[i]["details"]["additional_images"])
          ) {
            str = data[i]["details"]["additional_images"];
          } else if (
            typeof data[i]["details"]["additional_image"] === "object" &&
            !isUndefined(data[i]["details"]["additional_image"])
          ) {
            str = data[i]["details"]["additional_image"];
          } else {
            str = "https://apps.cedcommerce.com/importer/image_not_found.jpg";
          }
          rowData["main_image"] = str;
          // str = '';

          if (
            data[i]["details"]["site"] != undefined &&
            data[i]["details"]["site"] != null
          ) {
            if (
              data[i]["details"]["site"] == "US" ||
              data[i]["details"]["site"] == "UK"
            ) {
              let siteUs =
                "https://www.ebay.com/itm/" +
                data[i]["details"]["source_product_id"];
              this.setState({ siteContry: siteUs });
            } else if (data[i]["details"]["site"] == "DE") {
              let siteUs =
                "https://www.ebay.de/itm/" +
                data[i]["details"]["source_product_id"];
              this.setState({ siteContry: siteUs });
            } else if (data[i]["details"]["site"] == "FR") {
              let siteUs =
                "https://www.ebay.fr/itm/" +
                data[i]["details"]["source_product_id"];
              this.setState({ siteContry: siteUs });
            } else {
              let site =
                "https://www.ebay.com/itm/" +
                data[i]["details"]["source_product_id"];
              this.setState({ siteContry: site });
            }
          } else {
            this.setState({ siteContry: "" });
          }

          let price = parseFloat(data[i].variants[0]["price"]);
          if (
            data[i].variants[0]["price_currency"] !== undefined &&
            data[i].variants[0]["price_currency"] !== ""
          ) {
            price = price + " " + data[i].variants[0]["price_currency"];
          }
          rowData["title"] = (
            <div>
              <Label id={i}>
                <h3>{data[i].details.title}</h3>
              </Label>
              {this.state.siteContry != "" ? (
                <div>
                  <a href={this.state.siteContry} target="_black">
                    <i class="fa fa-external-link " aria-hidden="true" />
                  </a>
                </div>
              ) : (
                <div />
              )}
              <Label id={i + i}>
                <h2 style={{ color: "#868686" }}>
                  {data[i].variants[0]["sku"] === ""
                    ? "-"
                    : data[i].variants[0]["sku"]}
                </h2>
                <h2 style={{ color: "#868686" }}>{price}</h2>
              </Label>
            </div>
          );
          rowData["inventory"] = data[i].variants[0]["quantity"] + " in Stock";
        } else {
          let quantity = 0;
          let rows = [];
          Object.keys(data[i].variants).forEach((key, index) => {
            if (data[i].variants[key]["quantity"] > 0) {
              quantity += data[i].variants[key]["quantity"];
            }
            if (
              data[i].variants[key]["main_image"] !== undefined &&
              this.checkImage(data[i].variants[key]["main_image"])
            ) {
              str = data[i].variants[key]["main_image"];
            } else if (
              typeof data[i]["details"]["additional_images"] === "object" &&
              !isUndefined(data[i]["details"]["additional_images"][0])
            ) {
              str = data[i]["details"]["additional_images"][0];
            } else if (
              typeof data[i]["details"]["additional_image"] === "object" &&
              !isUndefined(data[i]["details"]["additional_image"][0])
            ) {
              str = data[i]["details"]["additional_image"][0];
            } else {
              str = "https://apps.cedcommerce.com/importer/image_not_found.jpg";
            }
            // if ( data[i].variants[key]['sku'] !== undefined ) {
            rows.push([
              data[i].variants[key]["sku"],
              data[i].variants[key]["price"],
              data[i].variants[key]["quantity"],
            ]);
            // }
          });
          if (str === "") {
            str = "https://apps.cedcommerce.com/importer/image_not_found.jpg";
          }
          rowData["main_image"] = str;
          // console.log(rows);
          rowData["title"] = (
            <div onClick={this.handleToggleClick.bind(this, i)}>
              <Label id={i}>
                <h3 style={{ cursor: "pointer" }}>{data[i].details.title}</h3>
              </Label>
              {this.state.siteContry != "" ? (
                <div>
                  <a href={this.state.siteContry} target="_black">
                    <Badge status="info">Link</Badge>
                  </a>
                </div>
              ) : (
                <div />
              )}
              <Label id={i + i}>
                <h2 style={{ color: "#868686", cursor: "pointer" }}>
                  {rows.length} Variants
                </h2>
              </Label>

              {product_grid_collapsible === i &&
                this.state.product_grid_collapsible !== i && (
                  <Card>
                    <table className="table table-responsive-lg">
                      <tr>
                        <th> SKU </th>
                        <th> Price </th>
                        <th> Quantity </th>
                        <th>Action</th>
                      </tr>
                      {rows.map((e) => (
                        <tr>
                          <td> {e[0]} </td>
                          <td> {e[1]} </td>
                          <td> {e[2]} </td>
                          <td>
                            <Button
                              size="slim"
                              onClick={() => {
                                if (e[0] !== "") {
                                  var textField = document.createElement(
                                    "textarea"
                                  );
                                  textField.innerText = e[0];
                                  document.body.appendChild(textField);
                                  textField.select();
                                  document.execCommand("copy");
                                  textField.remove();
                                  notify.success("SKU Copied");
                                } else {
                                  notify.info("No SKU");
                                }
                              }}
                            >
                              Copy SKU
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </Card>
                )}
            </div>
          );
          rowData["inventory"] = quantity + " in Stock";
        }
        rowData["type"] = data[i].details.type;
        rowData["source_variant_id"] = data[
          i
        ].details.source_product_id.toString();
        if (!isUndefined(data[i].upload_status) && data[i].upload_status) {
          if (data[i].source === undefined) {
            rowData["upload_status"] = (
              <React.Fragment>
                <Badge status="info">Matched</Badge>
                <br />
                <Badge status="attention">Imported</Badge>
              </React.Fragment>
            );
          } else {
            rowData["upload_status"] = (
              <React.Fragment>
                <Badge status="success">Uploaded</Badge>
                <br />
                <Badge status="attention">Imported</Badge>
              </React.Fragment>
            );
          }
        } else {
          rowData["upload_status"] = (
            <React.Fragment>
              <Badge status="attention">Imported</Badge>
            </React.Fragment>
          );
        }
        str = (
          <div>
            <i
                class="fa fa-pencil-square-o fa-2x"
                id="idcusermodal"
                aria-hidden="true"
				onClick={this.handleeditproductdata.bind(
					this,
					data[i]["details"]["source_product_id"]
				  )}
              >
                {" "}
                <span id="editbtnmargin" />
              </i>
          
            <span
              onClick={this.deletedatasection.bind(
                this,
                data[i]["details"]["source_product_id"]
              )}
            >
              <i class="fa fa-trash fa-2x" />
            </span>
          </div>
        );
        rowData["action_editdelete"] = str;
        products.push(rowData);
      }
    }
    // console.log(products)
    return products;
  }

  checkImage = (src) => {
    let flag = true;
    imageExists(src, (exists) => {
      if (!exists) {
        flag = false;
      }
    });
    return flag;
  };

  handleToggleClick = (product_grid_collapsible) => {
    if (this.state.product_grid_collapsible === product_grid_collapsible) {
      this.setState({ product_grid_collapsible: "" });
    } else {
      this.setState({ product_grid_collapsible: product_grid_collapsible });
    }
    const products = this.modifyProductsData(
      this.state.tempProductData,
      product_grid_collapsible
    );
    this.setState({ products: products });
  };

  operations = (event, id) => {
    // console.log(event);
    // console.log(id)
    switch (id) {
      case "grid":
        let parent_props = {
          gridSettings: this.gridSettings,
          filters: this.filters,
          position: this.state.selectedApp,
          merchant_id: this.state.merchant_id,
        };
        this.redirect("/panel/products/view/" + event["source_variant_id"], {
          parent_props: parent_props,
        });
        break;
      default:
        console.log("Default Case");
    }
  };

  updateState() {
    const state = this.state;
    this.setState(state);
  }

  closeDeleteProductModal() {
    this.state.toDeleteRow = {};
    this.state.deleteProductData = false;
    const state = this.state;
    this.setState(state);
  }

  deleteProductModal() {
    return (
      <Modal
        open={this.state.deleteProductData}
        onClose={() => {
          this.closeDeleteProductModal();
        }}
        title="Delete Product?"
        primaryAction={{
          content: "Delete",
          onAction: () => {
            notify.success(
              this.state.toDeleteRow.title + " deleted  successfully"
            );
            this.closeDeleteProductModal();
          },
        }}
        secondaryActions={[
          {
            content: "No",
            onAction: () => {
              notify.info("No products deleted");
              this.closeDeleteProductModal();
            },
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure, you want to delete {this.state.toDeleteRow.title}?
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    );
  }

  handleBulkUpdateProduct() {
    this.setState({
      bulkUpdateModal: true,
    });
  }
  downloadCsv(marketplace) {
    if (marketplace && marketplace !== "") {
      requests
        .postRequest(
          "frontend/app/downloadCsv",
          {
            Marketplace: marketplace,
          },
          false,
          true
        )
        .then((data) => {
          if (data.success) {
            this.setState({
              csvUrl: data.URL,
            });
            notify.info("Csv Generated Now Click On Download Csv");
          } else {
            notify.error("Csv Not Generated");
          }
        });
    } else {
      notify.error("Select Marketplace");
    }
  }
  handleSelectChangeMarketplaceCsv(selectedMarketplace) {
    this.setState({
      selectedMarketplace: selectedMarketplace,
    });
  }
  handleChangeModakCsv = () => {
    this.setState({
      uploadcsvModal: !this.state.uploadcsvModal,
    });
  };
  // handleeditdata(row){
  // 	console.log(row)
  // 	console.log("I am Click for data")
  // }
  render() {
    // const [selected, setSelected] = useState('today');
    // const handleSelectChange = useCallback((value) => setSelected(value), []);
    const options = [
      { label: "Amazon", value: "amazonimporter" },
      { label: "Ebay", value: "ebayimporter" },
      { label: "Etsy", value: "etsyimporter" },
      { label: "Wish", value: "wishimporter" },
      { label: "Etsy Dropshipping", value: "etsyaffiliate" },
      { label: "Ebay Dropshipping", value: "ebayaffiliate" },
      { label: "Aliexpress", value: "aliexpress" },
    ];
    return (
      <div>
        <Page
          FullWidth
          primaryAction={{
            content: "Bulk Update",
            onClick: () => {
              this.handleBulkUpdateProduct();
            },
          }}
          style={{ cursor: "pointer" }}
          title="Products List"
        >
          <Card>
            <div className="p-5">
              <ResourceList items={["products"]} renderItem={(item) => {}} />
              <div className="row">
                <div className="col-12">
                  <Tabs
                    tabs={this.state.installedApps}
                    selected={this.state.selectedApp}
                    onSelect={this.handleMarketplaceChange.bind(this)}
                  />
                </div>
                <div className="col-12 p-3 text-right">
                  <Label>{this.state.pagination_show} products</Label>
                  {/*<Label>{this.state.totalMainCount && Object.keys(this.filters.column_filters).length <= 0?`Total Main Product ${this.state.totalMainCount}`:''}</Label>*/}
                </div>
                <div className="col-12">
                  <SmartDataTable
                   data={this.state.products}
				   uniqueKey="source_variant_id"
				   showLoaderBar={this.state.showLoaderBar}
				   count={this.gridSettings.count}
				   activePage={this.gridSettings.activePage}
				   hideFilters={this.hideFilters}
				   columnTitles={this.columnTitles}
				   marketplace={this.filters.marketplace}
				   multiSelect={true}
				   operations={this.operations} //button
				   selected={this.state.selectedProducts}
				   className="ui compact selectable table"
				   withLinks={true}
				   visibleColumns={this.visibleColumns}
				   actions={this.massActions}
				   showColumnFilters={false}
				   predefineFilters={this.predefineFilters}
				   showButtonFilter={true}
				   columnFilterNameArray={this.filters.single_column_filter}
                    rowActions={{
                      edit: false,
                      delete: false,
                    }}
                    getVisibleColumns={(event) => {
                      this.visibleColumns = event;
                    }}
                    userRowSelect={(event) => {
                      const itemIndex = this.state.selectedProducts.indexOf(
                        event.data.source_variant_id
                      );
                      if (event.isSelected) {
                        if (itemIndex === -1) {
                          this.state.selectedProducts.push(
                            event.data.source_variant_id
                          );
                        }
                      } else {
                        if (itemIndex !== -1) {
                          this.state.selectedProducts.splice(itemIndex, 1);
                        }
                      }
                      const state = this.state;
                      this.setState(state);
                    }}
                    allRowSelected={(event, rows) => {
                      let data = this.state.selectedProducts.slice(0);
                      if (event) {
                        for (let i = 0; i < rows.length; i++) {
                          const itemIndex = this.state.selectedProducts.indexOf(
                            rows[i].source_variant_id
                          );
                          if (itemIndex === -1) {
                            data.push(rows[i].source_variant_id);
                          }
                        }
                      } else {
                        for (let i = 0; i < rows.length; i++) {
                          if (data.indexOf(rows[i].source_variant_id) !== -1) {
                            data.splice(
                              data.indexOf(rows[i].source_variant_id),
                              1
                            );
                          }
                        }
                      }
                      this.setState({ selectedProducts: data });
                    }}
                    massAction={(event) => {
                      switch (event) {
                        case "upload":
                          this.state.selectedProducts.length > 0
                            ? this.handleSelectedUpload("profile")
                            : notify.info("No Product Selected");
                          break;
                        default:
                          console.log(event, this.state.selectedProducts);
                      }
                    }}
                    editRow={(row) => {
                      this.redirect("/panel/products/edit/" + row.id);
                    }}
                    deleteRow={(row) => {
                      this.state.toDeleteRow = row;
                      this.state.deleteProductData = true;
                      const state = this.state;
                      this.setState(state);
                    }}
                    columnFilters={(filters) => {
                      this.filters.column_filters = filters;
                      this.getProducts();
                    }}
                    singleButtonColumnFilter={(filter) => {
                      console.log(filter);
                      this.filters.single_column_filter = filter;
                      this.getProducts();
                    }}
                    sortable
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6 text-right">
                  <Pagination
                    hasPrevious={1 < this.gridSettings.activePage}
                    onPrevious={() => {
                      if (1 < this.gridSettings.activePage) {
                        this.gridSettings.activePage--;
                        this.getProducts();
                      }
                    }}
                    hasNext={
                      this.state.totalPage / this.gridSettings.count >
                      this.gridSettings.activePage
                    }
                    nextKeys={[39]}
                    previousKeys={[37]}
                    previousTooltip="use Right Arrow"
                    nextTooltip="use Left Arrow"
                    onNext={() => {
                      if (
                        this.state.totalPage / this.gridSettings.count >
                        this.gridSettings.activePage
                      ) {
                        this.gridSettings.activePage++;
                        this.getProducts();
                      }
                    }}
                  />
                </div>
                <div className="col-md-2 col-sm-2 col-6">
                  <Select
                    options={this.pageLimits}
                    value={this.gridSettings.count}
                    onChange={this.pageSettingsChange.bind(this)}
                    label={""}
                    labelHidden={true}
                  />
                </div>
              </div>
            </div>
          </Card>
          <Modal
            open={this.state.selectedUploadModal}
            onClose={this.handleSelectedUpload.bind(this, "modalClose")}
            title={"Upload"}
            primaryAction={{
              content: "Start Upload",
              onClick: () => {
                this.handleSelectedUpload("Start_Upload");
              },
            }}
            secondaryActions={{
              content: "Cancel",
              onClick: () => {
                this.handleSelectedUpload("modalClose");
              },
            }}
          >
            <Modal.Section>
              <div>
                <Banner title="Please Note" status="info">
                  <Label id={"sUploadLabel"}>
                    Product without a profile, will be uploaded via default
                    profile.
                  </Label>
                  <Label id={"sUploadLabel2"}>
                    The multiple variants of a product will be auto uploaded on
                    selecting one of the variants.
                  </Label>
                  <br />
                  <Label id={"sUploadLabel3"}>
                    <h5>Total Selected Products:</h5>
                    <h5>
                      Main Product: <b>{this.state.parent_sku}</b>
                    </h5>
                    <h5>
                      SKU: <b>{this.state.child_sku}</b>
                    </h5>
                  </Label>
                </Banner>
              </div>
            </Modal.Section>
          </Modal>
          <Modal
            title={"Product Bulk Update"}
            open={this.state.bulkUpdateModal}
            onClose={() => {
              this.setState({ bulkUpdateModal: false });
            }}
          >
            <Modal.Section>
              <div className="row">
                {/*<div className="col-12 p-3">*/}
                {/*<Banner title="Information" status="info">*/}
                {/*<Label>*/}
                {/*In order to bulk update,  you have to select the marketplace first than*/}
                {/*click on Generate Csv than your Csv will be generated and Download link*/}
                {/*will be appeared and you can download csv from there.*/}
                {/*</Label>*/}
                {/*<Label>*/}
                {/*Update your products details in Csv file and than upload your Csv and make the products update in App also.*/}
                {/*</Label>*/}
                {/*</Banner>*/}
                {/*</div>*/}
                <div className="col-md-12 col-sm-12 col-12 p-3">
                  <Select
                    label="Marketplace"
                    placeholder="Marketplace"
                    options={options}
                    onChange={this.handleSelectChangeMarketplaceCsv.bind(this)}
                    value={this.state.selectedMarketplace}
                  />
                </div>
                <div className="col-md-6 col-sm-6 col-12 p-3">
                  <Card>
                    <div
                      onClick={() => {
                        this.downloadCsv(this.state.selectedMarketplace);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="text-center pt-5 pb-5">
                        <FontAwesomeIcon
                          icon={faArrowAltCircleDown}
                          color="#3f4eae"
                          size="10x"
                        />
                      </div>
                      <div className="text-center pt-2 pb-4">
                        {/*<div className="col-12">*/}
                        {/*<Button*/}
                        {/*primary*/}
                        {/*onClick={() => {*/}
                        {/*this.downloadCsv(this.state.selectedMarketplace);*/}
                        {/*}}>*/}
                        {/*Generate CSV*/}
                        {/*</Button>*/}
                        {/*</div>*/}
                        <span className="h2" style={{ color: "#3f4eae" }}>
                          Import CSV
                        </span>
                        <Label>(Export CSV from app.)</Label>
                        {this.state.csvUrl !== "" ? (
                          <div className="col-12 p-2">
                            <a
                              className="h2"
                              style={{ color: "#3f4eae" }}
                              onClick={() => {
                                this.setState({ bulkUpdateModal: false });
                              }}
                              target={"_blank"}
                              href={this.state.csvUrl}
                            >
                              Download CSV
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-md-6 col-sm-6 col-12 p-3">
                  <Card>
                    <div
                      onClick={this.handleChangeModakCsv.bind(this)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="text-center pt-5 pb-5">
                        <FontAwesomeIcon
                          icon={faArrowAltCircleUp}
                          color="#3f4eae"
                          size="10x"
                        />
                      </div>
                      <div className="text-center pt-2 pb-4">
                        <span className="h2" style={{ color: "#3f4eae" }}>
                          Upload Csv File
                        </span>
                        <Label>(Import updated CSV on app)</Label>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Modal.Section>
          </Modal>
          <Modal
            open={this.state.uploadcsvModal}
            onClose={this.handleChangeModakCsv.bind(this)}
            title="Upload CSV"
          >
            <Modal.Section>
              <FileImporterBulkUpdate {...this.props} />
            </Modal.Section>
          </Modal>
          {this.state.deleteProductData && this.deleteProductModal()}
          <div id="mainmaodalsectioneditbtn">
            <Modal
              open={this.state.activemodalsection}
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
             <div>{this.state.img.length > 1 && (
							<div className="col-12 mb-5">
								<span>
									<div className="row p-5 d-flex justify-content-center">
										<div className="col-1 mt-5 pt-5 justify-content-center"
												style={{ cursor: "pointer" }}
												onClick={this.pressLeftShift.bind(this)}
											>
											<span>
												<img style={{height: '35px', width: '35px'}}
													 src={require("../../../assets/img/leftShift.png")}/>
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
													 src={require("../../../assets/img/rigthShift.png")}/>
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
														console.log(this.state.img[0][0])
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
                        )}</div>
              </Modal.Section>
            </Modal>
          </div>
        </Page>
      </div>
    );
  }

  handleMarketplaceChange(event) {
    this.state.selectedProducts = [];
    window.showGridLoader = true;
    if (
      this.state.installedApps[event] !== undefined &&
      this.state.installedApps[event].id !== undefined
    )
      this.filters.marketplace = this.state.installedApps[event].id;
    this.state.selectedApp = event;
    this.gridSettings.count = 10;
    this.gridSettings.activePage = 1;
    this.filters.single_column_filter = [];
    this.updateState();
    this.getProducts();
  }

  handleMarketplaceStateChange(event) {
    this.state.selectedProducts = [];
    window.showGridLoader = true;
    if (
      this.state.installedApps[event] !== undefined &&
      this.state.installedApps[event].id !== undefined
    )
      this.filters.marketplace = this.state.installedApps[event].id;
    this.state.selectedApp = event;
    this.updateState();
    this.getProducts();
  }

  pageSettingsChange(event) {
    this.gridSettings.count = event;
    this.gridSettings.activePage = 1;
    this.getProducts();
  }

  manageStateChange = (old_state) => {
    this.filters = Object.assign({}, old_state["filters"]);
    this.gridSettings = Object.assign({}, old_state["gridSettings"]);
    this.state.selectedApp = old_state["position"];
    this.props.location.state = undefined;
    this.updateState();
    this.prepareHeader(this.props);
  };

  redirect(url, data) {
    if (!isUndefined(data)) {
      this.props.history.push(url, JSON.parse(JSON.stringify(data)));
    } else {
      this.props.history.push(url);
    }
  }
}
