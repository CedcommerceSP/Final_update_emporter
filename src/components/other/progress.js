import React, {Component} from 'react';
import {Card, Banner} from "@shopify/polaris";
import {notify} from "../../services/notify";
import { isUndefined } from 'util';

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseMessage:[],
            width:'0%',
            count: 1,
            dataHold:{},
            mode: true,
            pause: false,
            data: props.location.state.data,
            chunk: props.location.state.chunk,
            marketPlace: props.location.state.marketPlace,
        };
        this.createChunk(this.state.chunk,0)
    }
    createChunk(chunk,start) {
        if ( this.state.mode ) {
            let len = 100/(this.state.data.length/this.state.chunk);
            const data = this.state.data.slice(start,chunk);
            if (data.length > 0) {
                this.startUploading(start, chunk,len);
            } else {
                notify.success('Completed');
                setTimeout(() => {
                    this.props.history.push('/panel/products');
                },3000);
            }
        } else {
            this.setState({
                dataHold: {
                    chunk:chunk,
                    start:start,
                }
            });
        }
    }
    startUploading(start, chunk,len) {
        let response = this.state.responseMessage;
        setTimeout(() => {
            start = chunk;
            chunk = start + this.state.chunk;
            response.push(<Banner status="success"><h4>Daat Completed</h4></Banner>);
            this.setState({width:len*this.state.count + '%',count: this.state.count + 1,responseMessage:response});
            this.createChunk(chunk,start);
        },2000);
    }
    handleChange(event) {
        if (event === 'pause' ) {
            this.setState({mode:false,pause:true});
        } else if (  event === 'cancel' )  {
            if (window.confirm('Are you sure want to Cancel')) {
                this.setState({mode:false});
                notify.info('Canceled');
                setTimeout(() => {
                    this.props.history.push('/panel/products');
                },1000);
            }
        } else {
            this.setState({mode:true,pause:false});
            setTimeout(() => {
                this.createChunk(this.state.dataHold.chunk,this.state.dataHold.start);
            });
        }
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
                            <div className="col-6">{this.state.width} Completed</div>
                            <div className="col-6 text-right">Please wait...</div>
                            <div className="col-12 mb-5">
                                <div className="progress" style={{height:'30px'}}>
                                    <div className={`progress-bar ${this.state.mode?`bg-success`:`bg-warning`} progress-bar-striped progress-bar-animated`} role="progressbar"
                                         aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width:this.state.width}}/>
                                </div>
                            </div>
                            <div className="col-12 text-right">
                                <button onClick={() => this.handleChange(this.state.pause?"start":'pause')} className="btn btn-lg btn-success mr-5" type="button">
                                    {this.state.pause?"Start":'Pause'}
                                </button>
                                <button onClick={() => this.handleChange('cancel')} className="btn btn-danger btn-lg" type="button">
                                    Cancel
                                </button>
                            </div>
                            <div className="col-12 mt-5">
                                <div className=" text-right" style={{overflow:'auto',width:'100%',height:'200px',backgroundColor:'#f9f9f9'}}>
                                        {this.state.responseMessage.map((e,index) => {
                                            return <div key={index}>
                                                {e}
                                            </div>
                                        })}
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