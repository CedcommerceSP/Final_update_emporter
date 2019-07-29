/**
 * Created by cedcoss on 14/7/19.
 */
import React, {Component} from 'react';
import {
    Page,
    Card,
    Pagination,
    Select,
    PageActions,
    Thumbnail,
    Badge,
    Modal,
    Button,
    Subheading,
    Popover,
    ActionList,
    FormLayout,
    Layout,
    Stack,
    Heading,
    DisplayText,
    DataTable, Toast
} from "@shopify/polaris";
// import './order.css';
import {isUndefined} from 'util';
// import SmartDataTable from "../../../../shared/smart-table";
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";
import Skeleton from "../../../../shared/skeleton";
import {globalState} from "../../../../services/globalstate";

export class Orders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order_timeline_skeleton: false,
            customer: {
                customer_name: '',
                customer_country: '',
                customer_email_id: '',
            },
            account: {
                magento_id: '',
                created_at: ''
            },
            customer_address: {
                number_address: 0,
                customer_id: '',
                address_region: '',
                country_id: '',
                address_street: '',
                city: '',
                postcode: '',
                telephone: ''
            },
            item: [],
        };
        this.getCustomer();
    }

    productListing() {
        console.log("data is :", this.state.item)
        var newArray = [];
        for (let i = 0; i < this.state.item.length; i++) {
            this.state.line_items.product_title = this.state.item[i][0];
            this.state.line_items.product_price = this.state.item[i][1];
            this.state.line_items.product_quantity = this.state.item[i][2];
            this.state.line_items.product_sku = this.state.item[i][3];
            newArray.push(<FormLayout>
                    <Stack vertical={true}>
                        <Stack distribution="fill">
                            <div>
                                <p>{ this.state.line_items.product_title}</p>
                                <p><b>SKU : </b>{this.state.line_items.product_sku}</p>
                            </div>
                            <div>
                                <p><b>Price :</b>{this.state.line_items.product_price}</p>
                                <p><b>Quantity :</b> {this.state.line_items.product_quantity}</p>
                            </div>
                        </Stack>
                    </Stack>
                </FormLayout>
            )
            return newArray;
        }
    }

    getCustomer() {
        var array_address = [];
        requests.getRequest('connector/customer/getCustomer?id=159144').then(data => {
            if (data.success) {
                this.state.order_timeline_skeleton = true;
                console.log(data);
                this.state.customer.customer_name = data.data.details.first_name + " " + data.data.details.last_name;
                this.state.customer.customer_country = data.data.details.country;
                this.state.customer.customer_email_id = data.data.details.email;
                this.state.account.magento_id = data.data.details.source_id;
                this.state.account.created_at = data.data.details.created_at;
                if (Object.keys(data.data.addresses).length > 0) {
                    this.state.customer_address.number_address = Object.keys(data.data.addresses).length;
                    for (let i = 0; i < Object.keys(data.data.addresses).length; i++) {
                        for (let j = 0; j < Object.keys(data.data.addresses[i].street).length; j++) {

                            this.state.customer_address.address_street += data.data.addresses[i].street[j]
                            console.log("hahahaha"+this.state.customer_address.address_street)
                        }
                        array_address.push([
                            this.state.customer_address.address_region = data.data.addresses[i].region.region,
                            this.state.customer_address.country_id = data.data.addresses[i].country_id,
                            this.state.customer_address.city = data.data.addresses[i].city,
                            this.state.customer_address.postcode = data.data.addresses[i].postcode,
                            this.state.customer_address.telephone = data.data.addresses[i].telephone,
                            this.state.customer_address.address_street = this.state.customer_address.address_street,
                        ])
                        this.state.customer_address.address_street = '';
                    }
                    this.updateState();
                }
                this.state.item.push(array_address);

            } else {
                // this.showToast(data.message,false,600);

            }
        });
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    to_final_render_Doughnut() {
        console.log("item ------>",this.state.item);
        var arr = [];
        for (let i = 0; i < this.state.item[0].length; i++) {
            arr.push(<div className="col-sm-12 col-md-12 col-lg-4 mt-5">
                    <Card sectioned
                        title="Address"
                          actions={[{
                              content: <img style={{height: '35px', width: '35px'}}
                                            src={require("../../../../assets/img/home_address.png")}/>
                          }]}>
                        <hr/>
                        <p><b>Street : </b>{this.state.item[0][i][5]}</p>
                        <hr/>
                        <p><b>City : </b>{this.state.item[0][i][2]}</p>
                        <hr/>
                        <p><b>Region : </b>{this.state.item[0][i][0]}</p>
                        <hr/>
                        <p><b>Country Code : </b>{this.state.item[0][i][1]}</p>
                        <hr/>
                        <p><b>Postal Code : </b>{this.state.item[0][i][3]}</p>
                        <hr/>
                        <p><b>telephone : </b>{this.state.item[0][i][4]}</p>
                    </Card>
                </div>
            );
            continue;
        }

        return (arr)
    }

    render() {
        return (
            <Page fullWidth={true}
                  title={this.state.customer.customer_name}
            >
                <FormLayout>
                    <Layout>
                        <Layout.Section>
                            {this.state.order_timeline_skeleton ?
                                <Card title={'Customer details'} actions={[{
                                    content: <img style={{height: '35px', width: '35px'}}
                                                  src={require("../../../../assets/img/user.png")}/>
                                }]}>
                                    <Card.Section>
                                        <FormLayout>
                                            <Stack distribution={"equalSpacing"}>
                                                <p element={"p"}>{this.state.customer.customer_name}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <p element={"p"}>{this.state.customer.customer_country}</p>

                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <p style={{
                                                    color: 'blue',
                                                }} element={"p"}>{this.state.customer.customer_email_id}</p>

                                            </Stack>
                                            {/*<Stack distribution={"equalSpacing"}>
                                             <Heading element={"p"}>Purchased from</Heading>

                                             </Stack>
                                             <Stack distribution={"equalSpacing"}>
                                             <Heading element={"p"}>Line items ordered</Heading>
                                             <p style={{fontSize: '1.5rem'}}>{this.state.order.number_of_line_item}</p>
                                             </Stack>*/}
                                        </FormLayout>
                                    </Card.Section>
                                </Card> : <Skeleton case="body"/>}

                        </Layout.Section>

                        <Layout.Section secondary>
                            <FormLayout>
                                {this.state.order_timeline_skeleton ?
                                    <Card title={'Account details'} actions={[{
                                        content: <img style={{height: '35px', width: '35px'}}
                                                      src={require("../../../../assets/img/account.png")}/>
                                    }]}>
                                        <Card.Section title={'Account Information'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                            }}><b>Magento ID : </b>{this.state.account.magento_id}</p>
                                            <p style={{
                                                fontSize: '1.5rem',
                                            }}><b>Created at : </b>{this.state.account.created_at}</p>
                                        </Card.Section>
                                        {/*<Card.Section title={'Region information'}>
                                         <p style={{
                                         fontSize: '1.5rem',
                                         color: 'blue'
                                         }}>{this.state.client_details.contact_email}
                                         <hr/>
                                         {this.state.client_details.contact_number}</p>
                                         </Card.Section>*/}
                                    </Card> : <Skeleton case="body"/>}
                                {/*{this.state.order_timeline_skeleton ?
                                 <Card title={'Pricing details'} actions={[{
                                 content: <img style={{height: '35px', width: '35px'}}
                                 src={require("../../../../assets/img/notes .png")}/>
                                 }]}>
                                 <Card.Section>
                                 <FormLayout>
                                 <Stack distribution={"equalSpacing"}>
                                 <Heading element={"p"}>Price</Heading>
                                 <p style={{fontSize: '1.3rem'}}>{this.state.order_price.subtotal}</p>
                                 </Stack>
                                 <Stack distribution={"equalSpacing"}>
                                 <Heading element={"p"}>Shipping Amount</Heading>
                                 <p style={{fontSize: '1.3rem'}}>{parseFloat(this.state.order_price.shipping_amount).toFixed(2)}</p>
                                 </Stack>
                                 <Stack distribution={"equalSpacing"}>
                                 <Heading element={"p"}>Inclusive tax</Heading>
                                 <p style={{fontSize: '1.3rem'}}>{parseFloat(this.state.order_price.tax).toFixed(2)}</p>
                                 </Stack>
                                 <Stack distribution={"equalSpacing"}>
                                 <Heading element={"p"}>Payment Method</Heading>
                                 <p style={{fontSize: '1.3rem'}}>{this.state.order_price.payment_method}</p>
                                 </Stack>
                                 </FormLayout>
                                 </Card.Section>
                                 <Card.Section>
                                 <Stack distribution={"equalSpacing"}>
                                 <Heading element={"p"}>Total price</Heading>
                                 <p style={{fontSize: '1.3rem'}}>{this.state.order_price.total_price}</p>
                                 </Stack>
                                 </Card.Section>
                                 </Card> : <Skeleton case="body"/>}*/}
                            </FormLayout>
                        </Layout.Section>
                    </Layout>
                </FormLayout>
                <Layout.Section>
                    <Layout sectioned={false}>
                        {this.state.item[0] !== undefined && this.to_final_render_Doughnut()}
                    </Layout>
                </Layout.Section>
            </Page>
        );
    }

    pageSettingsChange(event) {
        this.gridSettings.count = event;
        this.gridSettings.activePage = 1;
        this.getCustomer();
    }

    redirect(url) {
        if (!isUndefined(this.props.location.state) && Object.keys(this.props.location.state).length > 0) {
            this.props.history.push(url, JSON.parse(JSON.stringify(this.props.location.state)))
        } else {
            this.props.history.push(url);
        }
    }
}

