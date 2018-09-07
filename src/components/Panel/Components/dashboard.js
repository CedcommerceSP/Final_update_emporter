import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {
    Page,
    Card,
    Select,
    Form,
    FormLayout,
    Checkbox,
    TextField,
    Button,
    Tooltip,
    Link,
    Icon,
    Label,TextContainer,Modal
} from '@shopify/polaris';
import { requests } from '../../../services/request';
import {isUndefined} from "util";
import {notify} from "../../../services/notify";
import './dashboard/dashboard.css';
import {
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { term_and_conditon } from './dashboard/term&condition';
import {dataGrids} from "./plans-component/plansFuctions";
import {Plans} from "./plans";
import PlanBody from "../../../shared/plans/plan-body";

const primaryColor = "#9c27b0";
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
const grayColor = "#999999";
class Dashboard extends Component {
    googleConfigurationData = [];
    constructor(props) {
        super(props);
        this.state = {
            info: {
                full_name: '',
                mobile: '',
                email: '',
                skype_id:'',
                primary_time_zone:'Pacific Time',
                best_time_to_contact: '8-12',
                term_and_conditon: false,
                how_u_know_about_us: '',
                Other_text:'',

            }, // Step 1
            info_error: {
                full_name: false,
                mobile: '',
                email: false,
                skype_id:'',
                primary_time_zone:'Pacific Time',
                best_time_to_contact: '8-12',
                term_and_conditon: false,
                how_u_know_about_us: '',

            }, // Step 1
            plans:[], // step 2
            /****** step 3 ********/
            API_code: ['google'], // connector/get/installationForm, method -> get, eg: { code : 'google' }
            account_linked: [], // merchant center account. linked type
            modalOpen: false,
            /********* Step 3 ends **********/
            /********* Step 4 **********/
            config_API: ['google'],
            config: false,
            google_configuration: {},
            google_configuration_updated: false,
            account_information_updated: false,
            /********* Step 4 Ends **********/
            active_step: {
                name: '', // anchor name
                step : 0 // step number
            },
            stepData: [], // this will store the current showing step, which is selected from data object e.g Shopify_Google []
            selected: '',
            open_init_modal: true, // this is used to open modal one time when user visit dashboard
            data: {
                Shopify_Google : [
                    {
                        message:<p>Enter Your Basic Information</p>, // step data
                        stepperMessage: 'Registration', // stepper Small Message
                        API_endpoint: '', // Api End Point is used to check to send data or get data (no use Right Now)
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/configuration', // After Completion Where To Redirect
                        anchor: 'U-INFO', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not and also help in deciding with step to go
                    }, // step 1
                    {
                        message: <p> Choose a plan for Shopify-Google Express Integration.
                            If you are <b> buying plan for the first time</b> then, once you buy the plan your
                            <b> 7 days trial</b> will be active for first week, and your <b> payment cycle will start after 7 days</b>.</p>,
                        stepperMessage: 'Choose a plan for Shopify-Google Express', // stepper Small Message
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/plans', // After Completion Where To Redirect
                        anchor: 'PLANS', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 2
                    {
                        message: <p> Link your <b> google merchant center account.</b>
                            Please make sure that you have <b> verified & claimed</b> website URL in your Merchant Center, that should be
                            <b> same as your Shopify store URL</b>
                        </p>,
                        stepperMessage: 'Google Merchant Center linked',
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/accounts', // After Completion Where To Redirect
                        anchor: 'LINKED', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 3
                    {
                        message: <span>Enter default configurations.</span>,
                        stepperMessage: 'Configurations',
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: <p>Now goto <NavLink  to="/panel/import">Upload Products</NavLink> section, first import products from shopify.  <br/>When import completed upload your products on google. </p>, // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/configuration', // After Completion Where To Redirect
                        anchor: 'CONFIG', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 4
                ],
                Amazon_Shopify: [
                    {
                        message:<p>Enter Your Basic Detail</p>,
                        stepperMessage: 'User Details', // stepper Small Message
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/configuration', // After Completion Where To Redirect
                        anchor: 'U-INFO', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 1
                    {
                        message: <p> Choose a plan for Amazon-Shopify  Integration. If you are <b> buying plan for the first time</b> then, once you buy the plan your
                            <b> 7 days trial</b> will be active for first week, and your <b> payment cycle will start after 7 days</b></p>,
                        stepperMessage: 'Amazon-Shopify Plan Chosen',
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/configuration', // After Completion Where To Redirect
                        anchor: 'PLANS', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 2
                    {
                        message:  <p> Link your AWS/MWS account.</p>,
                        stepperMessage: 'AWS/MWS Account Linked',
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/accounts', // After Completion Where To Redirect
                        anchor: 'LINKED', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 3
                    {
                        message: <span>Enter default configurations.</span>,
                        stepperMessage: 'Configurations',
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: <p>After All the step Completed You can Import your products from amazon to <NavLink  to="/panel/import">shopify.</NavLink></p>, // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/configuration', // After Completion Where To Redirect
                        anchor: 'CONFIG', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 4
                ],
            },
        };
        this.getGoogleConfigurations();
        this.checkStepCompleted = this.checkStepCompleted.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.paymentStatus = this.paymentStatus.bind(this);
    }
    componentDidMount() {
        // this.setState({
        //     stepData: this.state.data.Shopify_Google,
        // });
        this.mainAPICheck();
        // Object.keys(this.state.data).forEach(data => {
        //         this.checkStepCompleted(data);
        // });
    }
    handleChange = (newValue) => {
        this.setState({
            selected: newValue,
            stepData: this.state.data[newValue],
            open_init_modal: false,
        });
        this.checkStepCompleted(newValue);
    };// This Function Used for dropdown Selection
    mainAPICheck() {
        /****** for Plans ******/
        // requests.getRequest('plan/plan/get').then(data => {
        //     if ( data.success ) {
        //         if ( data.data !== null && !isUndefined(data.data) ) {
        //             data = dataGrids(data.data.data.rows); // change the data into desire format
        //             this.setState({plans : data});
        //         }
        //     } else {
        //         notify.error(data.message);
        //     }
        // });
        /*************  for step 3 (Link your google merchant center acc)   *****************/
        // API to get installation form - connector/get/installationForm, method -> get, { code : 'marketplace' }
        this.state.API_code.forEach(value => {
            requests.getRequest('connector/get/installationForm', {code:value}).then(data => {
                if ( data.success ) {
                    if ( data.data !== null && !isUndefined(data.data) ) {
                        let newData = [];
                        newData.push(data.data);
                        this.setState({account_linked: newData});
                    }
                } else {
                    notify.error(data.message);
                }
            });
        });
        /*************  for step 4 (Config)   *****************/
        // API to get default configuration -> /connector/get/config , method -> get, { marketplace : 'marketplace' }
        this.state.API_code.forEach(value => {
            requests.getRequest('/connector/get/config', {marketplace:value}).then(data => {
                this.setState({config: data.success});
            });
        }) // only used to check status that we get right data for getGoogleConfigurations()

    }
    // API_check is used for get information about how many step are completed
    checkStepCompleted(key) {
        let path = '/Shopify/Google';
        if ( key === 'Amazon_Shopify' ) {
            path = '/Amazon/Shopify';
        }
        requests.getRequest('frontend/app/getStepCompleted', {path: path}).then(data => {
            if ( data.success ) {
                if ( data.data !== null && !isUndefined(data.data)  ) {
                    let temp = this.state.data;
                    let anchor = '';
                    let flag = 0;
                    temp[key].forEach((keys, index) => {
                        if ( index < parseInt(data.data) ) { // if  ( step here < no of step completed )
                            keys.stepperActive = true;
                        } else if ( flag === 0 ) {
                            anchor = keys.anchor;
                            flag = 1;
                        }
                    });
                    this.setState({
                        data: temp,
                        active_step: {
                            name: anchor,
                            step: parseInt(data.data) + 1
                        }
                    });
                }
            } else {
                notify.error(data.message);
            }
        })
    } // initially run this to check which step is completed
    changeStep(arg) { // arg means step number
        let data = this.state.data[this.state.selected];
        let path = [];
        if ( arg === 1 || arg === 2 ) { // step 1 and 2 are common in both so send as one
            path.push('/Shopify/Google');
            path.push('/Amazon/Shopify');
        } else if ( this.state.selected === 'Amazon_Shopify' ) {
            path.push('/Amazon/Shopify');
        } else {
            path.push('/Shopify/Google');
        }
        requests.postRequest('frontend/app/stepCompleted', { paths: path, step: arg }).then(value => {
            if ( value.success ) {
                let anchor = '';
                let flag = 0;
                data.forEach((keys, index) => {
                    if ( index < arg ) {
                        keys.stepperActive = true;
                    } else if ( flag === 0 ) {
                        anchor = keys.anchor;
                        flag = 1;
                    }
                });
                this.setState({
                    stepData: data,
                    active_step : {
                        name: anchor,
                        step: arg + 1,
                    }
                });
                if ( arg < 4 ) {
                    notify.success('Follow The Next Step');
                } else {
                    notify.success('Now You Can Upload Your Products');
                }
            }
        });
    } // change stage just pass the completed step here in arg
    renderStepper() {
        let flag = 1;
        return (
            <div className="container">
                <div className="row bs-wizard" style={{borderBottom:"0"}}>
                    {this.state.stepData.map((data, index) => {
                        let css = 'disabled '; // when Previous Step is not Completed
                        if (data.stepperActive) {
                            css = 'complete'; // When Step Is completed
                        } else if (flag === 1) {
                            css = 'active'; // which Step Is Active
                            flag++;
                        }
                        return(<React.Fragment key={index}>
                            <div className={`col-3 bs-wizard-step ${css}`}>
                                <div className="text-center bs-wizard-stepnum">Step {index + 1}</div>
                                <div className="progress">
                                    <div className="progress-bar"/>
                                </div>
                                <a href="javascript:void(0)" className="bs-wizard-dot"/>
                                <div className="bs-wizard-info text-center">{data.stepperMessage}</div>
                            </div>
                        </React.Fragment>);
                    })}
                </div>
            </div>
        );
    }
    handleModalChange(event, stepActive) {
        // console.log(stepActive);
        if ( event === 'yes' || event === 'no' ) {
            if ( stepActive.name === 'PLANS' ) { // for anchor
                this.checkPayment(); // if step completed
            } else if ( stepActive.name === 'LINKED' ) {
                this.checkLinkedAccount();
            }
            this.setState({modalOpen: !this.state.modalOpen});
        } // id user say he/she completed then run this function
        else if ( event === 'init_modal' ) {
            // this.setState({open_init_modal: false});
            notify.info("Please Select A Integration First")
        } else {
            this.setState({modalOpen: !this.state.modalOpen});
        } // if he/she cancel or close the modal
    } // all operation perform on modal of step 3 and step 2 (plan) and also responsible for not closing the init modal comes here
    /******************* MAIN BODY **********************/
    renderBody() {
        let flag = 1;
        return(
            Object.keys(this.state.stepData).map(keys => {
                let css = 'BG-info'; // Previous step Not Completed
                let status = false; // Used To decide if step is active then show its function body
                if ( this.state.stepData[keys].stepperActive ) {
                    css = 'BG-success'; // Completed
                } else if (flag === 1) {
                    css = 'BG-warn'; // Active
                    status = true;
                    flag++;
                }
                return (
                    <React.Fragment key={keys}>
                        <div style={this.state.stepData[keys].stepperActive?{cursor:'pointer'}:null}  onClick={this.state.stepData[keys].stepperActive?this.redirect.bind(this,this.state.stepData[keys].redirectTo):null}>
                            <div className="row p-4 mt-sm-0 mt-5">
                                <div className="CARD col-12" style={{border: `1px solid ${css}`,backgroundColor:'#fff'}}>
                                    <div className={`CARD-title-small common text-center ${css}`}>
                                        {this.state.stepData[keys].stepperActive ?
                                            <FontAwesomeIcon icon={faCheck} size="5x"/>
                                            : <h1 className="mt-2 font-weight-bold" style={{fontSize:50}}>{parseInt(keys) + 1} </h1>
                                        }
                                    </div>
                                    <div className="CARD-body p-5">
                                        <div className="col-12 p-3 pl-5">
                                            <h4>{this.state.stepData[keys].message}</h4>
                                        </div>
                                        {this.checkAnchor(this.state.stepData[keys],status)} {/* switch case for deciding the anchor */}
                                    </div>
                                </div>
                            </div>
                            { this.state.stepData[keys].data !== '' && this.state.stepData[keys].stepperActive?
                                <div className="col-12 mt-5 p-5 text-center">
                                    <h4>{this.state.stepData[keys].data}</h4>
                                </div> :null
                            } {/* TODO Change condition this.state.stepData[keys].data !== '' if data meaning change */}
                        </div>
                    </React.Fragment>
                );
            })
        );
    }
    checkAnchor(data, status) {
        if ( status ) {
            switch (data.anchor) {
                case 'U-INFO': return this.renderGetUserInfo();
                case 'PLANS': return this.renderPlan();
                case 'LINKED': return this.renderLinkedAccount();
                case 'CONFIG': return this.renderConfig();
                default : console.log('This Is default');
            }
        }
    } // decide where to go when step is active
    /****************** step 1 User Information Body Start Here *************************/
    handleSubmit = (event) => { // this function is used to submit user basic info
        if (this.state.info.term_and_conditon &&
            this.state.info.full_name !== '' &&
            this.state.info.email !== '' &&
            this.state.info.mobile !== '')
        {
            requests.getRequest('core/user/updateuser', this.state.info).then(data => {
                if (data.success) {
                    notify.success(data.message);
                    this.changeStep(1); // pass the step number
                } else {
                    notify.error(data.message);
                }
            });
        } else {
            let tempData = this.state.info_error;
            if ( this.state.info.full_name === '' )
                tempData.full_name = true;
            if ( this.state.info.email === '' )
                tempData.email = true;
            if (this.state.info.mobile === '')
                tempData.mobile = true;
            if ( !this.state.info.term_and_conditon )
                tempData.term_and_conditon = true;
            this.setState({info_error: tempData});
        }
    };
    handleFormChange = (field, value) => { // this function is used to submit user basic info
        let data  = this.state.info;
        data[field] = value;
        let tempData = this.state.info_error;
        if ( this.state.info[field] !== '' || this.state.info[field] )
            tempData[field] = false;
        this.setState({
            info:data,
            info_error:tempData
        });
    };
    renderGetUserInfo() {
        return (
            <div className="row">
                <div className="col-12 text-center">
                    <hr/>
                    {/*<h1>Fill Up The Form</h1>*/}
                    {/*<h4>Some Other Text Here</h4>*/}
                </div>
                <div className="col-12">
                    <Form onSubmit={this.handleSubmit} target="_blank">
                        <FormLayout>
                            <div className='row'>
                                <div className="col-12 col-md-12">
                                    <TextField
                                        value={this.state.info.full_name}
                                        minLength={5}
                                        onChange={this.handleFormChange.bind(this,'full_name')}
                                        error={this.state.info_error.full_name?'Field Is Empty':null}
                                        label="Full Name:"
                                        type="text"
                                    />
                                </div>
                                <div className="col-12 col-md-12 text-left">
                                    {this.state.info.full_name=='' && this.state.info_error.full_name!=true?
                                        <p className="mt-1" style={{color: 'green'}}>*required</p>
                                        :null
                                    }
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12 col-md-12">
                                    <TextField
                                        value={this.state.info.mobile}
                                        minLength={5}
                                        error={this.state.info_error.mobile?'Field Is Empty':null}
                                        onChange={this.handleFormChange.bind(this,'mobile')}
                                        label="Phone Number:"
                                        type="tel"
                                    />
                                </div>
                                <div className="col-12 col-md-12 text-left">
                                    {this.state.info.mobile=='' && this.state.info_error.mobile!=true?
                                        <p className="mt-1" style={{color: 'green'}}>*required</p>
                                        :null
                                    }
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12 col-md-12">
                                    <TextField
                                        value={this.state.info.email}
                                        minLength={5}
                                        error={this.state.info_error.email?'Field Is Empty':null}
                                        onChange={this.handleFormChange.bind(this,'email')}
                                        label="Email:"
                                        type="email"
                                    />
                                </div>
                                <div className="col-12 col-md-12 text-left">
                                    {this.state.info.email=='' && this.state.info_error.email!=true?
                                        <p className="mt-1" style={{color: 'green'}}>*required</p>
                                        :null
                                    }
                                </div>
                            </div>
                            <TextField
                                value={this.state.info.skype_id}
                                onChange={this.handleFormChange.bind(this,'skype_id')}
                                label="Skype ID:"
                                type="text"
                            />
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <Select
                                        label="Your Primary Time Zone"
                                        options={[
                                            {label: 'Pacific Time', value: 'Pacific Time'},
                                            {label: 'Mountain Time', value: 'Mountain Time'},
                                            {label: 'Central Time', value: 'Central Time'},
                                            {label: 'Eastern Time', value: 'Eastern Time'},
                                            {label: 'Hawaii Standard Time', value: 'Hawaii Standard Time'},
                                            {label: 'Alaska Daylight Time', value: 'Alaska Daylight Time'},
                                            {label: 'other', value: 'other'},
                                        ]}
                                        onChange={this.handleFormChange.bind(this,'primary_time_zone')}
                                        value={this.state.info.primary_time_zone}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mt-3 mt-md-0">
                                    <Select
                                        label="Preferable Time For Calling"
                                        options={[
                                            {label: '0-4', value: '0-4'},
                                            {label: '4-8', value: '4-8'},
                                            {label: '8-12', value: '8-12'},
                                            {label: '12-16', value: '12-16'},
                                            {label: '16-20', value: '16-20'},
                                            {label: '20-24', value: '20-24'},
                                        ]}
                                        onChange={this.handleFormChange.bind(this,'best_time_to_contact')}
                                        value={this.state.info.best_time_to_contact}
                                    />
                                </div>
                            </div>
                            <Select
                                label="How Do you Know About us"
                                placeholder="Select"
                                options={[
                                    {label: 'Shopify App Store', value: 'Shopify App Store'},
                                    {label: 'Google Ads', value: 'Google Ads'},
                                    {label: 'FaceBook Ads', value: 'FaceBook Ads'},
                                    {label: 'Twitter', value: 'Twitter'},
                                    {label: 'Yahoo', value: 'Yahoo'},
                                    {label: 'Youtube', value: 'Youtube'},
                                    {label: 'Other', value: 'Other'},
                                ]}
                                onChange={this.handleFormChange.bind(this,'how_u_know_about_us')}
                                value={this.state.info.how_u_know_about_us}
                            />
                            {this.state.info.how_u_know_about_us=='Other'?
                                <TextField
                                    value={this.state.info.Other_text}
                                    onChange={this.handleFormChange.bind(this, 'Other_text')}
                                    label="Kindly Mention your Source"
                                    type="text"
                                />:null
                            }
                            <div className="form-control" style={{height:'180px', width:'100%',overflow:'auto'}}>
                                <h3>CedCommerce Terms & Condition and Privacy Policy</h3><br/><br/><br/>
                                {term_and_conditon()}
                            </div>
                            <Checkbox
                                checked={this.state.info.term_and_conditon}
                                label="Accept Term & Conditions"
                                error={this.state.info_error.term_and_conditon?'please Check The Term And Conditons':''}
                                onChange={this.handleFormChange.bind(this,'term_and_conditon')}
                            />
                            <Button submit primary={true}>Submit</Button>
                        </FormLayout>
                    </Form>
                </div>
            </div>
        );
    }
    /****************************************** step 2 Plans Start Here ******************************/
    checkPayment() {
        requests.getRequest('plan/plan/getActive').then(status => {
            if ( status.success ) {
                notify.success('plan Active');
                this.changeStep(2);
            } else {
                notify.error(status.message);
            }
        });
    }
    paymentStatus(event) {
        if ( event === 'Confirmation' ) {
            this.setState({modalOpen: !this.state.modalOpen});
        } else {
            notify.info(event);
        }
    }
    renderPlan() {
        return (
            <React.Fragment>
                <PlanBody paymentStatus={this.paymentStatus}/>;
            </React.Fragment>
        );
    }
    /*****************************************  Step 3 linked you account start Here  ***********************************/
    checkLinkedAccount() {
        notify.info('Need to Implement API to Check');
        this.changeStep(3);
    }
    openNewWindow(action) {
        this.setState({modalOpen: !this.state.modalOpen});
        window.open(action,  '_blank', 'location=yes,height=600,width=550,scrollbars=yes,status=yes');
    } // Open Modal And A new Small Window For User
    renderLinkedAccount() {
        /***     {post_type: "redirect", action: "https://connector.com/google/app/auth?bearer=e...."}      **/
        let value = this.state.account_linked;
        let html = <span/>;
        if ( value.length > 0 ) {
            value.forEach(data => {
                if ( data.post_type === 'redirect' ) {
                    html = <div className="text-center">
                        <Button primary={true} onClick={() => this.openNewWindow(data.action)}>
                            Connect
                        </Button>
                    </div>
                }
            })
        }
        return html;
    }
    /***************************************** step 4 Configurations start here *******************************/
    getGoogleConfigurations() {
        requests.getRequest('/connector/get/config', { marketplace: 'google' })
            .then(data => {
                if (data.success) {
                    this.googleConfigurationData = this.modifyGoogleConfigData(data.data);
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }
    modifyGoogleConfigData(data) {
        for (let i = 0; i < data.length; i++) {
            this.state.google_configuration[data[i].code] = data[i].value;
            data[i].options = this.modifyOptionsData(data[i].options);
        }
        return data;
    }
    modifyOptionsData(data) {
        let options = [];
        for (let i = 0; i < Object.keys(data).length; i++) {
            let key = Object.keys(data)[i];
            options.push({
                label: data[key],
                value: key
            });
        }
        return options;
    }
    googleConfigurationChange(index, value) {
        this.state.google_configuration_updated = true;
        this.state.google_configuration[this.googleConfigurationData[index].code] = value;
        this.updateState();
    }
    googleConfigurationCheckboxChange(index, optionIndex, value) {
        this.state.google_configuration_updated = true;
        const option = this.googleConfigurationData[index].options[optionIndex].value;
        const valueIndex = this.state.google_configuration[this.googleConfigurationData[index].code].indexOf(option);
        if (value) {
            if (valueIndex === -1) {
                this.state.google_configuration[this.googleConfigurationData[index].code].push(option);
            }
        } else {
            if (valueIndex !== -1) {
                this.state.google_configuration[this.googleConfigurationData[index].code].splice(valueIndex, 1);
            }
        }
        this.updateState();
    }
    saveGoogleConfigData() {
        requests.postRequest('connector/get/saveConfig', { marketplace: 'google', data: this.state.google_configuration })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                    this.changeStep(4);
                } else {
                    notify.error(data.message);
                }
                this.getGoogleConfigurations();
            });
    }
    renderConfig() {
        if (this.state.config)
        {
            return (
                <div className="row p-5">
                    {
                        this.googleConfigurationData.map(config => {
                            switch(config.type) {
                                case 'select':
                                    return (
                                        <div className="col-12 pt-2 pb-2" key={this.googleConfigurationData.indexOf(config)}>
                                            <Select
                                                options={config.options}
                                                label={config.title}
                                                placeholder={config.title}
                                                value={this.state.google_configuration[config.code]}
                                                onChange={this.googleConfigurationChange.bind(this, this.googleConfigurationData.indexOf(config))}>
                                            </Select>
                                        </div>
                                    );
                                    break;
                                case 'checkbox':
                                    return (
                                        <div className="col-12 pt-2 pb-2" key={this.googleConfigurationData.indexOf(config)}>
                                            <Label>{config.title}</Label>
                                            <div className="row">
                                                {
                                                    config.options.map(option => {
                                                        return (
                                                            <div className="col-md-6 col-sm-6 col-12 p-1" key={config.options.indexOf(option)}>
                                                                <Checkbox
                                                                    checked={this.state.google_configuration[config.code].indexOf(option.value) !== -1}
                                                                    label={option.value}
                                                                    onChange={this.googleConfigurationCheckboxChange.bind(this, this.googleConfigurationData.indexOf(config), config.options.indexOf(option))}
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                    break;
                                default:
                                    return (
                                        <div className="col-12 pt-2 pb-2" key={this.googleConfigurationData.indexOf(config)}>
                                            <TextField
                                                label={config.title}
                                                placeholder={config.title}
                                                value={this.state.google_configuration[config.code]}
                                                onChange={this.googleConfigurationChange.bind(this, this.googleConfigurationData.indexOf(config))}>
                                            </TextField>
                                        </div>
                                    );
                                    break;
                            }

                        })
                    }
                    <div className="col-12 text-right pt-2 pb-1">
                        <Button
                            onClick={() => {
                                this.saveGoogleConfigData();
                            }}
                            primary>Save</Button>
                    </div>
                </div>
            );
        }
    }
    /************************************  Render()   **********************************************************/
    render() {
        const options = [
            {label: 'Shopify-Google Integration', value: 'Shopify_Google'},
            {label: 'Amazon-Shopify Integration', value: 'Amazon_Shopify'},
        ]; {/* Integration Dropdown Options */}
        return (
            <Page
                title="Dashboard">
                <Card >
                    <div className="p-5">

                        <Select
                            label="Step To Follow :-"
                            options={options}
                            onChange={this.handleChange}
                            value={this.state.selected}
                        />
                    </div>
                </Card> {/* Dropdown */}
                <Card>
                    {this.renderStepper()}
                </Card> {/* Stepper */}
                {this.renderBody()} {/* Main Body Function Call Here */}
                <Modal
                    open={this.state.open_init_modal}
                    onClose={this.handleModalChange.bind(this,'init_modal')}
                    title="Select Integration"
                >
                    <Modal.Section>
                        <Card>
                            <div className="p-5">
                                <Select
                                    label="Show Steps To Follow For :-"
                                    placeholder="Select Integration From Here"
                                    options={ [
                                        {label: 'Shopify-Google Integration', value: 'Shopify_Google'},
                                        {label: 'Amazon-Shopify Integration', value: 'Amazon_Shopify'},
                                    ]}
                                    onChange={this.handleChange}
                                    value={this.state.selected}
                                />
                            </div>
                        </Card>
                    </Modal.Section>
                </Modal> {/* Open The Init DropDown */}
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleModalChange.bind(this,'no',this.state.active_step)}
                    title=""
                >
                    <Modal.Section>
                        <div className="text-center p-5">
                            <Button primary onClick={this.handleModalChange.bind(this,'yes',this.state.active_step)}>
                                Continue To Next Step
                            </Button>
                        </div>
                    </Modal.Section>
                </Modal> {/* Open When The New Window Is open (it is a medium to ask user if he completed its step or not) */}
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
    updateState() {
        const state = this.state;
        this.setState(state);
    }
}

export default Dashboard;