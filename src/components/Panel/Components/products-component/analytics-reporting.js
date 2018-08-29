import React, {Component} from 'react';
import {Page,Card,Select} from "@shopify/polaris";
import {Bar, Doughnut, Line, Pie, Polar, Radar} from 'react-chartjs-2';
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";

const options = [
    {label: 'Line Chart', value: 'line'},
    {label: 'Bar Chart', value: 'bar'},
    {label: 'Pie Chart', value: 'pie'},
];



class Analyticsreporting extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            selectedimporter: "line",
            selecteduploader: "line",
            importer:[],
            uploader:[]
        };

        this.preparedata();

    }
    componentDidUpdate()
    {

    }
    getalluploader()
    {
        let uploaderarray=[];
        let uploader={};
        requests.getRequest('connector/get/services?filters[type]=uploader').then(data1 => {
            if (data1.success == true) {
                uploader = data1.data;

                Object.keys(uploader).map(uploaderkey => {

                        uploaderarray.push(uploader[uploaderkey]['title'])
                    }
                )
                this.setState({uploader:uploaderarray})
            }
            else {
                notify.error(data1.message);
            }

        })
    }

    getallimporter()
    {
        let importerarray=[];
        let importer={};
        requests.getRequest('connector/get/services?filters[type]=importer').then(data=> {
            if (data.success == true) {
                importer = data.data;
                Object.keys(importer).map(importerkey => {
                    importerarray.push(importer[importerkey]['title']);
                });
                this.setState({importer:importerarray})

            }
            else {
                notify.error(data.message);

            }


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




    importerreports()
    {
        const line = {
            labels: this.state.importer,
            datasets: [
                {
                    label: '',
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
                    data: [10, 50, 80, 81, 56, 55, 40]
                },
            ]
        };
        const pie = {
            labels:  this.state.importer,
            datasets: [{
                data: [300, 50],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        };

        const bar = {
            labels:  this.state.importer,
            datasets: [
                {
                    label: '',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };

        switch (this.state.selectedimporter)
        {
            case 'line':
                return <Line height={200} data={line}
                             options=
                                 {{
                                 maintainAspectRatio: false
                                 }}
                />
                break;
            case 'bar':
                return   <Bar height={200} data={bar}
                              options={{
                                  maintainAspectRatio: false
                              }}
                />
                break;
            case 'pie':
                return <Pie height={100} data={pie}/>
                break;
        }
    }
    uploaderreports()
    {
        const line = {
            labels: this.state.uploader,
            datasets: [
                {
                    label: '',
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
                    data: [20,50, 10, 81, 56, 55, 40]
                },
            ]
        };
        const pie = {
            labels: this.state.uploader,
            datasets: [{
                data: [300, 50],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        };

        const bar = {
            labels: this.state.uploader,
            datasets: [
                {
                    label: 'Uploaders',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };
        switch (this.state.selecteduploader)
        {
            case 'line':
                return <Line height={200} data={line}
                             options=
                                 {{
                                     maintainAspectRatio: false
                                 }}
                />
                break;
            case 'bar':
                return   <Bar height={200} data={bar}
                              options={{
                                  maintainAspectRatio: false
                              }}
                />
                break;
            case 'pie':
                return <Pie height={100} data={pie}/>
                break;
        }
    }

    render() {

        return (
            <Page
                primaryAction={{content: 'Back', onClick: () => {
                        this.redirect('/panel/products');
                    }}}
                title="Analysis & Reports">
                <Card title="Products Imported">
                    <div className="p-4">
                        <div className="row">
                            <div className="col-md-8"></div>
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
                <Card title="Products Uploaded">
                    <div className="p-4">
                        <div className="row">
                            <div className="col-md-8"></div>
                            <div className="col-12 col-md-4">
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
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default Analyticsreporting;