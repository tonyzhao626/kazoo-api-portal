import React from 'react';
import { parsePhoneNumber } from 'libphonenumber-js';
import i18n from '../Common/i18n';
import moment from 'moment';
export default class CallHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: 0,
			end: 0
		};
	}
	getPhoneNumber = (number) => {
		let phone_number = '';
		var phoneNumber;
		let convertNumber = Number(number);
		if (Number.isInteger(convertNumber)) {
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
		} else {
			return number;
		}
	};

	getDateTime = (timestamp) => {
		let stamp = new Date(timestamp * 1000);
		let year = stamp.getFullYear() - 1970;
		let month = stamp.getUTCMonth() + 1;
		let date = '0' + stamp.getUTCDate();
		let hours = '0' + stamp.getUTCHours();
		let minutes = '0' + stamp.getUTCMinutes();
		let seconds = '0' + stamp.getUTCSeconds();
		let formattedDate = year + '-' + month + '-' + date.substr(-2);
		let formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		let dateTime1 = formattedDate + ' ' + formattedTime;
		let gmtDateTime = moment.utc(dateTime1, 'YYYY-MM-DD HH:mm:ss');
		let local = gmtDateTime.local().format('MM/DD/YYYY HH:mm:ss');
		let dateTime = { date: local.split(' ')[0], time: local.split(' ')[1] };
		return dateTime;
	};

	formatDuration = (sec) => {
		var date = new Date(null);
		date.setSeconds(sec);
		var timeString = date.toISOString().substr(11, 8);
		timeString = timeString.split(':')[1] + ':' + timeString.split(':')[2];
		return timeString;
	};

	render() {
		let lng = this.props.lng;
		return (
			<div id="call-history" className="text-left missed-call-box">
				<div className="call-title">
					<span className="call-view-all" onClick={() => this.props.history.push('/history')}>
						{i18n.t('recent.label', { lng })} {i18n.t('calls.label', { lng })}
					</span>
				</div>
				<div className="recent-calls">
					<table className="none-border table-striped">
						<thead className="calltable-thead pb-2">
							<tr>
								<th width="30%" className="pl-2">
									{i18n.t('from.label', { lng })}
								</th>
								<th width="27%">{i18n.t('to.label', { lng })}</th>
								<th width="27%">{i18n.t('date_time.label', { lng })}</th>
								<th width="20%" className="text-right">
									{i18n.t('duration.label', { lng })}
								</th>
							</tr>
						</thead>
						<tbody>
							{this.props.calldata && this.props.calldata.length > 0 ? (
								this.props.calldata.map((call, index) => {
									while (index < 10) {
										return (
											<tr key={index}>
												<td className="first-child">
													<div className="call-icon ml-2">
														{call.direction === 'inbound' ? (
															<svg className="calls-icon">
																<use href="telicon-2.2.0.svg#phone-outbound" />
															</svg>
														) : call.hangup_cause !== 'NO_ANSWER' ? (
															<svg className="calls-icon">
																<use href="telicon-2.2.0.svg#phone-inbound" />
															</svg>
														) : (
															<svg className="missed-icon">
																<use href="telicon-2.2.0.svg#phone-missed" />
															</svg>
														)}
													</div>
													<div className="ml-3">
														<div className="name text-left">{call.caller_id_name}</div>
														<div className="number text-left">
															{this.getPhoneNumber(call.caller_id_number)}
														</div>
													</div>
												</td>
												<td>
													<div className="name text-left">{call.callee_id_name}</div>
													<div className="number text-left">
														{call.callee_id_number ? this.getPhoneNumber(call.callee_id_number):this.getPhoneNumber(call.dialed_number)}
													</div>
												</td>
												<td>
													<div className="name text-left">
														{this.getDateTime(call.timestamp).date}
													</div>
													<div className="number text-left">
														{this.getDateTime(call.timestamp).time}
													</div>
												</td>
												<td className="duration text-right pl-2">
													{this.formatDuration(call.duration_seconds)}
												</td>
											</tr>
										);
									}
									return true;
								})
							) : (
								<tr className="text-center">
									<td colSpan="7">
										<h2>{i18n.t('no.label', { lng }) + ' ' + i18n.t('results.label', { lng })}!</h2>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
