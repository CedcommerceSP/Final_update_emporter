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
                    ques: "How do I send my Items from Amazon to Shopify and make sure they are in sync?",
                    ans: (
                        <React.Fragment>
                            <p>
                                With the Omni-Importer app you can send your products from
                                Amazon to your Shopify store.The processing for transferring
                                item is very simple. Please see the following points-
                            </p>
                            <ol>
                                <li className="mb-2">
                                    Go to Import/Upload section.
                                </li>
                                <li className="mb-2">
                                    Click on Import Product. All the products will be listed on the app. You can see the
                                    products in the Product section.
                                </li>
                                <li className="mb-2">
                                    Then you can select and upload or bulk upload, depending on the seller’s
                                    requirement.
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
                            <ol>
                                <li className="mb-2">
                                    Go to the Settings section on the app.
                                </li>
                                <li className="mb-2">
                                    In Shopify settings, enable the manual sync, and select the fields you want to
                                    update.
                                </li>
                                <li className="mb-2">
                                    Save the changes.
                                </li>
                                <li className="mb-2">
                                    Now, again import and upload the products from Import/Upload section.
                                </li>
                            </ol>
                        </React.Fragment>
                    )
                },
                {
                    id: 3,
                    show: false,
                    search: true,
                    ques: "What is the difference between custom and default profile?",
                    ans: (
                        <React.Fragment>
                            <p>
                                If you choose the default profile, while uploading products to Shopify, we will upload
                                all your products in bulk to your Shopify store.
                                <br/>
                                <br/>
                                In the custom profile, you categorize the products on several grounds like quantity,
                                vendor type, country, etc through profiling and upload that specific profile to Shopify.
                                Using this, you can also list your products in Shopify’s specific collection.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 4,
                    show: false,
                    search: true,
                    ques: `My products are imported from Amazon. What's next?`,
                    ans: (
                        <React.Fragment>
                            <p>
                                Now, you can upload your products to Shopify from Import/Upload section in 3 different
                                ways:
                            </p>
                            <br/>
                            <ul>
                                <li>
                                    Bulk Upload
                                </li>
                                <li>
                                    Select and Upload
                                </li>
                                <li>
                                    Through Profiling
                                </li>
                            </ul>
                        </React.Fragment>


                    )
                },
                {
                    id: 5,
                    show: false,
                    search: true,
                    ques: "Does Omni-Importer handle my product information?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes. Along with the main products the app helps you fetch all the
                                variation of the products,
                                <br/>
                                with their description, images, price, inventory, etc.
                            </p>
                        </React.Fragment>
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
                    ques: "Why I am getting the error “Failed to import from Amazon. InvalidParameterValue”?",
                    ans: (
                        <div>
                            {" "}
                            This error message shows if the wrong credentials entered while
                            connecting Amazon account Follow the steps given below to
                            reconnect Amazon account
                            <ul>
                                {" "}
                                <li> Go to Accounts</li>
                                <li> Click reconnect</li>
                                <li> Select the country</li>
                                <li> Enter your details like Seller Id and Token etc.</li>
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
                                <li> Go to Import/Upload section</li>
                                <li> Select the Upload option.</li>
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
                                    Click on Create profile
                                </li>
                                <li>
                                    Enter Profile name (ANY)
                                </li>
                                <li>
                                    Enter Product source
                                </li>
                                <li>
                                    Select the Target house (warehouse)
                                </li>
                                <li>
                                    Select attribute on which basis you want to create a profile
                                </li>
                                <li>
                                    Now, from the Import/Upload section, upload products by choosing the Custom profile.
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
                        <React.Fragment>
                            <p>
                                To import products go to - ‘Import/Upload’ section
                            </p>
                            <ol>
                                <li>
                                    <b>Import Products:</b> It helps to get the products from selected source <b>marketplace</b>
                                    (from where you want to import products) to the <b>app</b>.
                                </li>
                                <li>
                                    <b>Upload Products:</b> It helps to make products uploaded from <b>app</b> to <b>Shopify</b>.
                                    This can be done in 3 ways:
                                </li>
                                <ul>
                                    <li>
                                        Bulk Upload
                                    </li>
                                    <li>
                                        Select and Upload
                                    </li>
                                    <li>
                                        Through Profiling
                                    </li>
                                </ul>
                                <li>
                                    <b>Bulk Upload:</b> Go to <b>Import/Upload</b> section and click on <b>Upload
                                    Products</b> and select the default profile.
                                </li>
                                <li>
                                    <b>Select and Upload:</b> Go to the <b>Product</b> section. Select the products you
                                    want to upload, then click on <b>Actions</b> and then <b>Upload</b>.
                                </li>
                                <li>
                                    Kindly Refer Ques “What is profiling?” to know more about <b>Profiling</b>.
                                </li>
                            </ol>
                        </React.Fragment>
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
                    ques: 'What to do while getting the error "Failed to import from eBay. Account not Found !',
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
                    ques: "“Product Import Process failed: Walmart Refused Report Access Kindly Try later” why I am getting this error?",
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
                                </li>
                                {" "}
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
                    ques: "Products imported successfully but why not visible on Shopify store? Or  why I can't see my products on Shopify?",
                    ans: (
                        <div>
                            To make products visible on Shopify you have to upload it- from
                            App.
                            <br />
                            <br />
                            Kindly Refer Ques <br />
                            <i
                                style={{cursor: "pointer"}}
                                onClick={this.handleToggleClick.bind(this, {id: 11})}
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
                    ques: "When import products from marketplace, will it auto create on my Shopify store?",
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
                                style={{cursor: "pointer"}}
                                onClick={this.handleToggleClick.bind(this, {id: 11})}
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
                            Yes, you can upload selected products on shopify by
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
                                </li>
                                {" "}
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
                            To create a profile, follow the steps:
                            <ol>
                                {" "}
                                <li> Go to PROFILING Section</li>
                                <li> Click on CREATE PROFILE</li>
                                <li> Enter a profile name and select the source.</li>
                                <li> Now, click - “save and move to next step”.</li>
                                <li>
                                    {" "}
                                    Select the attributes, enter the filter value and click CREATE
                                    PROFILE.
                                </li>
                                {" "}
                            </ol>
                        </div>
                    )
                },
                {
                    id: 20,
                    show: false,
                    search: true,
                    ques: "Will my inventory get synced from Marketplace (like Walmart,eBay, Etsy or Walmart)  to Shopify store?",
                    ans: (
                        <div>
                            Yes, to enable or disable inventory sync you can go to
                            Settings,
                            <ol>
                                <li> then to Shopify configuration,</li>
                                <li> now to Product Sync.</li>
                                <li>
                                    {" "}
                                    Here you can enable/disable it and select the fields which you
                                    want to sync with Shopify.
                                </li>
                            </ol>
                        </div>
                    )
                },
                {
                    id: 21,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How do I send my Items from Amazon to Shopify and make sure stock are in sync?",
                    ans: (<React.Fragment>
                            <p>
                                With the Omni-Importer app, you can send your products from the Amazon seller center to
                                your Shopify
                                store. The process of transferring the item is very simple. Please see the following
                                points-
                                Go to Import/Upload section.
                                Click on Import Product. All the products will be listed on the app. You can see the
                                products in the
                                Product section.
                                Then you can select and upload or bulk upload, depending on the seller’s requirement.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 22,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "If I changed any field like title or description then, how can I update my product information on Shopify?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Go to the Settings section on the app.
                                In Shopify settings, enable the manual sync, and select the fields you want to update.
                                Save the changes.
                                Now, again import and upload the products from Import/Upload section.

                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 23,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is the difference between custom and default profile?",
                    ans: (
                        <React.Fragment>
                            <p>
                                If you choose the default profile, while uploading products to Shopify, we will upload
                                all your
                                products in bulk to your Shopify store.
                                In the custom profile, you categorize the products on several grounds like quantity,
                                vendor
                                type, country, etc through profiling and upload that specific profile to Shopify. Using
                                this,
                                you can also list your products in Shopify’s specific collection.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 24,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Does Omni-Importer handle my product information?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes. Along with the main products, the app helps you fetch all the variation of the
                                products,
                                with their description, images, price, inventory, etc.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 25,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "My products are imported from Amazon to the app. What's next?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Now, you can upload your products to Shopify from Import/Upload section in 3 different
                                ways:
                                Bulk Upload
                                Select and Upload
                                Through profiling

                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 26,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to connect my Amazon account to Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                You can connect your Amazon account to the app by following these steps:
                                Go to the ‘Accounts’ section.
                                Click on the “Link your Account” button in the Amazon section and enter the correct
                                credentials
                                to connect to the app.
                                For further assistance, you can see the HELP PDF option.

                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 27,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Why I am getting the error “Failed to import from Amazon. InvalidParameterValue”?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error message shows if the wrong credentials are entered while connecting Amazon
                                account.
                                Follow the steps given below to reconnect Amazon account
                                Go to Accounts section
                                Click Reconnect.
                                Select the country(where your Amazon account is)
                                Enter your details like Seller Id and Token etc.
                                Click on submit button.
                                For further assistance, you can see the HELP PDF option while connecting your Account.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 28,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to upload products from app to my Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Steps to upload the products from app to my Shopify store:
                                Go to Import/Upload section
                                Select the Upload Products option.
                                Or by going to the ‘Products’ section for uploading the selected products.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 29,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is profile and how it is used?",
                    ans: (<React.Fragment>
                            <p>
                                You can upload selected products by creating a profile on the basis of selected
                                attributes such
                                as quantity, title, country or price. Steps of Profiling:
                                Go to Profiling section.
                                Click on Create profile
                                Enter Profile name (ANY)
                                Enter Product source
                                Select the Target house (warehouse)
                                Select attribute on which basis you want to create a profile
                                Now, from the Import/Upload section, upload products by choosing the Custom profile.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 30,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Stuck on product import/upload process?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To import products go to - ‘Import/Upload’ section
                                Import Products: It helps to get the products from selected source marketplace (from
                                where you
                                want to import products) to the app.
                                Upload Products: It helps to make products uploaded from app to Shopify. This can be
                                done in 3
                                ways:
                                Bulk Upload
                                Select and Upload
                                Through Profiling
                                Bulk Upload: Go to Import/Upload section and click on Upload Products and select the
                                default
                                profile.
                                Select and Upload: Go to the Product section. Select the products you want to upload,
                                then click
                                on Actions and then Upload.
                                Kindly Refer Ques “What is profiling?” to know more about Profiling.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 31,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: 'How to re-connect my Amazon account?',
                    ans: (
                        <React.Fragment>
                            <p>
                                To reconnect your account, follow these steps:
                                Go to the Accounts section.
                                Go to Amazon marketplace and click on reconnect option.
                                Enter the correct credentials, click on Submit Button, your account will be
                                automatically
                                connected to your Amazon marketplace.
                                For further assistance, you can see the HELP PDF option.

                            </p>
                        </React.Fragment>
                    )
                }
                ,
                {
                    id: 32,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What to do while getting the error Failed to import frome Bay. Account not Found!",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error means wrong credentials entered, to fix this, you should try to reconnect
                                your eBay
                                account. To reconnect your account, follow the steps given below:
                                Go to the Accounts section.
                                Select the country.
                                Click Reconnect.
                                Enter the Credentials and get connected to the app
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 33, show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "“Product Import Process failed: Walmart Refused Report Access Kindly Try later” why I am getting this error?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error may be caused due to any of the following cases:
                                CASE 1: The details of the Walmart seller panel that you have provided may be wrong. So
                                kindly
                                re-connect your Walmart account by following the steps:
                                Go to the Accounts section.
                                Go to Walmart marketplace and click on reconnect option.
                                Enter the correct credentials, click on Submit Button, your app panel will be
                                automatically
                                connected to your Walmart marketplace.
                                For further assistance, you can see the HELP PDF option.

                                CASE 2: Please try again later, it may be happening because we didn’t get a proper
                                response from
                                Walmart.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 34,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Products imported successfully but why not visible on Shopify store? Or why I can't see my products on Shopify?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To make products visible on Shopify you have to upload it from App to your Shopify
                                store.

                                Kindly Refer Ques “Stuck on product import/upload process?” to know how to upload
                                products.

                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 35,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "When import products from the marketplace, will it auto create on my Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                No, when product imported from the selected marketplace, it will only get imported on
                                the app,
                                to upload it on Shopify you have to upload them from the Import/Upload section.

                                Refer Ques “Stuck on product import/upload process?” to know more.

                                Note: First 10 products are uploaded for free as a trial and after that, you need to pay
                                $0.1/product for uploading on Shopify.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 36,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is profiling?",
                    ans: (
                        <React.Fragment>
                            <p>
                                You can upload the product to Shopify by creating a profile on the basis of several
                                grounds
                                (such as quantity, title, country or price, etc). For uploading profile:
                                Go to Import/Upload section.
                                Click on Upload Product.
                                Select the Product source.
                                Then, select Custom profile in “Upload through” option.
                                Click on Upload Products.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 37,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Can I upload selected products on Shopify?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes, you can upload selected products on Shopify by following the steps given below:
                                Go to the Products section.
                                Select the products you want to upload( you can apply various filters such as- SKU,
                                title,
                                price, and quantity).
                                After selecting, click on ACTIONS and select Upload.
                                Selected products will be uploaded on Shopify.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 38,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to make products uploaded through Profiling?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To create a profile, follow the steps:
                                Go to PROFILING Section.
                                Click on CREATE PROFILE.
                                Enter a profile name and select the source.
                                Now, click - “save and move to the next step”.
                                Select the Target Location and Category.
                                Select the attributes, enter the filter value and click CREATE PROFILE.
                                Then go to Import/Upload section
                                Click on Upload products and select the Custom Profile.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 39,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Will, my inventory gets synced from Marketplace (like Walmart,eBay, Etsy, Amazon or Wish) to Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes, you can sync your inventory from marketplace to Shopify. For this, you need to
                                choose the
                                monthly plans as per your no.of products.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 40,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What does “ORDER HOLD on FBA” mean?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This means that order on FBA will be on HOLD status till the time x.
                                <br/>
                                <b>NOTE:</b> x is the time which you will give in the settings section of the app. By
                                default, it's 0.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 41,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What does “CANCEL ORDER ON SHOPIFY” means?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This means that, if the order gets canceled on Amazon, whether you want to cancel it on
                                Shopify store or not.
                            </p>
                            <br/>
                            <ol>
                                <li>
                                    If you want to get it canceled on Shopify, select YES.
                                </li>
                                <li>
                                    If you want that it does not get canceled on Shopify, select NO.
                                </li>
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
