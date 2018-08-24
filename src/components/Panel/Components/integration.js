import React, {Component} from 'react';
import { requests } from '../../../services/request';
import {Avatar, Button, Card, Page, Thumbnail} from '@shopify/polaris'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { environment } from '../../../environments/environment';
import {
    faArrowAltCircleLeft, faArrowsAltH,
    faCheckCircle,
    faExclamation,
    faLongArrowAltLeft,
    faLongArrowAltRight,
    faSync, faSyncAlt
} from "@fortawesome/free-solid-svg-icons";




class IntegrationPage extends Component {

    constructor(props)
    {
        super(props);
        this.renderimporteruploader=this.renderimporteruploader.bind(this);
        this.state={
            importer:{},
            uploader:{},
            importerset:false,
            uploaderset:false
        }
        requests.getRequest('connector/get/services?filters[type]=importer').then(data=>{
            this.state.importer=data.data
            this.setState({
                importer:this.state.importer,
                importerset:true
            });
        })
        requests.getRequest('connector/get/services?filters[type]=uploader').then(data=>{
            this.state.uploader=data.data;
            this.setState({
                uploader:this.state.uploader,
                uploaderset:true
            });
        })


    }
    redirect()
    {
        this.props.history.push('panel/plans');
    }
    renderimporteruploader()
    {
        let arr=[]
        if(this.state.importerset==true && this.state.uploaderset==true)
        {
            Object.keys(this.state.importer).map(importerkey=>{
                Object.keys(this.state.uploader).map(uploaderkey=>{
                    if(importerkey.substr(0,importerkey.indexOf('_'))!=uploaderkey.substr(0,uploaderkey.indexOf('_')))
                    {
                        arr.push(
                            <Card key={importerkey+uploaderkey}>
                                <Card.Section className="text-center">
                                    <div>
                                        <div className="row">
                                            <div className="d-sm-none d-none d-md-block col-sm-4 col-md-4 col-4 pt-sm-3  text-center">

                                                <img className="img-fluid" src={environment.API_ENDPOINT+this.state.importer[importerkey]['image']}/>

                                            </div>
                                            <div className="col-12 col-sm-4 col-4 mt-5">
                                                <div className="row">
                                                    <div className="col-12 d-block text-center font-weight-bold">
                                                        <h3>{importerkey.substr(0,importerkey.indexOf('_')).toUpperCase()}</h3>
                                                    </div>
                                                <div className="col-12 d-block text-center">
                                                    <FontAwesomeIcon  icon={faSyncAlt} size="5x" color=" #5563c1 "/>
                                                </div>
                                                    <div className="col-12  mt-3 d-block text-center font-weight-bold">
                                                        <h3>{uploaderkey.substr(0,uploaderkey.indexOf('_')).toUpperCase()}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-sm-none d-none d-md-block col-sm-4 col-md-4 col-4 pt-sm-3 text-center">

                                                <img className="img-fluid"  src={environment.API_ENDPOINT+this.state.uploader[uploaderkey]['image']}/>

                                            </div>
                                        </div>
                                    </div>
                                </Card.Section>
                                <Card.Section className="text-center">
                                    <div className="w-100 text-center">
                                    {
                                        this.state.importer[importerkey]['usable']==0 || this.state.uploader[uploaderkey]['usable']==0?
                                            <Button className="d-block" primary onClick={this.redirect.bind(this)}>Buy Plan For {importerkey.substr(0,importerkey.indexOf('_')).toUpperCase()}-{uploaderkey.substr(0,uploaderkey.indexOf('_')).toUpperCase()} Integration </Button>:'Integration is Active under your Plan'
                                    }
                                    </div>
                                </Card.Section>
                            </Card>
                        )

                        // arr.push(<div className="row mb-3">
                        //         <div className="col-4 col-md-5 text-center">{importerkey.toUpperCase()}</div>
                        //         <div className="col-8 col-md-2">{
                        //             this.state.importer[importerkey]['usable']==0 || this.state.uploader[uploaderkey]['usable']==0?
                        //                 <button className="btn btn-primary" onClick={this.redirect.bind(this)}>Buy Plan</button>:'Integration is Active under your Plan'
                        //         }</div>
                        //         <div className="col-4 col-md-5 text-center">{uploaderkey.toUpperCase()}</div>
                        //     </div>
                        //                   )
                    }
                })
            })
            return arr;
        }


        else
        {
            return <h2>Processing in Progress Please Wait......</h2>
        }
    }
    componentDidUpdate()
    {
        console.log(this.state.importer);
        console.log(this.state.uploader);
    }
    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Intergrations'}]}
            title="Integrations">
                {
                    this.renderimporteruploader()
                }
            </Page>
        );
    }
}

export default IntegrationPage;