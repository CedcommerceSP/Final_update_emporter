import React, {Component} from 'react';
import {Card} from "@shopify/polaris";
import {notify} from "../../services/notify";

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseMessage:[],
            width:'0%',
            count: 1,
            data: props.location.state.data,
            chunk: props.location.state.chunk,
            marketPlace: props.location.state.marketPlace,
        };
        this.createChunk(this.state.chunk,0)
    }
    createChunk(chunk,start) {
        const data = this.state.data.slice(start,chunk);
        console.log(this.state.width,this.state.count);
        if (data.length > 0) {
            this.startUploading(start, chunk);
        } else {
            notify.success('Completed');
            setTimeout(() => {
                this.props.history.push('/panel/products');
            },3000);
        }
    }
    startUploading(start, chunk) {
        let response = this.state.responseMessage;
        setTimeout(() => {
            start = chunk;
            chunk = start + this.state.chunk;
            response.push('new Data');
            this.setState({width:33.33*this.state.count + '%',count: this.state.count + 1,responseMessage:response});
            this.createChunk(chunk,start);
        },2000);
    }
    render() {
        return (
            <div className="p-5 row">
                <div className="offset-sm-2 offset-0 col-12 col-sm-8">
                    <Card>
                        <div className="row p-5">
                            <div className="col-12 mb-5">
                                <h1>Uploading:</h1>
                            </div>
                            <div className="col-6">75% Completed</div>
                            <div className="col-6 text-right">Please wait...</div>
                            <div className="col-12 mb-5">
                                <div className="progress" style={{height:'30px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                         aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width:this.state.width}}/>
                                </div>
                            </div>
                            <div className="col-12 text-right">
                                <button className="btn btn-mini" type="button">Cancel</button>
                            </div>
                            <div className="col-12 mt-5">
                                <div className="p-5" style={{overflow:'auto',width:'100%',height:'200px',backgroundColor:'#f9f9f9'}}>
                                    <ul>
                                        {this.state.responseMessage.map(e => {
                                            return <li><h4>{e}</h4></li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Progress;