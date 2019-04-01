import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Button, Card, Checkbox, Form, FormLayout, Page, Select, TextField,Modal, Label, Banner} from '@shopify/polaris';
import {isUndefined} from "util";
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import PlanBody from "../../../shared/plans/plan-body";
import AppsShared from "../../../shared/app/apps";
import InstallAppsShared from "../../../shared/app/install-apps";
import ConfigShared from "../../../shared/config/config-shared";

import {term_and_condition} from './dashboard/term&condition';
import AnalyticsReporting from "./products-component/analytics-reporting";

import {requests} from '../../../services/request';
import {notify} from "../../../services/notify";
import {globalState} from "../../../services/globalstate";

import {json} from "../../../environments/static-json";

import './dashboard/dashboard.css';
import PricingGuide from "../../../shared/pricing_guide";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        props.disableHeader(false); // used in disabled header
        this.state = {
            info: {
                full_name: '',
                mobile: '',
                mobile_code: '+1',
                country_code: 'US',
                email: '',
                skype_id:'',
                // primary_time_zone:'Pacific Time',
                // best_time_to_contact: '8-12',
                term_and_condition: false,
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
                term_and_condition: false,
                how_u_know_about_us: '',

            }, // Step 1
            otpCheck: {
                status:false,
                pin:'',
                error:false,
                number_change: false,
            }, // step 1
            plans:[], // step 2
            /****** step 3 ********/
            API_code: ['google'], // connector/get/installationForm, method -> get, eg: { code : 'google' }
            account_linked: [], // merchant center account. linked type
            modalOpen: false,
            data3Check:{},
            importerServices:[],
            /********* Step 3 ends **********/
            /*********** 4 ***************/
            payment_show:false,
            payment: {
                message:'',
                title:'',
                body:''
            },
            /*********** 4 ***************/
            active_step: {
                name: '', // anchor name
                step : 0 // step number
            },
            welcome_screen: false,
            stepData: [], // this will store the current showing step, which is selected from data object e.g Shopify_Google []
            selected: '',
            open_init_modal: true, // this is used to open modal one time when user visit dashboard
            // stepStart:true,
            data: {
                data : [ //Shopify_Google old Name
                    {
                        message:<p>Enter Your Basic Information</p>, // step data
                        stepperMessage: 'Basic Information', // stepper Small Message
                        API_endpoint: '', // Api End Point is used to check to send data or get data (no use Right Now)
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/configuration', // After Completion Where To Redirect
                        anchor: 'U-INFO', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not and also help in deciding with step to go
                    }, // step 1
                    {
                        message: <p>Pricing Overview.</p>,
                        stepperMessage: 'Pricing Plan', // stepper Small Message
                        API_endpoint: '', // Api End Point is used to check to send data or get data
                        data: '', // Data additional Field
                        method: 'GET', // Method Type
                        redirectTo: '/panel/dashboard/guide', // After Completion Where To Redirect
                        anchor: 'PRICING_GUIDE', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                        stepperActive: false, // used in stepper Check either Completed or not
                    }, // step 2
                    // {
                    //     message: <p> Link your <b>Account</b></p>,
                    //     stepperMessage: 'Account linked',
                    //     API_endpoint: '', // Api End Point is used to check to send data or get data
                    //     data: '', // Data additional Field
                    //     method: 'GET', // Method Type
                    //     redirectTo: '/panel/accounts', // After Completion Where To Redirect
                    //     anchor: 'LINKED', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                    //     stepperActive: false, // used in stepper Check either Completed or not
                    // }, // step 3
                    // {
                    //     message: <span>Enter default configurations</span>,
                    //     stepperMessage: 'Default Configurations',
                    //     API_endpoint: '', // Api End Point is used to check to send data or get data
                    //     data: <p>Now goto <NavLink  to="/panel/import">Upload Products</NavLink> section, first import products from shopify.  <br/>When import completed upload your products on google. </p>, // Data additional Field
                    //     method: 'GET', // Method Type
                    //     redirectTo: '/panel/configuration', // After Completion Where To Redirect
                    //     anchor: 'CONFIG', // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
                    //     stepperActive: false, // used in stepper Check either Completed or not
                    // }, // step 4
                ]
            },
        };
        this.checkStepCompleted = this.checkStepCompleted.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.paymentStatus = this.paymentStatus.bind(this);
        this.checkPayment = this.checkPayment.bind(this);
        this.checkLinkedAccount = this.checkLinkedAccount.bind(this);
        this.openNewWindow = this.openNewWindow.bind(this);
        this.redirectResult = this.redirectResult.bind(this);
        this.checkConfig = this.checkConfig.bind(this);
        this.autoFillDetails();
    }

    componentWillReceiveProps(nextPorps) {
        if ( nextPorps.necessaryInfo !== undefined ) {
            this.setState({necessaryInfo:nextPorps.necessaryInfo});
        }
    }

    autoFillDetails(){
        requests.getRequest('frontend/app/getShopDetails').then(data=>{
            if(data.success) {
                this.state.info.full_name = data.data.full_name;
                this.state.info.email = data.data.email;
                this.state.info.mobile = data.data.mobile;
                this.handleFormChange('country_code', data.data.country)
                this.setState(this.state);
            }
        });
    }

    componentDidMount() {
        this.setState({stepData:this.state.data.data});
        this.checkStepCompleted();
    }

    handleChange = (newValue) => {
        this.setState({
            selected: newValue,
            stepData: this.state.data[newValue],
            open_init_modal: false,
        });
        this.checkStepCompleted(newValue);
    };// This Function Used for dropdown Selection

    checkStepCompleted() {
        let path = '/App/User/Step';
        requests.getRequest('frontend/app/getStepCompleted', {path: path}).then(data => {
            if ( data.success ) {
                if ( data.data !== null && !isUndefined(data.data)  ) {
                    let temp = this.state.stepData;
                    let anchor = '';
                    let flag = true;
                    temp.forEach((keys, index) => {
                        if ( index < parseInt(data.data) ) { // if  ( step here < no of step completed )
                            keys.stepperActive = true;
                        } else if ( flag ) {
                            anchor = keys.anchor;
                            flag = false;
                        }
                    });
                    if ( flag ) {
                        this.props.disableHeader(true);
                    }
                    this.setState({
                        data: temp,
                        welcome_screen: flag,
                        stepStart:!flag,
                        active_step: {
                            name: anchor,
                            step: parseInt(data.data) + 1
                        }
                    });
                }
            } else {
                if ( data.code === 'under_maintenance' ) {
                    this.redirect('/show/message?success=sucess&message='+ data.message + '&icon=faToolbox')
                }
                // notify.error(data.message);
            }
        });
    } // initially run this to check which step is completed

    changeStep(arg) { // arg means step number
        let data = this.state.stepData;
        let path = [];
        path.push('/App/User/Step');
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
                if ( arg >= 2 ) {
                    this.props.disableHeader(true);
                    setTimeout(() => {
                        this.redirect('/panel/accounts');
                    },500);
                }
            }
        });
    } // change stage just pass the completed step here in arg

    renderStepper() {
        return null;
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
                            <div className={`col-4 bs-wizard-step ${css}`}>
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

    handleModalChange(event) {
         if ( event === 'init_modal' ) {
            notify.info("Please Select A Integration First")
        } else {
            this.setState({modalOpen: !this.state.modalOpen});
        } // if he/she cancel or close the modal
    } // all operation perform on modal of step 3 and step 2 (plan) and also responsible for not closing the init modal comes here

    /********************************** MAIN BODY ***************************************/
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
                if ( flag !== 1 ) {
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
                                }
                            </div>
                        </React.Fragment>
                    );
                }
            })
        );
    }

    checkAnchor(data, status) {
        if ( status ) {
            switch (data.anchor) {
                case 'U-INFO':
                    return this.renderGetUserInfo();
                case 'PRICING_GUIDE': return this.renderPricingGuide();
                case 'PLANS': return this.renderPlan();
                case 'LINKED': return this.renderLinkedAccount();
                case 'CONFIG': return this.renderConfig();
                default : console.log('This Is default');
            }
        }
    } // decide where to go when step is active

    /****************** step 1 User Information Body Start Here *************************/
    handleSubmit = () => { // this function is used to submit user basic info
        if (this.state.info.term_and_condition &&
            this.state.info.full_name !== '' &&
            this.state.info.email !== '' &&
            this.state.info.mobile !== '')
        {
            requests.postRequest('core/app/sendOtp', {phone: this.state.info.mobile_code + '' + this.state.info.mobile}).then(data => {
                if ( data.success ) {
                    let otpCheck = this.state.otpCheck;
                    otpCheck.status = true;
                    otpCheck.number_change = false;
                    this.setState({otpCheck:otpCheck});
                    notify.info("You will shortly recieve an OTP on your registered mobile number");
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
            if ( !this.state.info.term_and_condition )
                tempData.term_and_condition = true;
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
        if ( field === 'country_code' ) {
            let temp;
            json.country_mobile_code.forEach(e => {
                if ( e.value === value ) {
                    temp = e.phone_code;
                }
            });
            this.handleFormChange('mobile_code', temp);
        }
    };

    handleOTPSubmit = () => {
        if ( this.state.otpCheck.pin !== '' && !this.state.otpCheck.number_change ) {
            requests.postRequest('core/app/matchOtp', {otp: this.state.otpCheck.pin}).then(data => {
                if ( data.success ) {
                    let tempInfo = Object.assign({}, this.state.info);
                    tempInfo.mobile = tempInfo.mobile_code + '-' + tempInfo.mobile;
                    requests.getRequest('core/user/updateuser', tempInfo).then(data => {
                        if (data.success) {
                            window.fbq('track', 'Lead');
                            window.gtag('event', 'conversion', {
                                'send_to': 'AW-944073096/6IJiCIyK8Y8BEIjTlcID',
                                'value': 1.0,
                                'currency': 'USD',
                            });
                            requests.getRequest('shopifygql/setup/shopifydetails').then();
                            notify.success(data.message);
                            this.changeStep(1);
                        } else {
                            notify.error(data.message);
                        }
                    });
                } else {
                    notify.error(data.message);
                }
            })
        } else if ( this.state.otpCheck.number_change && this.state.info.mobile !== '' ) {
            this.handleSubmit();
        } else {
            notify.info('Field is empty');
        }
    };

    handleOTPChange = (arg,value) => {
        if ( arg === 'resend' ) {
            this.handleSubmit();
        } else {
            let otpCheck = this.state.otpCheck;
            otpCheck[arg] = value;
            this.setState({otpCheck:otpCheck});
        }
    };

    renderGetUserInfo() {
        return (
            <div className="row">
                <div className="col-12">
                    {this.state.otpCheck.status?
                        <div>
                            <Form onSubmit={this.handleOTPSubmit}>
                                <FormLayout>
                                    <div className="row">
                                        <div className={`col-12 offset-0 ${this.state.otpCheck.number_change?'':'col-sm-4 offset-sm-4'}`}>
                                            {this.state.otpCheck.number_change?
                                                <div className='row'>
                                                    <div className="col-3">
                                                        <Select
                                                            label="Country"
                                                            placeholder="Select"
                                                            options={json.country_mobile_code}
                                                            onChange={this.handleFormChange.bind(this,'country_code')}
                                                            value={this.state.info.country_code}
                                                        />
                                                    </div>
                                                    <div className="col-2">
                                                        <TextField label={'Code'} readOnly={true} value={this.state.info.mobile_code}/>
                                                    </div>
                                                    <div className="col-7">
                                                        <TextField
                                                            value={this.state.info.mobile}
                                                            minLength={5}
                                                            maxLength={14}
                                                            error={this.state.info_error.mobile?'*Please Enter Detail':null}
                                                            onChange={this.handleFormChange.bind(this,'mobile')}
                                                            helpText={"OTP will sent to this number for verification"}
                                                            label="Phone Number:"
                                                            type="number"
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12 text-left">
                                                        {this.state.info.mobile==='' && this.state.info_error.mobile!==true?
                                                            <p className="mt-1" style={{color: 'green'}}>*required</p>
                                                            :null
                                                        }
                                                    </div>
                                                </div>:
                                                <div>
                                                    <Label>Phone number: </Label>
                                                    <Label>{this.state.info.mobile_code + '' + this.state.info.mobile}</Label>
                                                    <a href="javascript:void(0)" onClick={this.handleOTPChange.bind(this,'number_change', true)}>Change Mobile Number</a><br/>
                                                    <div className='row mt-4'>
                                                        <div className="col-12">
                                                            <TextField
                                                                value={this.state.otpCheck.pin}
                                                                minLength={5}
                                                                maxLength={14}
                                                                error={this.state.otpCheck.error?'*Please Enter Detail':null}
                                                                onChange={this.handleOTPChange.bind(this,'pin')}
                                                                label="Enter OTP"
                                                                type="number"
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <a href="javascript:void(0)" onClick={this.handleOTPChange.bind(this,'resend')}>Resent OTP</a>
                                                        </div>
                                                    </div>
                                                </div>}
                                            <div className="mt-4">
                                                <Button
                                                    submit
                                                    primary
                                                    disabled={this.state.otpCheck.pin.length <= 3 && !this.state.otpCheck.number_change}
                                                >
                                                    Submit
                                                </Button>
                                                {this.state.otpCheck.number_change?'':<p>OTP will valid for 5 min</p>}
                                            </div>
                                        </div>
                                    </div>
                                </FormLayout>
                            </Form>
                        </div>:
                        <Form onSubmit={this.handleSubmit}>
                            <FormLayout>
                                <div className='row'>
                                    <div className="col-12 col-md-12">
                                        <TextField
                                            value={this.state.info.full_name}
                                            minLength={5}
                                            onChange={this.handleFormChange.bind(this,'full_name')}
                                            error={this.state.info_error.full_name?'*Please Enter Detail':null}
                                            label="Full Name:"
                                            type="text"
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 text-left">
                                        {this.state.info.full_name ==='' && this.state.info_error.full_name !== true?
                                            <p className="mt-1" style={{color: 'green'}}>*required</p>
                                            :null
                                        }
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-sm-3 col-6">
                                        <Select
                                            label="Country"
                                            placeholder="Select"
                                            options={json.country_mobile_code}
                                            onChange={this.handleFormChange.bind(this,'country_code')}
                                            value={this.state.info.country_code}
                                        />
                                    </div>
                                    <div className="col-sm-2 col-6">
                                        <TextField label={'Code'} readOnly={true} value={this.state.info.mobile_code}/>
                                    </div>
                                    <div className="col-sm-7 col-12">
                                        <TextField
                                            value={this.state.info.mobile}
                                            minLength={5}
                                            maxLength={14}
                                            error={this.state.info_error.mobile?'*Please Enter Detail':null}
                                            onChange={this.handleFormChange.bind(this,'mobile')}
                                            helpText={"OTP will sent to this number for verification"}
                                            label="Phone Number:"
                                            type="number"
                                            readOnly={false}/>
                                    </div>
                                    <div className="col-12 col-md-12 text-left">
                                        {this.state.info.mobile==='' && this.state.info_error.mobile!==true?
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
                                            error={this.state.info_error.email?'*Please Enter Detail':null}
                                            onChange={this.handleFormChange.bind(this,'email')}
                                            label="Email:"
                                            type="email"
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 text-left">
                                        {this.state.info.email==='' && this.state.info_error.email!==true?
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
                                <Select
                                    label="How Do you Know About us"
                                    placeholder="Select"
                                    options={[
                                        {label: 'Shopify App Store', value: 'Shopify App Store'},
                                        {label: 'Google Ads', value: 'Google Ads'},
                                        {label: 'Facebook Ads', value: 'Facebook Ads'},
                                        {label: 'Twitter', value: 'Twitter'},
                                        {label: 'Yahoo', value: 'Yahoo'},
                                        {label: 'Youtube', value: 'Youtube'},
                                        {label: 'Other', value: 'Other'},
                                    ]}
                                    onChange={this.handleFormChange.bind(this,'how_u_know_about_us')}
                                    value={this.state.info.how_u_know_about_us}
                                />
                                {this.state.info.how_u_know_about_us === 'Other'?
                                    <TextField
                                        value={this.state.info.Other_text}
                                        onChange={this.handleFormChange.bind(this, 'Other_text')}
                                        label="Kindly Mention your Source"
                                        type="text"
                                    />:null
                                }
                                <div className="form-control" style={{height:'180px', width:'100%',overflow:'auto'}}>
                                    <h3>CedCommerce Terms & Condition and Privacy Policy</h3><br/><br/><br/>
                                    {term_and_condition()}
                                </div>
                                <Checkbox
                                    checked={this.state.info.term_and_condition}
                                    label="Accept Terms & Conditions"
                                    error={this.state.info_error.term_and_condition?'Please Accept Terms & Conditions':''}
                                    onChange={this.handleFormChange.bind(this,'term_and_condition')}
                                />
                                <Button submit primary>Submit</Button>
                            </FormLayout>
                        </Form>}
                </div>
            </div>
        );
    }

    /***************************** Step 2 Pricing Plan *************************************************/

    handlePricingSubmit = () => {
        this.changeStep(2);
    };

    renderPricingGuide = () => {
        return <React.Fragment>
            <div className="pt-5 pb-5">
                <PricingGuide/>
            </div>
            <div className="p-5 mt-5 text-center">
                <Button onClick={this.handlePricingSubmit} primary>
                    Move To Next Step
                </Button>
            </div>
        </React.Fragment>
    };

    /****************************** step 2 Out Dated Plans Start Here *****************************/
    checkPayment = () => {
        requests.getRequest('plan/plan/getActive').then(status => {
            if ( status.success ) {
                notify.success('Your Plan is Activated');
                try {
                    let tempPlan = [];
                    status.data.services.forEach(e => {
                        if ( e.code === 'amazonimporter' )
                            tempPlan.push('amazonimporter', 'amazon_importer');
                        if ( e.code === 'ebayimporter' )
                            tempPlan.push('ebayimporter', 'ebay_importer');
                    });
                    globalState.setLocalStorage('activePlan', JSON.stringify(tempPlan));
                } catch (e) {

                }
                this.changeStep(2);
            } else {
                notify.error('Kindly Buy A Plan First, Then Move To Next Step.');
            }
        });
    };

    paymentStatus(event) {
        if ( event === 'Confirmation' ) {
            // this.setState({modalOpen: !this.state.modalOpen});
        } else if ( event === 'trial') {
            requests.getRequest('amazonimporter/config/activateTrial').then(data => {
                if(data.success) {
                    if (data.code === 'UNDER_TRIAL') {
                        notify.success(data.message);
                    } else {
                        notify.info(data.message);
                    }
                } else {
                    notify.error(data.message);
                }
            });
        } else {
            notify.info(event);
            this.checkPayment();
        }
    }

    renderPlan = () => {
        if ( localStorage.getItem('plan_status') ) {
            let data = JSON.parse(localStorage.getItem('plan_status'));
            if ( data.shop === globalState.getLocalStorage('shop') ) {
                if (!data.success) {
                    let temp = {
                        title: 'Payment Status',
                        temp: data,
                        message: data.message,
                        body: <div className="text-left mt-5">
                            <h4>You Can uninstall:-</h4>
                            <ul>
                                <li><h5>Go to Apps Section from your Shopify dashboard</h5></li>
                                <li><h5>You can Un-install the App by clicking the Bin Icon right to App</h5></li>
                            </ul>
                        </div>
                    };
                    this.setState({
                        payment_show: true,
                        payment: temp,
                    });
                } else {
                    this.checkPayment();
                }
                localStorage.removeItem('plan_status');
            }
        }
        return (
            <React.Fragment>
                <Banner status="info">
                    <div className="row">
                        <div className="col-12 text-center">
                            <Label id={1324461}>
                                <h4>
                                    Do you want to start your own Shopify store? We can guide you through it. <a href="https://docs.google.com/forms/d/1YPIZ-S3Q_5EwjGWSpgScR-OU0R9YKQQDsdxSXIKPrO4/edit" target="_blank">Contact us!</a>
                                </h4>
                            </Label>
                        </div>
                    </div>
                </Banner>
                <PlanBody paymentStatus={this.paymentStatus}/>;
                <div className="p-5 text-center">
                    <Button onClick={this.checkPayment} primary>
                        Move To Next Step
                    </Button>
                </div>
            </React.Fragment>
        );
    };

    /**************************  Step 3 linked you account start Here  ******************/
    checkLinkedAccount() {
        if ( this.state.importerServices.length > 0 ) {
            requests.postRequest('frontend/app/checkAccount', {code:this.state.importerServices}).then(data => {
                if ( data.success ) {
                    if ( data.data.account_connected ) {
                        notify.success('Account Connected Successfully');
                        this.changeStep(3);
                    } else {
                        notify.info('Please Connect Your Account First');
                    }
                } else {
                    notify.error(data.message);
                }
            });
        }
    }

    openNewWindow(code, val) {
        this.setState({modalOpen: !this.state.modalOpen, code: code, additional_data: val});
    } // Open Modal And A new Small Window For User

    handleImporterService = (arg) => {
        this.setState({importerServices:arg});
    };

    renderLinkedAccount = () => {
        return <div>
            <AppsShared history={this.props.history} importerServices={this.handleImporterService} redirectResult={this.redirectResult} success={this.state.data3Check}/>
            <div className="p-5 text-center">
                <Button onClick={this.checkLinkedAccount} primary>
                    Continue to next step
                </Button>
            </div>
        </div>;
    };

    redirectResult(code, val) {
        if ( isUndefined(val) ) { val = '' }
        this.openNewWindow(code, val);
    } // used in step 3 to get child data and send back to new child

    /********************** step 4 Configurations start here ****************************/
    checkConfig(val) {
        requests.getRequest('frontend/app/checkDefaultConfiguration?code=' + val).then(data => {
            if ( data.success ) {
                if ( data.data.configFilled ) {
                    this.changeStep(4);
                } else {
                    notify.info('Please Fill The Form');
                }
            } else {
                notify.error(data.message);
            }
        });
    }

    renderConfig() {
        return (
            <React.Fragment>
                <ConfigShared history={this.props.history} checkConfig={this.checkConfig} />
            </React.Fragment>
        );
    }

    /************************************  Render()   ***********************************/
    render() {
        return (
            <Page
                title={this.state.stepStart ? "Registration" : 'Dashboard'}
                primaryAction={{"content":"Pricing Guide", onClick:() => {this.redirect('/panel/dashboard/guide')}}}>
                {this.state.welcome_screen?
                    <div>
                        <AnalyticsReporting history={this.props.history}/>
                    </div>
                    : this.state.stepStart?
                    <React.Fragment>
                        <Card>
                            {this.renderStepper()}
                        </Card> {/* Stepper */}
                        {this.renderBody()} {/* Main Body Function Call Here */}
                        <Modal
                            open={this.state.modalOpen}
                            onClose={this.handleModalChange.bind(this,'no',this.state.active_step)}
                            title="Connect Account"
                        >
                            <Modal.Section>
                                    <InstallAppsShared
                                        history={this.props.history}
                                        redirect={this.redirectResult}
                                        code={this.state.code}
                                        additional_data={this.state.additional_data}
                                        success3={this.handleLinkedAccount}
                                    />
                            </Modal.Section>
                        </Modal> {/* Open For Step 3 to see Connected Account */}
                        <Modal title={this.state.payment.title} open={this.state.payment_show} onClose={() => {
                            this.setState({payment_show:false});}}
                        secondaryActions={{content:'OK', onClick:() => {
                                this.setState({payment_show:false});
                            }}}>
                            <Modal.Section>
                                <div className="text-center">
                                    <h3>{this.state.payment.message}</h3>
                                    {this.state.payment.body}
                                </div>
                            </Modal.Section>
                        </Modal>
                    </React.Fragment>:<div>
                            <Card>
                                <div>
                                    <img src={require('../../../assets/background/welcome_screen.png')} style={{height:'100%',width:'100%'}}/>
                                </div>
                            </Card>
                        </div>}
            </Page>
        );
    }

    handleLinkedAccount = (event) => {
        this.setState({data3Check:event});
    };

    redirect(url) {
        this.props.history.push(url);
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

}

export default Dashboard;
