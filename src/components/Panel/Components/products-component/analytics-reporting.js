import React, {Component} from 'react';
import {Page, Card, Select, Modal} from "@shopify/polaris";
import {Bar, Line, Pie} from 'react-chartjs-2';
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";
import './analytics.css';
import {faArrowAltCircleDown,faArrowAltCircleUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {globalState} from "../../../../services/globalstate";
const options = [
    // {label: 'Line Chart', value: 'line'},
    {label: 'Bar Chart', value: 'bar'},
    {label: 'Pie Chart', value: 'pie'},
];

let uploaderoptions=[];

class AnalyticsReporting extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            selectedimporter: "pie",
            selecteduploader: "pie",
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
            activePlan: globalState.getLocalStorage('activePlan')?JSON.parse(globalState.getLocalStorage('activePlan')):[],
        };

        this.preparedata();
        setTimeout(() => {
            if ( globalState.getLocalStorage('activePlan') && this.state.activePlan.length <= 0) {
                this.setState({activePlan:JSON.parse(globalState.getLocalStorage('activePlan'))});
                this.preparedata();
            }
        },2000);
    }
    componentDidUpdate()
    {
        if ( localStorage.getItem('plan_status') ) {
            let data = JSON.parse(localStorage.getItem('plan_status'));
            if ( data.shop === globalState.getLocalStorage('shop') ) {
                if ( !data.success ) {
                    // let temp = {
                    //     title:'Payment Status',
                    //     temp:data,
                    //     message:data.message,
                    //     body:<div className="text-left mt-5">
                    //         <h4>You Can uninstall:-</h4>
                    //         <ul>
                    //             <li><h5>Go to Apps Section from your shopify dashboard</h5></li>
                    //             <li><h5>You can Un-install the App by clicking the Bin Icon right to App</h5></li>
                    //         </ul>
                    //     </div>
                    // };
                    // this.setState({
                    //     payment_show:true,
                    //     payment:temp,
                    // });
                } else  {
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
    getallimporter()
    {
        let importertitlearray=[];
        let importer={};
        let importer_marketplacearray=[];
        requests.getRequest('connector/get/services?filters[type]=importer').then(data=> {
            if (data.success == true) {
                importer = data.data;
                Object.keys(importer).map(importerkey => {
                    if(this.state.activePlan.indexOf(importerkey) !== -1) {
                        importertitlearray.push(importer[importerkey]['title']);
                        importer_marketplacearray.push(importer[importerkey]['marketplace']);
                    }
                });
                this.get_y_axis_importer(importer_marketplacearray,importertitlearray,importer);
                this.setState({importer:importertitlearray})

            }
            else {
                notify.error(data.message);
            }
        })
    }
    get_y_axis_importer(importer_marketplace_array,importer_title_array,entiredata_importer)
    {
        let total_products_importer=[];
        let importer_data_recieved={};
        requests.postRequest('frontend/app/getImportedProductCount',{importers:importer_marketplace_array}).then(data=> {
            if (data.success == true) {
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

    getalluploader()
    {
        let uploaderarray=[];
        let uploader={};
        let uploaderoptionsTemp = [];
        requests.getRequest('connector/get/services?filters[type]=uploader').then(data1 => {
            if (data1.success) {
                uploader = data1.data;
                let temp = [];
                this.state.activePlan.forEach(e => {
                    if (e === 'amazon_importer') {
                        temp.push('Amazon');
                    }
                    if ( e === 'ebay_importer' ) {
                        temp.push('Ebay');
                    }
                })
                if ( temp.length > 0 ) {
                    Object.keys(uploader).map(uploaderkey => {
                        uploaderarray.push(uploader[uploaderkey]['marketplace']);
                        uploaderoptionsTemp.push({label:uploader[uploaderkey]['title'],value:uploader[uploaderkey]['marketplace']})
                    });
                    uploaderoptions = uploaderoptionsTemp.slice(0);
                    this.setState({
                        selecteduploadermarketplace:uploaderarray[0],
                        uploader: temp
                    });
                    this.get_y_axis_uploader(uploaderarray[0]);
                }
            }
            else {
                notify.error(data1.message);
            }
        })
    }

    get_y_axis_uploader(uploader_marketplce) {
        let uploaderarray = [];
        let uploader = [];
        let amazon=0;
        let ebay=0;

        requests.getRequest('frontend/app/getUploadedProductsCount', {marketplace: uploader_marketplce}).then(data1 => {
            if (data1.success) {
                uploader = data1.data;
                amazon=data1.data.amazon;
                ebay=data1.data.ebay;
            // for(let j=0;j<uploader.length;j++){
            //    let status=uploader[j].status
            //        if(status=='approved'){
            //            approved+=1;
            //        }
            //        else if(status=='uploaded'){
            //            uploaded+=1;
            //        }
            //        else if(status=='pending')
            //        {
            //            pending+=1;
            //        }
            //     }
            }
            else {
                notify.error(data1.message);
            }
            uploaderarray=[];
            uploaderarray.push(amazon);
            uploaderarray.push(ebay);
            uploaderarray.push(0);
            this.setState({yaxisuploader:uploaderarray})
        })
    }
    preparedata(){
        this.getallimporter();
        this.getalluploader();
    }

    handleChangeimporter = (newValue) => {
        this.setState({selectedimporter: newValue});
    };
    handleChangeuploader = (newValue) => {
        this.setState({selecteduploader: newValue});
    };

    handleChangeuploadermarketplace = (newValue) => {
        this.get_y_axis_uploader(newValue);
        this.setState({selecteduploadermarketplace: newValue});

    };
    importerreports()
    {
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
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#00cc66',
                    '#ff0000',
                    '#ff99ff',
                    '#000066',
                    '#990033',
                    '#9900cc',
                    '#a3c2c2'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#00cc66',
                    '#ff0000',
                    '#ff99ff',
                    '#000066',
                    '#990033',
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
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    borderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
                        '#9900cc',
                        '#a3c2c2'
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
                        '#9900cc',
                        '#a3c2c2'
                    ],
                    hoverBorderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
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
    uploaderreports()
    {
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
                    '#a2ff38',
                    '#2b6beb',
                    '#FFCE56',
                    '#2650cc',
                    '#ff0000',
                    '#fe0eff',
                    '#000066',
                    '#990033',
                    '#9900cc',
                    '#a3c2c2'

                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#00cc66',
                    '#ff0000',
                    '#ff99ff',
                    '#000066',
                    '#990033',
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
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    borderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
                        '#9900cc',
                        '#a3c2c2'

                    ],
                    hoverBorderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#00cc66',
                        '#ff0000',
                        '#ff99ff',
                        '#000066',
                        '#990033',
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
                <div className="CARD w-100" style={{marginTop:75}}>
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
                                        {/*<div className="col-12 col-md-4 pt-1 pb-1">*/}
                                            {/*<Select*/}
                                                {/*label=""*/}
                                                {/*options={uploaderoptions}*/}
                                                {/*onChange={this.handleChangeuploadermarketplace}*/}
                                                {/*value={this.state.selecteduploadermarketplace}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
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
                </div>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default AnalyticsReporting;