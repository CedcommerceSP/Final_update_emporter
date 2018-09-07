import React, {Component} from 'react';
import { Page,EmptyState } from '@shopify/polaris';
import * as queryString  from 'query-string';
import "./message.css"
import {
    faCheck,faTimes
} from '@fortawesome/free-solid-svg-icons';
import {Col,Card,Row,CardHeader,CardBody} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const primaryColor = "#9c27b0";
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
const grayColor = "#999999";
class MessageShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            title: '',
            success: '',
        }
    }
    componentWillMount() {
       const queryParams = queryString.parse(this.props.location.search);
       if(queryParams.message!=null && queryParams.success!=null) {
           if (queryParams.success === undefined || queryParams.success === 'false') {
               queryParams.success = 'BG-danger';
           } else {
               queryParams.success = 'BG-success';
           }
           this.setState({
               message: queryParams.message,
               title: queryParams.title,
               success: queryParams.success,
           });
           setTimeout(() => {
               window.close();
           },4000)
       }
       else
       {
           this.redirect('/auth');
       }
    }
    redirect(url) {
        this.props.history.push(url);
    }
    render() {
        return (
                <div className="row text-center m-5 h-100">
                    {/*<div className="col-12 col-sm-8 col-md-8 offset-0 offset-sm-2 offset-md-2">*/}
                            {/*<div className={`card p-4`} style={{width: '100%','minHeight':'200px'}}>*/}
                                {/*<div className={`card ${this.state.success} text-center text-white`} style={{width: '100%',minHeight:'400px'}}>*/}
                                    {/*<div className="card-body">*/}
                                        {/*<div className="row mt-5">*/}
                                            {/*<div className="col-md-12">*/}
                                            {/*<h1>{this.state.message}</h1>*/}
                                            {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                    {/*</div>*/}
                    <div className="offset-md-3 offset-sm-1 col-md-6 col-sm-10 col-12 mt-5">
                        <div className="CARD w-100">
                            <div className={`CARD-title-small text-center ${this.state.success}`}>
                                {this.state.success=='BG-success'?
                                    <FontAwesomeIcon icon={faCheck} size="5x"/>
                                    : <FontAwesomeIcon icon={faTimes} size="5x"/>
                                }
                            </div>
                            <div className="CARD-body col-12 p-5 pl-5 w-100" style={{height:360}}>
                                <h4>{this.state.message}</h4>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default MessageShow;