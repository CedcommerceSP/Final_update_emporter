import React, {Component} from 'react';
import { Page, Card } from '@shopify/polaris';
import * as queryString  from 'query-string';

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
       if ( queryParams.success === undefined || queryParams.success === 'false') {
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
    render() {
        return (
            <Page title="">
                <div className="row" style={{margin: '20% 0% 0%'}}>
                    <div className="col-12 col-sm-8 offset-0 offset-sm-2">
                        <div className="d-flex justify-content-center">
                            <div className="card p-4" style={{width: '100%','minHeight':'200px'}}>
                                <div className={`card ${this.state.success} text-center`} style={{width: '100%',minHeight:'200px'}}>
                                    <div className="card-header">
                                        <h1>{this.state.title}</h1>
                                    </div>
                                    <div className="card-body">
                                        <h1>{this.state.message}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}

export default MessageShow;