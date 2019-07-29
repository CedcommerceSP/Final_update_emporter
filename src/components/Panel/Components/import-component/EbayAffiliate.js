import React, {Component} from 'react';
import {Banner, Label, Card, Collapsible,DisplayText, Icon} from "@shopify/polaris";
import {
    CaretDownMinor,CircleChevronDownMinor
} from '@shopify/polaris-icons';

class EbayAffiliate extends Component {
    render() {
        return (
            <Card sectioned subdued>
                <div className="row pt-5">
                    <div className="col-12 mb-2">
                        <div className="row p-1" >
                            <div className="pl-4 col-11" >
                                <DisplayText size="small">Search</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor}/>
                            </div>
                        </div>
                        <hr/>
                    </div>
                    <div className="col-12 mb-2">
                        <div className="row p-1">
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">Item ID</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor}/>
                            </div>
                        </div>
                        <hr/>
                    </div>
                    <div className="col-12">
                        <div className="row p-1">
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">URL</DisplayText>
                            </div>
                            <div className="col-1 text-right" children={<Icon source={CaretDownMinor}/>}/>
                        </div>
                        <hr/>
                    </div>
                </div>
            </Card>
        );
    }
}

export default EbayAffiliate;