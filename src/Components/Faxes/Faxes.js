import React from 'react';
import './Faxes.css';
import CONFIG from '../../Config.json';
import { parsePhoneNumber } from 'libphonenumber-js';
import i18n from '../Common/i18n';
import moment from 'moment';
import _ from 'lodash';

export class Faxes extends React.Component {
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

	render() {
		let lng = this.props.lng;
		let faxesdata = _.orderBy(
			[ ...this.props.faxes_inbox_data, ...this.props.faxes_outbox_data ],
			'created',
			'desc'
		);
		return (
			<div id="call-history" className="text-left faxes-box">
				<div className="fax-title">
					<span className="call-view-all" onClick={() => this.props.history.push('/faxes')}>
						{i18n.t('faxes.label', { lng })}
					</span>
				</div>
				<div className="rencent-faxes">
					<table className="none-border table-striped">
						<thead className="calltable-thead">
							<tr>
								<th width="37%">{i18n.t('from.label', { lng })}</th>
								<th width="33%">{i18n.t('to.label', { lng })}</th>
								<th width="26%">{i18n.t('date_time.label', { lng })}</th>
								<th width="4%" className="text-right" />
							</tr>
						</thead>
						<tbody>
							{faxesdata &&
								faxesdata.map((fax, index) => {
									let account_id = localStorage.getItem('account_id');
									let URL = `${CONFIG.API_URL}/accounts/${account_id}/faxes/${fax.folder}/${fax.id}/attachment?auth_token=${this.props.auth_token}`;
									if (fax.folder === 'inbox') {
										return (
											<tr key={index}>
												<td className="first-child ml-3">
													<svg className="fax-icon">
														<use href="telicon-2.2.0.svg#download" />
													</svg>
													<div className="ml-3">
														<div className="name text-left">{fax.from}</div>
														<div className="number text-left">
															{this.getPhoneNumber(fax.from_number)}
														</div>
													</div>
												</td>
												<td>
													<div className="name text-left">
														{this.props.faxbox.caller_name}
													</div>
													<div className="number text-left">
														{this.props.faxbox.faxbox_name}
													</div>
												</td>
												<td>
													<div className="name text-left">
														{this.getDateTime(fax.created).date}
													</div>
													<div className="number text-left">
														{this.getDateTime(fax.created).time}
													</div>
												</td>
												<td className="text-right">
													<a href={URL}>
														<svg className="fax-icon">
															<use href="telicon-2.2.0.svg#download-cloud" />
														</svg>
													</a>
												</td>
											</tr>
										);
									}
									if (fax.folder === 'outbox') {
										return (
											<tr key={index}>
												<td className="first-child ml-3">
													<svg className="fax-icon">
														<use href="telicon-2.2.0.svg#upload" />
													</svg>
													<div className="ml-3">
														<div className="name text-left">
															{this.props.faxbox.caller_name}
														</div>
														<div className="number text-left">
															{this.props.faxbox.faxbox_name}
														</div>
													</div>
												</td>
												<td>
													<div className="name text-left">{fax.to_name}</div>
													<div className="number text-left">
														{this.getPhoneNumber(fax.to_number)}
													</div>
												</td>
												<td>
													<div className="name text-left">
														{this.getDateTime(fax.created).date}
													</div>
													<div className="number text-left">
														{this.getDateTime(fax.created).time}
													</div>
												</td>
												<td className="text-right">
													<a href={URL}>
														<svg className="fax-icon">
															<use href="telicon-2.2.0.svg#download-cloud" />
														</svg>
													</a>
												</td>
											</tr>
										);
									}
									return true;
								})}
							{faxesdata.length < 1 && (
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
