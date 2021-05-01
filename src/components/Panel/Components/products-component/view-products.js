
import React, { Component } from "react";
import {
	Page,
	Label,
	Card,
	TextContainer,
	Scrollable,
	Select,
	Button,
	TextField,
	ButtonGroup,
	DataTable,
	Thumbnail,
	DisplayText,
	Modal
} from "@shopify/polaris";
import $ from 'jquery';

import { isUndefined } from "util";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "./analytics.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";

class ViewProducts extends Component {
	editDisable = true;

	constructor(props) {
		super(props);
		this.state = {
			activemodal:false,
			Brandmodal:"",
			Colormodal:"",
			Titlemodal:"",
			Labelmodal:"",
			skumodal:"",
			pricemodal:"",
			quantitymodal:"",
			Studiomodal:"",
			imagemodal:"",
			source_variant_idmodal:"",
			id: props.match.params.id,
			open: 1,
			openVariantDetail: false,
			variantArrayDetails: [],
			img: [],
            necessaryInfo:{},
			buttonDisable: {
				save: true,
				save_upload: false,
				discard: false,
				sync: false
			},
			editorState: EditorState.createEmpty(),
			imagePosition: 0,
			products_top: {
				title: "",
				description: ''/*EditorState.createEmpty()*/
			},
			product_data: {
				details: {},
				variants: [],
				created_at: "",
				updated_at: "",
				variants_attributes: []
			},
			edited_fields: {},
			variants: [],
			rows: []
		};
		this.handleChangeclose=this.handleChangeclose.bind(this);
		this.handleeditupdate=this.handleeditupdate.bind(this);
		this.getSingleProductData();
	}

    componentWillReceiveProps(nextPorps) {
        // console.log("in planBody",nextPorps);
        if (nextPorps.necessaryInfo !== undefined) {
            this.setState({ necessaryInfo: nextPorps.necessaryInfo });
        }
    }
	handleeditdatamodal(datamodal){
         console.log(datamodal);
		//  console.log(this.state.id);
		 this.setState({Brandmodal:datamodal['Brand']});
		 this.setState({Titlemodal:datamodal['Title']});
		//  this.setState({Colormodal:datamodal['Color']});
		 this.setState({Labelmodal:datamodal['Label']});
		 this.setState({skumodal:datamodal['sku']});
		 this.setState({pricemodal:datamodal['price']});
		 this.setState({quantitymodal:datamodal['quantity']});
		 this.setState({Studiomodal:datamodal['Studio']});
		 this.setState({imagemodal:datamodal['main_image']})
		 this.setState({activemodal:!this.state.activemodal});
		this.setState({source_variant_idmodal:datamodal['source_variant_id']});
	}
	handleeditupdate(){
        let brand=$("#Brandmodal").val();
		let title=$("#Titlemodal").val();
		let sku=$("#skumodal").val();
		let Studio=$("#Studiomodal").val();
		let quantity=$("#quantitymodal").val();
		let price=$("#pricemodal").val();
		let source_variant_id=$("#source_product_idmodal").text();
		let source_product_id=this.state.id;
		let input={
			"source_variant_id":source_variant_id,
			"sku":sku,
			"price":price,
			"quantity":quantity,
			"Studio":Studio,
			"Brand":brand,
			"Title":title,
			"source_product_id":source_product_id,
			shop_id:this.props.location.state.parent_props.merchant_id

		}
		$.ajax({
			url:"http://importer.sellernext.com/frontend/test/updateVariantsOfScrapping",
			method:"POST",
			data:input,
			success:function(result){
				console.log(result);
			}
		})
	}
	handledatadeletemodal(datamodal){
		let input={
			"source_product_id":this.state.id,
			"source_variant_id":datamodal['source_variant_id'],
			shop_id:this.props.location.state.parent_props.merchant_id
		}
		let confrimdata=window.confirm("Are you Sure want to delete ");
       if(confrimdata){
		$.ajax({
			url:"http://importer.sellernext.com/frontend/test/updateVariantsOfScrapping",
			method:"POST",
			data:input,
			success:function(result){
				console.log(result);
			}
		})
	}
	}
	handleStudiomodal(e){
		this.setState({Studiomodal:e.target.value});

	}
	handletitleedit(e){
		this.setState({Titlemodal:e.target.value});

	}
	handlebrandmodaledit(e){
		this.setState({Brandmodal:e.target.value});

	}
	handlepriceedit(e){
		this.setState({pricemodal:e.target.value});

	}

	handlequantitymodal(e){
		this.setState({quantitymodal:e.target.value});

	}
	handleChangeclose(){
		this.setState({activemodal:!this.state.activemodal})
	}
	getSingleProductData = () => {
		requests
			.postRequest("connector/product/getProductById", {
				source_product_id: this.state.id
			})
			.then(data => {
				// console.log(data)
				if (data.success) {
                    // console.log(data.data.details["additional_images"]);
                    let temp = this.state;
					temp.edited_fields = {};
					temp["product_data"] = {
						// details: Object.assign({}, data.data.details),
						variants: JSON.parse(JSON.stringify(data.data.variants)),
						created_at: data.data["created_at"],
						updated_at: data.data["updated_at"]
					};
					if (!isUndefined(data.data["variant_attribute"])) {
						temp["product_data"]["variant_attribute"] = JSON.parse(
							JSON.stringify(data.data["variant_attribute"])
						);
					} else if (!isUndefined(data.data["variant_attributes"])) {
						temp["product_data"]["variant_attributes"] = JSON.parse(
							JSON.stringify(data.data["variant_attributes"])
						);
					}
					let draft = htmlToDraft(
						"<React.Fragment>" +
							data.data.details["long_description"] +
							"</React.Fragment>"
					);
					const { contentBlocks, entityMap } = draft;
					const contentState = ContentState.createFromBlockArray(
						contentBlocks,
						entityMap
					);
					const editorState = EditorState.createWithContent(contentState);
					temp.editorState = editorState;
					temp.products_top = {
						title: data.data.details.title,
						description: data.data.details["long_description"]
					};
		            // this.setState({Titlemodal:data.data.details.title});
 
					if (
						!isUndefined(data.data["variants"]) &&
						typeof data.data["variants"] === "object"
					) {
						let variant = data.data["variants"];
						temp.variants = [];
						Object.keys(variant).forEach(e => {
							if (!isUndefined(variant[e])) {
								temp.variants.push(variant[e]);
							}
						});
						temp.rows = this.handleTableChange(temp.variants);
					}
					temp.img = [];
					if (!isUndefined(data.data.details["additional_image"]) && data.data.details["additional_image"] !== null) {
						Object.keys(data.data.details["additional_image"]).forEach(e => {
							if (!isUndefined(data.data.details["additional_image"])) {
								temp.img.push(data.data.details["additional_image"]);
							}
						});

                    } 
					else if (!isUndefined(data.data.details["additional_images"] ) && data.data.details["additional_images"] !== null)
					 {
						Object.keys(data.data.details["additional_images"]).forEach(e => {
							if (!isUndefined(data.data.details["additional_images"])) {
								temp.img.push(data.data.details["additional_images"]);
							}
						});
					}
					// console.clear();
					this.setState(temp);
				} else {
					notify.error(data.message);
				}
			});
	};

	handleTableChange = variant => {
		let rows = [];
		// console.log(this.props);
		Object.keys(variant).forEach(e => {
			// console.log(variant[e]);
			rows.push([
				<span
					style={{ cursor: "pointer" }}
					onClick={() => {
						this.setState({
							openVariantDetail: true,
							variantArrayDetails: variant[e]
						});
					}}
				>
					<Thumbnail source={variant[e]["main_image"]} alt={""} />
				</span>,
				<TextField
					label={"sku"}
					readOnly={false}
					disabled={this.editDisable}
					labelHidden={true}
					value={this.state.variants[e].sku}
					onChange={this.handleVariantsChange.bind(this, "sku", e)}
				/>,
				<TextField
					label={"price"}
					readOnly={false}
					disabled={this.editDisable}
					labelHidden={true}
					value={this.state.variants[e].price}
					type={"number"}
					onChange={this.handleVariantsChange.bind(this, "price", e)}
				/>,
				<TextField
					label={"quantity"}
					readOnly={false}
					disabled={this.editDisable}
					labelHidden={true}
					value={this.state.variants[e].quantity}
					type={"number"}
					onChange={this.handleVariantsChange.bind(this, "quantity", e)}
				/>,
				<Label id={"ddd11"}>{this.state.variants[e].weight}</Label>,
				// <TextField
				//     label={'Weight'}
				//     readOnly={false}
				//     disabled={this.editDisable}
				//     labelHidden={true}
				//     value={this.state.variants[e].weight}
				//     onChange={this.handleVariantsChange.bind(this,'weight',e)}/>
				<div style={{ minWidth: "80px" }}>
					<Label id={"ddd"}>{this.state.variants[e].weight_unit}</Label>
					{/*<Select*/}
					{/*label={"Unit"}*/}
					{/*labelHidden={true}*/}
					{/*disabled={this.editDisable}*/}
					{/*options={[*/}
					{/*{label:'lb', value:'lb'},*/}
					{/*{label:'kg', value:'kg'},*/}
					{/*{label:'oz', value:'oz'}]}*/}
					{/*value={this.state.variants[e].weight_unit}*/}
					{/*onChange={this.handleVariantsChange.bind(this,'weight_unit',e)}/>*/}
				</div>,
				<div>
                 <Button onClick={this.handleeditdatamodal.bind(this,variant[e])}primary id="editbtnmargin">Edit</Button>
				 <Button onClick={this.handledatadeletemodal.bind(this,variant[e])} destructive>Delete</Button>
				</div>
			]);
		});
		return rows;
	};
    openModalInDescription(){
    	return(
    		<Page>
			<Modal
				title={"Details"}
				open={this.state.openVariantDetail}
				onClose={() => {
                    this.setState({ openVariantDetail: false });
                }}
			>
				<Modal.Section>
					<div className="row">
						{Object.keys(this.state.variantArrayDetails).map(e => {
                            console.log(e);
                            if (typeof this.state.variantArrayDetails[e] !== 'string' && typeof this.state.variantArrayDetails[e] !== 'number' && typeof this.state.variantArrayDetails[e] !== 'undefined' ) {
                                return null;
                            }
                            return (
								<div className="col-12 col-sm-6 mb-4">
                                    {e === "main_image" ? (
										<React.Fragment>
											<b>{e}</b>:<br />
											<Thumbnail
												source={this.state.variantArrayDetails[e]}
												alt={""}
											/>
										</React.Fragment>
                                    ) : (
										<React.Fragment>
											<b>{e}</b>:<br />
                                            {this.state.variantArrayDetails[e]}
										</React.Fragment>
                                    )}
								</div>
                            );
                        })}
					</div>
				</Modal.Section>
			</Modal>
			</Page>
		)
	}

	render() {
		return (
			<Page
				title="View Products"
				primaryAction={{
					content: "Back",
					onClick: () => {
						this.redirect("/panel/products");
					}
				}}
			>
				<Card>
					<div className="p-5 row">
						{!this.editDisable && (
							<div className="col-12 mb-5 d-flex justify-content-end">
								<ButtonGroup>
									<Button onClick={this.handleSyncAction} icon={"refresh"}>
										{" "}
										Sync With MArketPlace
									</Button>
								</ButtonGroup>
							</div>
						)}
						{!this.editDisable && (
							<div className="col-12 mb-5 d-flex justify-content-end">
								<ButtonGroup>
									<Button
										onClick={this.handleSaveAction}
										primary
										disabled={this.state.buttonDisable.save}
									>
										Save
									</Button>
									<Button
										onClick={this.handleSaveUploadAction}
										disabled={this.state.buttonDisable.save}
									>
										Save & Upload
									</Button>
									<Button
										onClick={this.handleDiscardAction}
										destructive
										disabled={this.state.buttonDisable.save}
									>
										Discard
									</Button>
								</ButtonGroup>
							</div>
						)}
						<div className="col-12 mb-5">
							<Card>
								<div
									className="p-5" /*style={{height:'200px',overflow:'auto'}}*/
								>
									<div className="mb-5"
									/*onClick={this.openModalInDescription.bind(this)}
										 style={{cursor:'pointer'}}*/>
										<TextContainer>
											<DisplayText size="large">
                                                {this.state.products_top.title}
											</DisplayText>
											{/*<TextField
                                                label={'Title'}
                                                readOnly={false}
                                                disabled={this.editDisable}
                                                value={this.state.products_top.title}
                                                onChange={this.handleDetailChange.bind(this,'title')}
                                            />*/}
										</TextContainer>
									</div>
									{this.state.products_top.description === "" ? null : (
										<div className="react_quill_app_class">
											{/*<h4><b>Description</b></h4>*/}
											<div id="editor">
												<Card sectioned>
													<Scrollable
														shadow
														style={{ maxHeight: "300px" }}
														hint={false}
													>
														<div
															dangerouslySetInnerHTML={{
																__html: this.state.products_top.description
															}}
														/>
													</Scrollable>
													<p style={{color:"#c7c7c7"}}>
														Description string count : {this.state.products_top.description.length}
													</p>
												</Card>
												{/*<Editor*/}
												{/*editorState={this.state.editorState}*/}
												{/*wrapperClhandleDetailChangeassName="demo-wrapper"*/}
												{/*readOnly={this.editDisable}*/}
												{/*editorClassName="demo-editor"*/}
												{/*toolbar={{*/}
												{/*options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'history', 'textAlign','list'],*/}
												{/*inline: {*/}
												{/*options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],*/}
												{/*bold: { className: 'bordered-option-classname' },*/}
												{/*italic: { className: 'bordered-option-classname' },*/}
												{/*underline: { className: 'bordered-option-classname' },*/}
												{/*strikethrough: { className: 'bordered-option-classname' },*/}
												{/*code: { className: 'bordered-option-classname' },*/}
												{/*},*/}
												{/*blockType: {*/}
												{/*className: 'bordered-option-classname',*/}
												{/*},*/}
												{/*fontSize: {*/}
												{/*className: 'bordered-option-classname',*/}
												{/*},*/}
												{/*fontFamily: {*/}
												{/*className: 'bordered-option-classname',*/}
												{/*},*/}
												{/*}}*/}
												{/*onEditorStateChange={this.handleDraftJS}*/}
												{/*/>*/}
											</div>
										</div>
									)}
								</div>
							</Card>
						</div>
						{this.state.img.length > 1 && (
							<div className="col-12 mb-5">
								<span>
									<div className="row p-5 d-flex justify-content-center">
										<div className="col-1 mt-5 pt-5 justify-content-center"
												style={{ cursor: "pointer" }}
												onClick={this.pressLeftShift.bind(this)}
											>
											<span>
												<img style={{height: '35px', width: '35px'}}
													 src={require("../../../../assets/img/leftShift.png")}/>
											</span>

										</div>
										<div className="col-8 col-sm-4">
											<div className="pb-5">
												<Thumbnail
													// source={this.state.img[this.state.imagePosition]}
													source={this.state.img[0][this.state.imagePosition]}
													alt={""}
													size={"extralarge"}
												/>
												<div className="text-center">
													<p style={{ color: "#585858" }}>
														({this.state.img.length} images)
													</p>
												</div>
											</div>
										</div>
										<div className="col-1 mt-5 pt-5 justify-content-center"
											 style={{ cursor: "pointer" }}
											 onClick={this.pressRightShift.bind(this,this.state.img.length)}
										>
											<span>
												<img style={{height: '35px', width: '35px'}}
													 src={require("../../../../assets/img/rigthShift.png")}/>
											</span>

										</div>

										<div className={"col-12"}>
											<div className="row d-flex justify-content-center">
												{this.state.img.map((e, i) => {
													// console.log(this.state.img);
													if (
														this.state.imagePosition < i + 5 &&
														this.state.imagePosition > i - 5
													) {
														// console.log(e)
														// console.log(i)
														console.log(this.state.img[0][0])
														return (
															<div
																key={i}
																style={{ cursor: "pointer" }}
																className="col-3 col-sm-1 mb-1"
																onClick={this.handleImageChange.bind(this, i)}
															>
																<span>
																	<Thumbnail source={this.state.img[0][i]} alt={""} />
																</span>
																{this.state.imagePosition === i ? (
																	<div className="mt-1 bg-info p-1" />
																) : (
																	<div
																		style={{ color: "#585858" }}
																		className="text-center"
																	>
																		{i + 1}
																	</div>
																)}
															</div>
														);
													}
												})}
											</div>
										</div>
									</div>
								</span>
							</div>
						)}
                        {this.state.img.length == 1 && (
							<div className="col-12 mb-5">
								<span>
									<div className="row p-5 d-flex justify-content-center">
										<div className="col-12 col-sm-5">
											<div className="pb-5 pr-5">
												<Thumbnail
													source={this.state.img[this.state.imagePosition]}
													alt={""}
													size={"extralarge"}
												/>
												<div className="text-center">
													<p style={{ color: "#585858" }}>
														({this.state.img.length} image)
													</p>
												</div>
											</div>
										</div>
										<div className={"col-12"}>
											<div className="row d-flex justify-content-center">
												{this.state.img.map((e, i) => {
                                                    if (
                                                        this.state.imagePosition < i + 5 &&
                                                        this.state.imagePosition > i - 5
                                                    ) {
                                                        return (
															<div
																key={i}
																style={{ cursor: "pointer" }}
																className="col-3 col-sm-1 mb-1"
																onClick={this.handleImageChange.bind(this, i)}
															>
																<span>
																	<Thumbnail source={e} alt={""} />
																</span>
                                                                {this.state.imagePosition === i ? (
																	<div className="mt-1 bg-info p-1" />
                                                                ) : (
																	<div
																		style={{ color: "#585858" }}
																		className="text-center"
																	>
                                                                        {i + 1}
																	</div>
                                                                )}
															</div>
                                                        );
                                                    }
                                                })}
											</div>
										</div>
									</div>
								</span>
							</div>
                        )}

						<div className="col-12 mb-5">
							<Card>
								<div className="pb-5">
									<DataTable
										columnContentTypes={[
											"text",
											"text",
											"text",
											"text",
											"text",
											"text"
										]}
										headings={[
											"Image",
											"SKU",
											"Price",
											"Quantity",
											"Weight",
											"unit",
											"Action"
										
										]}
										rows={this.state.rows}
										truncate={true}
									/>
								</div>
							</Card>
						</div>
						{!this.editDisable && (
							<div className="col-12 d-flex justify-content-end">
								<ButtonGroup>
									<Button
										onClick={this.handleSaveAction}
										primary
										disabled={this.state.buttonDisable.save}
									>
										{" "}
										Save{" "}
									</Button>
									<Button
										onClick={this.handleSaveUploadAction}
										disabled={this.state.buttonDisable.save}
									>
										{" "}
										Save & Upload{" "}
									</Button>
									<Button
										onClick={this.handleDiscardAction}
										destructive
										disabled={this.state.buttonDisable.save}
									>
										{" "}
										Discard{" "}
									</Button>
								</ButtonGroup>
							</div>
						)}
					</div>
				</Card>
				<Modal
					title={"Details"}
					open={this.state.openVariantDetail}
					onClose={() => {
						this.setState({ openVariantDetail: false });
					}}
				>
					<Modal.Section>
						<div className="row">
							{Object.keys(this.state.variantArrayDetails).map(e => {
                                if (typeof this.state.variantArrayDetails[e] !== 'string' && typeof this.state.variantArrayDetails[e] !== 'number' && typeof this.state.variantArrayDetails[e] !== 'undefined' ) {
                                    return null;
                                }
								return (
									<div className="col-12 col-sm-6 mb-4">
										{e === "main_image" ? (
											<React.Fragment>
												<b>{e}</b>:<br />
												<Thumbnail
													source={this.state.variantArrayDetails[e]}
													alt={""}
												/>
											</React.Fragment>
										) : (
											<React.Fragment>
												<b>{e}</b>:<br />
												{this.state.variantArrayDetails[e]}
											</React.Fragment>
										)}
									</div>
								);
							})}
						</div>
					</Modal.Section>
				</Modal>
				<Modal
          open={this.state.activemodal}
          onClose={this.handleChangeclose}
          title={<div className="titlemodalchange"><p className="title_header">source_variant_id</p><p id="source_product_idmodal">{this.state.source_variant_idmodal}</p></div>}
          primaryAction={{
            content: "Update",
               onAction: this.handleeditupdate,
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction:this.handleChangeclose,
            },
          ]}
        >
          <Modal.Section>  
            <form encType="multipart/form-data">
            <div className="productmodaldes">
           
            <div className="flexclassdiv">
            <div className="flexunderdiv">
			<label className="modaldatalabel">Brand </label>
            <input value={this.state.Brandmodal} name="typepro" id="Brandmodal"  type="text" onChange={this.handlebrandmodaledit.bind(this)}/>
            </div>
            <div>
             <label className="modaldatalabel">SKU</label>
            <input value={this.state.skumodal} id="skumodal" name="source_marketplacemodal" type="text" readOnly />
            </div>
            </div>
            <div className="flexclassdiv">
            <div className="flexunderdiv">
                <label className="modaldatalabel">Price</label>
            <input value={this.state.pricemodal} name="Vender" id="pricemodal" type="text" onChange={this.handlepriceedit.bind(this)} />
            </div>
             <div>
            <label className="modaldatalabel">Studio </label>
            <input value={this.state.Studiomodal} name="typepro" id="Studiomodal"  type="text" onChange={this.handleStudiomodal.bind(this)}/>
            </div>
            </div>
			<div className="flexclassdiv">
			<div className="imagefixdiv">
		<label className="modaldatalabel">Quantity</label>
            <input value={this.state.quantitymodal} name="typepro" id="quantitymodal"  type="text" onChange={this.handlequantitymodal.bind(this)}/>
			</div>
			<div>
			
			</div>
			
			</div>
             </div>
             </form>
          </Modal.Section>
        </Modal>

			</Page>
			
		);
	}

	handleImageChange = index => {
        console.log(index);
        this.setState({ imagePosition: index });
	};
    pressLeftShift(){
    	if (this.state.imagePosition != 0) {
            this.setState({
                imagePosition: this.state.imagePosition - 1
            })
        }

	}
    pressRightShift = count =>{
        if (this.state.imagePosition < count-1) {
            this.setState({
                imagePosition: this.state.imagePosition + 1
            })
        }
	}

	handleDraftJS = value => {
		let html = draftToHtml(convertToRaw(value.getCurrentContent()));
		let products_top = this.state.products_top;
		products_top.description = html;
		this.setState({ products_top: products_top });
		this.setState({ editorState: value });
		if (this.state.open === 1) {
			this.setState({ open: 2 });
		} else {
			this.setState({ open: 3 });
			let buttonDisable = this.state.buttonDisable;
			buttonDisable.save = false;
			this.setState({ buttonDisable: buttonDisable });
			this.handleProductDataChange("details", "description", 0, html);
			this.handleEditedFieldChange("details", "description", 0, html);
		}
	};

	handleDetailChange = (field, value) => {
		let buttonDisable = this.state.buttonDisable;
		buttonDisable.save = false;
		this.setState({ buttonDisable: buttonDisable });
		this.handleProductDataChange("details", field, 0, value);
		this.handleEditedFieldChange("details", field, 0, value);
		let products_top = this.state.products_top;
		products_top[field] = value;
		this.setState({ products_top: products_top });
	};

	handleVariantsChange = (field, index, value) => {
		this.handleProductDataChange("variants", field, index, value);
		this.handleEditedFieldChange("variants", field, index, value);
		this.setState({ open: 3 });
		let buttonDisable = this.state.buttonDisable;
		buttonDisable.save = false;
		let variants = this.state.variants;
		variants[index][field] = value;
		let rows = this.handleTableChange(variants);
		this.setState({ variants: variants, rows: rows });
	};

	handleProductDataChange = (main_field, field, index, value) => {
		let product_data = this.state.product_data;
		if (main_field === "details") {
			product_data[main_field][field] = value;
		} else {
			product_data[main_field][index][field] = value;
		}
		this.setState({ product_data: product_data });
	};

	handleEditedFieldChange = (main_field, field, index, value) => {
		let edited_fields = this.state.edited_fields;
		let product_data = this.state.product_data;
		if (main_field === "details") {
			if (isUndefined(edited_fields[main_field]))
				edited_fields[main_field] = {};
			edited_fields[main_field][field] = value;
		} else {
			if (isUndefined(edited_fields[main_field]))
				edited_fields[main_field] = {};
			if (isUndefined(edited_fields[main_field][index]))
				edited_fields[main_field][index] = {};
			edited_fields[main_field][index]["source_variant_id"] =
				product_data[main_field][index]["source_variant_id"];
			edited_fields[main_field][index][field] = value;
		}
		this.setState({ edited_fields: edited_fields });
	};

	handleSaveAction = () => {
		let buttonDisable = this.state.buttonDisable;
		buttonDisable.save = true;
		this.setState({ buttonDisable: buttonDisable });
		let data = {
			marketplace: "google",
			product_data: this.state.product_data,
			edited_fields: this.state.edited_fields,
			upload_product: false
		};
		requests.postRequest("connector/product/updateProduct", data).then(e => {
			if (e.success) {
				notify.success(e.message);
			} else {
				notify.error(e.message);
			}
			this.getSingleProductData();
		});
	};

	handleSaveUploadAction = () => {
		let buttonDisable = this.state.buttonDisable;
		buttonDisable.save = true;
		this.setState({ buttonDisable: buttonDisable });
		let data = {
			marketplace: "google",
			product_data: this.state.product_data,
			edited_fields: this.state.edited_fields,
			upload_product: true
		};
		requests.postRequest("connector/product/updateProduct", data).then(e => {
			if (e.success) {
				notify.success(e.message);
			} else {
				notify.error(e.message);
			}
			this.getSingleProductData();
		});
	};

	handleSyncAction = () => {
		let data = {
			marketplace: "shopify",
			product_id: this.state.product_data["details"]["source_product_id"],
			upload_product: true
		};
		requests.postRequest("connector/product/syncWithSource", data).then(e => {
			if (e.success) {
				notify.success(e.message);
			} else {
				notify.error(e.message);
			}
			this.getSingleProductData();
		});
	};

	handleDiscardAction = () => {
		let buttonDisable = this.state.buttonDisable;
		buttonDisable.save = true;
		this.setState({ buttonDisable: buttonDisable });
		this.getSingleProductData();
	};

	redirect = url => {
		if (
			!isUndefined(this.props.location.state) &&
			Object.keys(this.props.location.state).length > 0
		) {
			this.props.history.push(
				url,
				JSON.parse(JSON.stringify(this.props.location.state))
			);
		} else {
			this.props.history.push(url);
		}
	};
}

export default ViewProducts;
