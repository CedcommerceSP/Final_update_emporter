import React, {Component} from 'react';

class Progress extends Component {
    constructor(props) {
        super(props);
        console.log(props.location.state)
    }
    render() {
        return (
            <div className="p-5 row">
                <div className="offset-sm-2 offset-0 col-12 col-sm-8">
                    <div className="row">
                        <div className="col-12 mb-5">
                            <h1>Uploading:</h1>
                        </div>
                        <div className="col-6">75% Completed</div>
                        <div className="col-6 text-right">Please wait...</div>
                        <div className="col-12 mb-5">
                            <div className="progress" style={{height:'30px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                     aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width:'75%'}}/>
                            </div>
                        </div>
                        <div className="col-12 text-right">
                            <button className="btn btn-mini" type="button">Cancel</button>
                        </div>
                        <div className="col-12 mt-5">
                            <div className="p-5" style={{overflow:'auto',width:'100%',height:'200px',backgroundColor:'#e7e7e7'}}>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-danger">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-danger">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-danger">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                                <h4 className="text-success">-> This Is a Test Run Data Response From Server</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Progress;