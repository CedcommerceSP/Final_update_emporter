import React, {Component} from "react";
import {
    Page,
    Stack,
    Button,
    Card,
    Collapsible,
    Banner,
    ResourceList,
    Modal,
    TextContainer
} from "@shopify/polaris";
import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {globalState} from "../../../services/globalstate";

class FAQPage extends Component {
    constructor(props) {
        super(props);
        this.modalOpen = this.modalOpen.bind(this); // modal function
        this.state = {
            modal: false, // modal show/hide
            search: "", // search
            noSearchFound: [1],
            faq: [
                {
                    id: 1,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How do I send my Items from Amazon to Shopify and make sure stock are in sync?",
                    ans: (
                        <React.Fragment>
                            <p>
                                With the Omni-Importer app, you can send your products from the Amazon seller center to
                                your Shopify store. The process of transferring the item is very simple. Please see the
                                following points-</p>
                            <ol>
                                <li>Go to Import/Upload section.</li>
                                <li>Click on Import Product. All the products will be listed on the app. You can see the
                                    products in the Product section.</li>
                                <li>Then you can select and upload or bulk upload, depending on the seller’s requirement.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 2,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to make products uploaded through Profiling?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To create a profile, follow the steps:
                            </p>
                            <ol>
                                <li>Go to PROFILING Section.</li>
                                <li>Click on CREATE PROFILE.</li>
                                <li>Enter a profile name and select the source.</li>
                                <li>Now, click - <b>save and move to the next step.</b></li>
                                <li>Select the Target Location and Category.</li>
                                <li>Select the attributes, enter the filter value and click CREATE PROFILE.
                                    Then go to Import/Upload section.</li>
                                <li>Click on Upload products and select the Custom Profile.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 3,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is the difference between custom and default profile?",
                    ans: (
                        <React.Fragment>
                            <p>
                                If you choose the default profile, while uploading products to Shopify, we will upload
                                all your products in bulk to your Shopify store.
                                <br/>
                                In the custom profile, you categorize the products on several grounds like quantity,
                                vendor type, country, etc through profiling and upload that specific profile to Shopify.
                                <br/>
                                Using this, you can also list your products in Shopify’s specific collection.
                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 4,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Does Omni-Importer handle my product information?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes. Along with the main products, the app helps you fetch all the variation of the
                                products, with their description, images, price, inventory, etc.
                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 5,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "My products are imported from Amazon to the app. What's next?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Now, you can upload your products to Shopify from Import/Upload section in 3 different
                                ways:
                            </p>
                            <ol>
                                <li>Bulk Upload</li>
                                <li>Select and Upload</li>
                                <li>Through profiling</li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 6,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to connect my Amazon account to Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                You can connect your Amazon account to the app by following these steps:
                            </p>
                            <ol>
                                <li>Go to the <b>Accounts</b> section.</li>
                                <li>Click on the <b>Link your Account</b> button in the Amazon section and enter the correct
                                    credentials to connect to the app.</li>
                                <br/>
                                For further assistance, you can see the HELP PDF option.
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 7,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Why I am getting the error “Failed to import from Amazon. InvalidParameterValue”?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error message shows if the wrong credentials are entered while connecting Amazon
                                account. Follow the steps given below to reconnect Amazon account
                                <br/>
                            </p>
                            <ol>
                                <li>Go to Accounts section</li>
                                <li>Click Reconnect.</li>
                                <li>Select the country(where your Amazon account is)
                                    Enter your details like Seller Id and Token etc.</li>
                                <li>Click on submit button.</li>
                                <br/>
                                For further assistance, you can see the HELP PDF option while connecting your Account.
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 8,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to upload products from app to my Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Steps to upload the products from app to my Shopify store:
                            </p>
                            <ol>
                                <li>Go to Import/Upload section.</li>
                                <li>Select the Upload Products option.</li>
                                <li>Or by going to the ‘Products’ section for uploading the selected products.</li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 9,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is profile and how it is used?",
                    ans: (
                        <React.Fragment>
                            <p>
                                You can upload selected products by creating a profile on the basis of selected
                                attributes such as quantity, title, country or price. Steps of Profiling:
                            </p>
                            <ol>
                                <li>Go to Profiling section.</li>
                                <li>Click on Create profile</li>
                                <li>Enter Profile name (ANY)</li>
                                <li>Enter Product source</li>
                                <li>Select the Target house (warehouse)</li>
                                <li>Select attribute on which basis you want to create a profile
                                    Now, from the Import/Upload section, upload products by choosing the Custom profile.</li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 10,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Stuck on product import/upload process?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To import products go to - <b>Import/Upload</b> section
                                <br/>
                                <b>Import Products:</b> It helps to get the products from selected source marketplace (from
                                where you want to import products) to the app.
                                <b>Upload Products:</b> It helps to make products uploaded from app to Shopify. This can be
                                done in 3 ways:
                            </p>
                            <ol>
                                <li>Bulk Upload</li>
                                <li>Select and Upload Through Profiling</li>
                                <b>Bulk Upload:</b> Go to Import/Upload section and click on Upload Products and select the
                                default profile.
                                <b>Select and Upload:</b> Go to the Product section. Select the products you want to upload,
                                then click on Actions and then Upload.
                                Kindly Refer Ques <b>What is profiling?</b> to know more about Profiling.
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 11,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to re-connect my Amazon account?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To reconnect your account, follow these steps:
                            </p>
                            <ol>
                                <li>Go to the Accounts section.</li>
                                <li>Go to Amazon marketplace and click on reconnect option.</li>
                                <li>Enter the correct credentials, click on Submit Button, your account will be
                                    automatically connected to your Amazon marketplace.</li>
                            </ol>
                            <b>For further assistance, you can see the HELP PDF option.</b>
                        </React.Fragment>
                    )
                },

                {
                    id: 12,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Can I upload selected products on Shopify?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes, you can upload selected products on Shopify by following the steps given below:
                            </p>
                            <ol>
                                <li>Go to the Products section.</li>
                                <li>Select the products you want to upload( you can apply various filters such as- SKU,
                                    title, price, and quantity).</li>
                                <li>After selecting, click on ACTIONS and select Upload.</li>
                                <li>Selected products will be uploaded on Shopify.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 13,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Product Import Process failed: Walmart Refused Report Access Kindly Try later why I am getting this error?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error may be caused due to any of the following cases:
                                <br/>
                                <b>CASE 1:</b> The details of the Walmart seller panel that you have provided may be wrong. So
                                kindly re-connect your Walmart account by following the steps:
                                <br/>
                                <ol>
                                    <li>Go to the Accounts section.</li>
                                    <li>Go to Walmart marketplace and click on reconnect option.</li>
                                    <li>Enter the correct credentials, click on Submit Button, your app panel will be
                                        automatically connected to your Walmart marketplace.</li>
                                    <li>For further assistance, you can see the HELP PDF option.</li>
                                </ol>

                                <b>CASE 2:</b> Please try again later, it may be happening because we didn’t get a proper
                                response from Walmart.
                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 14,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Products imported successfully but why not visible on Shopify store? Or why I can't see my products on Shopify?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To make products visible on Shopify you have to upload it from App to your Shopify
                                store.
                                <br/>
                                Kindly Refer Ques “Stuck on product import/upload process?” to know how to upload
                                products.

                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 15,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "When import products from the marketplace, will it auto create on my Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                No, when product imported from the selected marketplace, it will only get imported on
                                the app, to upload it on Shopify you have to upload them from the Import/Upload section.
                                <br/>
                                Refer Ques “Stuck on product import/upload process?” to know more.
                                <br/>
                                <b>Note:</b> First 10 products are uploaded for free as a trial and after that, you need to pay
                                $0.1/product for uploading on Shopify.
                            </p>
                        </React.Fragment>
                    )
                },

                {
                    id: 16,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to manually create your Shopify orders on FBA?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Go to the Settings section, and follow these steps:
                            </p>
                            <ol>
                                <li>Go to the FBA settings.</li>
                                <li>Go to the option "Want to create order manually"</li>
                                <li>Click on it.</li>
                                <li>Select the option '"YES".</li>
                                <li>Now go to FBA section of the app</li>
                                <li>Click "Create" for the orders you want to create manually</li>
                            </ol>
                            <b>Now, your selected orders are created on FBA.</b>
                        </React.Fragment>
                    )
                },



                {
                    id: 17,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Will, my inventory gets synced from Marketplace (like Walmart,eBay, Etsy, Amazon or Wish) to Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes, you can sync your inventory from marketplace to Shopify. For this, you need to
                                choose the monthly plans as per your no.of products.
                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 18,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "If I changed any field like title or description then, how can I update my product information on Shopify?",
                    ans: (
                        <React.Fragment>
                            <ol>
                                <li>Go to the Settings section on the app.</li>
                                <li>In Shopify settings, enable the manual sync, and select the fields you want to update.
                                    Save the changes.</li>
                                <li>Now, again import and upload the products from Import/Upload section.</li>

                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 19,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What to do while getting the error Failed to import from eBay. Account not Found!",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error means wrong credentials entered, to fix this, you should try to reconnect
                                your eBay account. To reconnect your account, follow the steps given below:
                            </p>
                            <ol>
                                <li>Go to the Accounts section.</li>
                                <li>Select the country.</li>
                                <li>Click Reconnect.</li>
                                <li>Enter the Credentials and get connected to the app.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 20,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to map your Shopify shipping speed category with the FBA shipping speed category?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Go to the Settings section of the app, and follow the steps:
                            </p>
                            <ol>
                                <li>Go to the FBA section.</li>
                                <li>Click on the "Manage Shipping Speed Categpry".</li>
                                <li>And map the Shopify and FBA shipping categories.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 21,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is profiling?",
                    ans: (
                        <React.Fragment>
                            <p>
                                You can upload the product to Shopify by creating a profile on the basis of several
                                grounds (such as quantity, title, country or price, etc). For uploading profile:
                            </p>
                            <ol>
                                <li>Go to Import/Upload section.</li>
                                <li>Click on Upload Product.</li>
                                <li>Select the Product source.</li>
                                <li>Then, select the Custom profile in “Upload through” option.</li>
                                <li>Click on Upload Products.</li>
                            </ol>
                        </React.Fragment>
                    )
                },








            ]
        };
        if (!globalState.getLocalStorage("auth_token")) {
            this.props.disableHeader(false);
        } else {
            this.props.disableHeader(true);
        }
    }

    handleSearch() {
        try {
            let value = this.state.faq;
            let flag = 0;
            if (this.state.search.length >= 2) {
                value.forEach(data => {
                    const text = data.ques.toLowerCase();
                    if (text.search(this.state.search) === -1) {
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
                primaryAction={{
                    content: "Contact Us",
                    onClick: () => {
                        this.redirect("/panel/help/report");
                    }
                }}
            >
                <div className="row">
                    <div className="col-12 mb-4">
                        <Card>
                            <ResourceList
                                items={this.state.noSearchFound}
                                renderItem={item => {
                                }}
                                filterControl={
                                    <ResourceList.FilterControl
                                        searchValue={this.state.search}
                                        onSearchChange={searchValue => {
                                            this.setState({search: searchValue.toLowerCase()});
                                            this.handleSearch();
                                        }}
                                    />
                                }
                            />
                        </Card>
                    </div>
                    {this.state.faq.map(data => {
                        return (
                            <React.Fragment key={data.id}>
                                {data.search ? (
                                    <div className="col-sm-6 col-12 mb-3">
                                        <div
                                            style={{cursor: "pointer"}}
                                            onClick={this.handleToggleClick.bind(this, data)}
                                        >
                                            <Banner title={data.ques} icon="view" status="attention">
                                                {/*<div className="pt-5">*/}
                                                {/*<Stack vertical>*/}
                                                {/*<div className=" mb-2">*/}
                                                {/*<h3>{data.ques}</h3>*/}
                                                {/*</div>*/}
                                                {/*</Stack>*/}
                                                {/*</div>*/}
                                            </Banner>
                                        </div>
                                        <Collapsible open={data.show} id={data.id}>
                                            <div className="p-3">
                                                <Banner title="Answer" status="info">
                                                    <h4>{data.ans}</h4>
                                                </Banner>
                                            </div>
                                        </Collapsible>
                                    </div>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </div>
                {/*<div className="col-12 mt-5">*/}
                {/*<div className="text-center mt-5">*/}
                {/*<h3><b>Contact Us- </b></h3>*/}
                {/*<h5><b>Email id-</b> apps@cedcommerce.com</h5>*/}
                {/*<h5><b>Phone Number-</b>(+1) 888-882-0953</h5>*/}
                {/*</div>*/}
                {/*</div>*/}
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
                                    <li className="mb-3">
                                        'title'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'title
                                    </li>
                                    <li className="mb-3">
                                        'description'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'long_description'
                                    </li>
                                    <li className="mb-3">
                                        'price'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'price'
                                    </li>
                                    <li className="mb-3">
                                        'link'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        Your Product Link{" "}
                                    </li>
                                    <li className="mb-3">
                                        'brand'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'vendor'
                                    </li>
                                    <li className="mb-3">
                                        'image_link'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'main_image'
                                    </li>
                                    <li className="mb-3">
                                        'main_image'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'container_id'
                                    </li>
                                    <li className="mb-3">
                                        'gtin'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'bar_code'
                                    </li>
                                    <li className="mb-3">
                                        'mpn'{" "}
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />{" "}
                                        'sku'
                                    </li>
                                </ul>
                            </h4>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Page>
        );
    }
    handleToggleClick = event => {
        let data = this.state.faq;
        data.forEach(key => {
            if (key.id === event.id) {
                key.show = !key.show;
            }
        });
        this.setState({
            faq: data
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