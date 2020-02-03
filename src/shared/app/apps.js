import React, {Component} from "react";
import {
    Select,
    Button,
    Card,
    TextField,
    Banner,
    Label,
    Tooltip,
    Icon, Tabs,
    Collapsible,Stack,FormLayout,Modal,Badge,DisplayText
} from "@shopify/polaris";
import {requests} from "../../services/request";
import {notify} from "../../services/notify";
import {json} from "../../environments/static-json";
import FileImporter from "../../components/Panel/Components/import-component/fileimporter";
import {environment} from "../../environments/environment";

class AppsShared extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_banner: false,
            account_details_amazon:[],
            country_code:"",
            account_name:"",
        };
        this.getConnectors();
        // this.getFbaAccountList();
    }

    componentDidMount() {
        if (
            this.props.necessaryInfo !== undefined &&
            Object.keys(this.props.necessaryInfo.credits).length > 0
        ) {
            let credits =
                this.props.necessaryInfo.credits.available_credits +
                this.props.necessaryInfo.credits["total_used_credits"];
            if (credits < 11) {
                this.setState({show_banner: true});
            }
        }
    }
    /*getFbaAccountList(){
         var temp_arry=[];
         var temp_array_1=[];
         var account_name="";
         var country_code="";
        requests.getRequest("fba/fbaconfig/getAmazonAccountDetials").then(data => {
            if (data.success) {
                for (let i=0;i<data.data.length;i++){
                    console.log(data.data[i]['country_code'])
                    temp_arry=[
                         this.state.account_name = data.data[i]['account_name'],
                         this.state.country_code = data.data[i]['country_code'],
                    ];
                    temp_array_1.push(temp_arry);
                }
                this.setState({
                    account_details_amazon:temp_array_1
                })

            }

        });
    }*/

    getConnectors() {
        this.state = {
            apps: [],
            ebay_county_code: "",
            code_usable: [],
            selected:0,
            banner_paln: false,
        };
        requests.getRequest("connector/get/all").then(data => {
            if (data.success) {
                // console.log("namaste",data);
                let installedApps = [];
                let code = [];
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "ebayimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "etsyimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "amazonimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "ebayaffiliate") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "wishimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "fba") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "amazonaffiliate") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "walmartimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "aliexpress") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                this.props.importerServices(code);
                this.setState({
                    apps: installedApps
                });
            } else {
                notify.error(data.message);
            }
        });
    }

    handleChange = (obj, val) => {
        this.setState({[obj]: val});
    };

    handleTabChange = (selectedTabIndex) => {
        this.setState({selected: selectedTabIndex});
    };


    renderMarketplace() {
        console.log(this.state.apps)
           return this.state.apps.map(app => {
               if (app.code !== 'fba' && app.code !== 'ebayaffiliate' && app.code !== 'amazonaffiliate' && app.code !== 'aliexpress') {
                   if (this.validateCode(app.code)) {
                       return (
                           <div
                               className="col-6 col-sm-6 mb-4"
                               key={this.state.apps.indexOf(app)}
                           >
                               <Card title={app.title}>
                                   {this.props.success.code === app.code ||
                                   app["installed"] !== 0
                                       ?<div className="text-left pt-3 pl-4">
                                       <Badge progress="complete" status="success">Connected</Badge>
                                   </div>:null}
                                   <div className="row p-5">
                                       <div className="col-12">
                                           <img src={app.image} alt={app.title}
                                                style={{maxWidth: "100%", height: "160px"}}/>
                                       </div>
                                       <div className="col-12 mt-4 mb-4">
                                           <div className="row">
                                               <div className="col-12 col-sm-6">
                                                   {this.additionalInput(app.code)}
                                               </div>
                                               <div className="col-12 col-sm-6">
                                                   <Button
                                                       // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                       onClick={() => {
                                                           this.installApp(app.code);
                                                       }}
                                                       primary
                                                       fullWidth={true}
                                                   >
                                                       {this.props.success.code === app.code ||
                                                       app["installed"] !== 0
                                                           ? "ReConnect"
                                                           : "Link your Account"}
                                                   </Button>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </Card>
                           </div>
                       );
                   }
               }
            })
        }

    renderOrderManagement(){

        return this.state.apps.map(app => {
            if (app.code === 'fba') {
                if (this.validateCode(app.code)) {
                        return (
                            <React.Fragment>
                                <div
                                    className="col-6 col-sm-6 mb-4"
                                    key={this.state.apps.indexOf(app)}
                                >
                                    <Card title={app.title}>
                                        {this.props.success.code === app.code ||
                                        app["installed"] !== 0
                                            ? <div className="text-left pt-3 pl-4">
                                                <Badge progress="complete" status="success">Connected</Badge>
                                            </div> : null}
                                        <div className="row p-5">
                                            <div className="col-12">
                                                <img src={app.image} alt={app.title}
                                                     style={{maxWidth: "100%", height: "160px"}}/>
                                            </div>
                                            <div className="col-12 mt-4 mb-4">
                                                <div className="row">
                                                    <div className="col-12 col-sm-6">
                                                        {this.additionalInput(app.code)}
                                                    </div>
                                                    <div className="col-12 col-sm-6">
                                                        <Button
                                                            // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                            onClick={() => {
                                                                this.installApp(app.code);
                                                            }}
                                                            primary
                                                            fullWidth={true}
                                                        >
                                                            {this.props.success.code === app.code ||
                                                            app["installed"] !== 0
                                                                ? "ReConnect"
                                                                : "Link your Account"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                {/*<div className="col-6 col-sm-6 mt-5 text-center">
                                    <img className='img-fluid pt-5 mt-2'
                                         style={{cursor: 'pointer'}}
                                         height="100"
                                         width="100"
                                         align="middle"
                                         src={require("../../assets/img/add_account.png")}
                                         onClick={() => {
                                             this.installApp(app.code);
                                         }}
                                    />
                                    <DisplayText size="small">Add More Account For FBA</DisplayText>
                                </div>*/}
                            </React.Fragment>

                        );
                }
            }
        })
    }
    renderDropshipping(){

        return this.state.apps.map(app => {
            if (app.code === 'aliexpress' || app.code === 'amazonaffiliate' || app.code === 'ebayaffiliate') {
                if (this.validateCode(app.code)) {
                    return (
                        <React.Fragment>
                            <div
                                className="col-6 col-sm-6 mb-4"
                                key={this.state.apps.indexOf(app)}
                            >
                                <Card title={app.title}>
                                    {this.props.success.code === app.code ||
                                    app["installed"] !== 0
                                        ? <div className="text-left pt-3 pl-4">
                                            <Badge progress="complete" status="success">Connected</Badge>
                                        </div> : null}
                                    <div className="row p-5">
                                        <div className="col-12">
                                            <img src={app.image} alt={app.title}
                                                 style={{maxWidth: "100%", height: "160px"}}/>
                                        </div>
                                        <div className="col-12 mt-4 mb-4">
                                            <div className="row">
                                                <div className="col-12 col-sm-6">
                                                    {this.additionalInput(app.code)}
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <Button
                                                        // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                        onClick={() => {
                                                            this.installApp(app.code);
                                                        }}
                                                        primary
                                                        fullWidth={true}
                                                    >
                                                        {this.props.success.code === app.code ||
                                                        app["installed"] !== 0
                                                            ? "ReConnect"
                                                            : "Link your Account"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            {/*<div className="col-6 col-sm-6 mt-5 text-center">
                             <img className='img-fluid pt-5 mt-2'
                             style={{cursor: 'pointer'}}
                             height="100"
                             width="100"
                             align="middle"
                             src={require("../../assets/img/add_account.png")}
                             onClick={() => {
                             this.installApp(app.code);
                             }}
                             />
                             <DisplayText size="small">Add More Account For FBA</DisplayText>
                             </div>*/}
                        </React.Fragment>

                    );
                }
            }
        })
    }

    handleToggleClick = () => {

        this.setState((state) => {
            const banner_plan = !state.banner_plan;
            return {
                banner_plan,
            };
        });
    };

    handleChangeModakCsv = () => {
        // console.log("qwerty",this.state.active);
        // this.setState(({active}) => ({active: !active}));
        this.setState({
            active : !this.state.active
        })
        // console.log("asdfgh",this.state.active);
        // this.csvManagementRender();
    };

    renderCsvUploadManagement() {
        const {active} = this.state;
        return (<React.Fragment>
                <div className="col-12 mb-3">
                    <div
                        style={{cursor: "pointer"}}
                        onClick={this.handleToggleClick.bind(this.state.banner_paln)}
                    >
                        <Banner title="CSV Order Management" icon="view" status="info"
                        >
                            <p><b><i>One time payment if Csv not matched according to the offical format</i></b></p>
                        </Banner>
                    </div>
                    <Collapsible open={true}
                                 ariaExpanded={this.state.fba_plan}
                    >
                        <FormLayout>
                            <FormLayout.Group condensed>
                                <div className="col-12 m-4">
                                    {/* Starting Of Plan Card */}
                                    <Card>
                                        <div className="d-flex justify-content-center p-5">
                                            <div className="pt-5">
                                                <div className="mb-5 text-center">
                                                    {" "}


                                                </div>
                                                <Stack distribution="center">
                                                    {" "}


                                                    <img style={{height: '100px', width: '100px', cursor: "pointer"}}
                                                         src={require("../../assets/img/csv_upload.png")}
                                                         onClick={this.handleChangeModakCsv.bind(this)}
                                                    />
                                                </Stack>
                                                <div className="mb-5 text-center">
                                                    {" "}
                                                    {/* Descriptions For Particular deatails */}
                                                    <h1 className="mb-4 mt-4">
                                                        <b>Upload CSV</b>
                                                    </h1>
                                                    <h4>Upload Your Products CSV File To import all the products into an
                                                        App</h4>
                                                </div>
                                                <hr />
                                                <div className="text-center mt-5">
                                                </div>
                                            </div>
                                            {/*{console.log(this.state.active)}*/}

                                        </div>
                                    </Card>
                                </div>
                            </FormLayout.Group>
                        </FormLayout>
                    </Collapsible>
                </div>
            </React.Fragment>
        );

    }


    render() {

        const {selected} = this.state;
        const tabs = [
            {
                id: 'account_marketplace',
                content: 'Marketplace',
                accessibilityLabel: 'accountmarketplace',
                panelID: 'accountmarketplace',
            },
            {
                id: 'order_management',
                content: 'Order Management',
                panelID: 'order-management',
            },
            {
                id: 'dropshipping',
                content: 'Dropshipping',
                panelID: 'dropshipping',
            },
            {
                id: 'cvs_management',
                content: 'CSV Upload',
                panelID: 'csv-management'
            }
        ];
        return (
            <div className="row">
                {this.state.show_banner && (
                    <div className="col-12 mb-5">
                        <Banner title="Note" status="info">
                            <Label id={"trial"}>You can upload 10 products free.</Label>
                        </Banner>
                    </div>
                )}

                <div className="col-12">
                    <Card>
                        <Tabs tabs={tabs} selected={selected} onSelect={this.handleTabChange}/>
                        <Card.Section>
                            <div className="row">
                            {selected == 0 ? this.renderMarketplace() : selected === 1 ? this.renderOrderManagement() :selected === 2 ? this.renderDropshipping() : this.renderCsvUploadManagement()}
                            </div>
                        </Card.Section>
                    </Card>
                </div>

                <Modal
                    open={this.state.active}
                    onClose={this.handleChangeModakCsv.bind(this)}
                    title="Upload CSV"
                >
                    <Modal.Section>
                        <FileImporter {...this.props} />
                    </Modal.Section>
                </Modal>

                {/*{this.state.apps.map(app => {
                    if (this.validateCode(app.code)) {
                        return (
                            <div
                                className="col-12 col-sm-6 mb-4"
                                key={this.state.apps.indexOf(app)}
                            >
                                <Card title={app.title}>
                                    <div className="row p-5">
                                        <div className="col-12">
                                            <img src={app.image} alt={app.title}
                                                 style={{maxWidth: "100%", height: "160px"}}/>
                                        </div>
                                        <div className="col-12 mt-4 mb-4">
                                            <div className="row">
                                                <div className="col-12 col-sm-6">
                                                    {this.additionalInput(app.code)}
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <Button
                                                        // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                        onClick={() => {
                                                            this.installApp(app.code);
                                                        }}
                                                        primary
                                                        fullWidth={true}
                                                    >
                                                        {this.props.success.code === app.code ||
                                                        app["installed"] !== 0
                                                            ? "ReConnect"
                                                            : "Link your Account"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    }
                })}*/}
                <input
                    type={"hidden"}
                    data-toggle="modal"
                    data-target="#exampleModal"
                    id={"openEtsyHelp"}
                />

                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Etsy Help
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={require("../../assets/img/etsy_help.png")}
                                    width={"100%"}
                                />
                            </div>
                            {/*<div class="modal-footer">*/}
                            {/*<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>*/}
                            {/*<button type="button" class="btn btn-primary">Save changes</button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    validateCode = code => {
        return (
            code === "amazonimporter" ||
            code === "ebayimporter" ||
            code === "fba" ||
            code === "walmartimporter" ||
            code === "wishimporter" ||
            code === "wishimporter" ||
            code === "etsyimporter" ||
            code === "amazonaffiliate" ||
            code === "ebayaffiliate" ||
            code === "aliexpress"
        );
    };
    additionalInput = code => {
        if (code === "ebayimporter") {
            return (
                <Select
                    options={json.country}
                    value={this.state.ebay_county_code}
                    onChange={this.handleChange.bind(this, "ebay_county_code")}
                    placeholder={"Choose Country"}
                    label={""}
                />
            );
        } else if (code === "etsyimporter") {
            return (
                <TextField
                    label={"Shop Name"}
                    value={this.state.etsy}
                    connectedRight={
                        <span
                            onClick={() => {
                                document.getElementById("openEtsyHelp").click();
                            }}
                        >
							<Tooltip content={"Help"} light={true}>
								<Icon source="help" color="inkLighter" backdrop={true}/>
							</Tooltip>
						</span>
                    }
                    onChange={this.handleChange.bind(this, "etsy")}
                    placeholder={"Etsy Shop Name"}
                    labelHidden={true}
                    readOnly={false}
                />
            );
        }
        return null;
    };

    installApp(code) {
        if (code === "ebayimporter")
            if (this.state.ebay_county_code !== "") {
                this.props.redirectResult(code, {
                    code: code,
                    ebay_site_id: this.state.ebay_county_code
                });
            } else {
                notify.info("Country is not selected");
            }
        else if (code === "etsyimporter") {
            if (this.state.etsy !== undefined && this.state.etsy !== "") {
                this.props.redirectResult(code, {
                    code: code,
                    shop_name: this.state.etsy
                });
            } else {
                notify.info("Please Provide The Valid Shop Name.");
            }
        } else {
            this.props.redirectResult(code, "");
        }
    }
}

export default AppsShared;
