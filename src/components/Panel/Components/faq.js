import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Page, Stack, Button,Card,Collapsible, Banner, ResourceList, Modal, TextContainer} from '@shopify/polaris';
import {faArrowsAltH} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class FAQPage extends Component {
    constructor(props) {
        super(props);
        this.modalOpen = this.modalOpen.bind(this); // modal function
        this.state = {
            modal: false, // modal show/hide
            search: '',// search
            noSearchFound: [1],
            faq: [
                {
                    id:1,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: 'How To Upload My Products on Google Merchant Center?',
                    ans: <ol>
                        <li className="mb-2">Go To Upload Product <NavLink to="/panel/import"> Section </NavLink> </li>
                        <li className="mb-2">Import Your Product from source Store (Shopify)  </li>
                        <li className="mb-2">When Import Is completed you can upload your product by clicking on Upload Products </li>
                    </ol>
                },
                {
                    id:2,
                    show: false,
                    search: true,
                    ques: 'How To Register On Google Express?',
                    ans: <ol>
                        <li className="mb-2">Create Your Google Merchant <a href='https://support.google.com/merchants/answer/188924?hl=en' target="_blank">Account</a> (If you Don't Have any)</li>
                        <li className="mb-2"> Fill Out Google Action interest <a href='https://www.google.com/retail/shoppingactions/' target='_blank'>Form</a> and mention Agency Partner and Channel Partner <a href='https://cedcommerce.com/' target="_blank">CedCommerce</a>  </li>
                        <li className="mb-2">Sign Up to shop with <a href='https://support.google.com/express/answer/4559815?hl=en' target='_blank'>Google Express</a></li>
                    </ol>
                },
                {
                    id:3,
                    show: false,
                    search: true,
                    ques: 'What Is Profiling And what is default Profile?',
                    ans: <React.Fragment>
                        <p><b>Profiling</b> is a medium to upload products from one market place to Another market place in desire format.</p>
                        <p><b>Profiling</b> Convert Your product data into appropriate format in which the target Market place Accept It.</p>
                        <p>You Can Create Your own Custom Profile. <NavLink to="/panel/profiling/create">here</NavLink></p>
                        <p>In default Profile We Have Some Fixed Format. For Example Click <a href="javascript:void(0)" onClick={this.modalOpen}>Here</a></p>
                    </React.Fragment>
                },
            ]
        }
    }
    handleSearch() {
        try {
            let value = this.state.faq;
            let flag = 0;
            if ( this.state.search.length >= 2 ) {
                value.forEach(data => {
                    const text = data.ques.toLowerCase();
                    if ( text.search(this.state.search) === -1 ) {
                        data.search = false;
                    } else {
                        data.search = true;
                        flag = 1;
                    }
                });
            } else {
                value.forEach(data => {
                    data.search = true;
                    flag = 1;
                });
            }
            if (flag === 0) {
                this.setState({noSearchFound: []});
            } else {
                this.setState({noSearchFound: [1]});
            }
            this.setState({faq: value});
        } catch (e) {
        }
    }
    render() {
        return (
            <Page
                title="Help"
            primaryAction={{content:'Report An Issue', onClick:() => {
                    this.redirect('/panel/help/report');
                }}}>
                <div className="row">
                    <div className="col-12 mb-4">
                        <Card>
                            <ResourceList
                                items={this.state.noSearchFound}
                                renderItem={item => {}}
                                filterControl={
                                    <ResourceList.FilterControl
                                        searchValue={this.state.search}
                                        onSearchChange={(searchValue) => {
                                            this.setState({search : searchValue.toLowerCase()});
                                            this.handleSearch();
                                        }}
                                    />
                                }
                            />
                        </Card>
                    </div>
                    {this.state.faq.map(data => {
                        return (<React.Fragment key={data.id}>
                                {data.search?<div className="col-sm-6 col-12 mb-3">
                                <div style={{cursor:'pointer'}} onClick={this.handleToggleClick.bind(this, data)}>
                                    <Banner title="Query"  icon="view">
                                        <div className="pt-5">
                                            <Stack vertical>
                                                <div className=" mb-2">
                                                    <h3>{data.ques}</h3>
                                                </div>
                                            </Stack>
                                        </div>
                                    </Banner>
                                </div>
                                <Collapsible open={data.show} id={data.id}>
                                    <Banner title="Answer" status="info">
                                        <h4>{data.ans}</h4>
                                    </Banner>
                                </Collapsible>
                            </div>:null}
                        </React.Fragment>);
                    })}
                </div>
                <Modal
                    open={this.state.modal}
                    title="Default Profile Example"
                    onClose={this.modalOpen}
                >
                    <Modal.Section>
                        <TextContainer>
                            <h2>Google Attribute Mapping Are Something Like this: </h2>
                            <h4>
                                <ul>
                                    <li className="mb-3">'title' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'title</li>
                                    <li className="mb-3">'description' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'long_description'</li>
                                    <li className="mb-3">'price' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'price'</li>
                                    <li className="mb-3">'link' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> Your Product Link </li>
                                    <li className="mb-3">'brand' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'vendor'</li>
                                    <li className="mb-3">'image_link' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'main_image'</li>
                                    <li className="mb-3">'main_image' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'container_id'</li>
                                    <li className="mb-3">'gtin' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'bar_code'</li>
                                    <li className="mb-3">'mpn' <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/> 'sku'</li>
                                </ul>
                            </h4>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Page>
        );
    }
    handleToggleClick = (event) => {
        let data = this.state.faq;
        data.forEach(key => {
            if ( key.id === event.id ) {
                key.show = !key.show;
            }
        });
        this.setState({
            faq : data,
        });
    };
    modalOpen() {
        this.setState({
            modal: !this.state.modal
        });
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default FAQPage;