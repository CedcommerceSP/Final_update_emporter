import React, {Component} from 'react';
import { Card, Select, Page } from '@shopify/polaris';

class FileMapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openMapping: false,
            container_field: this.modifyMappingArray(props.location.state[1]),
            csv_fields: this.modifyMappingArray(props.location.state[0]),
        };
    }

    modifyMappingArray(arg) {
        let obj = [];
        Object.keys(arg).forEach((e) => {
            obj.push({
                label: arg[e],
                value: arg[e]
            })
        });
        return obj;
    }

    render() {
        return (
            <Page title={"Mapping"}>
                <Card>
                    <div className="row p-5">
                        <div className="col-6">
                            <Select label={"Available Filed"} options={this.state.csv_fields}/>
                        </div>
                        <div className="col-6">
                            <Select label={"Mapping With"} options={this.state.container_field}/>
                        </div>
                    </div>
                </Card>
            </Page>
        );
    }
}

export default FileMapping;