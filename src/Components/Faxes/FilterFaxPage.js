import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import DatePicker from 'react-datepicker';
import './Faxes.css';

export default class FilterFaxPage extends React.Component {
	render() {
		return (
			<div>
				<Dropdown
					direction="down"
					isOpen={this.props.filterDropdown}
					toggle={this.props.filterToggle}
					id="filter-dropdown"
				>
					<DropdownToggle tag="div">
						<button className="fax-search-button" onClick={this.props.filterToggle}>
							<svg className="apply-icon">
								<use href="telicon-2.2.0.svg#layers--3" />
							</svg>
							Filter
						</button>
					</DropdownToggle>
					<DropdownMenu right>
						<div className="filter-fax">
							<div className="row">
								<div className="col-md-2">Type</div>
								<div className="col-md-10">
									<div className="button-group">
										<div
											className={`choose-btn fax-btn-all ${this.props.allType
												? 'fax-type-btn-active'
												: ''}`}
											onClick={this.props.changeAllType}
										>
											All
										</div>
										<div
											className={`choose-btn fax-btn-all ${this.props.inboundType
												? 'fax-type-btn-active'
												: ''}`}
											onClick={this.props.changeInboundType}
										>
											<svg className="fax-icon-filter mr-2">
												<use href="telicon-2.2.0.svg#arrow-target-down" />
											</svg>
											Inbound
										</div>
										<div
											className={`choose-btn ${this.props.outboundType
												? 'fax-type-btn-active'
												: ''}`}
											onClick={this.props.changeOutboundType}
										>
											<svg className="fax-icon-filter mr-2">
												<use href="telicon-2.2.0.svg#arrow-from-bottom" />
											</svg>
											Outbound
										</div>
									</div>
								</div>
							</div>
							<div className="line-div" />
							<div className="row">
								<div className="col-md-2">Status</div>
								<div className="col-md-10">
									{this.props.allType && (
										<div>
											<div className="row">
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.pendingChk}
														onChange={this.props.changePendingChk}
													/>
													<span className="round-pending-state">Pending</span>
												</div>
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.processingChk}
														onChange={this.props.changeProcessingChk}
													/>
													<span className="round-pending-state">Processing </span>
												</div>
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.failedChk}
														onChange={this.props.changeFailedChk}
													/>
													<span className="round-faild-state">Failed </span>
												</div>
											</div>
											<div className="row mt-2">
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.sentChk}
														onChange={this.props.changeSentChk}
													/>
													<span className="round-send-state">Sent</span>
												</div>
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.receivedChk}
														onChange={this.props.changeReceivedChk}
													/>
													<span className="round-send-state">Received </span>
												</div>
											</div>
										</div>
									)}
									{this.props.inboundType && (
										<div>
											<div className="row">
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.receivedChk}
														onChange={this.props.changeReceivedChk}
													/>
													<span className="round-send-state">Received </span>
												</div>
											</div>
										</div>
									)}
									{this.props.outboundType && (
										<div>
											<div className="row">
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.pendingChk}
														onChange={this.props.changePendingChk}
													/>
													<span className="round-pending-state">Pending</span>
												</div>
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.processingChk}
														onChange={this.props.changeProcessingChk}
													/>
													<span className="round-pending-state">Processing </span>
												</div>
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.failedChk}
														onChange={this.props.changeFailedChk}
													/>
													<span className="round-faild-state">Failed </span>
												</div>
											</div>
											<div className="row mt-2">
												<div className="col-md-4">
													<input
														type="checkbox"
														className="mr-2"
														checked={this.props.sentChk}
														onChange={this.props.changeSentChk}
													/>
													<span className="round-send-state">Sent</span>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="line-div" />
							<div className="row">
								<div className="col-md-2">Date</div>
								<div className="col-md-10">
									<DatePicker
										className="filter-calendar form-control"
										placeholderText="Start"
										onChange={this.props.startDateChange}
										maxDate={this.props.endDate}
										selected={this.props.startDate}
									/>
									<span className="ml-2 mr-2">-</span>
									<DatePicker
										className="filter-calendar form-control"
										placeholderText="End"
										onChange={this.props.endDateChange}
										selected={this.props.endDate}
										minDate={this.props.startDate}
										maxDate={new Date()}
									/>
								</div>
							</div>
							<div className="line-div" />
							<div className="row">
								<div className="col-md-12">
									<div className="button-group1">
										<div className="text-left">
											<button className="cancel-btn text-left" onClick={this.props.resetDefault}>
												Reset to Defaults
											</button>
										</div>
										<div className="text-right button-group1">
											<button className="choose-btn text-right">Clear All</button>
											<button
												className="send-fax-button text-right ml-2"
												onClick={this.props.apply}
											>	Apply
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</DropdownMenu>
				</Dropdown>
			</div>
		);
	}
}
