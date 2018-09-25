import React, {Component} from 'react';
import * as queryString  from 'query-string';
import "./message.css"
import {
    faCheck,faTimes
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
           },2000)
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
                <div className="offset-md-3 offset-sm-1 col-md-6 col-sm-10 col-12 mt-5">
                    <div className="CARD w-100">
                        <div className={`CARD-title-small text-center ${this.state.success}`}>
                            {this.state.success === 'BG-success'?
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