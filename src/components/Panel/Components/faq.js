import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Page, Stack, Button,Card,Collapsible, Banner, ResourceList, Modal, TextContainer} from '@shopify/polaris';
import {faArrowsAltH} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {globalState} from "../../../services/globalstate";

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
                    ques: 'How do I send my items from Amazon to Shopify and make sure they are in sync?',
                    ans:
                        <React.Fragment>
                            <p>With the Omni-Importer App you can send your Products from Amazon to Your Shopify Store. Process for sending items is very simple, please see the following points:-</p>
                            <ol>
                                <li className="mb-2">First, you need to import products from Amazon Marketplace to our Omni-Importer App.</li>
                                <li className="mb-2">Once products are imported in the Omni-Importer App, after that you can upload the products to your Shopify Store.
                                </li>
                            </ol>
                        </React.Fragment>
                },
                {
                    id:2,
                    show: false,
                    search: true,
                    ques: 'How can I update my product information?',
                    ans: <React.Fragment>
                        <p>If you want to update any product information you can update that information by reuploading the items on Shopify through Omni-Importer App.</p>
                    </React.Fragment>
                },
                {
                    id:3,
                    show: false,
                    search: true,
                    ques: 'What is the difference between custom and default profile?',
                    ans: <p>
                        Profiling convert your data into appropriate format and it is a way to upload the products from one marketplace (source marketplace)  in a specified format to another marketplace (destination marketplace). Where as Default profile  have some fixed format and is used in the same manner.
                    </p>
                },{
                    id:4,
                    show: false,
                    search: true,
                    ques: 'Does Omni Importer handle my product variations?',
                    ans: <p>
                        Yes ,Along with the main products, the app helps you fetch all the variations of the products.
                    </p>
                },
            ]
        };
        if ( !globalState.getLocalStorage('auth_token') ) {
            this.props.disableHeader(false);
        } else {
            this.props.disableHeader(true);
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
            // primaryAction={{content:'Report An Issue', onClick:() => {
            //         this.redirect('/panel/help/report');
            //     }}}
            //
            >
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