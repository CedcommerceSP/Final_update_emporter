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
    Checkbox, Tooltip, Link, Icon } from '@shopify/polaris';

export class Plans extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            checkBox: [],
        }
    }
    componentWillMount() {
        requests.getRequest('plan/plan/get').then(data => {
            // console.log(data);
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
        if ( flag === 1 )
            data1 = Object.assign({},RemoveService(Object.assign({},newArg), value.slice(0)));
        else data1 = arg;
        console.log(data1);
        requests.postRequest('/plan/plan/choose',data1).then(data => console.log(data));

    }
    onCheckBox(event) {
        let data = this.state.checkBox;
        data.forEach(Data => {
            if ( Data.title === event ) {
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
                                                        <span className="price-tag_small">{data.validity}</span>
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
                                                                    if ( data.services[keys].services[key1].required === 'yes' ) {
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
                                                                            if ( valueData.title === data.services[keys].services[key1].title )
                                                                                flag = 1;
                                                                        });
                                                                        if ( flag === 0 ) {
                                                                            ddd.push({title:data.services[keys].services[key1].title, isSelected: true, key: data.id, id: key1});
                                                                            this.state.checkBox = ddd;
                                                                        }
                                                                        return (<div key={key1} className="text-left form-inline">
                                                                            {this.state.checkBox.map(kk => {
                                                                                if ( kk.title === data.services[keys].services[key1].title ) {
                                                                                    return (
                                                                                        <Checkbox
                                                                                            key = { kk.title }
                                                                                            checked={kk.isSelected}
                                                                                            label={data.services[keys].services[key1].title}
                                                                                            onChange={this.onCheckBox.bind(this,data.services[keys].services[key1].title)}
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
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}