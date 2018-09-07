import React, {Component} from 'react';
import {Page, Card, Button} from "@shopify/polaris";
import {faDollarSign, faCalendarCheck, faCalendarTimes, faHeadphones, faCogs, faQuoteLeft, faQuoteRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {displayArray} from './current-plan-func';
import { requests } from '../../../../services/request';
import {notify} from "../../../../services/notify";
import './plan.css';

const primaryColor = "#9c27b0";
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
const grayColor = "#999999";
class CurrentPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            card: [],
            card_service:[]
        };
    }
    componentWillMount() {
        requests.getRequest('plan/plan/getActive').then(data => {
            if ( data.success ) {
                const state = displayArray(data.data);
                this.setState(state);
            } else {
                notify.error(data.message);
            }
        });
    }
    render() {
        return (
            <Page
                primaryAction={{content: 'Back', onClick: () => {
                        this.redirect('/panel/plans');
                    }}}
                title="Current Plan">
                    <Card >
                        <div className="container">
                            <div className="row p-4 p-sm-5">
                                <div className="col-12 mb-5 pb-5 pt-0">
                                    <h1>Active Plan</h1>{/*Tittle*/}
                                    {/*<span style={{fontSize:'40px', color: '#000'}}><b>Starter Plan</b></span>*/}
                                </div>
                                {/*<div className="col-12 mb-5 p-5 text-right">*/}
                                    {/*<div className="progress mb-5" style={{height:'30px'}}>*/}
                                        {/*<div className="progress-bar BG-primary"*/}
                                             {/*role={'progressbar'}*/}
                                             {/*style={{width:'10%'}}/>*/}
                                    {/*</div>*/}
                                    {/*<h2>Total Feed Used</h2>*/}
                                    {/*<h4>999/10000</h4>*/}
                                {/*</div>*/}
                                {this.state.card.map((keys, index) => { {/*LVL1*/}
                                    let col = 'col-12 col-sm-6 mb-5';
                                    if ( this.state.card.length % 2 === 1 ) {
                                        if ( index + 1 === this.state.card.length ) {
                                            col = 'col-12 col-sm-6 mb-5';
                                        }
                                    }
                                    return (
                                        <div className={col} key={index}>
                                            <div className="">
                                                <div className="CARD mt-5">
                                                    <div className="CARD-title-small text-center BG-primary">
                                                        {keys.icon}
                                                    </div>
                                                    <div className="CARD-body p-5">
                                                        <h2>{keys.text}</h2>
                                                        <h6>{keys.text_info}</h6></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="col-12 p-5 text-center">
                                    <Button className="d-block" onClick={this.redirect.bind(this,'/panel/plans')}>
                                        Upgrade Plan
                                    </Button>
                                </div>
                                <div className="col-12 mt-5">
                                    <div className="row">
                                        <div className="col-12 col-sm-2 text-center text-sm-left">
                                            <FontAwesomeIcon icon={faQuoteLeft} size="3x" color={grayColor}/>
                                        </div>
                                        <div className="col-12 col-sm-8 text-center">
                                            <span style={{fontSize:'20px', color: '#999999'}}>
                                                {this.state.description}
                                            </span>
                                        </div>
                                        <div className="col-12 col-sm-2 text-center text-sm-right">
                                            <FontAwesomeIcon icon={faQuoteRight} size="3x" color={grayColor}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-5 mb-5">
                                    <hr/>
                                </div>
                                <div className="col-12 mb-5 pb-5 pt-0">
                                    <h2>My Services</h2>{/*Tittle*/}
                                    {/*<span style={{fontSize:'40px', color: '#000'}}><b>Starter Plan</b></span>*/}
                                </div>
                                {this.state.card_service.map((key, titleIndex) => {
                                    return (<React.Fragment key={titleIndex}>
                                                <div className="col-12 mb-5" >
                                                    <div className="CARD mt-5">
                                                        <div className="CARD-title-small text-center BG-warn">
                                                            {key.icon}
                                                        </div>
                                                        <div className="CARD-body p-5">
                                                            <h2>{key.text}</h2>
                                                            <h6>{key.text_info}</h6></div>
                                                    </div>
                                                </div>
                                    </React.Fragment>)
                                })}
                            </div>
                        </div>
                    </Card>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}


export default CurrentPlan;