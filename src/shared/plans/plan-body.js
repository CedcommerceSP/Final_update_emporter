import React, {Component} from "react";
import {
    Button,
    Card,
    Checkbox,
    Icon,
    Label,
    Link,
    Modal,
    RadioButton,
    Select,
    Stack,
    TextField,
    Tooltip,
    DisplayText,
    Collapsible,
    Banner,
    Page
} from "@shopify/polaris";
import {isUndefined} from "util";

import {requests} from "../../services/request";
import {notify} from "../../services/notify";
import {globalState} from "../../services/globalstate";

import {
    dataGrids,
    RemoveService,
    marketPlacePricingPlan
} from "./plansFuctions";

class PlanBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banner_paln: false,
            sync_plan: false,
            fba_plan: false,
            originalData: [], // data came from server
            data: [], // data modify to suit the frontend requirement
            checkBox: [],
            schemaModal: {
                // this object is used to maintain frontend data
                show: false, // for show/Hide Modal
                title: "", // title of a Modal
                body: "", // HTML body
                data: "" // Data to be store
            },
            schemaData: {
                // this one is send to server
                plan: {} // selected plans
            }, // more field is added like schema and payment_method below
            schemaShopSelected: false,
            perProductCharge: "NaN",
            oneTimePaymentDetails: {
                totalCredits: 0,
                totalAmount: 0,
                service: false
            }
        };
        this.toggleSchemaModal = this.toggleSchemaModal.bind(this);
        this.createSchema = this.createSchema.bind(this);
        this.getImportPaymentSettings();
    }

    getImportPaymentSettings() {
        requests.getRequest("shopifygql/payment/getPaymentSettings").then(data => {
            if (data.success) {
                this.state.perProductCharge = data["data"]["per_product_cost"];
                this.state.oneTimePaymentDetails.service =
                    data["data"]["import_service"];
                this.setState(this.state);
            } else {
                notify.error(data.message);
            }
        });
    }

    componentWillMount() {
        requests.getRequest("plan/plan/get").then(data => {
            // get All the Plans Available
            if (data.success) {
                if (data.data !== null && !isUndefined(data.data)) {
                    const temp = JSON.parse(JSON.stringify(data.data.data.rows));
                    data = dataGrids(data.data.data.rows, null);
                    this.setState({
                        data: data,
                        originalData: temp
                    });
                    console.log("data", this.state.data);
                    console.log("originalData", this.state.originalData);
                }
            } else {
                notify.error(data.message);
            }
        });
    }

    onSelectPlan(arg) {
        console.log(arg);
        let value = [];
        let flag = 0;
        let newArg = Object.assign({}, arg);
        let data1;
        this.state.checkBox.forEach(data => {
            if (data.key === newArg.id) {
                value.push(Object.assign({}, data));
                flag = 1;
            }
        });
        data1 = Object.assign(
            {},
            RemoveService(Object.assign({}, newArg), value.slice(0))
        ); // Change the plan in Desire Format
        let win = window.open(
            "",
            "_parent",
            "location=yes,height=600,width=550,scrollbars=yes,status=yes"
        );
        // win.close();
        requests.postRequest("plan/plan/choose", data1).then(data => {
            if (data.success) {
                if (!isUndefined(data.data.confirmation_url)) {
                    win.location = data.data.confirmation_url;
                } else {
                    win.close();
                    this.getSchema(data.data, data1); // open Modal For Payment Procedure
                }
            } else {
                win.close();
                notify.error(data.message);
            }
        });
    }

    onCheckBox(event, key) {
        // this function is used to check unCheck Checkbox which is not Required by default
        console.log(event, key);
        let data = this.state.checkBox;
        data.forEach(Data => {
            if (Data.code === event && key === Data.key) {
                Data.isSelected = !Data.isSelected;
            }
        });
        let data2 = JSON.parse(JSON.stringify(this.state.originalData));
        let dataPrice = dataGrids(data2, data);
        this.setState({
            checkBox: data,
            data: dataPrice
        });
    }

    handleCreditsChange(credits) {
        let creditCount = parseInt(credits);
        let cost;
        if (isNaN(creditCount)) {
            creditCount = 0;
        }
        cost = Math.round(creditCount * this.state.perProductCharge * 100) / 100;
        this.state.oneTimePaymentDetails.original_price = cost.toFixed(2);
        if (credits <= 300) {
            this.state.oneTimePaymentDetails.discount_percentage = 0;
        } else if (credits <= 500) {
            cost = cost - (cost * 30) / 100;
            if ( 30 > cost ) {
                cost = 30;
            }
            this.state.oneTimePaymentDetails.discount_percentage = 30;
        } else if (credits <= 600) {
            cost = cost - (cost * 40) / 100;
            if ( 36 > cost ) {
                cost = 36;
            }
            this.state.oneTimePaymentDetails.discount_percentage = 40;
        } else if (credits <= 2000) {
            cost = cost - (cost * 50) / 100;
            if ( 42 > cost ) {
                cost = 42;
            }
            this.state.oneTimePaymentDetails.discount_percentage = 50;
        } else if (credits <= 3000) {
            cost = cost - (cost * 65) / 100;
            if ( 100 > cost ) {
                cost = 100;
            }
            this.state.oneTimePaymentDetails.discount_percentage = 65;
        } else if (credits <= 5000) {
            cost = cost - (cost * 70) / 100;
            if ( 150 > cost ) {
                cost = 150;
            }
            this.state.oneTimePaymentDetails.discount_percentage = 70;
        } else if (credits <= 10000) {
            cost = cost - (cost * 75) / 100;
            if ( 175 > cost ) {
                cost = 175;
            }
            this.state.oneTimePaymentDetails.discount_percentage = 75;
        } else {
            cost = cost - (cost * 80) / 100;
            if ( 250 > cost ) {
                cost = 250;
            }
            this.state.oneTimePaymentDetails.discount_percentage = 80;
        }
        this.state.oneTimePaymentDetails.totalCredits = creditCount;
        this.state.oneTimePaymentDetails.totalAmount = cost.toFixed(2);
        this.setState(this.state);
    }

    makePaymentForImporter() {
        if (this.validateOneTimeCharge()) {
            const paymentData = {
                connectors: "shopify",
                total_credits: this.state.oneTimePaymentDetails.totalCredits,
                total_amount: this.state.oneTimePaymentDetails.totalAmount,
                services: [this.state.oneTimePaymentDetails.service]
            };
            let win = window.open(
                "",
                "_parent",
                "location=yes,height=600,width=550,scrollbars=yes,status=yes"
            );
            requests
                .postRequest("plan/plan/importerPlanChoose", paymentData)
                .then(data => {
                    if (data.success) {
                        if (!isUndefined(data.data.confirmation_url)) {
                            win.location = data.data.confirmation_url;
                        } else {
                            win.close();
                            this.getSchema(data.data, paymentData); // open Modal For Payment Procedure
                        }
                    } else {
                        win.close();
                        notify.error(data.message);
                    }
                });
        }
    }

    productImportPaymentModal() {
    }

    validateOneTimeCharge() {
        if (this.state.oneTimePaymentDetails.totalAmount == 0) {
            notify.info(
                "Please enter number of products you want to upload to Shopify"
            );
            return false;
        }
        return true;
    }

    handleToggleClick = () => {

        this.setState((state) => {
            const banner_plan = !state.banner_plan;
            return {
                banner_plan,
            };
        });
    };
    handleToggleClick1 = () => {

        this.setState((state) => {
            const sync_plan = !state.sync_plan;
            return {
                sync_plan,
            };
        });
    };
    handleToggleClickFba = () => {

        this.setState((state) => {
            const fba_plan = !state.fba_plan;
            return {
                fba_plan,
            };
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="row pt-4 pb-4">
                            <div className="col-3 d-md-block d-sm-none">
                                <hr />
                            </div>
                            <div className="col-md-6 col-sm-12 col-12 text-center">
                                <DisplayText element="h3">Plan List</DisplayText>
                            </div>
                            <div className="col-3 d-md-block d-sm-none">
                                <hr />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mb-3">
                        <div
                            style={{cursor: "pointer"}}
                            onClick={this.handleToggleClick.bind(this.state.banner_paln)}
                        >
                            <Banner title="Product Import Charges" icon="view" status="attention">
                                <p><b>One Time Payment</b></p>
                            </Banner>
                        </div>
                        <Page>
                            <Stack>
                                <Collapsible open={this.state.banner_plan}
                                             ariaExpanded={this.state.banner_plan}
                                >
                                    <div className="col-12 p-3">
                                        <Card>
                                            <div className="row p-5">
                                                <div className="col-12 text-center pt-5 pb-2">
                                                    <div className="mb-5 text-center">
                                                        <p className="price-tag">
                                                            <span className="price-tag_small">$</span>
                                                            {this.state.perProductCharge}
                                                            <span className="price-tag_small">/ product</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-12 p-3">
                                                    <Card>
                                                        <div className="row p-5">
                                                            <div className="col-md-3 col-sm-12 col-12 text-center">
                                                                <TextField
                                                                    label="Product Count"
                                                                    type="number"
                                                                    value={this.state.oneTimePaymentDetails.totalCredits}
                                                                    onChange={this.handleCreditsChange.bind(this)}
                                                                    helpText="No. of product you want to upload on Shopify"
                                                                />
                                                            </div>
                                                            <div
                                                                className="col-md-1 col-sm-12 col-12 text-center pt-5">
                                                                <h2>
                                                                    <b>X</b>
                                                                </h2>
                                                            </div>
                                                            <div
                                                                className="col-md-3 col-sm-12 col-12 text-center pt-5">
                                                                <div className="mb-5 text-center">
                                                                    <p className="price-tag">
                                                                        <span className="price-tag_small">$</span>
                                                                        {this.state.perProductCharge}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="col-md-1 col-sm-12 col-12 text-center pt-5">
                                                                <h2>
                                                                    <b>=</b>
                                                                </h2>
                                                            </div>
                                                            <div
                                                                className="col-md-4 col-sm-12 col-12 text-center pt-5">
                                                                <div className="mb-5 text-center">
                                                                    <p className="price-tag">
                                                                        <span className="price-tag_small">$</span>
                                                                        {this.state.oneTimePaymentDetails.original_price !==
                                                                        this.state.oneTimePaymentDetails.totalAmount && (
                                                                            <span className="price-tag_small">
																<strike>
																	{
                                                                        this.state.oneTimePaymentDetails
                                                                            .original_price
                                                                    }
																</strike>
															</span>
                                                                        )}
                                                                        {this.state.oneTimePaymentDetails.totalAmount}
                                                                    </p>
                                                                </div>
                                                                <Label id="payable_amount">Payable Amount</Label>
                                                                <div>
													<span style={{color: "#7d7d7d"}}>
														<Label>( should be more than 0.5$ )</Label>
													</span>
                                                                </div>
                                                                <div>
													<span style={{color: "#7d7d7d"}}>
														<Label>
															( Discount{" "}
                                                            {
                                                                this.state.oneTimePaymentDetails
                                                                    .discount_percentage
                                                            }{" "}
                                                            % )
														</Label>
													</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                                <div className="col-12 text-center pt-3 pb-2">
                                                    <Button
                                                        primary={true}
                                                        size="large"
                                                        disabled={
                                                            this.state.oneTimePaymentDetails.totalAmount < 0.6
                                                        }
                                                        onClick={() => {
                                                            this.makePaymentForImporter();
                                                        }}
                                                    >
                                                        Make Payment
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </Collapsible>
                            </Stack>
                        </Page>
                    </div>
                    <div className="col-12 mb-2">
                        <div
                            style={{cursor: "pointer"}}
                            onClick={this.handleToggleClick1.bind(this.state.sync_plan)}
                        >
                            <Banner title="Product Syncing Charges" icon="view" status="attention">
                            </Banner>
                        </div>
                        <Page>
                            <Stack>
                                <Collapsible open={this.state.sync_plan}
                                             ariaExpanded={this.state.sync_plan}
                                >
                                    {this.state.data.map((data, index) => {
                                        console.log("qwerty", data);
                                        console.log("merchant", index);
                                        if(data.title !== "FBA"){
                                            return( <div className="col-12 mb-4" key={index}>
                                                {/* Starting Of Plan Card */}
                                                <Card>
                                                    <div className="d-flex justify-content-center p-5">
                                                        <div className="pt-5">
                                                            <div className="mb-5 text-center">
                                                                {" "}
                                                                {/* Plan Numeric Price */}
                                                                <p className="price-tag">
                                                                    <span className="price-tag_small">$</span>
                                                                    {/*<span className="price-tag_discount"><strike>{data.originalValue}</strike></span>*/}
                                                                    {data.main_price}
                                                                    <span className="price-tag_small">
                                                                        {data.validity_display}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div className="mb-5">
                                                                {" "}
                                                                {/* Button To choose Plan */}
                                                                <Button
                                                                    primary={true}
                                                                    fullWidth={true}
                                                                    size="large"
                                                                    disabled={
                                                                        data.main_price === 0 || data.main_price === "0"
                                                                    }
                                                                    onClick={this.onSelectPlan.bind(this, data)}
                                                                >
                                                                    {data.main_price === 0 || data.main_price === "0"
                                                                        ? "Select Marketplace"
                                                                        : "Choose Plan"}
                                                                </Button>
                                                            </div>
                                                            <div className="mb-5 text-center">
                                                                {" "}
                                                                {/* Descriptions For Particular deatails */}
                                                                <h1 className="mb-4">
                                                                    <b>{data.title}</b>
                                                                </h1>
                                                                <h4>{data.description}</h4>
                                                            </div>
                                                            <hr />
                                                            <div className="text-center mt-5">
                                                                {" "}
                                                                {/* Services Data */}
                                                                {data.services
                                                                    ? Object.keys(data.services).map(keys => {
                                                                        return (
                                                                            <React.Fragment key={keys}>
                                                                                <p className="service-body mb-5">
                                                                                         <span
                                                                                             className="service-description mb-3"
                                                                                             style={{fontWeight: "bold"}}
                                                                                         >
                                                                                         <b>{data.services[keys].title}</b>
                                                                                         </span>
                                                                                    <span>
                                                                                         <Tooltip
                                                                                             content={
                                                                                                 data.services[keys].description
                                                                                             }
                                                                                             preferredPosition="above"
                                                                                         >
                                                                                         <Link>
                                                                                         <Icon
                                                                                             source="help"
                                                                                             color="inkLighter"
                                                                                             backdrop={true}
                                                                                         />
                                                                                         </Link>
                                                                                         </Tooltip>
                                                                                         </span>
                                                                                </p>
                                                                                {Object.keys(
                                                                                    data.services[keys].services
                                                                                ).map(key1 => {
                                                                                    if (
                                                                                        data.services[keys].services[key1]
                                                                                            .required === 1
                                                                                    ) {
                                                                                        return (
                                                                                            <div key={key1}
                                                                                                 className="text-left">
                                                                                                <Checkbox
                                                                                                    checked={true}
                                                                                                    label={
                                                                                                        data.services[keys].services[key1]
                                                                                                            .title
                                                                                                    }
                                                                                                    disabled={true}
                                                                                                />
                                                                                            </div>
                                                                                        );
                                                                                    } else {
                                                                                        let temp = this.state.checkBox.slice(0);
                                                                                        let flag = 0;
                                                                                        temp.forEach(valueData => {
                                                                                            if (
                                                                                                valueData.code ===
                                                                                                data.services[keys].services[key1]
                                                                                                    .code
                                                                                            ) {
                                                                                                if (valueData.key === data.id) {
                                                                                                    flag = 1;
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                        if (flag === 0) {
                                                                                            temp.push({
                                                                                                code: data.services[keys].services[key1]
                                                                                                    .code,
                                                                                                isSelected: false,
                                                                                                key: data.id,
                                                                                                id: key1
                                                                                            });
                                                                                            this.state.checkBox = temp;
                                                                                        }
                                                                                        return (
                                                                                            <div key={key1}
                                                                                                 className="text-left">
                                                                                                {this.state.checkBox.map(KEYS => {
                                                                                                    if (
                                                                                                        KEYS.code ===
                                                                                                        data.services[keys].services[
                                                                                                            key1
                                                                                                            ].code &&
                                                                                                        KEYS.key === data.id
                                                                                                    ) {
                                                                                                        return (
                                                                                                            <div
                                                                                                                className="p-2"
                                                                                                                key={KEYS.code}
                                                                                                                style={{
                                                                                                                    backgroundColor: "#FCF1CD"
                                                                                                                }}
                                                                                                            >
                                                                                                                <Checkbox
                                                                                                                    checked={KEYS.isSelected}
                                                                                                                    label={
                                                                                                                        data.services[keys]
                                                                                                                            .services[key1].title
                                                                                                                    }
                                                                                                                    onChange={this.onCheckBox.bind(
                                                                                                                        this,
                                                                                                                        data.services[keys]
                                                                                                                            .services[key1].code,
                                                                                                                        data.id
                                                                                                                    )}
                                                                                                                />
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                })}
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                })}
                                                                            </React.Fragment>
                                                                        );
                                                                    })
                                                                    : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>)
                                        }
                                       /* return (
                                            {/!*<div className="col-12 mb-4" key={index}>
                                                 Starting Of Plan Card
                                                <Card>
                                                    <div className="d-flex justify-content-center p-5">
                                                        <div className="pt-5">
                                                            <div className="mb-5 text-center">
                                                                {" "}
                                                                 Plan Numeric Price
                                                                <p className="price-tag">
                                                                    <span className="price-tag_small">$</span>
                                                                    <span className="price-tag_discount"><strike>{data.originalValue}</strike></span>
                                                                    {data.main_price}
                                                                    <span className="price-tag_small">
                                                                        {data.validity_display}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div className="mb-5">
                                                                {" "}
                                                                 Button To choose Plan
                                                                <Button
                                                                    primary={true}
                                                                    fullWidth={true}
                                                                    size="large"
                                                                    disabled={
                                                                        data.main_price === 0 || data.main_price === "0"
                                                                    }
                                                                    onClick={this.onSelectPlan.bind(this, data)}
                                                                >
                                                                    {data.main_price === 0 || data.main_price === "0"
                                                                        ? "Select Marketplace"
                                                                        : "Choose Plan"}
                                                                </Button>
                                                            </div>
                                                            <div className="mb-5 text-center">
                                                                {" "}
                                                                 Descriptions For Particular deatails
                                                                <h1 className="mb-4">
                                                                    <b>{data.title}</b>
                                                                </h1>
                                                                <h4>{data.description}</h4>
                                                            </div>
                                                            <hr />
                                                            <div className="text-center mt-5">
                                                                {" "}
                                                                 Services Data
                                                                {data.services
                                                                    ? Object.keys(data.services).map(keys => {
                                                                        return (
                                                                            <React.Fragment key={keys}>
                                                                                <p className="service-body mb-5">
                                                                                         <span
                                                                                             className="service-description mb-3"
                                                                                             style={{fontWeight: "bold"}}
                                                                                         >
                                                                                         <b>{data.services[keys].title}</b>
                                                                                         </span>
                                                                                    <span>
                                                                                         <Tooltip
                                                                                             content={
                                                                                                 data.services[keys].description
                                                                                             }
                                                                                             preferredPosition="above"
                                                                                         >
                                                                                         <Link>
                                                                                         <Icon
                                                                                             source="help"
                                                                                             color="inkLighter"
                                                                                             backdrop={true}
                                                                                         />
                                                                                         </Link>
                                                                                         </Tooltip>
                                                                                         </span>
                                                                                </p>
                                                                                {Object.keys(
                                                                                    data.services[keys].services
                                                                                ).map(key1 => {
                                                                                    if (
                                                                                        data.services[keys].services[key1]
                                                                                            .required === 1
                                                                                    ) {
                                                                                        return (
                                                                                            <div key={key1}
                                                                                                 className="text-left">
                                                                                                <Checkbox
                                                                                                    checked={true}
                                                                                                    label={
                                                                                                        data.services[keys].services[key1]
                                                                                                            .title
                                                                                                    }
                                                                                                    disabled={true}
                                                                                                />
                                                                                            </div>
                                                                                        );
                                                                                    } else {
                                                                                        let temp = this.state.checkBox.slice(0);
                                                                                        let flag = 0;
                                                                                        temp.forEach(valueData => {
                                                                                            if (
                                                                                                valueData.code ===
                                                                                                data.services[keys].services[key1]
                                                                                                    .code
                                                                                            ) {
                                                                                                if (valueData.key === data.id) {
                                                                                                    flag = 1;
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                        if (flag === 0) {
                                                                                            temp.push({
                                                                                                code: data.services[keys].services[key1]
                                                                                                    .code,
                                                                                                isSelected: false,
                                                                                                key: data.id,
                                                                                                id: key1
                                                                                            });
                                                                                            this.state.checkBox = temp;
                                                                                        }
                                                                                        return (
                                                                                            <div key={key1}
                                                                                                 className="text-left">
                                                                                                {this.state.checkBox.map(KEYS => {
                                                                                                    if (
                                                                                                        KEYS.code ===
                                                                                                        data.services[keys].services[
                                                                                                            key1
                                                                                                            ].code &&
                                                                                                        KEYS.key === data.id
                                                                                                    ) {
                                                                                                        return (
                                                                                                            <div
                                                                                                                className="p-2"
                                                                                                                key={KEYS.code}
                                                                                                                style={{
                                                                                                                    backgroundColor: "#FCF1CD"
                                                                                                                }}
                                                                                                            >
                                                                                                                <Checkbox
                                                                                                                    checked={KEYS.isSelected}
                                                                                                                    label={
                                                                                                                        data.services[keys]
                                                                                                                            .services[key1].title
                                                                                                                    }
                                                                                                                    onChange={this.onCheckBox.bind(
                                                                                                                        this,
                                                                                                                        data.services[keys]
                                                                                                                            .services[key1].code,
                                                                                                                        data.id
                                                                                                                    )}
                                                                                                                />
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                })}
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                })}
                                                                            </React.Fragment>
                                                                        );
                                                                    })
                                                                    : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>*!/}
                                        );*/

                                    })}
                                </Collapsible>
                            </Stack>
                        </Page>
                    </div>
                    <div className="col-12 mb-2">
                        <div
                            style={{cursor: "pointer"}}
                            onClick={this.handleToggleClickFba.bind(this.state.fba_plan)}
                        >
                            <Banner title="FBA Order Management" icon="view" status="attention">
                                <p><b>Fulfillment By Amazon</b></p>
                            </Banner>
                        </div>
                            <Collapsible open={this.state.fba_plan}
                                         ariaExpanded={this.state.fba_plan}
                            >
                                {this.state.data.map((data, index) => {
                                    console.log("qwerty", data);
                                    console.log("merchant", index);
                                    if(data.title === "FBA"){
                                        return( <div className="col-12 m-4" key={index}>
                                            {/* Starting Of Plan Card */}
                                            <Card>
                                                <div className="d-flex justify-content-center p-5">
                                                    <div className="pt-5">
                                                        <div className="mb-5 text-center">
                                                            {" "}
                                                            {/* Plan Numeric Price */}
                                                            <p className="price-tag">
                                                                <span className="price-tag_small">$</span>
                                                                {/*<span className="price-tag_discount"><strike>{data.originalValue}</strike></span>*/}
                                                                {data.main_price}
                                                                <span className="price-tag_small">
                                                                        {data.validity_display}
                                                                    </span>
                                                            </p>
                                                        </div>
                                                        <div className="mb-5">
                                                            {" "}
                                                            {/* Button To choose Plan */}
                                                            <Button
                                                                primary={true}
                                                                fullWidth={true}
                                                                size="large"
                                                                disabled={
                                                                    data.main_price === 0 || data.main_price === "0"
                                                                }
                                                                onClick={this.onSelectPlan.bind(this, data)}
                                                            >
                                                                {data.main_price === 0 || data.main_price === "0"
                                                                    ? "Select Marketplace"
                                                                    : "Choose Plan"}
                                                            </Button>
                                                        </div>
                                                        <div className="mb-5 text-center">
                                                            {" "}
                                                            {/* Descriptions For Particular deatails */}
                                                            <h1 className="mb-4">
                                                                <b>{data.title}</b>
                                                            </h1>
                                                            <h4>{data.description}</h4>
                                                        </div>
                                                        <hr />
                                                        <div className="text-center mt-5">
                                                            {" "}
                                                            {/* Services Data */}
                                                            {data.services
                                                                ? Object.keys(data.services).map(keys => {
                                                                    return (
                                                                        <React.Fragment key={keys}>
                                                                            <p className="service-body mb-5">
                                                                                         <span
                                                                                             className="service-description mb-3"
                                                                                             style={{fontWeight: "bold"}}
                                                                                         >
                                                                                         <b>{data.services[keys].title}</b>
                                                                                         </span>
                                                                                <span>
                                                                                         <Tooltip
                                                                                             content={
                                                                                                 data.services[keys].description
                                                                                             }
                                                                                             preferredPosition="above"
                                                                                         >
                                                                                         <Link>
                                                                                         <Icon
                                                                                             source="help"
                                                                                             color="inkLighter"
                                                                                             backdrop={true}
                                                                                         />
                                                                                         </Link>
                                                                                         </Tooltip>
                                                                                         </span>
                                                                            </p>
                                                                            {Object.keys(
                                                                                data.services[keys].services
                                                                            ).map(key1 => {
                                                                                if (
                                                                                    data.services[keys].services[key1]
                                                                                        .required === 1
                                                                                ) {
                                                                                    return (
                                                                                        <div key={key1}
                                                                                             className="text-left">
                                                                                            <Checkbox
                                                                                                checked={true}
                                                                                                label={
                                                                                                    data.services[keys].services[key1]
                                                                                                        .title
                                                                                                }
                                                                                                disabled={true}
                                                                                            />
                                                                                        </div>
                                                                                    );
                                                                                } else {
                                                                                    let temp = this.state.checkBox.slice(0);
                                                                                    let flag = 0;
                                                                                    temp.forEach(valueData => {
                                                                                        if (
                                                                                            valueData.code ===
                                                                                            data.services[keys].services[key1]
                                                                                                .code
                                                                                        ) {
                                                                                            if (valueData.key === data.id) {
                                                                                                flag = 1;
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                    if (flag === 0) {
                                                                                        temp.push({
                                                                                            code: data.services[keys].services[key1]
                                                                                                .code,
                                                                                            isSelected: false,
                                                                                            key: data.id,
                                                                                            id: key1
                                                                                        });
                                                                                        this.state.checkBox = temp;
                                                                                    }
                                                                                    return (
                                                                                        <div key={key1}
                                                                                             className="text-left">
                                                                                            {this.state.checkBox.map(KEYS => {
                                                                                                if (
                                                                                                    KEYS.code ===
                                                                                                    data.services[keys].services[
                                                                                                        key1
                                                                                                        ].code &&
                                                                                                    KEYS.key === data.id
                                                                                                ) {
                                                                                                    return (
                                                                                                        <div
                                                                                                            className="p-2"
                                                                                                            key={KEYS.code}
                                                                                                            style={{
                                                                                                                backgroundColor: "#FCF1CD"
                                                                                                            }}
                                                                                                        >
                                                                                                            <Checkbox
                                                                                                                checked={KEYS.isSelected}
                                                                                                                label={
                                                                                                                    data.services[keys]
                                                                                                                        .services[key1].title
                                                                                                                }
                                                                                                                onChange={this.onCheckBox.bind(
                                                                                                                    this,
                                                                                                                    data.services[keys]
                                                                                                                        .services[key1].code,
                                                                                                                    data.id
                                                                                                                )}
                                                                                                            />
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                            })}
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            })}
                                                                        </React.Fragment>
                                                                    );
                                                                })
                                                                : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>)
                                    }
                                    /* return (
                                     {/!*<div className="col-12 mb-4" key={index}>
                                     Starting Of Plan Card
                                     <Card>
                                     <div className="d-flex justify-content-center p-5">
                                     <div className="pt-5">
                                     <div className="mb-5 text-center">
                                     {" "}
                                     Plan Numeric Price
                                     <p className="price-tag">
                                     <span className="price-tag_small">$</span>
                                     <span className="price-tag_discount"><strike>{data.originalValue}</strike></span>
                                     {data.main_price}
                                     <span className="price-tag_small">
                                     {data.validity_display}
                                     </span>
                                     </p>
                                     </div>
                                     <div className="mb-5">
                                     {" "}
                                     Button To choose Plan
                                     <Button
                                     primary={true}
                                     fullWidth={true}
                                     size="large"
                                     disabled={
                                     data.main_price === 0 || data.main_price === "0"
                                     }
                                     onClick={this.onSelectPlan.bind(this, data)}
                                     >
                                     {data.main_price === 0 || data.main_price === "0"
                                     ? "Select Marketplace"
                                     : "Choose Plan"}
                                     </Button>
                                     </div>
                                     <div className="mb-5 text-center">
                                     {" "}
                                     Descriptions For Particular deatails
                                     <h1 className="mb-4">
                                     <b>{data.title}</b>
                                     </h1>
                                     <h4>{data.description}</h4>
                                     </div>
                                     <hr />
                                     <div className="text-center mt-5">
                                     {" "}
                                     Services Data
                                     {data.services
                                     ? Object.keys(data.services).map(keys => {
                                     return (
                                     <React.Fragment key={keys}>
                                     <p className="service-body mb-5">
                                     <span
                                     className="service-description mb-3"
                                     style={{fontWeight: "bold"}}
                                     >
                                     <b>{data.services[keys].title}</b>
                                     </span>
                                     <span>
                                     <Tooltip
                                     content={
                                     data.services[keys].description
                                     }
                                     preferredPosition="above"
                                     >
                                     <Link>
                                     <Icon
                                     source="help"
                                     color="inkLighter"
                                     backdrop={true}
                                     />
                                     </Link>
                                     </Tooltip>
                                     </span>
                                     </p>
                                     {Object.keys(
                                     data.services[keys].services
                                     ).map(key1 => {
                                     if (
                                     data.services[keys].services[key1]
                                     .required === 1
                                     ) {
                                     return (
                                     <div key={key1}
                                     className="text-left">
                                     <Checkbox
                                     checked={true}
                                     label={
                                     data.services[keys].services[key1]
                                     .title
                                     }
                                     disabled={true}
                                     />
                                     </div>
                                     );
                                     } else {
                                     let temp = this.state.checkBox.slice(0);
                                     let flag = 0;
                                     temp.forEach(valueData => {
                                     if (
                                     valueData.code ===
                                     data.services[keys].services[key1]
                                     .code
                                     ) {
                                     if (valueData.key === data.id) {
                                     flag = 1;
                                     }
                                     }
                                     });
                                     if (flag === 0) {
                                     temp.push({
                                     code: data.services[keys].services[key1]
                                     .code,
                                     isSelected: false,
                                     key: data.id,
                                     id: key1
                                     });
                                     this.state.checkBox = temp;
                                     }
                                     return (
                                     <div key={key1}
                                     className="text-left">
                                     {this.state.checkBox.map(KEYS => {
                                     if (
                                     KEYS.code ===
                                     data.services[keys].services[
                                     key1
                                     ].code &&
                                     KEYS.key === data.id
                                     ) {
                                     return (
                                     <div
                                     className="p-2"
                                     key={KEYS.code}
                                     style={{
                                     backgroundColor: "#FCF1CD"
                                     }}
                                     >
                                     <Checkbox
                                     checked={KEYS.isSelected}
                                     label={
                                     data.services[keys]
                                     .services[key1].title
                                     }
                                     onChange={this.onCheckBox.bind(
                                     this,
                                     data.services[keys]
                                     .services[key1].code,
                                     data.id
                                     )}
                                     />
                                     </div>
                                     );
                                     }
                                     })}
                                     </div>
                                     );
                                     }
                                     })}
                                     </React.Fragment>
                                     );
                                     })
                                     : null}
                                     </div>
                                     </div>
                                     </div>
                                     </Card>
                                     </div>*!/}
                                     );*/

                                })}
                            </Collapsible>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    /*render() {
     return (
     <React.Fragment>
     <div className="row">
     <div className="col-12">
     <div className="row pt-4 pb-4">
     <div className="col-3 d-md-block d-sm-none">
     <hr />
     </div>
     <div className="col-md-6 col-sm-12 col-12 text-center">
     <DisplayText element="h3">Product Import Charges</DisplayText>
     <h2><b>One Time Payment</b></h2>
     </div>
     <div className="col-3 d-md-block d-sm-none">
     <hr />
     </div>
     </div>
     </div>
     <div className="col-12 p-3">
     <Card>
     <div className="row p-5">
     <div className="col-12 text-center pt-5 pb-2">
     <div className="mb-5 text-center">
     <p className="price-tag">
     <span className="price-tag_small">$</span>
     {this.state.perProductCharge}
     <span className="price-tag_small">/ product</span>
     </p>
     </div>
     </div>
     <div className="col-12 p-3">
     <Card>
     <div className="row p-5">
     <div className="col-md-3 col-sm-12 col-12 text-center">
     <TextField
     label="Product Count"
     type="number"
     value={this.state.oneTimePaymentDetails.totalCredits}
     onChange={this.handleCreditsChange.bind(this)}
     helpText="No. of product you want to upload on Shopify"
     />
     </div>
     <div className="col-md-1 col-sm-12 col-12 text-center pt-5">
     <h2>
     <b>X</b>
     </h2>
     </div>
     <div className="col-md-3 col-sm-12 col-12 text-center pt-5">
     <div className="mb-5 text-center">
     <p className="price-tag">
     <span className="price-tag_small">$</span>
     {this.state.perProductCharge}
     </p>
     </div>
     </div>
     <div className="col-md-1 col-sm-12 col-12 text-center pt-5">
     <h2>
     <b>=</b>
     </h2>
     </div>
     <div className="col-md-4 col-sm-12 col-12 text-center pt-5">
     <div className="mb-5 text-center">
     <p className="price-tag">
     <span className="price-tag_small">$</span>
     {this.state.oneTimePaymentDetails.original_price !==
     this.state.oneTimePaymentDetails.totalAmount && (
     <span className="price-tag_small">
     <strike>
     {
     this.state.oneTimePaymentDetails
     .original_price
     }
     </strike>
     </span>
     )}
     {this.state.oneTimePaymentDetails.totalAmount}
     </p>
     </div>
     <Label id="payable_amount">Payable Amount</Label>
     <div>
     <span style={{color: "#7d7d7d"}}>
     <Label>( should be more than 0.5$ )</Label>
     </span>
     </div>
     <div>
     <span style={{color: "#7d7d7d"}}>
     <Label>
     ( Discount{" "}
     {
     this.state.oneTimePaymentDetails
     .discount_percentage
     }{" "}
     % )
     </Label>
     </span>
     </div>
     </div>
     </div>
     </Card>
     </div>
     <div className="col-12 text-center pt-3 pb-2">
     <Button
     primary={true}
     size="large"
     disabled={
     this.state.oneTimePaymentDetails.totalAmount < 0.6
     }
     onClick={() => {
     this.makePaymentForImporter();
     }}
     >
     Make Payment
     </Button>
     </div>
     </div>
     </Card>
     </div>
     <div className="col-12">
     <div className="row pt-4 pb-4">
     <div className="col-3 d-md-block d-sm-none">
     <hr />
     </div>
     <div className="col-md-6 col-sm-12 col-12 text-center">
     <DisplayText element="h3">Product And Order Syncing Charges</DisplayText>
     </div>
     <div className="col-3 d-md-block d-sm-none">
     <hr />
     </div>
     </div>
     </div>
     {this.state.data.map((data, index) => {
     return (
     <div className="col-sm-4 col-12 mb-4" key={index}>
     {/!* Starting Of Plan Card *!/}
     <Card>
     <div className="d-flex justify-content-center p-5">
     <div className="pt-5">
     <div className="mb-5 text-center">
     {" "}
     {/!* Plan Numeric Price *!/}
     <p className="price-tag">
     <span className="price-tag_small">$</span>
     {/!*<span className="price-tag_discount"><strike>{data.originalValue}</strike></span>*!/}
     {data.main_price}
     <span className="price-tag_small">
     {data.validity_display}
     </span>
     </p>
     </div>
     <div className="mb-5">
     {" "}
     {/!* Button To choose Plan *!/}
     <Button
     primary={true}
     fullWidth={true}
     size="large"
     disabled={
     data.main_price === 0 || data.main_price === "0"
     }
     onClick={this.onSelectPlan.bind(this, data)}
     >
     {data.main_price === 0 || data.main_price === "0"
     ? "Select Marketplace"
     : "Choose Plan"}
     </Button>
     </div>
     <div className="mb-5 text-center">
     {" "}
     {/!* Descriptions For Particular deatails *!/}
     <h1 className="mb-4">
     <b>{data.title}</b>
     </h1>
     <h4>{data.description}</h4>
     </div>
     <hr />
     <div className="text-center mt-5">
     {" "}
     {/!* Services Data *!/}
     {data.services
     ? Object.keys(data.services).map(keys => {
     return (
     <React.Fragment key={keys}>
     <p className="service-body mb-5">
     <span
     className="service-description mb-3"
     style={{fontWeight: "bold"}}
     >
     <b>{data.services[keys].title}</b>
     </span>
     <span>
     <Tooltip
     content={
     data.services[keys].description
     }
     preferredPosition="above"
     >
     <Link>
     <Icon
     source="help"
     color="inkLighter"
     backdrop={true}
     />
     </Link>
     </Tooltip>
     </span>
     </p>
     {Object.keys(
     data.services[keys].services
     ).map(key1 => {
     if (
     data.services[keys].services[key1]
     .required === 1
     ) {
     return (
     <div key={key1} className="text-left">
     <Checkbox
     checked={true}
     label={
     data.services[keys].services[key1]
     .title
     }
     disabled={true}
     />
     </div>
     );
     } else {
     let temp = this.state.checkBox.slice(0);
     let flag = 0;
     temp.forEach(valueData => {
     if (
     valueData.code ===
     data.services[keys].services[key1]
     .code
     ) {
     if (valueData.key === data.id) {
     flag = 1;
     }
     }
     });
     if (flag === 0) {
     temp.push({
     code: data.services[keys].services[key1]
     .code,
     isSelected: false,
     key: data.id,
     id: key1
     });
     this.state.checkBox = temp;
     }
     return (
     <div key={key1} className="text-left">
     {this.state.checkBox.map(KEYS => {
     if (
     KEYS.code ===
     data.services[keys].services[
     key1
     ].code &&
     KEYS.key === data.id
     ) {
     return (
     <div
     className="p-2"
     key={KEYS.code}
     style={{
     backgroundColor: "#FCF1CD"
     }}
     >
     <Checkbox
     checked={KEYS.isSelected}
     label={
     data.services[keys]
     .services[key1].title
     }
     onChange={this.onCheckBox.bind(
     this,
     data.services[keys]
     .services[key1].code,
     data.id
     )}
     />
     </div>
     );
     }
     })}
     </div>
     );
     }
     })}
     </React.Fragment>
     );
     })
     : null}
     </div>
     </div>
     </div>
     </Card>
     </div>
     );
     })}
     </div>
     <Modal
     title={this.state.schemaModal.title}
     open={this.state.schemaModal.show}
     primaryAction={{
     content: "Submit",
     onClick: () => {
     this.submit();
     }
     }}
     onClose={this.toggleSchemaModal}
     >
     <Modal.Section>{this.state.schemaModal.body}</Modal.Section>
     </Modal>{" "}
     {/!* this is used in payment Method *!/}
     </React.Fragment>
     );
     }*/
    getSchema(arg, plan) {
        let data = this.state.schemaData;
        if (plan !== null) {
            data.plan = plan;
        }
        this.setState({
            schemaData: data
        });
        if (!isUndefined(arg.show_payment_methods)) {
            this.setSchema(1, arg.payment_methods);
        } else if (!isUndefined(arg.schema)) {
            // arg.schema.push(JSON.parse('{"key":"included_destination","title":"Included Destination","value":["Shopping Actions"],"required":true,"type":"checkbox","options":{"Shopping":"Shopping","Shopping Actions":"Shopping Actions","Display Ads":"Display Ads"}}'));
            // arg.schema.push(JSON.parse('{"key":"Name","title":"Your Name","value":"","required":true,"type":"textfield"}'));
            this.setSchema(2, arg.schema);
        } else if (!isUndefined(arg.confirmation_url)) {
            this.setSchema(3, arg.confirmation_url);
        } else {
            this.setSchema(4, arg.payment_done);
        }
    } // this is responsible for deciding what data we get from server (schema, payment_method etc) and send info to setSchema

    setSchema(event, arg) {
        let data = this.state.schemaModal;
        data.show = true;
        data.title = "PAYMENT";
        switch (event) {
            case 1:
                data.body = this.paymentMethod(arg);
                break;
            case 2:
                data.body = this.createSchema(arg);
                break;
            case 3:
                this.openNewWindow(arg);
                break;
            case 4:
                this.paymentDone(arg);
                break;
            default:
                notify.info("Wrong Input");
        }
        this.setState({
            schemaModal: data
        });
    } // this function is responsible for creating the Body of Payment Modal

    paymentMethod(arg) {
        // let data = this.state.schemaData;
        // data.payment_method = arg[Object.keys(arg)[Object.keys(arg).length - 1]];
        // this.setState({
        //     schemaData: data,
        // });
        return (
            <Stack vertical>
                {Object.keys(arg).map((key, index) => {
                    return (
                        <RadioButton
                            key={index}
                            label={arg[key].title}
                            helpText={arg[key].description}
                            id={arg[key].code}
                            name="payment"
                            onChange={this.handleSchemaModalChange.bind(this, arg[key])}
                        />
                    );
                })}
            </Stack>
        );
    } // create a choose payment method

    createSchema(arg) {
        let data = this.state.schemaModal;
        data.data = arg;
        this.setState({
            schemaModal: data
        });
        return arg.map((key, index) => {
            switch (key.type) {
                case "select":
                    let options = [];
                    Object.keys(key.options).forEach(e => {
                        if (this.state.schemaModal.data[index].value === "") {
                            let data2 = this.state.schemaData;
                            data2.schema = {};
                            data2.schema[this.state.schemaModal.data[index].key] =
                                key.options[e];
                            this.state.schemaModal.data[index].value = key.options[e];
                        }
                        options.push({label: e, value: key.options[e]});
                    });
                    let disable_flag = this.state.schemaShopSelected;
                    if (!disable_flag) {
                        options.forEach(e => {
                            if (e.value === globalState.getLocalStorage("shop")) {
                                disable_flag = true;
                                this.setState({schemaShopSelected: disable_flag});
                                this.schemaConfigurationChange(index, "select", e.value);
                            }
                        });
                    }
                    return (
                        <div key={index}>
                            <Select
                                options={options}
                                label={key.title}
                                disabled={disable_flag}
                                onChange={this.schemaConfigurationChange.bind(
                                    this,
                                    index,
                                    "select"
                                )}
                                value={this.state.schemaModal.data[index].value}
                            />
                        </div>
                    );
                case "checkbox":
                    return (
                        <div className="col-12 pt-2 pb-2 mt-4" key={index}>
                            <Label key={index} id={index}>
                                {key.title}
                            </Label>
                            <div className="row">
                                {Object.keys(key.options).map(option => {
                                    return (
                                        <div className="col-md-6 col-sm-6 col-12 p-1" key={option}>
                                            <Checkbox
                                                checked={key.value.indexOf(option) !== -1}
                                                label={option}
                                                onChange={this.schemaConfigurationChange.bind(
                                                    this,
                                                    index,
                                                    option
                                                )}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div className="mt-4" key={index}>
                            <TextField
                                label={key.title}
                                value={this.state.schemaModal.data[index].value}
                                onChange={this.schemaConfigurationChange.bind(
                                    this,
                                    index,
                                    "textbox"
                                )}
                            />
                        </div>
                    );
            }
        });
    } // create a schema For payment modal

    schemaConfigurationChange(index, type, value) {
        let data = this.state.schemaModal; // frontend data we need to maintain
        let data2 = this.state.schemaData; // server data we need to send
        if (isUndefined(data2.schema)) {
            // define a schema object
            data2.schema = {};
        }
        if (type === "select") {
            data2.schema[data.data[index].key] = value; // will set the server data (We need to send)
            data.data[index].value = value; // this is for frontend side data
        } else if (type === "textbox") {
            data2.schema[data.data[index].key] = value;
            data.data[index].value = value;
        } else {
            if (value) {
                data.data[index].value.push(type);
            } else {
                data.data[index].value.splice(data.data[index].value.indexOf(type), 1);
            }
            data2.schema[data.data[index].key] = data.data[index].value;
        }
        this.setState({
            schemaModal: data,
            schemaData: data2
        });
        this.setSchema(2, this.state.schemaModal.data);
    } // maintain the value of schema

    handleSchemaModalChange(status, plan, event) {
        let data = this.state.schemaData;
        data.payment_method = status;
        this.setState({
            schemaData: data
        });
    } // choose the payment method

    openNewWindow() {
        this.props.paymentStatus("Confirmation", true); // this will send Data to its parent Component
        this.toggleSchemaModal();
    } // open new Window

    paymentDone(arg) {
        this.toggleSchemaModal();
        if (arg) {
            notify.success("Payment Done");
            this.props.paymentStatus("Payment Completed");
        } else {
            notify.error("Something Went Wrong");
            this.props.paymentStatus("Something Went Wrong");
        }
    } // mainly its last step when data either succeed or fail (data come from server)

    submit() {
        if (this.validationCheck()) {
            let win = window.open(
                "",
                "_parent",
                "location=yes,height=600,width=550,scrollbars=yes,status=yes"
            ); // open new Window
            requests
                .postRequest("plan/plan/submitSchema", this.state.schemaData)
                .then(data => {
                    if (data.success) {
                        if (!isUndefined(data.data.confirmation_url)) {
                            win.location = data.data.confirmation_url;
                        } else {
                            win.close();
                        }
                        this.getSchema(data.data, null);
                    } else {
                        win.close();
                        notify.error(data.message);
                    }
                });
        }
    } // submit the data to server When clicked

    validationCheck() {
        const server = this.state.schemaData;
        const frontEnd = this.state.schemaModal.data;
        let validate = true;
        if (isUndefined(server.schema) && isUndefined(server.payment_method)) {
            notify.info("Please Fill Up The Field");
            return false;
        } else {
            Object.keys(frontEnd).forEach((data, index) => {
                if (frontEnd[data].required) {
                    let flag = 0;
                    Object.keys(server.schema).forEach(keys => {
                        if (frontEnd[data].key === keys) {
                            flag = 1;
                            if (frontEnd[data].type === "checkbox") {
                                if (server.schema[keys].length <= 0) {
                                    validate = false;
                                    notify.info(frontEnd[data].title + ": Please Select");
                                }
                            } else {
                                if (server.schema[keys] === "") {
                                    validate = false;
                                    notify.info(frontEnd[data].title + ": Empty Or Not Selected");
                                }
                            }
                        }
                    });
                    if (flag === 0) {
                        validate = false;
                        server.schema[frontEnd[index].key] = frontEnd[index].value;
                        this.submit();
                    }
                }
            });
        }
        return validate;
    } // this is for Validation check to make Sure User follow All Steps

    toggleSchemaModal() {
        const data = {
            show: false,
            title: "",
            body: "",
            data: ""
        };
        this.state.schemaModal.show = false;
        this.setState({
            schemaModal: data,
            schemaData: {
                plan: {}
            },
            schemaShopSelected: false
        });
    } // this will reset All the object And close the Modal of Payment
}

export default PlanBody;
