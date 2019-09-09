import React, {Component} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import * as queryString from "query-string";
import {isUndefined} from "util";
import {Modal, Label, Banner, Stack, TextField, Button} from "@shopify/polaris";
import 'font-awesome/css/font-awesome.min.css';
import {Products} from "./Components/products";
import {Apps} from "./Components/apps";
import {InstallApp} from "./Components/apps-component/install-app";
import {AppInstalled} from "./Components/apps-component/app-installed";
import {Import} from "./Components/import";
import {Profiling} from "./Components/profiling";
import {CreateProfile} from "./Components/profile-component/create-profile";
import {Configuration} from "./Components/configuration";
import {QueuedTask} from "./Components/queued_task";
import {Activities} from "./Components/queued-tasks-component/activities";
import {Plans} from "./Components/plans";
import {FbaOrder} from "./Components/fbaOrder"
// import {Orders} from "./Components/migrator-order/orders"
import {Header} from "./Layout/header";
import Dashboard from "./Components/dashboard";
import FAQPage from "./Components/faq";
import {environment} from "../../environments/environment";
import {panelFunctions} from "./functions";
import Guide from "./Components/dashboard/guide";
import CurrentPlan from "./Components/plans-component/current-plan";
import AnalyticsReporting from "./Components/products-component/analytics-reporting";
import BillingHistory from "./Components/plans-component/billing-history";
import ConnectedAccounts from "./Components/apps-component/connected-accounts";
import ReportAnIssue from "./Components/help-component/report-issue";
import ViewProfile from "./Components/profile-component/view-profile";
import ViewProducts from "./Components/products-component/view-products";
import {modifyAccountConnectedInfo} from "./Components/static-functions";

import {requests} from "../../services/request";
import {capitalizeWord} from "./Components/static-functions";
import {notify} from "../../services/notify";
import {validateImporter} from "./Components/static-functions.js";
import "./panel.css";
import FileMapping from "./Components/import-component/FileMapping";

export class Panel extends Component {
    constructor(props) {
        super(props)

        this.state = {
            header: true,
            necessaryInfo: {},
            fbapresent: false,
            product_upload: 0,
            product_import: 0,
            show_rating_popup: false,
            /*show_etsy_popup: true,*/
            show_button_submit:false,
            // rating: 0,
            value: '',
        };
        this.disableHeader = this.disableHeader.bind(this);
        this.getNecessaryInfo = this.getNecessaryInfo.bind(this);
        this.getNecessaryInfo();
        this.getRatingDataBackend();
    }

    /*    updateState() {
     let {state} = this.state;
     this.setState({state})

     }*/
    /*
     changeRating(newRating, name) {
     /!*this.state.rating=newRating;
     this.updateState();*!/
     this.setState({
     rating: newRating
     })

     }*/



    getRatingDataBackend() {
        requests.getRequest('frontend/importer/fetchReviewRatingData').then(data => {
            if (data.success) {
                if (data.data[0]['is_Done_Rating'] == 1) {
                }
                else {
                    this.getAllMarketPlace();
                }

            }
            else {
                this.getAllMarketPlace();
            }
        })
    }

    thumbUp() {
        // console.log("thumbs up")
        var data = [
            {"thumb_action": 'up'},
            {"submit_review": 1},
            {"textbox_query": this.state.value}
        ];

        requests.postRequest('frontend/importer/reviewRatingData', {data: data}, false, true).then(response1 => {
            if (response1.success) {
                window.open('https://apps.shopify.com/omni-importer?surface_detail=webcommerce&surface_inter_position=1&surface_intra_position=4&surface_type=search#reviews', '_blank');
                this.setState({show_rating_popup: false});
                notify.success(response1.message)
            }
            else {
                notify.error(response1.message)
            }
        });
    }
    thumbDown(){
        // console.log("thumbs down")
        this.setState({show_button_submit: true});

    }

    forButtonCancel() {
        this.setState({show_rating_popup: false});
    }
    forButtonSubmit(){
        if (this.state.value == ''){
            alert("Please tell us issue?")
        }
        else {
            var data = [
                {"thumb_action": 'down'},
                {"submit_review": 1},
                {"textbox_query": this.state.value}
            ];

            requests.postRequest('frontend/importer/reviewRatingData', {data: data}, false, true).then(response1 => {
                if (response1.success) {
                    // window.open('https://apps.shopify.com/omni-importer?surface_detail=webcommerce&surface_inter_position=1&surface_intra_position=4&surface_type=search#reviews', '_blank');
                    this.setState({show_rating_popup: false});
                    notify.success(response1.message)
                }
                else {
                    notify.error(response1.message)
                }
            });
        }

    }


    forReviewNeverAgain() {
        // console.log("never ask again");
        var data = [
            {"submit_review": 1},
            {"textbox_query": 'Clicked on Never Ask Again'}
        ];
        requests.postRequest('frontend/importer/neverAskAgainForRating', {data: data}, false, true).then(response1 => {
            if (response1.success) {
                this.setState({show_rating_popup: false});
                notify.success(response1.message)
            }
            else {
                notify.error(response1.message)
            }
        });

    }

    componentWillMount() {
        const params = queryString.parse(this.props.location.search);
        if (!isUndefined(params.hmac) && !isUndefined(params.shop)) {
            let url = environment.API_ENDPOINT + "shopify/site/login?";
            let end = "";
            for (let i = 0; i < Object.keys(params).length; i++) {
                const key = Object.keys(params)[i];
                url += end + key + "=" + params[key];
                end = "&";
            }
            window.location = url;
        }
    }

    getNecessaryInfo() {
        requests.postRequest("frontend/app/getNecessaryDetails").then(e => {
            if (e.success) {
                console.log("response",e)
                let account_connected_array = e["account_connected"].map(e => e.code);
                let account_connected = modifyAccountConnectedInfo(
                    account_connected_array
                );
                let credits = {};
                let sync = {};
                if (typeof e["services"] === "object") {
                    e["services"].forEach(e => {
                        if (e.code === "product_import") {
                            credits = e;
                        } else if (e.code === "product_sync") {
                            sync = e;
                        }
                    });
                    if (credits["available_credits"] < 5) {
                        this.setState({creditsExpired: true});
                    }
                }
                let user_necessary_details = {
                    account_connected: account_connected,
                    services: e["services"],
                    credits: credits,
                    sync: sync,
                    account_connected_array: account_connected_array,
                    import_count:e.import_count,
                    upload_count:e.upload_count,
                };
                this.setState({
                    necessaryInfo: user_necessary_details
                }, () => {
                    this.checkingFba();
                });
            }
        });
    }

    getUploadCount() {
        let total_product_upload = 0;
        requests
            .postRequest("frontend/app/getUploadedProductsCount", {})
            .then(data1 => {
                if (data1.success && (data1.data.length > 0)) {
                    Object.keys(data1.data).forEach(e => {
                        if (data1.data[e] !== undefined) {
                            total_product_upload = total_product_upload + data1.data[e]["count"];
                        }
                    });
                    this.setState({
                        product_upload: total_product_upload
                    })
                    if (this.state.product_upload > 10) {
                        let partial_import = (this.state.product_import * 10) / 100;
                        // console.log(partial_import);
                        // console.log(this.state.product_upload);
                        if (this.state.product_upload >= partial_import && this.state.product_upload <= this.state.product_import) {
                            this.setState({
                                show_rating_popup: true
                            })
                        }
                    }
                }
            });
    }

    getAllMarketPlace() {
        let importer_title = [];
        let importer = {};
        let importer_marketplace = [];
        requests
            .getRequest("connector/get/services?filters[type]=importer")
            .then(data => {
                if (data.success) {
                    importer = data.data;
                    Object.keys(importer).map(importerkey => {
                        if (validateImporter(importerkey)) {
                            importer_title.push(importer[importerkey]["title"]);
                            importer_marketplace.push(importer[importerkey]["marketplace"]);
                        }
                    });
                    this.importCount(
                        importer_marketplace,
                        importer_title,
                        importer
                    );
                    this.setState({importer: importer_title});
                } else {
                    notify.error(data.message);
                }
            });
    }

    importCount(importer_marketplace_array,
                importer_title_array,
                entire_data_importer) {
        let count_of_product = 0;
        requests
            .postRequest("frontend/app/getImportedProductCount", {
                importers: importer_marketplace_array
            }, false, true)
            .then(data => {
                if (data.success) {
                    // console.log(data.data.importers)
                    Object.keys(data.data).forEach(e => {
                        if (data.data[e] !== undefined) {
                            count_of_product = count_of_product + data.data[e];

                        }
                    });
                    this.setState({
                        product_import: count_of_product
                    })
                    if (this.state.product_import > 10) {

                        this.getUploadCount();
                    }
                }
            });
    }


    componentWillUpdate() {
        if (environment.isLive) {
            // console.clear();
            console.info("Welcome To OMNI-Importer");
        }
    }

    componentDidMount() {
        this.checkingFba();
    }

    disableHeader(value) {
        if (!value) {
            // console.clear();
        }
        this.setState({header: value});
    }

    menu = panelFunctions.getMenu();

    checkingFba() {
        if (this.state.necessaryInfo.account_connected_array) {
             // console.log(this.state.necessaryInfo.account_connected_array);
            let flag = false;
            if (this.state.necessaryInfo.account_connected_array.indexOf('fba') < 0) {
                for (let i = 0; i < this.menu.length; i++) {
                    if (this.menu[i]['id'] == "fbaorders") {
                        this.menu.splice(i, 1);
                    }
                }
            }

        }
    }

    handleChange = (value) => {
        this.setState({value});
    };

    render() {
        const {rating} = this.state;
        return (
            <div className="container-fluid app-panel-container">
                <div className="row">
                    <div className="col-12">
                        <div className="app-header">
                            {this.state.header ? (
                                <Header menu={this.menu} history={this.props.history}/>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="row h-100 app-panel">
                    <div className="col-12">
                        <Switch>
                            <Route
                                exact
                                path="/panel/"
                                render={() => <Redirect to="/panel/dashboard"/>}
                            />

                            <Route
                                exact
                                path="/panel/products"
                                render={() => {
                                    return (
                                        <Products
                                            {...this.props}
                                            necessaryInfo={this.state.necessaryInfo}
                                        />
                                    );
                                }}
                            />

                            <Route
                                exact
                                path="/panel/fbaOrders"
                                render={() => {
                                    return (
                                        <FbaOrder
                                            {...this.props}
                                            necessaryInfo={this.state.necessaryInfo}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/panel/products/view/:id"
                                component={ViewProducts}
                            />
                            <Route
                                exact
                                path="/panel/products/analysis"
                                component={AnalyticsReporting}
                            />
                            <Route
                                exact
                                path="/panel/accounts"
                                render={() => {
                                    return (
                                        <Apps
                                            {...this.props}
                                            getNecessaryInfo={this.getNecessaryInfo}
                                            necessaryInfo={this.state.necessaryInfo}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/panel/accounts/connect"
                                component={ConnectedAccounts}
                            />

                            <Route
                                exact
                                path="/panel/plans"
                                render={() => {
                                    return (
                                        <Plans
                                            {...this.props}
                                            getNecessaryInfo={this.getNecessaryInfo}
                                            necessaryInfo={this.state.necessaryInfo}
                                        />
                                    );
                                }}
                            />

                            <Route path="/panel/accounts/install" component={InstallApp}/>
                            <Route path="/panel/accounts/success" component={AppInstalled}/>
                            {/*<Route path="/panel/order" component={Orders}/>*/}

                            <Route
                                exact
                                path="/panel/import"
                                render={() => {
                                    return (
                                        <Import
                                            {...this.props}
                                            getNecessaryInfo={this.getNecessaryInfo}
                                            necessaryInfo={this.state.necessaryInfo}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/panel/import/mapping"
                                render={() => {
                                    return (
                                        <FileMapping
                                            {...this.props}
                                            getNecessaryInfo={this.getNecessaryInfo}
                                            necessaryInfo={this.state.necessaryInfo}
                                        />
                                    );
                                }}
                            />
                            <Route exact path="/panel/profiling" component={Profiling}/>
                            <Route
                                exact
                                path="/panel/profiling/view"
                                component={ViewProfile}
                            />
                            <Route
                                exact
                                path="/panel/profiling/create"
                                component={CreateProfile}
                            />
                            <Route
                                exact
                                path="/panel/configuration"
                                render={() => {
                                    return (
                                        <Configuration
                                            {...this.props}
                                            necessaryInfo={this.state.necessaryInfo}
                                        />
                                    );
                                }}
                            />
                            <Route exact path="/panel/plans" component={Plans}/>
                            <Route
                                exact
                                path="/panel/plans/current"
                                component={CurrentPlan}
                            />
                            <Route
                                exact
                                path="/panel/plans/history"
                                component={BillingHistory}
                            />
                            <Route exact path="/panel/queuedtasks" component={QueuedTask}/>
                            <Route
                                exact
                                path="/panel/queuedtasks/activities"
                                component={Activities}
                            />
                            <Route
                                exact
                                path="/panel/help"
                                render={() => {
                                    return (
                                        <FAQPage
                                            {...this.props}
                                            necessaryInfo={this.state.necessaryInfo}
                                            disableHeader={this.disableHeader}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/panel/help/report"
                                component={ReportAnIssue}
                            />
                            <Route exact path="/panel/dashboard/guide" component={Guide}/>
                            <Route
                                exact
                                path="/panel/dashboard"
                                render={() => {
                                    return (
                                        <Dashboard
                                            disableHeader={this.disableHeader}
                                            necessaryInfo={this.state.necessaryInfo}
                                            {...this.props}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="**"
                                render={() => <Redirect to="/panel/dashboard"/>}
                            />
                        </Switch>
                    </div>
                </div>
                <Modal
                    title={"Low Credits"}
                    open={this.state.creditsExpired}
                    onClose={() => {
                        this.setState({creditsExpired: false});
                    }}
                    primaryAction={{
                        content: "Plan Section",
                        onClick: () => {
                            this.redirect("/panel/plans");
                            this.setState({creditsExpired: false});
                        }
                    }}
                >
                    <Modal.Section>
                        <Banner title={"Alert"} status="warning">
                            <Label id={123}>
                                You Almost Exhausted Your Credits. Kindly Buy Some Credits From
                                Plan Section.
                            </Label>
                        </Banner>
                    </Modal.Section>
                </Modal>
                <Modal
                    title={"Are You Happy"}
                    open={this.state.show_rating_popup}
                    onClose={() => {
                        this.setState({show_rating_popup: false});
                    }}
                >
                    <Modal.Section>
                        <Stack vertical={true}>
                            <Stack vertical={true} alignment="center">
                                <h1 style={{'color': "#000000"}}><b>RATE US</b></h1>
                            </Stack>
                            <Stack distribution="center" spacing="extraLoose">
                                <React.Fragment/>
                                <div className="like">
                                    <i style={{'font-size': '50px', 'cursor': 'pointer', 'user-select': 'none'}}
                                       on
                                       onClick={this.thumbUp.bind(this)}
                                       class="fa fa-thumbs-up"/>
                                </div>
                                {/*<StarRatings
                                 rating={this.state.rating}
                                 starRatedColor="#ffd700"
                                 starEmptyColor="#2a2a2a"
                                 starHoverColor="#ffd700"
                                 starSelectingHoverColor="#ffd700"
                                 changeRating={this.changeRating.bind(this)}
                                 numberOfStars={5}
                                 starDimension="40px"
                                 name='rating'
                                 />*/}
                                <div className="dislike">
                                    <i style={{'font-size': '50px', 'cursor': 'pointer', 'user-select': 'none'}}
                                       onClick={this.thumbDown.bind(this)}
                                       class="fa fa-thumbs-down"/>
                                </div>
                                {/*<StarRatings
                                 rating={this.state.rating}
                                 starRatedColor="#ffd700"
                                 starEmptyColor="#2a2a2a"
                                 starHoverColor="#ffd700"
                                 starSelectingHoverColor="#ffd700"
                                 changeRating={this.changeRating.bind(this)}
                                 numberOfStars={5}
                                 starDimension="40px"
                                 name='rating'
                                 />*/}
                                <React.Fragment/>
                            </Stack>
                            {this.state.show_button_submit?
                            <Stack vertical={true} alignment="center">
                                <TextField
                                    label="If Any Issue"
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="Optional"
                                    multiline
                                />
                                <Button
                                    primary={true}
                                    onClick={this.forButtonSubmit.bind(this)}
                                >
                                    Submit
                                </Button>
                            </Stack>:null}
                            <hr/>
                            <Stack distribution="equalSpacing">
                                <Button
                                    primary={true}
                                    onClick={this.forButtonCancel.bind(this)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    primary={true}
                                    onClick={this.forReviewNeverAgain.bind(this)}
                                >Never Ask Again
                                </Button>
                            </Stack>
                        </Stack>
                    </Modal.Section>
                </Modal>
                {/*<Modal
                    title={"Important Notice"}
                    open={this.state.show_etsy_popup}
                    onClose={() => {
                        this.setState({show_etsy_popup: false});
                    }}
                    primaryAction={{
                        content: "OK",
                        onClick: () => {
                            this.setState({show_etsy_popup: false});
                        }
                    }}
                >
                    <Modal.Section>
                        <Banner title={"Information"} status="info">
                            <Label id={123}>
                                <div class="Polaris-Banner__Content" id="Banner3Content">
                                    <p>
                                        System is Schedule for Maintaince from <b>23th July, 2019 11:30 PM(PST)</b> to <b> 24th July, 2019 1:30 AM(PST)</b>
                                    </p>
                                    <br/>
                                    <p>Thank You for your Patience</p>
                                </div>
                            </Label>
                        </Banner>
                    </Modal.Section>
                </Modal>*/}
            </div>
        );
    }

    redirect = url => {
        this.props.history.push(url);
    };
}
