import React from 'react';
import Topbar from '../Common/Topbar';
import { connect } from 'react-redux';
import './DevicesNumbers.css';
import './circle.css';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getalldevices } from '../../Actions/devices.action';
import i18n from '../Common/i18n';
import _ from 'lodash';

class DevicesNumbers extends React.Component {
	constructor(props) {
		super(props);
		this.viewToday = this.viewToday.bind(this);
		this.viewPastweek = this.viewPastweek.bind(this);
		this.state = {
			callData: '',
			callState: '',
			user_name: ''
		};
	}
	componentDidMount() {
		if (this.props.devicereducer.loading) {
			this.props.getalldevices();
		} else {
			let all_devices_numbers = _.defaults(this.props.devicereducer.all_devices_numbers);
			let numbers = all_devices_numbers.phone_num;
			let user_name = all_devices_numbers.full_name;
			let today_data = _.defaults(all_devices_numbers.total_data).today_data;
			let pastweek_data = _.defaults(all_devices_numbers.total_data).pastweek_data;
			let callData = [];
			let callState = [];
			let phoneNumber, today_count, today_total, pastweek_count, pastweek_total;
			if (numbers) {
				numbers.forEach((element) => {
					if (element.length > 4) {
						phoneNumber = this.getPhoneNumber(element) ? this.getPhoneNumber(element) : element;
						if (today_data.length === 0) {
							today_total = 1;
							today_count = 0;
						} else {
							today_count = 0;
							today_total = today_data.length;
							today_data.forEach((value) => {
								if (
									(value.callee_id_number !== '' &&
										value.caller_id_number !== '' &&
										element.includes(value.callee_id_number)) ||
									element.includes(value.caller_id_number)
								) {
									today_count++;
								}
							});
						}

						if (pastweek_data.length === 0) {
							pastweek_total = 1;
							pastweek_count = 0;
						} else {
							pastweek_count = 0;
							pastweek_total = pastweek_data.length;
							pastweek_data.forEach((value) => {
								if (
									(value.callee_id_number !== '' &&
										value.caller_id_number !== '' &&
										element.includes(value.callee_id_number)) ||
									element.includes(value.caller_id_number)
								) {
									pastweek_count++;
								}
							});
						}

						callData.push({ phoneNumber, today_count, today_total, pastweek_count, pastweek_total });
						callState.push({ phone: phoneNumber, today: true, week: false });
						this.setState({ callData: callData });
						this.setState({ callState: callState });
						this.setState({ user_name: user_name });
					}
				});
			}
		}
	}
	componentDidUpdate(preProps) {
		let all_devices_numbers = _.defaults(this.props.devicereducer.all_devices_numbers);
		if (all_devices_numbers !== _.defaults(preProps.devicereducer.all_devices_numbers)) {
			let numbers = all_devices_numbers.phone_num;
			let user_name = all_devices_numbers.full_name;
			let today_data = _.defaults(all_devices_numbers.total_data).today_data;
			let pastweek_data = _.defaults(all_devices_numbers.total_data).pastweek_data;
			let callData = [];
			let callState = [];
			let phoneNumber, today_count, today_total, pastweek_count, pastweek_total;
			if (numbers) {
				numbers.forEach((element) => {
					if (element.length > 4) {
						phoneNumber = this.getPhoneNumber(element) ? this.getPhoneNumber(element) : element;
						if (today_data.length === 0) {
							today_total = 1;
							today_count = 0;
						} else {
							today_count = 0;
							today_total = today_data.length;
							today_data.forEach((value) => {
								if (
									(value.callee_id_number !== '' &&
										value.caller_id_number !== '' &&
										element.includes(value.callee_id_number)) ||
									element.includes(value.caller_id_number)
								) {
									today_count++;
								}
							});
						}

						if (pastweek_data.length === 0) {
							pastweek_total = 1;
							pastweek_count = 0;
						} else {
							pastweek_count = 0;
							pastweek_total = pastweek_data.length;
							pastweek_data.forEach((value) => {
								if (
									(value.callee_id_number !== '' &&
										value.caller_id_number !== '' &&
										element.includes(value.callee_id_number)) ||
									element.includes(value.caller_id_number)
								) {
									pastweek_count++;
								}
							});
						}

						callData.push({ phoneNumber, today_count, today_total, pastweek_count, pastweek_total });
						callState.push({ phone: phoneNumber, today: true, week: false });
						this.setState({ callData: callData });
						this.setState({ callState: callState });
						this.setState({ user_name: user_name });
					}
				});
			}
		}
	}
	getPhoneNumber = (number) => {
		let phone_number = '';
		var phoneNumber;
		if (!number.includes('+')) {
			if (number.length === 11) {
				phone_number = parsePhoneNumber('+' + number);
				let phone_num = phone_number.formatInternational();
				let number_arr = phone_num.split(' ');
				phoneNumber = number_arr[0] + ' ' + number_arr[1] + '-' + number_arr[2] + '-' + number_arr[3];
				return phoneNumber;
			} else if (number.length === 10) {
				phone_number = parsePhoneNumber('+1' + number);
				let phone_num = phone_number.formatInternational();
				let number_arr = phone_num.split(' ');
				phoneNumber = number_arr[0] + ' ' + number_arr[1] + '-' + number_arr[2] + '-' + number_arr[3];
				return phoneNumber;
			} else {
				return number;
			}
		} else {
			phone_number = parsePhoneNumber(number);
			let phone_num = phone_number.formatInternational();
			let number_arr = phone_num.split(' ');
			phoneNumber = number_arr[0] + ' ' + number_arr[1] + '-' + number_arr[2] + '-' + number_arr[3];
			return phoneNumber;
		}
	};

	viewToday = (value) => {
		if (this.state.callState) {
			let data = [];
			this.state.callState.forEach((element, index) => {
				if (value === element.phone) {
					data.push({ phone: value, today: true, week: false });
				} else {
					data.push({ phone: element.phone, today: element.today, week: element.week });
				}
			});
			this.setState({ callState: data });
		}
	};
	viewPastweek = (value) => {
		if (this.state.callState) {
			let data = [];
			this.state.callState.forEach((element, index) => {
				if (value === element.phone) {
					data.push({ phone: value, today: false, week: true });
				} else {
					data.push({ phone: element.phone, today: element.today, week: element.week });
				}
			});
			this.setState({ callState: data });
		}
	};
	render() {
		let all_devices_numbers = _.defaults(this.props.devicereducer.all_devices_numbers);
		let devices = all_devices_numbers.alldevices;
		let { lng } = this.props.language;
		let { systemmessage } = this.props.systemmessage;
		if (systemmessage === 'Authentication failed.') {
			window.location.reload();
		}
		return (
			<div className="num_device">
				{this.props.devicereducer.loading && (
					<div className="loader_container">
						<div className="loader" />
					</div>
				)}
				<Topbar
					title={i18n.t('devices.label', { lng }) + ' ' + i18n.t('numbers.label', { lng })}
					user_name={this.state.user_name}
				/>
				<div className="main-container">
					<div className="row">
						<div className="col-md-12 text-left">
							<div className="content">{i18n.t('devices.label', { lng })}</div>
							<div className="row">
								{devices &&
									devices.map((device, index) => {
										return (
											<div className="col-md-3" key={index}>
												<div
													className={`device-box ${!device.regsiter
														? 'devices-top-wrap-red'
														: ''}`}
													key={index}
												>
													{device.device_type === 'sip_device' && (
														<div>
															<svg
																className={`corner corner-icon ${device.regsiter
																	? 'color-green'
																	: 'color-red'}`}
															>
																<use href="telicon-2.2.0.svg#device-voip-phone" />
															</svg>
															<img src="desk.png" alt="device" />
														</div>
													)}
													{device.device_type === 'cellphone' && (
														<div>
															<svg
																className={`corner corner-icon ${device.regsiter
																	? 'color-green'
																	: 'color-red'}`}
															>
																<use href="telicon-2.2.0.svg#device-mobile" />
															</svg>
															<img src="cell.png" alt="device" />
														</div>
													)}
													{device.device_type === 'softphone' && (
														<div>
															<svg
																className={`corner corner-icon ${device.regsiter
																	? 'color-green'
																	: 'color-red'}`}
															>
																<use href="telicon-2.2.0.svg#device-soft-phone" />
															</svg>
															<img src="device-soft.png" alt="device" />
														</div>
													)}
													{device.device_type === 'application' && (
														<div>
															<svg
																className={`corner corner-icon ${device.regsiter
																	? 'color-green'
																	: 'color-red'}`}
															>
																<use href="telicon-2.2.0.svg#device-sprint-phone" />
															</svg>
															<img src="application.png" alt="device" />
														</div>
													)}
													<div className="mt-2 name">{device.name}</div>
													<div className="number">{device.mac_address}</div>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 text-left">
							<div className="content">{i18n.t('numbers.label', { lng })}</div>
							<div className="row">
								{this.state.callData &&
									this.state.callData.map((element, index) => {
										return (
											<div className="col-md-3" key={index}>
												<div className="devices-top">
													{element.phoneNumber}{' '}
													<img src="usa.png" className="ml-1" alt="flag" />
													<p className="mt-3 num-title">
														{element.phoneNumber === this.state.callState[index].phone &&
														this.state.callState[index].today ? (
															<span
																className="mr-3 active_line"
																onClick={() => this.viewToday(index)}
															>
																{i18n.t('today.label', { lng })}
															</span>
														) : (
															<span
																className="mr-3"
																onClick={() => this.viewToday(element.phoneNumber)}
															>
																{i18n.t('today.label', { lng })}
															</span>
														)}
														{element.phoneNumber === this.state.callState[index].phone &&
														this.state.callState[index].week ? (
															<span
																className="active_line"
																onClick={() => this.viewPastweek(index)}
															>
																{i18n.t('past_week.label', { lng })}
															</span>
														) : (
															<span
																className=""
																onClick={() => this.viewPastweek(element.phoneNumber)}
															>
																{i18n.t('past_week.label', { lng })}
															</span>
														)}
													</p>
													<hr />
													{element.phoneNumber === this.state.callState[index].phone &&
													this.state.callState[index].today ? (
														<div className="row">
															<div className="col-md-6 text-right">
																<div className="numbers-wrap">
																	<h2 className="mt-3">
																		{Math.round(element.today_count * 100 / element.today_total)}%
																	</h2>
																	<span className="number mb-5">
																		{i18n.t('all.label', { lng }) +
																			' ' +
																			i18n.t('callcount.label', { lng })}
																	</span>
																</div>
															</div>
															<div className="col-md-6 text-left">
																<div className="donut">
																	<div
																		className={`c100 p${Math.round(
																			element.today_count *
																				100 /
																				element.today_total
																		)}`}
																	>
																		<div className="slice">
																			<div className="bar" />
																			<div className="fill" />
																		</div>
																	</div>
																</div>
															</div>
														</div>
													) : element.phoneNumber === this.state.callState[index].phone &&
													this.state.callState[index].week ? (
														<div className="row">
															<div className="col-md-6 text-right">
																<div className="numbers-wrap">
																	<h2 className="mt-3">
																		{Math.round(element.pastweek_count * 100 / element.pastweek_total)}%
																	</h2>
																	<span className="number mb-5">
																		{i18n.t('all.label', { lng }) +
																			' ' +
																			i18n.t('callcount.label', { lng })}
																	</span>
																</div>
															</div>
															<div className="col-md-6 text-left">
																<div className="donut">
																	<div
																		className={`c100 p${Math.round(
																			element.pastweek_count *
																				100 /
																				element.pastweek_total
																		)}`}
																	>
																		<div className="slice">
																			<div className="bar" />
																			<div className="fill" />
																		</div>
																	</div>
																</div>
															</div>
														</div>
													) : (
														''
													)}
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	devicereducer: state.devicereducer,
	language: state.language,
	systemmessage: state.systemmessage
});
const mapDispatchToProps = (dispatch) => ({
	getalldevices: () => dispatch(getalldevices())
});

export default connect(mapStateToProps, mapDispatchToProps)(DevicesNumbers);
