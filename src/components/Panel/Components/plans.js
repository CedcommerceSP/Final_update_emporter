import React, { Component } from 'react';
import './plans-component/plan.css';
import { requests } from '../../../services/request';
import { dataGrids, RemoveService } from './plans-component/plansFuctions';
import { isUndefined } from 'util';
import { notify } from '../../../services/notify';
import { Page,
    Card,
    Select,
    Button,
    Label,
    Checkbox, Tooltip, Link, Icon, Modal, RadioButton, Stack } from '@shopify/polaris';

export class Plans extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            checkBox: [],
            schemaModal: {
                show: false,
                title: '',
                body: '',
            }, // for show/Hide Modal
            schemaData: {
                method: '',
                data: []
            }
        };
        this.toggleSchemaModal = this.toggleSchemaModal.bind(this);
        this.createSchema = this.createSchema.bind(this);
        this.handleSchemaModalChange = this.handleSchemaModalChange.bind(this);
    }
    componentWillMount() {
        requests.getRequest('plan/plan/get').then(data => {
            console.log(data);
            if ( data.success ) {
                if ( data.data !== null && !isUndefined(data.data) ) {
                    data = dataGrids(data.data.data.rows);
                    this.setState({data : data});
                }
            } else {
                notify.error(data.message);
            }
        });
    }
    onSelectPlan(arg) {
        let value = [];
        let flag = 0;
        let newArg = Object.assign({}, arg);
        let data1 ;
        this.state.checkBox.forEach(data => {
            if (data.key === newArg.id) {
                value.push(Object.assign({}, data));
                flag = 1;
            }
        });
        data1 = Object.assign({},RemoveService(Object.assign({},newArg), value.slice(0)));
        console.log(data1);
        requests.postRequest('plan/plan/choose',data1).then(data => {
            if (data.success) {
                this.getSchema(data.data);
            } else {
                notify.error(data.message);
            }
        });
    }
    onCheckBox(event) {
        let data = this.state.checkBox;
        data.forEach(Data => {
            if ( Data.code === event ) {
                Data.isSelected = !Data.isSelected;
            }
        });
        this.setState({checkBox: data});
    }
    render() {
        // console.log(this.state.data);
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
                        {this.state.data.map((data, index) => {
                            return (
                                <div className="col-sm-4 col-12 pt-3 pb-3" key={index}>{/* Starting Of Plan Card */}
                                    <Card>
                                        <div className="d-flex justify-content-center">
                                            <div className="p-5" >
                                                <div className="mb-5 text-center" > {/* Plan Numeric Price */}
                                                    <p className="price-tag">
                                                        <span className="price-tag_small">$</span>
                                                        <span className="price-tag_discount"><strike>{data.originalValue}</strike></span>
                                                        {data.main_price}
                                                        <span className="price-tag_small">{data.validity_display}</span>
                                                    </p>
                                                </div>
                                                <div className="mb-5"> {/* Button To choose Plan */}
                                                    <Button primary={true} fullWidth={true} size="large" onClick={this.onSelectPlan.bind(this, data)}>
                                                        Choose this Plan
                                                    </Button>
                                                </div>
                                                <div className="mb-5 text-center"> {/* Descriptions For Particular deatails */}
                                                    <h1 className="mb-4"><b>{data.title}</b></h1>
                                                    <h4>{data.description}</h4>
                                                </div>
                                                <hr/>
                                                <div className="text-center mt-5"> {/* Services Data */}
                                                    {data.services?Object.keys(data.services).map(keys => {
                                                        return (<React.Fragment key={keys}>
                                                            <p className="service-body">
                                                                -<span className="service-description mb-3" style={{fontWeight:'bold'}}><b>{data.services[keys].title}</b></span>
                                                                <span>
                                                                    <Tooltip content={data.services[keys].description} preferredPosition="above">
                                                                        <Link><Icon source="help" color="inkLighter" backdrop={true} /></Link>
                                                                    </Tooltip>
                                                                </span>-
                                                            </p>
                                                            {Object.keys(data.services[keys].services).map(key1 => {
                                                                if ( data.services[keys].services[key1].required === 1 ) {
                                                                    return (<div key={key1} className="text-left">
                                                                        <Checkbox
                                                                            checked={true}
                                                                            label={data.services[keys].services[key1].title}
                                                                            disabled={true} />
                                                                    </div>);
                                                                } else {
                                                                    let ddd = this.state.checkBox;
                                                                    let flag = 0;
                                                                    ddd.forEach( valueData => {
                                                                        if ( valueData.code === data.services[keys].services[key1].code )
                                                                            flag = 1;
                                                                    });
                                                                    if ( flag === 0 ) {
                                                                        ddd.push({code:data.services[keys].services[key1].code, isSelected: true, key: data.id, id: key1});
                                                                        this.state.checkBox = ddd;
                                                                    }
                                                                    return (<div key={key1} className="text-left form-inline">
                                                                        {this.state.checkBox.map(kk => {
                                                                            if ( kk.code === data.services[keys].services[key1].code ) {
                                                                                return (
                                                                                    <Checkbox
                                                                                        key = { kk.code }
                                                                                        checked={kk.isSelected}
                                                                                        label={data.services[keys].services[key1].title}
                                                                                        onChange={this.onCheckBox.bind(this,data.services[keys].services[key1].code)}
                                                                                    />
                                                                                );
                                                                            }
                                                                        })}
                                                                    </div>);
                                                                }
                                                            })}
                                                        </React.Fragment>);
                                                    }):null}
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
                    primaryAction={{content:'Submit', onClick:() => {this.submit()}}}
                    onClose={this.toggleSchemaModal}
                >
                    <Modal.Section>
                        {this.state.schemaModal.body}
                    </Modal.Section>
                </Modal>
            </Page>
        );
    }
    getSchema(arg) {
        console.log(arg.schema);
        if ( !isUndefined(arg.show_payment_methods) ) {
            this.setSchema(1, null);
        } else {
            this.setSchema(2, arg.schema)
        }
    }
    setSchema(event,arg) {
        let data = this.state.schemaModal;
        data.show = true;
        data.title = 'PAYMENT';
        switch(event) {
            case 1 : data.body = this.paymentMethod(arg);break;
            case 2 : data.body = this.createSchema(arg);break;
        }
        this.setState({
            schemaModal: data
        });
    }
    paymentMethod(arg) {
        return (
            <Stack vertical>
                {arg.map(data => {
                    return (<RadioButton key={data} label={data.title} helpText={data.description} id={data.title} name="payment" onChange={this.handleSchemaModalChange}/>
                    );
                })}
            </Stack>
        );
    }
    createSchema(arg) {
        let data = this.state.schemaData;
        data.data = arg;
        this.setState({
            schemaData: data,
        });
        console.log(arg);
        return (
            arg.map((key, index) => {
                switch(key.type) {
                    case 'select' :
                        let options = [];
                        arg.forEach(keys => {
                            keys.options.forEach(key => {
                                    options.push({label: Object.keys(key)[0],value:Object.keys(key)[0]});
                            });
                        });
                        return (
                        <div key = {index}>
                            <Select
                                options={options}
                                label={key.title}
                                onChange={this.schemaConfigurationChange.bind(this, index)}
                                value={this.state.schemaData.data[index].value}/>
                        </div>
                    );
                    case 'checkbox' : return (
                        <div className="col-12 pt-2 pb-2" key={index}>
                        <Label>{arg.title}</Label>
                    </div>);
                }
            })
        );
    }
    schemaConfigurationChange(index,value) {
        let data = this.state.schemaData;
        data.data[index].value = value;
        this.setState({
            schemaData: data,
        });
        this.setSchema(2, this.state.schemaData.data);
    }
    handleSchemaModalChange(status, event) {
        let data = this.state.schemaData;
        data.method = event;
        this.setState({
            schemaData: data,
        });
    }
    submit() {
        console.log(this.state.schemaData);
    }
    toggleSchemaModal() {
        let data = this.state.schemaModal;
        data.show = !data.show;
        this.setState({schemaModal: data});
    }
    redirect(url) {
        this.props.history.push(url);
    }
    updateState() {
        const state = this.state;
        this.setState(state);
    }
}