import React, {Component} from 'react';
import {Page, Label, Card,TextContainer, Collapsible, Button, Stack} from "@shopify/polaris";
import { isUndefined } from 'util';
import './analytics.css';
import ReadMoreReact from 'read-more-react';
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";

class ViewProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:props.match.params.id,
            open: false,
            img:'',
            products_top: {
                title:'',
                description:'',
            },
            products_middle:{
                sku:'',
                price:'',
                quantity:'',
                weight:'',
                weight_unit: '',
            },
            products_middle_additional:{
            },
            products_bottom: {
            }
        };
    }
    componentWillMount() {
        requests.postRequest('google/app/getUploadedProductById',{'variant_id': this.state.id})
            .then(data => {
                if ( data.success ) {
                    let temp = this.state;
                    temp.img = data.data.variants.main_image;
                    temp.products_top = {
                        title:data.data.details.title,
                        description:data.data.details.short_description
                    };
                    temp.products_middle = {
                        sku:data.data.variants.sku,
                        price:data.data.variants.price,
                        quantity:data.data.variants.quantity,
                        weight:data.data.variants.weight,
                        weight_unit: data.data.variants.weight_unit,
                    };
                    data.data.variant_attributes.forEach(e => {
                        temp.products_middle_additional[e.toLowerCase()] = data.data.variants[e.toLowerCase()];
                    });
                    Object.keys(data.data.variants).forEach(keys => {
                        if ( isUndefined(temp.products_middle[keys]) && isUndefined(temp.products_middle_additional[keys.toLowerCase()])) {
                            temp.products_bottom[keys] =!isUndefined(data.data.variants[keys]) && data.data.variants[keys] !== null ?data.data.variants[keys].toString():'';
                        }
                    });
                    this.setState(temp);
                } else {
                    notify.error(data.message);
                }
            })
    }
    render() {
        return (
            <Page title="View Products" primaryAction={{content:'Back', onClick:() => {
                    this.redirect('/panel/products');
                }}}>
                <Card>
                    <div className="p-5 row">
                        <div className="col-12 col-sm-4 mb-5" >
                            <Card>
                                <div className="p-3" style={{height:'200px'}}>
                                    <img src={this.state.img} alt="Product Image" className="img-show"/>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 col-sm-8 mb-5">
                            <Card>
                                <div className="p-5" style={{height:'200px',overflow:'auto'}}>
                                    <div className="mb-5">
                                        <h4><b>Title</b></h4>
                                        <h5>{this.state.products_top.title}</h5>
                                    </div>
                                    <div>
                                        <h4><b>Description</b></h4>
                                        <h5 dangerouslySetInnerHTML={{__html:this.state.products_top.description}}>
                                        </h5>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 mb-5">
                            <Card>
                                <div className="p-5 row">
                                    <div className="mb-5 col-sm-6 col-12">
                                        <h4><b>SKU</b></h4>
                                        <h5>{this.state.products_middle.sku}</h5>
                                    </div>
                                    <div className="mb-5 col-sm-6 col-12">
                                        <h4><b>Title</b></h4>
                                        <h5>{this.state.products_middle.price}</h5>
                                    </div>
                                    <div className="mb-5 col-sm-6 col-12">
                                        <h4><b>Quantity</b></h4>
                                        <h5>{this.state.products_middle.quantity}</h5>
                                    </div>
                                    <div className="mb-5 col-sm-6 col-12">
                                        <h4><b>Weight</b></h4>
                                        <h5>{this.state.products_middle.weight}&nbsp;/&nbsp;<i>{this.state.products_middle.weight_unit}</i></h5>
                                    </div>
                                    {Object.keys(this.state.products_middle_additional).map((key,index) => {
                                        return (
                                            <div className="mb-5 col-sm-6 col-12" key={index}>
                                                <h4><b>{key.toUpperCase()}</b></h4>
                                                <h5>{this.state.products_middle_additional[key]}</h5>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                        <div className="col-12">
                            <Card sectioned>
                                <Stack vertical>
                                    <Collapsible id="basic-collapsible" open={this.state.open}>
                                        <div className="row p-5">
                                            {Object.keys(this.state.products_bottom).map((key, index) => {
                                                return (
                                                    <div className="mb-5 col-sm-6 col-12" key={index}>
                                                        <h4><b>{key.toUpperCase()}</b></h4>
                                                        <ReadMoreReact
                                                            text={this.state.products_bottom[key]}
                                                              min={50}
                                                              ideal={100}
                                                              max={200} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Collapsible>
                                </Stack>
                                <div className="text-center">
                                    <button onClick={this.handleToggleClick} className="btn btn-outline-secondary btn-lg">
                                        {this.state.open?'Show Less':'Show More'}
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Card>
            </Page>
        );
    }
    handleToggleClick = () => {
        this.setState({open: !this.state.open});
    };
    redirect = url => {
        this.props.history.push(url);
    }
}

export default ViewProducts;