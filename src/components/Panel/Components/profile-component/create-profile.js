import React, { Component } from 'react';

import { Page,
    Card,
    Select,
    Button,
    TextStyle,
    ResourceList,
    Modal,
    TextContainer,
    FilterType } from '@shopify/polaris';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle,
        faArrowAltCircleDown,
        faArrowAltCircleUp,
        faMapSigns,
        faSpinner,
        faCircleNotch} from '@fortawesome/free-solid-svg-icons';

import { notify } from '../../../../services/notify';

export class CreateProfile extends Component {

    statusColor = {
      completed: '#7FFF00',
      ready: '#3f4eae',
      disabled: '#696969'
    };
    profilesList = [
        {
            label: 'Default Profile',
            value: 'default_profile'
        }
    ];
    constructor() {
        super();
        this.state = {
          showImportProducts: false,
          showUploadProducts: false,
          showImportProductsStatus: 'ready',
          showUploadProductsStatus: 'disabled',
          importProductsDetails: {
            source: '',
            target: '',
            sync_frequency: '',
            products_imported: false,
            products_importing: false
          },
          uploadProductDetails: {
              selected_profile: ''
          }
        };
    }

    renderImportProductsModal() {
        return (
            <div>
                <Modal
                    open={this.state.showImportProducts}
                    onClose={() => {
                        this.state.showImportProducts = false;
                        this.updateState();
                    }}
                    title="Pull Products"
                    primaryAction={{
                        content: 'Next',
                        onAction: () => {
                            this.state.showImportProducts = false;
                            this.updateState();
                        },
                        disabled: !this.state.importProductsDetails.products_imported
                    }}
                >
                    <Modal.Section>
                        <div className="row">
                            <div className="col-12 pt-1 pb-1">
                                <Select
                                    label="Import From"
                                    placeholder="Source"
                                    disabled={this.state.importProductsDetails.products_imported}
                                    options={[
                                        {label: 'Amazon', value: 'amazon'},
                                        {label: 'Ebay', value: 'ebay'},
                                        {label: 'Walmart', value: 'walmart'},
                                    ]}
                                    onChange={this.handleImportChange.bind(this, 'source')}
                                    value={this.state.importProductsDetails.source}
                                />
                            </div>
                            <div className="col-12 pt-1 pb-1">
                                <Select
                                    label="Upload To"
                                    placeholder="Target"
                                    disabled={this.state.importProductsDetails.products_imported}
                                    options={[
                                        {label: 'Shopify', value: 'shopify'},
                                        {label: 'Magento', value: 'magento'},
                                        {label: 'BigCommerce', value: 'bigcommerce'},
                                    ]}
                                    onChange={this.handleImportChange.bind(this, 'target')}
                                    value={this.state.importProductsDetails.target}
                                />
                            </div>
                            <div className="col-12 pt-1 pb-1">
                                <Select
                                    label="Product Syncing Frequency"
                                    placeholder="Sync Frequency"
                                    disabled={this.state.importProductsDetails.products_imported}
                                    options={[
                                        {label: 'Import Once', value: 'import_once'},
                                        {label: 'Auto Syncing', value: 'auto_sync'}
                                    ]}
                                    onChange={this.handleImportChange.bind(this, 'sync_frequency')}
                                    value={this.state.importProductsDetails.sync_frequency}
                                />
                            </div>
                            {
                                !this.state.importProductsDetails.products_importing &&
                                !this.state.importProductsDetails.products_imported &&
                                <div className="col-12 pt-1 pb-1 text-center">
                                    <Button disabled={!(this.state.importProductsDetails.source !== '' &&
                                                        this.state.importProductsDetails.target !== '' &&
                                                        this.state.importProductsDetails.sync_frequency !== '')}
                                            onClick={() => {
                                                this.importProducts();
                                            }}
                                            primary>
                                        Import Products
                                    </Button>
                                </div>
                            }
                            {
                                this.state.importProductsDetails.products_importing &&
                                <div className="col-12 pt-1 pb-1 text-center">
                                    <h4>Importing Products...</h4>
                                    <FontAwesomeIcon icon={faCircleNotch} spin="true" color={this.statusColor.ready} size="10x"/>
                                </div>
                            }
                            {
                                this.state.importProductsDetails.products_imported &&
                                <div className="col-12 pt-1 pb-1 text-center">
                                    <h4>Products Imported</h4>
                                    <FontAwesomeIcon icon={faCheckCircle} color={this.statusColor.completed} size="10x"/>
                                </div>
                            }
                        </div>
                    </Modal.Section>
                </Modal>
            </div>
        );
    }

    handleImportChange(key, value) {
        this.state.importProductsDetails[key] = value;
        this.updateState();
    }

    importProducts() {
        this.state.importProductsDetails.products_importing = true;
        this.updateState();
        setTimeout(() => {
            this.state.importProductsDetails.products_importing = false;
            this.state.importProductsDetails.products_imported = true;
            this.state.showImportProductsStatus = 'completed';
            this.state.showUploadProductsStatus = 'ready';
            this.updateState();
        }, 2000);
    }

    renderUploadProductsModal() {
        return (
            <Modal
                open={this.state.showUploadProducts}
                onClose={() => {
                    this.state.showUploadProducts = false;
                    this.updateState();
                }}
                title="Upload Products"
            >
                <Modal.Section>
                    <div className="row">
                        <div className="col-12">
                            <Select
                                label="Select Profile"
                                options={this.profilesList}
                                placeholder="Select Profile For Upload"
                                onChange={this.uploadProductsChange.bind(this, 'selected_profile')}
                                value={this.state.uploadProductDetails.selected_profile}
                            />
                        </div>
                        {
                            this.state.uploadProductDetails.selected_profile === 'default_profile' &&
                            this.state.importProductsDetails.source === 'shopify' &&
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-md-4 col-12 text-center">
                                        <span>Map collection with?</span>
                                    </div>
                                    <div className="col-md-4 col-12 text-center">

                                    </div>
                                    <div className="col-md-4 col-12 text-center">

                                    </div>
                                </div>
                            </div>
                        }
                        <div className="col-md-6 col-sm-6 col-12 text-center pt-3 pb-3">
                            <Button onClick={() => {
                                this.saveProfile(true);
                            }} primary>
                                Upload Products Now
                            </Button>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12 text-center pt-3 pb-3">
                            <Button onClick={() => {
                                this.saveProfile(false);
                            }} primary>
                                Upload Products Later
                            </Button>
                        </div>
                    </div>
                </Modal.Section>
            </Modal>
        );
    }

    uploadProductsChange(key, value) {
        this.state.uploadProductDetails[key] = value;
        this.updateState();
    }

    saveProfile(upload) {
        this.state.showUploadProductsStatus = 'completed';
        this.state.showUploadProducts = false;
        if (upload) {
            notify.success('Profile created successfully. Upload process in progress.');
        } else {
            notify.success('Profile created successfully.');
        }
        this.redirect("/panel/profiling");
    }

    render() {
        return (
            <Page
                breadcrumbs={[{content: 'Create Profile'}]}
                primaryAction={{content: 'Back', onClick: () => {
                    this.redirect('/panel/profiling');
                }}}
                title="Create Profile">
                <div className="row">
                    <div className="col-md-6 col-sm-6 col-12">
                        <Card>
                            <div>
                                <div className="text-center pt-3 pb-3" style={{cursor: 'pointer'}}>
                                    <h1 className="mt-2 mb-4"><strong>Step 1</strong></h1>
                                    <FontAwesomeIcon onClick={() => {
                                        if (this.state.showImportProductsStatus === 'ready') {
                                            this.state.showImportProducts = true;
                                            this.updateState();
                                        }
                                    }} icon={faArrowAltCircleDown} color={this.statusColor[this.state.showImportProductsStatus]} size="10x" />
                                </div>
                                <div className="text-center pt-4 pb-2">
                                    <FontAwesomeIcon icon={faCheckCircle} color={this.statusColor[this.state.showImportProductsStatus]} size="5x"/>
                                </div>
                                <div className="text-center pt-2 pb-4">
                                    <span className="h2">Pull Products</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-6 col-sm-6 col-12">
                        <Card>
                            <div style={{cursor: 'pointer'}}>
                                <div className="text-center pt-3 pb-3">
                                    <h1 className="mt-2 mb-4"><strong>Step 2</strong></h1>
                                    <FontAwesomeIcon onClick={() => {
                                        if (this.state.showUploadProductsStatus === 'ready') {
                                            this.state.showUploadProducts = true;
                                            this.updateState();
                                        }
                                    }} icon={faArrowAltCircleUp} color={this.statusColor[this.state.showUploadProductsStatus]} size="10x" />
                                </div>
                                <div className="text-center pt-4 pb-2">
                                    <FontAwesomeIcon icon={faCheckCircle} color={this.statusColor[this.state.showUploadProductsStatus]} size="5x"/>
                                </div>
                                <div className="text-center pt-2 pb-4">
                                    <span className="h2">Upload Products</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                {this.renderImportProductsModal()}
                {this.renderUploadProductsModal()}
            </Page>
        );
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}