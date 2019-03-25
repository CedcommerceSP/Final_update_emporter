import React, {Component} from 'react';
import { DropZone, Stack, Thumbnail, Caption, Banner, List, Card , Button,ButtonGroup} from '@shopify/polaris';
import { isUndefined } from 'util';

import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";
import {capitalizeWord} from "../static-functions";

class FileImporter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            hasError: false,
            rejectedFiles: [],
            openMapping: false,
            container_field: [],
            csv_fields:[],
            upload_status:false,
            mapping_status:false,
            upload_new:false,
            response:{}
        };
        console.clear();
        this.status();
    }
    status() {
        requests.getRequest("fileimporter/request/getStatus").then(response => {
            console.log(response);
            if (!response.data['file_uploaded']) {
                this.setState({upload_status: true});
            }
            else {
                this.setState({
                    response:response['data'],
                    mapping_status: true,
                    upload_new: true,
                });
            }
        })
    }
    uploadFile = (file) => {
        this.getBase64(file).then(file_new => {
            let fileData = file_new.replace(/^data:text\/[a-z]+;base64,/, "");
            requests.postRequest('fileimporter/request/fileUpload', {file:fileData}).then(e => {
                if ( e.success ) {
                    this.redirect('/panel/import/mapping',{
                        field: e['data']['fields'],
                        header: e['data']['header'],
                        mapped:e['data']['mapped']
                    });
                    this.setState({
                        openMapping: true,
                        container_field: e['data']['fields'],
                        csv_fields :e['data']['header'],
                    });
                    notify.success(e.message);
                } else {
                    notify.error(e.message);
                }
            })
        });
    };

    render() {
        const {files, rejectedFiles, hasError} = this.state;
        const validImageTypes = ['text/csv', 'text/xlsx'];
        const fileUpload = !files.length && <DropZone.FileUpload />;
        const uploadedFiles = files.length > 0 && (
                <Stack vertical>
                    {files.map((file, index) => {
                        return (
                            <div key={index}>
                                <div className="d-flex justify-content-center mb-4">
                                    <Thumbnail
                                        size="small"
                                        alt={file.name}
                                        source={
                                            validImageTypes.indexOf(file.type) > 0
                                                ? window.URL.createObjectURL(file)
                                                : 'https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304'
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    {file.name} <Caption>{file.size} bytes</Caption>
                                </div>
                                <div>
                                    <Button primary onClick={this.uploadFile.bind(this, file)}>
                                        Upload
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button onClick={() => {this.setState({files:[]});}}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </Stack>
            );
        const errorMessage = hasError && (
                <Banner
                    title="The following file couldn’t be uploaded:"
                    status="critical"
                >
                    <List type="bullet">
                        {rejectedFiles.map((file, index) => (
                            <List.Item key={index}>
                                {`"${file.name}" is not supported. File type must be .csv, Office Open XML (.xlsx) .`}
                            </List.Item>
                        ))}
                    </List>
                </Banner>
            );

        return (
            <Card>
                <Stack  distribution="fillEvenly" >
                    {errorMessage}
                    {fileUpload && this.toCheckStatusAndRender()}
                    {
                        uploadedFiles && <Card>
                            <div className="text-center p-5">
                                {uploadedFiles}
                            </div>
                        </Card>
                    }
                </Stack>
            </Card>
        );
    }
    toCheckStatusAndRender(){
        let mapped = this.state.response['mapped'];
        const fileUpload = <DropZone.FileUpload />;
        if(this.state.upload_status){
            return(<DropZone
                accept="text/csv"
                type="file"
                onDrop={(files, acceptedFiles, rejectedFiles) => {
                    this.setState({
                        files: [...this.state.files, ...acceptedFiles],
                        rejectedFiles: rejectedFiles,
                        hasError: rejectedFiles.length > 0,
                    });
                }}
            >
                {fileUpload}
            </DropZone>)
        } else {
            return <Card>
                <Stack vertical={true} alignment="center">
                    <div className="p-2 text-center mt-4">
                        <Stack distribution="center" spacing="extraLoose" alignment="center">
                            <Thumbnail
                                size="medium"
                                alt={""}
                                source={'https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304'}
                            />
                            <Stack vertical spacing="none">
                                <p style={{color:"#333333"}}>
                                    ({this.state.response['file_uploaded']} Items)
                                </p>
                                <p style={{color:"#333333"}}>
                                    {mapped !== undefined && mapped['marketplace'] && capitalizeWord(mapped['marketplace'])}
                                </p>
                            </Stack>
                        </Stack>
                    </div>
                    <div className="mb-4">
                        <ButtonGroup>
                            <Button primary onClick={() => {
                                this.redirect('/panel/import/mapping', {
                                    field: this.state.response['field'],
                                    header: this.state.response['header'],
                                    mapped:mapped['mappedObject'],
                                    marketplace: mapped['marketplace']
                                });
                            }}>
                                {mapped !== undefined && mapped['errorFlag']? "Mapping" : "Edit Mapping"}
                            </Button>
                            <Button onClick={() => {this.setState({upload_status: true});}}>Upload new CSV</Button>
                        </ButtonGroup>
                    </div>
                </Stack>
            </Card>
        }
    }
    getBase64(file) {
        if(!isUndefined(file) ) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }
        else {
            return new Promise((resolve, reject) => {
                false
            });
        }
    }

    redirect(url, data) {
        if ( data !== undefined ) {
            this.props.history.push(url, data)
        } else
            this.props.history.push(url);
    }
}

export default FileImporter;