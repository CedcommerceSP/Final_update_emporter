import React, { Component } from "react";
import {
	Select,
	Button,
	Card,
	TextField,
	Banner,
	Label,
	Tooltip,
	Icon
} from "@shopify/polaris";
import { requests } from "../../services/request";
import { notify } from "../../services/notify";
import { json } from "../../environments/static-json";
import { environment } from "../../environments/environment";

class AppsShared extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show_banner: false
		};
		this.getConnectors();
	}

	componentDidMount() {
		if (
			this.props.necessaryInfo !== undefined &&
			Object.keys(this.props.necessaryInfo.credits).length > 0
		) {
			let credits =
				this.props.necessaryInfo.credits.available_credits +
				this.props.necessaryInfo.credits["total_used_credits"];
			if (credits < 11) {
				this.setState({ show_banner: true });
			}
		}
	}

	getConnectors() {
		this.state = {
			apps: [],
			ebay_county_code: "",
			code_usable: []
		};
		requests.getRequest("connector/get/all").then(data => {
			if (data.success) {
				let installedApps = [];
				let code = [];
				for (let i = 0; i < Object.keys(data.data).length; i++) {
					installedApps.push(data.data[Object.keys(data.data)[i]]);
					code.push(data.data[Object.keys(data.data)[i]]["code"]);
				}
				this.props.importerServices(code);
				this.setState({
					apps: installedApps
				});
			} else {
				notify.error(data.message);
			}
		});
	}
	handleChange = (obj, val) => {
		console.log(val, obj);
		this.setState({ [obj]: val });
	};
	render() {
		return (
			<div className="row">
				{this.state.show_banner && (
					<div className="col-12 mb-5">
						<Banner title="Note" status="info">
							<Label id={"trial"}>You can upload 10 products free.</Label>
						</Banner>
					</div>
				)}
				{this.state.apps.map(app => {
					if (this.validateCode(app.code)) {
						return (
							<div
								className="col-12 col-sm-6 mb-4"
								key={this.state.apps.indexOf(app)}
							>
								<Card title={app.title}>
									<div className="row p-5">
										<div className="col-12">
											<img src={app.image} alt={app.title} style={{maxWidth:"100%", height:"160px"}} />
										</div>
										<div className="col-12 mt-4 mb-4">
											<div className="row">
												<div className="col-12 col-sm-6">
													{this.additionalInput(app.code)}
												</div>
												<div className="col-12 col-sm-6">
													<Button
														// disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
														onClick={() => {
															this.installApp(app.code);
														}}
														primary
														fullWidth={true}
													>
														{this.props.success.code === app.code ||
														app["installed"] !== 0
															? "ReConnect"
															: "Connect"}
													</Button>
												</div>
											</div>
										</div>
									</div>
								</Card>
							</div>
						);
					}
				})}
				<input
					type={"hidden"}
					data-toggle="modal"
					data-target="#exampleModal"
					id={"openEtsyHelp"}
				/>

				<div
					className="modal fade"
					id="exampleModal"
					tabIndex="-1"
					role="dialog"
					aria-labelledby="exampleModalLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">
									Etsy Help
								</h5>
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									aria-label="Close"
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<img
									src={require("../../assets/img/etsy_help.png")}
									width={"100%"}
								/>
							</div>
							{/*<div class="modal-footer">*/}
							{/*<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>*/}
							{/*<button type="button" class="btn btn-primary">Save changes</button>*/}
							{/*</div>*/}
						</div>
					</div>
				</div>
			</div>
		);
	}
	validateCode = code => {
		return (
			code === "amazonimporter" ||
			code === "ebayimporter" ||
			code === "walmartimporter" ||
			code === "wishimporter" ||
			code === "etsyimporter" ||
			code === "amazonaffiliate"
		);
	};
	additionalInput = code => {
		if (code === "ebayimporter") {
			return (
				<Select
					options={json.country}
					value={this.state.ebay_county_code}
					onChange={this.handleChange.bind(this, "ebay_county_code")}
					placeholder={"Choose Country"}
					label={""}
				/>
			);
		} else if (code === "etsyimporter") {
			return (
				<TextField
					label={"Shop Name"}
					value={this.state.etsy}
					connectedRight={
						<span
							onClick={() => {
								document.getElementById("openEtsyHelp").click();
							}}
						>
							<Tooltip content={"Help"} light={true}>
								<Icon source="help" color="inkLighter" backdrop={true} />
							</Tooltip>
						</span>
					}
					onChange={this.handleChange.bind(this, "etsy")}
					placeholder={"Etsy Shop Name"}
					labelHidden={true}
				    readOnly={false}
                />
			);
		}
		return null;
	};
	installApp(code) {
		if (code === "ebayimporter")
			if (this.state.ebay_county_code !== "") {
				this.props.redirectResult(code, {
					code: code,
					ebay_site_id: this.state.ebay_county_code
				});
			} else {
				notify.info("Country is not selected");
			}
		else if (code === "etsyimporter") {
			if (this.state.etsy !== undefined && this.state.etsy !== "") {
				this.props.redirectResult(code, {
					code: code,
					shop_name: this.state.etsy
				});
			} else {
				notify.info("Please Provide The Valid Shop Name.");
			}
		} else {
			this.props.redirectResult(code, "");
		}
	}
}

export default AppsShared;
