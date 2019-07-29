import React, {Component} from 'react';
import {Banner, Label, Card, Collapsible,DisplayText, Icon,
        Page,Stack,TextContainer,Autocomplete,textField,Tag} from "@shopify/polaris";
import {
    CaretDownMinor,CircleChevronDownMinor
} from '@shopify/polaris-icons';

class EbayAffiliate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_div: false,
            selected: [],
            inputText: '',
            options: this.options,
        };
    }

    handleToggleClick = () => {

        this.setState((state) => {
            const search = !state.search_div;
            return {
                search,
            };
        });
    };
    render() {
        const textField = (
            <Autocomplete.TextField
                onChange={this.updateText}
                label="Tags"
                value={this.state.inputText}
                placeholder="Vintage, cotton, summer"
            />
        );
        return (
            <Card sectioned subdued>
                <div className="row pt-5">
                    <div className="col-12 mb-2">
                        <div className="row p-1" >
                            <div className="pl-4 col-11"
                                 style={{cursor: "pointer"}}
                                 onClick={this.handleToggleClick.bind(this.state.search_div)}
                            >
                                <DisplayText size="small">Search</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor}/>
                            </div>
                        </div>
                        <hr/>
                        <Page>
                            <Stack>
                                <Collapsible open={this.state.search_div}
                                             ariaExpanded={this.state.search_div}
                                >
                                    <div className="col-12 p-3">
                                        <Card>
                                            <div className="row p-5">
                                                <div style={{height: '325px'}}>
                                                    <TextContainer>
                                                        <Stack>{this.renderTags()}</Stack>
                                                    </TextContainer>
                                                    <br />
                                                    <Autocomplete
                                                        allowMultiple
                                                        options={this.state.options}
                                                        selected={this.state.selected}
                                                        // textField={textField}
                                                        onSelect={this.updateSelection}
                                                        listTitle="Suggested Tags"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </Collapsible>
                            </Stack>
                        </Page>
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
    renderTags = () => {
        return this.state.selected.map((option) => {
            let tagLabel = '';
            tagLabel = option.replace('_', ' ');
            /*tagLabel = titleCase(tagLabel)*/;
            return (
                <Tag key={'option' + option} onRemove={() => this.removeTag(option)}>
                    {tagLabel}
                </Tag>
            );
        });
    };
    removeTag = (tag) => {
        const {selected: newSelected} = this.state;
        newSelected.splice(newSelected.indexOf(tag), 1);
        this.setState({selected: newSelected});
    };


    /* titleCase=(string) =>{
    string = string
        .toLowerCase()
        .split(' ')
        .map(function(word) {
            return word.replace(word[0], word[0].toUpperCase());
        });
    return string.join(' ');
    };*/
}

export default EbayAffiliate;