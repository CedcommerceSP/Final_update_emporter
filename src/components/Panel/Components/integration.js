import React, {Component} from 'react';
import { requests } from '../../../services/request';
import {Avatar, Button, Card, Page, Thumbnail,Banner, Label,ResourceList} from '@shopify/polaris'
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
import { notify } from '../../../services/notify'

var rows;
let visible=[];
class IntegrationPage extends Component {

    constructor(props)
    {
        super(props);
        this.renderimporteruploader=this.renderimporteruploader.bind(this);
        this.filtercontrol=this.filtercontrol.bind(this);
        this.state={
            dataset:false,
            searchValue:'',
            integrations:[],
        }
        this.preparedata()




    }
    preparedata(){
        let integrations=[];
        let importer={};
        let uploader={};
        requests.getRequest('connector/get/services?filters[type]=importer').then(data=> {
            if (data.success == true)
            {
            importer = data.data;
            requests.getRequest('connector/get/services?filters[type]=uploader').then(data1 => {
                 if(data1.success==true){
                uploader = data1.data;
                Object.keys(importer).map(importerkey => {
                    Object.keys(uploader).map(uploaderkey => {
                        if (importer[importerkey]['title'] != uploader[uploaderkey]['title']) {
                            integrations.push(
                                {
                                    importer: importer[importerkey]['title'],
                                    uploader: uploader[uploaderkey]['title'],
                                    importer_usable: importer[importerkey]['usable'],
                                    uploader_usable: uploader[uploaderkey]['usable'],
                                    importer_image: importer[importerkey]['image'],
                                    uploader_image: uploader[uploaderkey]['image'],
                                    visible: true

                                }

                            )
                            visible.push(importerkey+uploaderkey)

                        }

                    })

                })

                this.setState({
                    integrations: integrations,
                    dataset: true
                })
            }
            else
                 {
                     this.setState({
                         integrations:[],
                     })

                     notify.error(data1.message)
                 }

            })
        }
        else
            {
                this.setState({
                    integrations:[],
                })
                notify.error(data.message)
            }
        })


    }
    componentDidUpdate()
    {

    }
    redirect()
    {
        this.props.history.push('/panel/plans');
    }
    renderimporteruploader()
    {
        let arr=[]
        if(this.state.dataset==true) {
            for(let i=0;i<this.state.integrations.length;i++){
            if (this.state.integrations[i].importer!= this.state.integrations[i].uploader && this.state.integrations[i].visible==true) {
                arr.push(
                    <Card key={this.state.integrations[i].importer + this.state.integrations[i].uploader}>
                        <Card.Section className="text-center">
                            <div>
                                <div className="row">
                                    <div
                                        className="d-sm-none d-none d-md-block col-sm-4 col-md-4 col-4 pt-sm-3  text-center">

                                        <img className="img-fluid"
                                             src={environment.API_ENDPOINT + this.state.integrations[i].importer_image}/>

                                    </div>
                                    <div className="col-12 col-sm-4 col-4 mt-5">
                                        <div className="row">
                                            <div className="col-12 d-block text-center font-weight-bold">
                                                <h3>{this.state.integrations[i].importer.toUpperCase()}</h3>
                                            </div>
                                            <div className="col-12 d-block text-center">
                                                <FontAwesomeIcon icon={faSyncAlt} size="5x"
                                                                 color=" #5563c1 "/>
                                            </div>
                                            <div
                                                className="col-12  mt-3 d-block text-center font-weight-bold">
                                                <h3>{this.state.integrations[i].uploader.toUpperCase()}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="d-sm-none d-none d-md-block col-sm-4 col-md-4 col-4 pt-sm-3 text-center">

                                        <img className="img-fluid"
                                             src={environment.API_ENDPOINT + this.state.integrations[i].uploader_image}/>

                                    </div>
                                </div>
                            </div>
                        </Card.Section>
                        <Card.Section className="text-center">
                            <div className="w-100 text-center">
                                {
                                    this.state.integrations[i].importer_usable == 0 || this.state.integrations[i].uploader_usable == 0 ?
                                        <Button className="d-block" primary
                                                onClick={this.redirect.bind(this)}>Buy Plan
                                            For {this.state.integrations[i].importer.toUpperCase()}-{this.state.integrations[i].uploader.toUpperCase()} Integration </Button>
                                        :
                                        <div className="w-md-75 w-sm-75 w-100 m-auto">
                                            <Banner status="success">
                                                <Label>{this.state.integrations[i].importer.toUpperCase()}-{this.state.integrations[i].uploader.toUpperCase()} Integration
                                                    is Active under your Plan</Label>
                                            </Banner>
                                        </div>
                                }
                            </div>
                        </Card.Section>
                    </Card>
                )


            }
        }
            return arr;
                }


        else
        {
            return true
        }
    }
    searchbasedvariation(searchvalue)
    {
        if(searchvalue!='') {
            for (let i = 0; i < this.state.integrations.length; i++) {
                if (this.state.integrations[i].importer.toUpperCase().indexOf(searchvalue.toUpperCase()) > -1 || this.state.integrations[i].uploader.toUpperCase().indexOf(searchvalue.toUpperCase()) > -1) {
                    this.state.integrations[i].visible = true;
                }
                else
                {
                    this.state.integrations[i].visible = false;
                }

            }
            this.setState({
                integrations: this.state.integrations
            })

        }
        if(searchvalue=='')
        {
            for (let i = 0; i < this.state.integrations.length; i++) {
                this.state.integrations[i].visible = true;
            }


            this.setState({
                integrations: this.state.integrations
            })
        }

     this.resourcevisible()
    }
    resourcevisible()
    {

        visible=[];
        for(let i=0;i<this.state.integrations.length;i++)
        {
            if(this.state.integrations[i].visible==true)
            {
                visible.push(i);

            }
            else
            {
                visible.splice(i,1);
            }

        }
    }

    filtercontrol(e)
    {
           this.searchbasedvariation(e);
        this.setState({
            searchValue:e
        })



    }
    componentWillUpdate()
    {

    }
    render() {

        const resourceName = {
            singular:'',
            plural: '',
        };
        return (

            <Page title="Integrations">
                <Card>
                    <ResourceList
                        resourceName={resourceName}
                        items={visible}
                        renderItem={item => {}}
                        filterControl={
                            <ResourceList.FilterControl
                                searchValue={this.state.searchValue}
                                onSearchChange={this.filtercontrol.bind(this)}
                            />
                        }

                    />
                </Card>
                {
                    this.renderimporteruploader()
                }
            </Page>
        );


    }
}

export default IntegrationPage;