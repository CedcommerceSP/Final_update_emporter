import React, { Component } from "react";

import {
  TextField,
  Checkbox,
  RadioButton,
  Select,
  Button,
  Label
} from "@shopify/polaris";

export class Formbuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: props.form
    };
  }

  render() {
    return (
      <div className="row">
        {this.state.form.map(field => {
          switch (field.type) {
            case "textfield":
              return (
                <div
                  className="col-12 mt-1 mb-1"
                  key={this.state.form.indexOf(field)}
                >
                  <TextField
                    label={field.title}
                    value={field.value}
                    onChange={this.handleChange.bind(
                      this,
                      this.state.form.indexOf(field)
                    )}
                  />
                </div>
              );
            case "select":
              return (
                <div
                  className="col-12 mt-1 mb-1"
                  key={this.state.form.indexOf(field)}
                >
                  <Select
                    label={field.title}
                    options={field.options}
                    onChange={this.handleChange.bind(
                      this,
                      this.state.form.indexOf(field)
                    )}
                    value={field.value}
                  />
                </div>
              );
            case "checkbox":
              return (
                <div
                  className="col-12 mt-1 mb-1"
                  key={this.state.form.indexOf(field)}
                >
                  <Label>{field.title}</Label>
                  <div className="row">
                    {field.options.map(option => {
                      return (
                        <div
                          className="col-md-4 col-sm-6 col-12"
                          key={field.options.indexOf(option)}
                        >
                          <Checkbox
                            checked={field.value.indexOf(option.value) !== -1}
                            label={option.label}
                            onChange={this.handleOptionsChange.bind(
                              this,
                              this.state.form.indexOf(field),
                              field.options.indexOf(option)
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            case "radio":
              return (
                <div
                  className="col-12 mt-1 mb-1"
                  key={this.state.form.indexOf(field)}
                >
                  <Label>{field.title}</Label>
                  <div className="row">
                    {field.options.map(option => {
                      return (
                        <div
                          className="col-md-4 col-sm-6 col-12"
                          key={field.options.indexOf(option)}
                        >
                          <RadioButton
                            label={option.label}
                            checked={option.value === field.value}
                            id={option.key}
                            name={option.key}
                            onChange={this.handleOptionsChange.bind(
                              this,
                              this.state.form.indexOf(field),
                              field.options.indexOf(option)
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
          }
        })}
        <div className="col-12 text-right mt-3">
          <Button
            onClick={() => {
              this.submitForm();
            }}
            primary
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      form: nextProps.form
    });
  }

  submitForm() {
    this.props.onSubmit(this.state);
  }

  handleChange(fieldIndex, value) {
    this.state.form[fieldIndex].value = value;
    const state = this.state;
    this.setState(state);
  }

  handleOptionsChange(fieldIndex, optionIndex, value) {
    const keyValue = this.state.form[fieldIndex].options[optionIndex].value;
    switch (this.state.form[fieldIndex].type) {
      case "checkbox":
        const keyIndex = this.state.form[fieldIndex].value.indexOf(keyValue);
        if (value) {
          if (keyIndex === -1) {
            this.state.form[fieldIndex].value.push(keyValue);
          }
        } else {
          if (keyIndex !== -1) {
            this.state.form[fieldIndex].value.splice(keyIndex, 1);
          }
        }
        break;
      case "radio":
        this.state.form[fieldIndex].value = keyValue;
        break;
    }
    const state = this.state;
    this.setState(state);
  }
}
