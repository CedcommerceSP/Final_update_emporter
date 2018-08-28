import React, {Component} from 'react';
import { Page,EmptyState } from '@shopify/polaris';
import * as queryString  from 'query-string';
import "./message.css"
import {Col,Card,Row,CardHeader,CardBody} from "reactstrap";

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
               queryParams.success = 'bg-danger';
           } else {
               queryParams.success = 'bg-success';
           }
           this.setState({
               message: queryParams.message,
               title: queryParams.title,
               success: queryParams.success,
           });
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
                <div className="row text-center">
                    <div className="col-12 col-sm-8 col-md-8 offset-0 offset-sm-2 offset-md-2">
                            <div className={`card p-4`} style={{width: '100%','minHeight':'200px'}}>
                                <div className={`card ${this.state.success} text-center text-white`} style={{width: '100%',minHeight:'400px'}}>
                                    <div className="card-body">
                                        <div className="row mt-5">
                                            <div className="col-md-12">
                                            <h1>{this.state.message}</h1>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                    </div>
                </div>
        );
    }
}

export default MessageShow;