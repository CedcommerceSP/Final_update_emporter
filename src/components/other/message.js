import React, {Component} from 'react';
import * as queryString  from 'query-string';
import "./message.css"
import {
    faCheck,faTimes
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "@shopify/polaris";
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
           if ( !this.state.failed ) {
               setTimeout(() => {
                   // window.location.href = 'https://' + this.state.shop + '/admin';
                   window.close();
               },2000)
           } else {
               setTimeout(() => {
                   // window.location.href = 'https://' + this.state.shop + '/admin';
                   window.close();
               },6000)
           }
       }
       else
       {
           window.close();
           this.redirect('/auth');
       }
    }
    redirect(url) {
        this.props.history.push(url);
    }
    handleClick = () => {
        window.close();
        // window.location.href = 'https://' + this.state.shop;
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
                            <div className="text-left mt-4">
                                {this.state.failed?<ul>
                                    <li><h5>You Can uninstall:-</h5></li>
                                    <li><h5>Go to app from your shopify dahboard</h5></li>
                                    <li><h5>You can Un-install the App by clicking in Bin Icon</h5></li>
                                </ul>:null}
                            </div>
                            {/*<div className="p-5 text-right">*/}
                                {/*{this.state.failed?<Button primary onClick={this.handleClick}>*/}
                                    {/*Back*/}
                                {/*</Button>:null}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessageShow;