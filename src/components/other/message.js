import React, {Component} from 'react';
import * as queryString  from 'query-string';
import "./message.css"
import {
    faCheck,faTimes
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "@shopify/polaris";
import Loader from "react-loader-spinner";

class MessageShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            title: '',
            success: '',
            shop: null,
            failed:'',
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
               shop: queryParams.shop !== undefined ?queryParams.shop : null,
               failed: queryParams.failed !== undefined,
           });
           localStorage.setItem('plan_status',JSON.stringify({
               message: queryParams.message,
               title: queryParams.title,
               success: queryParams.success === 'BG-success',
               shop: queryParams.shop !== undefined ?queryParams.shop : null,
               failed: queryParams.failed !== undefined,
           }));
           let win = window.open('','_parent','location=yes,width=20px,height=10px,scrollbars=yes,status=yes');
           setTimeout(() => {
               if ( queryParams.shop !== undefined ) {
                   win.location = 'https://' + queryParams.shop + '/admin/apps/importer-5';
               }
           },3000);
       }
       else
       {
           let win = window.open('','_parent','location=yes,width=200px,height=500px,scrollbars=yes,status=yes');
           setTimeout(() => {
               if ( queryParams.shop !== undefined ) {
                   win.location = 'https://' + queryParams.shop + '/admin/apps/importer-5';
               }
           },3000);
       }
    }
    redirect(url) {
        this.props.history.push(url);
    }
    handle = () => {
        window.open( 'https://' + this.state.shop + '/admin/apps/importer-5','_parent');
    };
    render() {
        return (
            <div className="row text-center m-5 h-100">
                <div className="offset-md-3 offset-sm-1 col-md-6 col-sm-10 col-12 mt-5">
                    <div className="CARD w-100">
                        <div className={`CARD-title-small text-center ${this.state.success}`}>
                            {this.state.success === 'BG-success'?
                                <FontAwesomeIcon icon={faCheck} size="5x"/>
                                : <FontAwesomeIcon icon={faTimes} size="5x"/>
                            }
                        </div>
                        <div className="CARD-body col-12 p-5 pl-5 w-100" style={{height:300}}>
                            <hr/>
                            <h4>{this.state.message}</h4>
                            <hr/>
                            <div className="col-12 d-flex justify-content-center">
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <Loader
                                            type="ThreeDots"
                                            color="#5c6ac4"
                                            height="100"
                                            width="100"
                                        />
                                    </div>
                                    <div className="col-12 text-center">
                                        <h4>Please Wait..</h4>
                                    </div>
                                </div>
                            </div>
                            {this.state.shop !== null?<div className="text-right">
                                <Button onClick={() => {window.open( 'https://' + this.state.shop + '/admin/apps/importer-5','_parent')}}>Home</Button>
                                <p style={{color:'#645f5b'}}>*In Case redirect not happen,<br/> Click on Home Button</p>
                                </div>:null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessageShow;