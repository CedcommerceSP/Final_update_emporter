import React, {Component} from 'react';
import {Page, Card, Select, Modal} from "@shopify/polaris";
import {Bar, Line, Pie} from 'react-chartjs-2';
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";
import './analytics.css';
import {faArrowAltCircleDown,faArrowAltCircleUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { validateImporter } from '../static-functions.js';
import {globalState} from "../../../../services/globalstate";
import {capitalizeWord} from "../static-functions";
const options = [
    // {label: 'Line Chart', value: 'line'},
    {label: 'Bar Chart', value: 'bar'},
    {label: 'Pie Chart', value: 'pie'},
];

class AnalyticsReporting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedimporter: "bar",
            selecteduploader: "bar",
            selecteduploadermarketplace:'',
            importer:[],
            uploader:[''],
            uploadermarketplace:[],
            yaxisuploader:[],
            uploaderstatus:{
              uploaded:0,
            },
            payment_show:false,
            payment: {
                message:'',
                title:'',
                body:''
            },
            yaxisimporter:[],
            uploaded_product: false,
            imported_product: false,
            activePlan: globalState.getLocalStorage('activePlan')?JSON.parse(globalState.getLocalStorage('activePlan')):[],
        };
        this.getallimporter();
    }

    componentDidUpdate() {
        if ( localStorage.getItem('plan_status') ) {
            let data = JSON.parse(localStorage.getItem('plan_status'));
            if ( data.shop === globalState.getLocalStorage('shop') ) {
                if ( data.success ) {
                    let temp = {
                        title:'Status',
                        temp:data,
                        message:data.message,
                        body:<div className="text-center mt-5">
                            <h4>Congrats!</h4>
                        </div>
                    };
                    this.setState({
                        payment_show:true,
                        payment:temp,
                    });
                }
                localStorage.removeItem('plan_status');
            }
        }
    }

    getallimporter(){
        let importertitlearray=[];
        let importer={};
        let importer_marketplacearray=[];
        requests.getRequest('connector/get/services?filters[type]=importer').then(data=> {
            if (data.success) {
                importer = data.data;
                Object.keys(importer).map(importerkey => {
                    if(validateImporter(importerkey)) {
                        importertitlearray.push(importer[importerkey]['title']);
                        importer_marketplacearray.push(importer[importerkey]['marketplace']);
                    }
                });
                this.get_y_axis_importer(importer_marketplacearray,importertitlearray,importer);
                this.get_y_axis_uploader(importer_marketplacearray,importertitlearray,importer);
                this.setState({importer:importertitlearray})

            }
            else {
                notify.error(data.message);
            }
        })
    }

    get_y_axis_importer(importer_marketplace_array,importer_title_array,entiredata_importer){
        let total_products_importer=[];
        let importer_data_recieved={};
        requests.postRequest('frontend/app/getImportedProductCount',{importers:importer_marketplace_array}).then(data=> {
            if (data.success) {
                importer_data_recieved = data.data;
                Object.keys(importer_data_recieved).map(importer_recieved_mp=>{
                for (let i = 0; i < importer_marketplace_array.length; i++) {
                    Object.keys(entiredata_importer).map(master_key => {
                        if (importer_marketplace_array[i] == entiredata_importer[master_key]['marketplace']
                            && importer_title_array[i] == entiredata_importer[master_key]['title'] && importer_marketplace_array[i] ==importer_recieved_mp) {
                            total_products_importer.push(importer_data_recieved[importer_recieved_mp]);
                        }
                    })
                }
            });
                total_products_importer.push(0);
                this.setState({
                    yaxisimporter:total_products_importer
                });
            }
            else {
                notify.error(data.message);

            }
        })
    }

    get_y_axis_uploader(uploader_marketplce, title, data) {
        let uploaderarray = [];
        let uploader = [];
        let show = false;
        requests.postRequest('frontend/app/getUploadedProductsCount', {marketplace: title}).then(data1 => {
            if (data1.success) {
                Object.keys(data1.data).forEach(e => {
                    if ( data1.data[e] !== undefined ) {
                        if ( data1.data[e]['_id'] === null ) {
                            uploader.push('Shopify Matched Product');
                            uploaderarray.push(data1.data[e]['count']);
                            show = true;
                        } else {
                            uploader.push(capitalizeWord(data1.data[e]['_id']));
                            uploaderarray.push(data1.data[e]['count']);
                            show = true;
                        }
                    }
                });
                uploaderarray.push(0);
                this.setState({yaxisuploader:uploaderarray, uploaded_product: show,uploader:uploader})
            }
        })
    }

    handleChangeimporter = (newValue) => {
        this.setState({selectedimporter: newValue});
    };

    handleChangeuploader = (newValue) => {
        this.setState({selecteduploader: newValue});
    };

    render() {
        return (
            <Page
                title="Product Analytics" titleHidden={true}>
                {/*<Card title="Products Imported">*/}
                <Modal title={this.state.payment.title} open={this.state.payment_show} onClose={() => {
                    this.setState({payment_show:false});}}
                       secondaryActions={{content:'OK', onClick:() => {
                               this.setState({payment_show:false});
                           }}}>
                    <Modal.Section>
                        <div className="text-center">
                            <h3>{this.state.payment.message}</h3>
                            {this.state.payment.body}
                        </div>
                    </Modal.Section>
                </Modal>
                <div className="CARD w-100" style={{marginTop:75}}>
                    <div className='CARD-title-small text-center BG-primary common'>
                            <FontAwesomeIcon icon={faArrowAltCircleDown} size="5x"/>
                    </div>
                    <div className="col-12 mt-5" >
                        <h3 className="font-weight-bold" style={{paddingTop:20}}>Products Imported</h3>
                    </div>
                    <div className="CARD-body">
                        <div className="col-12 p-0">
                            <Card>
                    <div className="p-4">
                        <div className="row">
                            <div className="col-md-8"/>
                            <div className="col-12 col-md-4">
                                <Select
                                    label=""
                                    options={options}
                                    onChange={this.handleChangeimporter}
                                    value={this.state.selectedimporter}
                                />
                            </div>
                        </div>
                        <div>{
                            this.importerreports()
                        }
                        </div>
                    </div>
                        </Card>
                        </div>
                    </div>
                </div>
                {/*</Card>*/}
                {this.state.uploaded_product && <div className="CARD w-100" style={{marginTop:75}}>
                    <div className={`CARD-title-small text-center BG-primary common`}>
                            <FontAwesomeIcon icon={faArrowAltCircleUp} size="5x"/>
                            {/*// <h1 className="mt-2 font-weight-bold pt-2" style={{fontSize:20}}>Uploader</h1>*/}
                    </div>
                    <div className="col-12 mt-5" >
                        <h3 className="font-weight-bold" style={{paddingTop:20}}>Products Upload Status</h3>
                    </div>
                    <div className="CARD-body">
                        <div className="col-12 p-0">
                            <Card>
                                <div className="p-4">
                                    <div className="row">
                                        <div className="col-md-4 pt-1 pb-1"></div>
                                        <div className="col-12 col-md-4 pt-1 pb-1">
                                            <Select
                                                label=""
                                                options={options}
                                                onChange={this.handleChangeuploader}
                                                value={this.state.selecteduploader}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            {
                                                this.uploaderreports()
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>}
            </Page>
        );
    }

    importerreports() {
        const line = {
            labels: this.state.importer,
            datasets: [
                {
                    label: 'Importers',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.yaxisimporter
                },
            ]
        };
        const pie = {
            labels:  this.state.importer,
            datasets: [{
                data: this.state.yaxisimporter,
                backgroundColor: [
                    '#5d8deb',
                    '#36A2EB',
                    '#7bf5ff',
                    '#776fcc',
                    '#494eff',
                    '#3742ff',
                    '#000066',
                    '#27997c',
                    '#9900cc',
                    '#a3c2c2'
                ],
                hoverBackgroundColor: [
                    '#5d8deb',
                    '#36A2EB',
                    '#7bf5ff',
                    '#776fcc',
                    '#494eff',
                    '#3742ff',
                    '#000066',
                    '#27997c',
                    '#9900cc',
                    '#a3c2c2'
                ]
            }]
        };
        const bar = {
            labels:  this.state.importer,
            datasets: [
                {
                    label:'Importers',
                    backgroundColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    borderColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'
                    ],
                    hoverBorderColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'
                    ],
                    data:this.state.yaxisimporter
                }
            ]
        };

        switch (this.state.selectedimporter)
        {
            case 'line':
                return <Line height={300} data={line}
                             options=
                                 {{
                                     maintainAspectRatio: false
                                 }}
                />
            case 'bar':
                return   <Bar height={300} data={bar}
                              options={{
                                  maintainAspectRatio: false
                              }}
                />
            case 'pie':
                return <Pie height={150} data={pie}/>
        }
    }

    uploaderreports() {
        const line = {
            labels: this.state.uploader,
            datasets: [
                {
                    label: 'Status',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.yaxisuploader
                },
            ]
        };
        const pie = {
            labels: this.state.uploader,
            datasets: [{
                data: this.state.yaxisuploader,
                backgroundColor: [
                    '#5d8deb',
                    '#36A2EB',
                    '#7bf5ff',
                    '#776fcc',
                    '#494eff',
                    '#3742ff',
                    '#000066',
                    '#27997c',
                    '#9900cc',
                    '#a3c2c2'
                ],
                hoverBackgroundColor: [
                    '#5d8deb',
                    '#36A2EB',
                    '#7bf5ff',
                    '#776fcc',
                    '#494eff',
                    '#3742ff',
                    '#000066',
                    '#27997c',
                    '#9900cc',
                    '#a3c2c2'
                ]
            }]
        };

        const bar = {
            labels: this.state.uploader,
            datasets: [
                {
                    label:'Status',
                    backgroundColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    borderColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    hoverBorderColor: [
                        '#5d8deb',
                        '#36A2EB',
                        '#7bf5ff',
                        '#776fcc',
                        '#494eff',
                        '#3742ff',
                        '#000066',
                        '#27997c',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    data: this.state.yaxisuploader
                }
            ]
        };
        switch (this.state.selecteduploader)
        {
            case 'line':
                return <Line height={300} data={line}
                             options=
                                 {{
                                     maintainAspectRatio: false
                                 }}
                />
            case 'bar':
                return   <Bar height={300} data={bar}
                              options={{
                                  maintainAspectRatio: false
                              }}
                />
            case 'pie':
                return <Pie height={150} data={pie}/>
        }
    }

    redirect(url) {
        this.props.history.push(url);
    }
}

export default AnalyticsReporting;