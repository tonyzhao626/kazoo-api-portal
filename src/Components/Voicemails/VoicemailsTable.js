import React from 'react';
import './VoicemailsTable.css';
import Audioplayer from './Audioplayer';
import axios from 'axios';
import { parsePhoneNumber } from 'libphonenumber-js';
import CONFIG from '../../Config.json';
import i18n from '../Common/i18n';
import moment from 'moment';

const Message = (props) => {
	let checkMail = props.checkVoiceMail;
	let from = props.from;
	let to = props.to;
	let vmbox_id = props.vmbox_id;
	let media_id = props.media_id;
	let auth_token = props.auth_token;
	let lng = props.lng;
	let account_id = localStorage.getItem('account_id');
	let URL = `${CONFIG.API_URL}/accounts/${account_id}/vmboxes/${vmbox_id}/messages/${media_id}/raw?auth_token=${auth_token}`;
	return (
		<div
			className={`voicemail-row
                      ${props.playStatus.audioPlay && props.audioId !== props.playStatus.audioId
							? 'disabledbutton'
							: ''}
                      ${props.playStatus.audioPlay && props.audioId === props.playStatus.audioId
							? 'voicemail-row-active'
							: ''}`}
		>
			<div className="col-md-2 row">
				<div className="col-md-3">
					{checkMail &&
						checkMail.map((mail, index) => {
							if (media_id === mail.media_id) {
								return (
									<input
										key={index}
										type="checkbox"
										className="checkbox"
										checked={mail.state}
										onChange={() => props.checkboxChange(media_id)}
									/>
								);
							}
							return true;
						})}
				</div>
				<div className="col-md-9">
					{props.folder === 'new' ? (
						<span className="newstatus">{i18n.t('new.label', { lng })}</span>
					) : props.folder === 'saved' ? (
						<span className="listenedstatus">{i18n.t('listened.label', { lng })}</span>
					) : props.folder === 'deleted' ? (
						<span className="deletedstatus">{i18n.t('deleted.label', { lng })}</span>
					) : (
						''
					)}
				</div>
			</div>
			<div className="col-md-2">
				<div className="name text-left">{getDateTime(props.timestamp).date}</div>
				<div className="number text-left">{getDateTime(props.timestamp).time}</div>
			</div>
			<div className="col-md-2">
				<div className="name text-left">{props.caller_id_name}</div>
				<div className="number text-left">{getPhoneNumber(from.split('@')[0])}</div>
			</div>
			<div className="col-md-2">
				<div className="name text-left"> {getPhoneNumber(to.split('@')[0])}</div>
			</div>
			<div className="col-md-4">
				{props.playStatus.audioPlay && props.audioId === props.playStatus.audioId ? (
					<div className="row">
						<div className="col-md-10">
							<Audioplayer props={props} />
						</div>
						<div className="col-md-2">
							<button
								className="audio-close"
								onClick={() => props.audioPlayerEnd(props.audioId, vmbox_id, media_id, props.folder)}
							>
								{i18n.t('close.label', { lng })}
							</button>
						</div>
					</div>
				) : (
					<div className="row">
						<div className="col-md-6">
							<div className="name text-left"> {getDuration(props.length / 1000)}</div>
						</div>
						<div className="col-md-6">
							<div className="text-right pr-2">
								<svg
									className="fax-icon audioplay mr-3"
									onClick={() => props.audioPlayer(props.audioId)}
								>
									<use href="telicon-2.2.0.svg#play--circle" />
								</svg>
								<a href={URL}>
									<svg className="fax-icon">
										<use href="telicon-2.2.0.svg#download-cloud" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

function getDateTime(timestamp) {
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
}

function getDuration(totalSeconds) {
	let hours = Math.floor(totalSeconds / 3600);
	let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
	let seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60);
	seconds = Math.round(seconds * 100) / 100;

	let result = '';
	if (hours !== 0) {
		result += (hours < 10 ? '0' + hours : hours) + ':';
	}
	result += (minutes < 10 ? '0' + minutes : minutes) + ':';
	result += seconds < 10 ? '0' + seconds : seconds;

	return result;
}
function getPhoneNumber(number) {
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
}

class VoicemailsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allmessages: [],
			audioPlay: false,
			audioId: '',
			checkKey: '',
			checkState: false,
			messageRecords: ''
		};
		this.audioPlayer = this.audioPlayer.bind(this);
		this.audioPlayerEnd = this.audioPlayerEnd.bind(this);
		this.filtermailList = this.filtermailList.bind(this);
		this.getPhoneNumber = this.getPhoneNumber.bind(this);
	}

	componentDidUpdate(preProps) {
		const { allmessages } = this.props;
		if (allmessages !== preProps.allmessages) {
			let perPage = this.props.perPage;
			let currentPage = this.props.currentPage;
			let messageRecords = this.filtermailList(allmessages, perPage, currentPage);
			this.setState({ messageRecords: messageRecords });
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
	filtermailList = (messageRecords, perPage, currentPage, search) => {
		let subMessageRecords = [];
		if (messageRecords && messageRecords.length > 0) {
			for (var index = perPage * currentPage; index < perPage * (currentPage + 1); index++) {
				if (messageRecords[index]) {
					if (!search) {
						subMessageRecords.push(messageRecords[index]);
					} else {
						let searchKey = search.trim();
						let from = this.getPhoneNumber(messageRecords[index].from.split('@')[0]);
						let to = this.getPhoneNumber(messageRecords[index].to.split('@')[0]);
						if (
							from.includes(searchKey) ||
							to.includes(searchKey) ||
							messageRecords[index].caller_id_name.includes(searchKey)
						)
							subMessageRecords.push(messageRecords[index]);
					}
				}
			}
		}
		return subMessageRecords;
	};
	audioPlayer(key) {
		this.setState({
			audioId: key,
			audioPlay: !this.state.audioPlay
		});
	}
	audioPlayerEnd(key, vmbox_id, media_id, state) {
		let account_id = localStorage.getItem('account_id');
		if (state === 'new') {
			let url = `${CONFIG.API_URL}/accounts/${account_id}/vmboxes/${vmbox_id}/messages/${media_id}`;
			axios
				.post(url)
				.then((res) => {
					this.props.getallnotification();
				})
				.catch((error) => {
					console.log(error);
				});
		}
		this.setState({
			audioId: key,
			audioPlay: !this.state.audioPlay
		});
	}

	render() {
		const { allmessages } = this.props;
		let lng = this.props.lng;
		let perPage = this.props.perPage;
		let currentPage = this.props.currentPage;
		let searchKey = this.props.searchKey;
		let messageRecords = this.filtermailList(allmessages, perPage, currentPage, searchKey);
		return (
			<div className="row text-left">
				<div className="voicemailtable">
					<div className="row1 mb-2">
						<div className="col-md-2 row">
							<div className="col-md-3"> </div>
							<div className="col-md-6">{i18n.t('status.label', { lng })}</div>
						</div>
						<div className="col-md-2">{i18n.t('date_time.label', { lng })}</div>
						<div className="col-md-2">{i18n.t('from.label', { lng })}</div>
						<div className="col-md-2">{i18n.t('to.label', { lng })}</div>
						<div className="col-md-2">{i18n.t('duration.label', { lng })}</div>
						<div className="col-md-2" />
					</div>
					{messageRecords && messageRecords.length > 0 ? (
						messageRecords.map((message, index) => (
							<Message
								audioPlayer={this.audioPlayer}
								audioPlayerEnd={this.audioPlayerEnd}
								auth_token={this.props.auth_token}
								itemState={this.props.itemState}
								checkboxChange={this.props.checkboxChange}
								vmbox_id={this.props.vmbox_id}
								playStatus={this.state}
								audioId={message.media_id}
								key={index}
								{...message}
								checkVoiceMail={this.props.checkVoiceMail}
								lng={lng}
							/>
						))
					) : (
						<div className="col-md-12 text-center">
							<h2>{i18n.t('no.label', { lng }) + ' ' + i18n.t('results.label', { lng })}!</h2>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default VoicemailsTable;
