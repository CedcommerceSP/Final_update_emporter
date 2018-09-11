import React, {Component} from 'react';
import {Page, Card, DataTable, Label} from "@shopify/polaris";
import * as queryString from "query-string";

class ViewProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryParams: queryString.parse(props.location.search),
            data: [
                {name:'Name',value:'Testing'},
                {name:'Source',value:'Shopify'},
                {name:'Target',value:'Google'},
                {name:'Category',value:'Arts & Entertainment/Hobbies & Creative Arts'},
                {name:'Query',value:'(Price > 1)'},
            ]
        }
    }
    componentWillMount() {
        console.log(this.state.queryParams);
    }
    render() {
        const rows = [
            ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
            ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
            [
                'Navy Merino Wool Blazer with khaki chinos and yellow belt',
                '$445.00',
                124518,
                32,
                '$14,240.00',
            ],
        ];
        return (
            <Page title="View" primaryAction={{content:'Back', onClick:() => {this.redirect('/panel/profiling')}}}>
                <Card>
                    <div className="p-5">
                        <Card title="Products Details">
                            <div className="row p-5">
                                {this.state.data.map((data, index) => {
                                    return (
                                        <div className="col-12 mb-4" key={index}>
                                            <Label id={data.name}><span style={{fontWeight:'bold'}}>{data.name}</span>: {data.value} </Label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <DataTable
                                        columnContentTypes={[
                                            'text',
                                            'numeric',
                                            'numeric',
                                            'numeric',
                                            'numeric',
                                        ]}
                                        headings={[
                                            'Product',
                                            'Price',
                                            'SKU Number',
                                            'Net quantity',
                                            'Net sales',
                                        ]}
                                        rows={rows}
                                        totals={['', '', '', 255, '$155,830.00']}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </Card>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default ViewProfile;