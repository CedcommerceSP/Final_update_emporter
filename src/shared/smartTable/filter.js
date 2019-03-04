import React, {Component} from 'react';
import {Button, Select, Stack, TextField, Modal} from "@shopify/polaris";
import {isUndefined} from "util";

class Filter extends Component {

    filterConditions = [
        {label: 'equals', value: "1"},
        {label: 'not equals', value: "2"},
        {label: 'contains', value: "3"},
        {label: 'does not contains', value: "4"},
        {label: 'starts with', value: "5"},
        {label: 'ends with', value: "6"}
    ];
    filterInt = [
        {label: 'equals', value: "1"},
        {label: 'not equals', value: "2"}
    ];

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            columnFilterName: props.columnFilterName,
            columnFilterNameValue:{name:'',condition:'',value:''},
            columnFilterNameArray:[],
            predefineFilters:props.predefineFilters
        };
    }


    render() {
        return (
            <div>
                <Button onClick={this.togglePopover} disclosure>
                    Filter
                </Button>
                <Modal
                    title={"Filter"}
                    open={this.state.active}
                    primaryAction={{content:"filter",onClick:() => {
                            this.handleButtonFilterSubmit();
                        } ,disabled:this.state.columnFilterNameValue.name === '' ||
                            this.state.columnFilterNameValue.condition === '' ||
                            this.state.columnFilterNameValue.value.trim() === ''}}
                    onClose={() => {this.setState({active:false})}}>
                    <Modal.Section>
                        <div className="p-3">
                            <Stack wrap={true}>
                                <Select
                                    label="Title"
                                    placeholder={"Please Select"}
                                    options={this.state.predefineFilters !== undefined? this.state.predefineFilters:this.state.columnFilterName}
                                    value={this.state.columnFilterNameValue.name}
                                    onChange={this.handleButtonFilterChange.bind(this,'name')}
                                />
                                {this.state.columnFilterNameValue.name !== '' && <Select
                                    label="Condition"
                                    disabled={this.state.columnFilterNameValue.name === ''}
                                    placeholder={"select Condition"}
                                    options={!this.state.columnFilterNameValue.isInt?this.filterConditions:this.filterInt}
                                    value={this.state.columnFilterNameValue.condition}
                                    onChange={this.handleButtonFilterChange.bind(this,'condition')}
                                />}
                                {this.state.columnFilterNameValue.condition !== '' && <div onKeyUp={this.handleEnterPress}>
                                    <TextField
                                        label="Value"
                                        disabled={this.state.columnFilterNameValue.condition === ''}
                                        placeholder={"Enter Value"}
                                        value={this.state.columnFilterNameValue.value}
                                        onChange={this.handleButtonFilterChange.bind(this,'value')}
                                        readOnly={false}/>
                                </div>}
                            </Stack>
                        </div>
                    </Modal.Section>
                </Modal>
            </div>
        );
    }

    handleEnterPress = (event) => {
        const enterKeyPressed = event.keyCode === 13;
        if (enterKeyPressed && !(this.state.columnFilterNameValue.name === '' ||
            this.state.columnFilterNameValue.condition === '' ||
            this.state.columnFilterNameValue.value.trim() === '')) {
            this.handleButtonFilterSubmit();
        }
    };

    togglePopover = () => {
        this.setState(({active}) => {
            return {active: !active};
        });
    };

    handleButtonFilterChange = (fieldName, value) => {
        let { columnFilterNameValue } = this.state;
        let columnFilterName = [];
        if ( isUndefined(this.state.predefineFilters) ) {
            columnFilterName = this.state.columnFilterName;
        } else {
            columnFilterName = this.state.predefineFilters;
        }
        columnFilterName.forEach(key => {
            if ( key.value === value ) {
                if ( key.type === 'int' && fieldName === 'name') {
                    columnFilterNameValue.isInt = true;
                    columnFilterNameValue.condition = '';
                } else {
                    columnFilterNameValue.isInt = false;
                }
            }
        });
        columnFilterNameValue[fieldName] = value;
        this.setState({columnFilterNameValue: columnFilterNameValue});
    };

    handleButtonFilterSubmit = () => {
        let { columnFilterNameValue } = this.state;
        let { columnFilterNameArray } = this.state;
        columnFilterNameArray.forEach((e,i) => {
            if ( e.name === columnFilterNameValue['name']) {
                columnFilterNameArray.splice(i,1);
            }
        });
        columnFilterNameArray.push(columnFilterNameValue);
        columnFilterNameValue = {name:'', condition:'', value:'', isInt: false};
        this.props.handleFilterEvent(columnFilterNameArray);
        this.setState({
            columnFilterNameValue: columnFilterNameValue,
            columnFilterNameArray: columnFilterNameArray
        });
        this.togglePopover();
    };

}

export default Filter;