import React, { Component } from "react";
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
import { faArrowsAltH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { globalState } from "../../../services/globalstate";

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
          ques:
            "How do I send my Items from Amazon to Shopify and make sure they are in sync?",
          ans: (
            <React.Fragment>
              <p>
                With the Omni-Importer app you can send your products from
                Amazon to your Shopify store.The processing for transferring
                item is very simple. Please see the following points-
              </p>
              <ol>
                <li className="mb-2">
                  First you will need to import products from Amazon Marketplace
                  to our Omni-Importer app.This is done on the 'Manage Products'
                  page.
                </li>
                <li className="mb-2">
                  Once Products are imported into the Omni-Importer app you will
                  be able to upload those products to your Shopify store.
                </li>
              </ol>
            </React.Fragment>
          )
        },
        {
          id: 2,
          show: false,
          search: true,
          ques: "How can I update my product information?",
          ans: (
            <React.Fragment>
              <p>
                If you want to update any product information you can do so by
                reuplaoding those items on Shopify through the Omni-Importer
                App.
              </p>
            </React.Fragment>
          )
        },
        {
          id: 3,
          show: false,
          search: true,
          ques: "What is the difference between custom and default profile?",
          ans: (
            <p>
              Profiling converts your data into the correct format and is a way
              to only one products from one Marketplace (the source marketplace)
              in a specified format to another Marketplace (the destination
              marketplace). Where as , a default profile has a mixed format and
              is used in a same manner.
            </p>
          )
        },
        {
          id: 4,
          show: false,
          search: true,
          ques: `My products are imported from Amazon. What's next?`,
          ans: (
            <p>
              Omni-Importer App sync inventory and price of the products once in
              a day.So your products are never out of sync.
            </p>
          )
        },
        {
          id: 5,
          show: false,
          search: true,
          ques: "Does Omni-Importer handle my product information?",
          ans: (
            <p>
              Yes. Along with the main products the app helps you fetch all the
              variation of the products.
            </p>
          )
        },
        {
          id: 6,
          show: false,
          search: true,
          ques: "How to connect my Amazon account to Shopify store?",
          ans: (
            <div>
              You can connect your Amazon account to the Shopify store by
              following these steps:
              <ul>
                <li> Go to the ‘Accounts’ section.</li>
                <li>
                  {" "}
                  Click on the ‘Connect’ button in the Amazon section and enter
                  the correct credentials to connect to the app.{" "}
                </li>
              </ul>
              For further assistance, you can see the HELP PDF option.
            </div>
          )
        },
        {
          id: 8,
          show: false,
          search: true,
          ques:
            "Why I am getting the error “Failed to import from Amazon. InvalidParameterValue”?",
          ans: (
            <div>
              {" "}
              This error message shows if the wrong credentials entered while
              connecting Amazon account Follow the steps given below to
              reconnect Amazon account
              <ul>
                {" "}
                <li> Go to Accounts </li>
                <li> Click reconnect</li>
                <li> Select the country</li>
                <li> Enter your details like Seller Id and Token etc. </li>
                <li> Click on submit button.</li>
              </ul>
              For further assistance, you can see the HELP PDF option while
              connecting your Account.
            </div>
          )
        },
        {
          id: 9,
          show: false,
          search: true,
          ques: "How to upload products from app to my Shopify store?",
          ans: (
            <div>
              {" "}
              Steps to upload the products from app to my Shopify store:
              <ul>
                <li> Go to Import/Upload section </li>
                <li> Select the Upload option. </li>
              </ul>
              Or by going to the ‘Products’ section for uploading the selected
              products.
            </div>
          )
        },
        {
          id: 10,
          show: false,
          search: true,
          ques: "What is profile and how it is used?",
          ans: (
            <div>
              {" "}
              You can upload selected products by creating a profile with
              selected attributes such as quantity, title or price. Steps of
              Profiling:
              <ul>
                <li> Go to Profiling section.</li>
                <li>
                  {" "}
                  Select filters according to your need and apply it your
                  products and then upload them on Shopify from Import/upload
                  and then select the custom profile rather than default
                  profiling.
                </li>
              </ul>
            </div>
          )
        },
        {
          id: 11,
          show: false,
          search: true,
          ques: "Stuck on product import/upload process?",
          ans: (
            <div>
              To import products go to - ‘Import/Upload’ section
              <ol>
                {" "}
                <li>
                  {" "}
                  Import Products: It helps to get the products from selected
                  source marketplace (from where you want to import products) to
                  the app.
                </li>
                <li>
                  {" "}
                  Upload Products: It helps to make products uploaded from app
                  to Shopify.
                </li>
              </ol>
              <ol>
                {" "}
                <li>
                  {" "}
                  To make products visible on Shopify you have 3 option to
                  uploaded it:
                </li>
                <li>
                  {" "}
                  Bulk Upload: It can be done from Upload Products in
                  ‘Import/Upload’ section
                </li>
                <li>
                  {" "}
                  Upload Specific product: Can upload selected products by
                  creating Profile,
                  <br />
                  <br />
                  Kindly Refer Ques <br />
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={this.handleToggleClick.bind(this, { id: 17 })}
                  >
                    <b>What is profiling?</b>
                  </i>
                  <br />
                  to know more about profiling.
                  <br />
                  <br />
                </li>
                <li>
                  {" "}
                  Select and upload: Go to the ‘Products’, select the products
                  which need to be uploaded then upload it by clicking on the
                  Upload Button.
                </li>
              </ol>
            </div>
          )
        },
        {
          id: 12,
          show: false,
          search: true,
          ques: "How to re-connect my Amazon account?",
          ans: (
            <div>
              To reconnect your account, steps given below:
              <ol>
                <li> Go to the Accounts section.</li>
                <li>
                  {" "}
                  Go to Amazon marketplace and click on reconnect option.
                </li>
                <li>
                  {" "}
                  Enter the correct credentials, click on Submit Button, your
                  account will be automatically connected to your Amazon
                  marketplace.{" "}
                </li>
              </ol>
              For further assistance, you can see the{" "}
              <a href="http://apps.cedcommerce.com/importer/amazon_UK_IN.pdf">
                {" "}
                HELP PDF{" "}
              </a>{" "}
              option.
            </div>
          )
        },
        {
          id: 13,
          show: false,
          search: true,
          ques:
            'What to do while getting the error "Failed to import from eBay. Account not Found !',
          ans: (
            <div>
              This error means wrong credentials entered, to fix this, you
              should try reconnect your eBay account. To reconnect your account,
              follow the steps given below:
              <ol>
                {" "}
                <li> Go to accounts.</li>
                <li> Click reconnect.</li>
                <li> select the country.</li>
                <li>
                  {" "}
                  enter your details (like Seller Id, Token, etc) and click the
                  “submit” button.{" "}
                </li>
              </ol>
            </div>
          )
        },

        {
          id: 14,
          show: false,
          search: true,
          ques:
            "“Product Import Process failed: Walmart Refused Report Access Kindly Try later” why I am getting this error?",
          ans: (
            <div>
              {" "}
              This error may be caused due to any of the following cases
              <b> CASE 1: </b> The details of the Walmart seller panel that you
              have provided may be wrong. So kindly re-connect your Walmart
              account by following the steps:
              <ol>
                {" "}
                <li> Go to the Accounts section.</li>
                <li>
                  {" "}
                  Go to Walmart marketplace and click on reconnect option.
                </li>
                <li>
                  {" "}
                  Enter the correct credentials, click on Submit Button, your
                  account will be automatically connected to your Walmart
                  marketplace.{" "}
                </li>{" "}
              </ol>
              For further assistance, you can see the{" "}
              <a href="http://apps.cedcommerce.com/importer/walmart_doc.pdf">
                {" "}
                HELP PDF{" "}
              </a>{" "}
              option.
              <b> CASE 2:</b> Please try again later, it may be happens because
              we didn’t get proper response from Walmart.
            </div>
          )
        },
        {
          id: 15,
          show: false,
          search: true,
          ques:
            "Products imported successfully but why not visible on Shopify store? Or  why I can't see my products on Shopify?",
          ans: (
            <div>
              To make products visible on Shopify you have to upload it- from
              App.
              <br />
              <br />
              Kindly Refer Ques <br />
              <i
                style={{ cursor: "pointer" }}
                onClick={this.handleToggleClick.bind(this, { id: 11 })}
              >
                <b>Stuck on product import/upload process?</b>
              </i>
              <br />
              to know how to upload products.
            </div>
          )
        },
        {
          id: 16,
          show: false,
          search: true,
          ques:
            "When import products from marketplace, will it auto create on my Shopify store?",
          ans: (
            <div>
              {" "}
              No, when product imported from selected marketplace, it will only
              get imported on app only, to upload it on Shopify you have to
              upload.
              <br />
              <br />
              Refer Ques <br />
              <i
                style={{ cursor: "pointer" }}
                onClick={this.handleToggleClick.bind(this, { id: 11 })}
              >
                <b>Stuck on product import/upload process?</b>
              </i>
              <br />
              to know more.
              <br />
              <br />
              <b> Note: </b>{" "}
              <i>
                {" "}
                First 10 products are uploaded for free and after that, you need
                to pay $0.05/product for uploading on Shopify{" "}
              </i>
            </div>
          )
        },
        {
          id: 17,
          show: false,
          search: true,
          ques: "What is profiling?",
          ans: (
            <div>
              You can upload by creating profile with different attributes (such
              as quantity, title or price). While uploading select the profile
              you created and then click upload products.
            </div>
          )
        },
        {
          id: 18,
          show: false,
          search: true,
          ques: "Can I upload selected products on Shopify?",
          ans: (
            <div>
              Ans. 12. Yes, you can upload selected products on shopify by
              following the steps given below:
              <ol>
                {" "}
                <li> Go to Products</li>
                <li>
                  {" "}
                  Select the products you want to upload( you can apply various
                  filters such as- SKU, title, price and quantity).{" "}
                </li>
                <li>
                  {" "}
                  From <b> ACTIONS </b> select <b> upload </b> and then products
                  will be uploaded on Shopify.{" "}
                </li>{" "}
              </ol>
            </div>
          )
        },
        {
          id: 19,
          show: false,
          search: true,
          ques: "How to make products uploaded through Profiling?",
          ans: (
            <div>
              {" "}
              Ans.13. To create a profile, follow the steps:
              <ol>
                {" "}
                <li> Go to PROFILING Section</li>
                <li> Click on CREATE PROFILE </li>
                <li> Enter a profile name and select the source. </li>
                <li> Now, click - “save and move to next step”. </li>
                <li>
                  {" "}
                  Select the attributes, enter the filter value and click CREATE
                  PROFILE.
                </li>{" "}
              </ol>
            </div>
          )
        },
        {
          id: 20,
          show: false,
          search: true,
          ques:
            "Will my inventory get synced from Marketplace (like Walmart,eBay, Etsy or Walmart)  to Shopify store?",
          ans: (
            <div>
              Ans.14. Yes, to enable or disable inventory sync you can go to
              CONFIGURATION,
              <ol>
                <li> then to Shopify configuration, </li>
                <li> now to Product Sync. </li>
                <li>
                  {" "}
                  Here you can enable/disable it and select the fields which you
                  want to sync with Shopify.
                </li>
              </ol>
            </div>
          )
        }
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
        this.setState({ noSearchFound: [] });
      } else {
        this.setState({ noSearchFound: [1] });
      }
      this.setState({ faq: value });
    } catch (e) {}
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
                renderItem={item => {}}
                filterControl={
                  <ResourceList.FilterControl
                    searchValue={this.state.search}
                    onSearchChange={searchValue => {
                      this.setState({ search: searchValue.toLowerCase() });
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
                      style={{ cursor: "pointer" }}
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
                      <Banner title="Answer" status="info">
                        <h4>{data.ans}</h4>
                      </Banner>
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
