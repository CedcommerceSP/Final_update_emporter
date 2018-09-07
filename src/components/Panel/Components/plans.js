import React, { Component } from 'react';
import './plans-component/plan.css';
import { requests } from '../../../services/request';
import { dataGrids, RemoveService } from '../../../shared/plans/plansFuctions';
import { isUndefined } from 'util';
import { notify } from '../../../services/notify';
import { Page,
    Card,
    Select,
    Button,
    Label,
    Checkbox, Tooltip, Link, Icon, Modal, RadioButton, Stack, TextField } from '@shopify/polaris';
import PlanBody from "../../../shared/plans/plan-body";
export class Plans extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     data: [],
        //     checkBox: [],
        //     schemaModal: { // this object is used to maintain frontend data
        //         show: false,// for show/Hide Modal
        //         title: '', // title of a Modal
        //         body: '', // HTML body
        //         data: '', // Data to be store
        //     },
        //     schemaData: { // this one is send to server
        //         plan:{}, // selected plans
        //     } // more field is added like schema and payment_method below
        // };
        // this.toggleSchemaModal = this.toggleSchemaModal.bind(this);
        // this.createSchema = this.createSchema.bind(this);
    }
    // componentWillMount() {
    //     requests.getRequest('plan/plan/get').then(data => { // get All the Plans Available
    //         if ( data.success ) {
    //             if ( data.data !== null && !isUndefined(data.data) ) {
    //                 data = dataGrids(data.data.data.rows);
    //                 this.setState({data : data});
    //             }
    //         } else {
    //             notify.error(data.message);
    //         }
    //     });
    // }
    paymentStatus(event) {
        console.log(event);
    }
    render() {
        return (
            <Page
                title="Plans"
                primaryAction={{content: 'Billing History', onClick: () => {
                        this.redirect('/panel/plans/history');
                    }}}>
                    <div className="row">
                        <div className="col-12 text-center mb-5"> {/*tittle*/}
                            <span style={{'fontSize':'40px'}}><b>Choose the best offer</b></span>
                            <h3>If you already have an existing plan you can upgrade or downgrade your plan</h3>
                        </div>
                        <div className="col-12 mb-4">
                            <div className="d-flex justify-content-center">
                                <Button primary={true} onClick={() => this.redirect('/panel/plans/current')}>Show Active Plan</Button>
                            </div>
                        </div>
                    </div>
                    <PlanBody paymentStatus={this.paymentStatus} />
            </Page>
        );
    }
    // getSchema(arg, plan) {
    //     let data = this.state.schemaData;
    //     if (plan !== null ){
    //         data.plan = plan;
    //     }
    //     this.setState({
    //         schemaData: data,
    //     });
    //     if ( !isUndefined(arg.show_payment_methods) ) {
    //         this.setSchema(1, arg.payment_methods);
    //     } else if ( !isUndefined(arg.schema )) {
    //         // arg.schema.push(JSON.parse('{"key":"included_destination","title":"Included Destination","value":["Shopping Actions"],"required":true,"type":"checkbox","options":{"Shopping":"Shopping","Shopping Actions":"Shopping Actions","Display Ads":"Display Ads"}}'));
    //         // arg.schema.push(JSON.parse('{"key":"Name","title":"Your Name","value":"","required":true,"type":"textfield"}'));
    //         this.setSchema(2, arg.schema);
    //     } else if ( !isUndefined(arg.confirmation_url )) {
    //         this.setSchema(3, arg.confirmation_url);
    //     } else {
    //         this.setSchema(4, arg.payment_done);
    //     }
    // } // this is responsible for deciding what data we get from server (schema, payment_method etc) and send info to setSchema
    // setSchema(event,arg) {
    //     let data = this.state.schemaModal;
    //     data.show = true;
    //     data.title = 'PAYMENT';
    //     switch(event) {
    //         case 1 :  data.body = this.paymentMethod(arg);break;
    //         case 2 :  data.body = this.createSchema(arg);break;
    //         case 3 :  this.openNewWindow(arg);break;
    //         case 4 :  this.paymentDone(arg);break;
    //         default : notify.info('Wrong Input');
    //     }
    //     this.setState({
    //         schemaModal: data
    //     });
    // } // this function is responsible for creating the Body of Payment Modal
    // paymentMethod(arg) {
    //     // let data = this.state.schemaData;
    //     // data.payment_method = arg[Object.keys(arg)[Object.keys(arg).length - 1]];
    //     // this.setState({
    //     //     schemaData: data,
    //     // });
    //     return (
    //         <Stack vertical>
    //             {Object.keys(arg).map((key, index) => {
    //                 return (<RadioButton
    //                         key={index}
    //                         label={arg[key].title}
    //                         helpText={arg[key].description}
    //                         id={arg[key].code}
    //                         name="payment"
    //                         onChange={this.handleSchemaModalChange.bind(this,arg[key])}/>
    //                 );
    //             })}
    //         </Stack>
    //     );
    // } // create a choose payment method
    // createSchema(arg) {
    //     let data = this.state.schemaModal;
    //     data.data = arg;
    //     this.setState({
    //         schemaModal: data,
    //     });
    //     return (
    //         arg.map((key, index) => {
    //             switch(key.type) {
    //                 case 'select' :
    //                     let options = [];
    //                     Object.keys(key.options).forEach(e => {
    //                        if ( this.state.schemaModal.data[index].value === '' ) {
    //                            let data2 = this.state.schemaData;
    //                            data2.schema = {};
    //                            data2.schema[this.state.schemaModal.data[index].key] = key.options[e];
    //                            this.state.schemaModal.data[index].value = key.options[e];
    //                        }
    //                        options.push({label: e,value:key.options[e]});
    //                     });
    //                     return (
    //                     <div key = {index}>
    //                         <Select
    //                             options={options}
    //                             label={key.title}
    //                             onChange={this.schemaConfigurationChange.bind(this, index,'select')}
    //                             value={this.state.schemaModal.data[index].value}/>
    //                     </div>
    //                 );
    //                 case 'checkbox' : return (
    //                     <div className="col-12 pt-2 pb-2 mt-4" key={index}>
    //                     <Label key={index} id={index}>{key.title}</Label>
    //                         <div className="row">
    //                             {
    //                                 Object.keys(key.options).map(option => {
    //                                     return (
    //                                         <div className="col-md-6 col-sm-6 col-12 p-1" key={option}>
    //                                             <Checkbox
    //                                                 checked={key.value.indexOf(option) !== -1}
    //                                                 label={option}
    //                                                 onChange={this.schemaConfigurationChange.bind(this, index, option)}
    //                                             />
    //                                         </div>
    //                                     );
    //                                 })
    //                             }
    //                         </div>
    //                 </div>);
    //                 default: return (
    //                     <div className="mt-4" key={index}>
    //                         <TextField
    //                             label={key.title}
    //                             value={this.state.schemaModal.data[index].value}
    //                             onChange={this.schemaConfigurationChange.bind(this, index,'textbox')}
    //                          />
    //                     </div>
    //                 );
    //             }
    //         })
    //     );
    // } // create a schema For payment modal
    // schemaConfigurationChange(index,type,value) {
    //     let data = this.state.schemaModal; // frontend data we need to maintain
    //     let data2 = this.state.schemaData; // server data we need to send
    //     if ( isUndefined(data2.schema) ) { // define a schema object
    //         data2.schema = {};
    //     }
    //     if ( type === 'select' ) {
    //         data2.schema[data.data[index].key] = value; // will set the server data (We need to send)
    //         data.data[index].value = value; // this is for frontend side data
    //     } else if ( type === 'textbox' ) {
    //         data2.schema[data.data[index].key] = value;
    //         data.data[index].value = value;
    //     } else {
    //         if ( value ) {
    //             data.data[index].value.push(type);
    //         } else {
    //             data.data[index].value.splice( data.data[index].value.indexOf(type) ,1);
    //         }
    //         data2.schema[data.data[index].key] = data.data[index].value;
    //     }
    //     this.setState({
    //         schemaModal: data,
    //         schemaData: data2,
    //     });
    //     this.setSchema(2, this.state.schemaModal.data);
    // } // maintain the value of schema
    // handleSchemaModalChange(status, plan,event) {
    //     let data = this.state.schemaData;
    //     data.payment_method = status;
    //     this.setState({
    //         schemaData: data,
    //     });
    // } // choose the payment method
    // openNewWindow() {
    //     this.toggleSchemaModal();
    // } // open new Window
    // paymentDone(arg) {
    //     this.toggleSchemaModal();
    //     if ( arg ) {
    //         notify.success("Payment Done");
    //     } else {
    //         notify.error("Something Went Wrong");
    //     }
    // } // mainly its last step when data either succeed or fail (data come from server)
    // submit() {
    //     console.log(this.state.schemaData);
    //     if (this.validationCheck()) {
    //         let win = window.open('', '_blank', 'location=yes,height=600,width=550,scrollbars=yes,status=yes'); // open new Window
    //         requests.postRequest('plan/plan/submitSchema',this.state.schemaData).then(data => {
    //             if (data.success) {
    //                 if ( !isUndefined(data.data.confirmation_url )) {
    //                     win.location = data.data.confirmation_url;
    //                 } else {
    //                     win.close();
    //                 }
    //                 this.getSchema(data.data, null);
    //             } else {
    //                 win.close();
    //                 notify.error(data.message);
    //             }
    //         });
    //     }
    // } // submit the data to server When clicked
    // validationCheck() {
    //     const server = this.state.schemaData;
    //     const frontEnd = this.state.schemaModal.data;
    //     let validate = true;
    //     if ( isUndefined(server.schema) && isUndefined(server.payment_method)) {
    //         notify.info('Please Fill Up The Field');
    //         return false;
    //     } else {
    //         Object.keys(frontEnd).forEach((data, index) => {
    //             if ( frontEnd[data].required ) {
    //                 let flag = 0;
    //                 Object.keys(server.schema).forEach((keys) => {
    //                     if ( frontEnd[data].key === keys ) {
    //                         flag = 1;
    //                         if ( frontEnd[data].type === 'checkbox' ) {
    //                             if (server.schema[keys].length <= 0 ) {
    //                                 validate = false;
    //                                 notify.info(frontEnd[data].title + ": Please Select");
    //                             }
    //                         } else {
    //                             if ( server.schema[keys] === '' ) {
    //                                 validate = false;
    //                                 notify.info(frontEnd[data].title + ": Empty Or Not Selected");
    //                             }
    //                         }
    //                     }
    //                 });
    //                 if ( flag === 0 ) {
    //                     validate = false;
    //                     server.schema[frontEnd[index].key] = frontEnd[index].value;
    //                     this.submit();
    //                 }
    //             }
    //         });
    //     }
    //     return validate;
    // } // this is for Validation check to make Sure User follow All Steps
    // toggleSchemaModal() {
    //     const data  = {
    //         show: false,
    //         title: '',
    //         body: '',
    //         data: '',
    //     };
    //     this.state.schemaModal.show = false;
    //     this.setState({
    //         schemaModal: data,
    //         schemaData: {
    //             plan:{},
    //         }
    //     });
    // } // this will reset All the object And close the Modal of Payment
    redirect(url) {
        this.props.history.push(url);
    }
    updateState() {
        const state = this.state;
        this.setState(state);
    }
}