import React, {Component} from 'react';
import {Banner, Button, Checkbox, Heading, Label, Select, TextField} from "@shopify/polaris";
import {capitalizeWord, modifyOptionsData} from "../../components/Panel/Components/static-functions";
import {isUndefined} from "util";
import * as queryString from "query-string";
import {requests} from "../../services/request";
import {notify} from "../../services/notify";

class InstallAppsShared extends Component {
    queryParams;
    constructor(props) {
        super(props);
        this.queryParams = {
            code : props.code,
        };
        this.getInstallationForm();
        this.redirect = this.redirect.bind(this);
        this.getAppInstallationForm = this.getAppInstallationForm.bind(this);
    }

    getInstallationForm() {
        if (!isUndefined(this.queryParams.code)) {
            this.state = {
                code: this.queryParams.code
            };
            this.getAppInstallationForm();
        } else {
            this.props.redirect(false);
        }
    }
    render() {
        return (
            <div className="row">
                <div className="col-12 mt-4 mb-4">
                    <Banner status="info">
                        <Heading>{'Connect ' + capitalizeWord(this.state.code)}</Heading>
                    </Banner>
                </div>
                <div className="col-12 mt-1">
                    <div className="row">
                        {   !isUndefined(this.state.schema) &&
                        this.state.schema.map((field) => {
                            switch(field.type) {
                                case 'select':
                                    return (
                                        <div className="col-12 pt-2 pb-2" key={this.state.schema.indexOf(field)}>
                                            <Select
                                                options={field.options}
                                                label={field.title}
                                                placeholder={field.title}
                                                value={field.value}
                                                onChange={this.handleChange.bind(this, field.key)}>
                                            </Select>
                                        </div>
                                    );
                                    break;
                                case 'checkbox':
                                    return (
                                        <div className="col-12 pt-2 pb-2" key={this.state.schema.indexOf(field)}>
                                            <Label>{field.title}</Label>
                                            <div className="row">
                                                {
                                                    field.options.map(option => {
                                                        return (
                                                            <div className="col-md-6 col-sm-6 col-12 p-1" key={field.options.indexOf(option)}>
                                                                <Checkbox
                                                                    checked={field.value.indexOf(option.value) !== -1}
                                                                    label={option.value}
                                                                    onChange={this.handleMultiselectChange.bind(this, this.state.schema.indexOf(field), field.options.indexOf(option))}
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                    break;
                                default:
                                    return (
                                        <div className="col-12 pt-2 pb-2" key={this.state.schema.indexOf(field)}>
                                            <TextField
                                                label={field.title}
                                                placeholder={field.title}
                                                value={field.value}
                                                onChange={this.handleChange.bind(this, field.key)}>
                                            </TextField>
                                        </div>
                                    );
                                    break;
                            }
                        })
                        }
                        <div className="col-12 text-center mt-3">
                            <Button onClick={() => {
                                this.onSubmit();
                            }}>Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    handleChange(key, event) {
        for (let i = 0; i < this.state.schema.length; i++) {
            if (this.state.schema[i].key === key) {
                const state = this.state;
                state.schema[i].value = event;
                this.setState(state);
                break;
            }
        }
    }

    handleMultiselectChange(index, optionIndex, event) {
        const checkboxValue = this.state.schema[index].options[optionIndex].value;
        const optIndex = this.state.schema[index].value.indexOf(checkboxValue);
        if (event) {
            if (optIndex === -1) {
                this.state.schema[index].value.push(checkboxValue);
            }
        } else {
            if (optIndex !== -1) {
                this.state.schema[index].value.splice(optIndex, 1);
            }
        }
        this.updateState();
    }

    onSubmit() {
        if (this.state.postType === 'external') {
            let url = this.state.action;
            let end = url.indexOf('?') === -1 ? '?' : '&';
            for (let i = 0; i < this.state.schema.length; i++) {
                url += end + this.state.schema[i].key + '=' + this.state.schema[i].value;
                end = '&';
            }
            window.open(url, '_blank', 'location=yes,height=600,width=550,scrollbars=yes,status=yes');
        } else {
            let url = this.state.action;
            let data = {};
            for (let i = 0; i < this.state.schema.length; i++) {
                data[this.state.schema[i].key] = this.state.schema[i].value;
            }
            requests.postRequest(url, data, true)
                .then(data => {
                    if (data.success) {
                        notify.success(data.message);
                    } else {
                        notify.error(data.message);
                    }
                    this.redirect();
                });
        }
    }

    getAppInstallationForm() {
        let win = window.open('', '_blank', 'location=yes,height=600,width=550,scrollbars=yes,status=yes');
        requests.getRequest('connector/get/installationForm', {code: this.state.code })
            .then(data => {
                if (data.success === true) {
                    if (data.data.post_type === 'redirect') {
                        win.location = data.data.action;
                        this.redirect();
                    } else {
                        if (win !== null) {
                            win.close();
                        }
                        const state = this.state;
                        this.state['schema'] = this.modifySchemaData(data.data.schema);
                        this.state['action'] = data.data.action;
                        this.state['postType'] = data.data.post_type;
                        this.updateState();
                    }
                } else {
                    notify.error(data.message);
                    this.redirect();
                }
            });
    }

    modifySchemaData(data) {
        for (let i = 0; i < data.length; i++) {
            if (!isUndefined(data[i].options)) {
                data[i].options = modifyOptionsData(data[i].options);
            }
        }
        return data;
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect() {
        this.props.redirect(false);
    }
}

export default InstallAppsShared;