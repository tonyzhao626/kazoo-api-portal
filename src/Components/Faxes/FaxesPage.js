import React from 'react';
import { connect } from 'react-redux';
import Topbar from '../Common/Topbar';
import { getallfaxes } from '../../Actions/faxes.action';
import SendFaxPage from './SendFaxPage';
import FilterFaxPage from './FilterFaxPage';
import { Modal } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip } from 'reactstrap';
import { parsePhoneNumber } from 'libphonenumber-js';
import 'react-datepicker/dist/react-datepicker.css';
import CONFIG from '../../Config.json';
import i18n from '../Common/i18n';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Faxes.css';
import _ from 'lodash';
import axios from 'axios';
import Websocket from 'react-websocket';

class FaxesPage extends React.Component {
	constructor(props) {
		super(props);
		const day = new Date();
		this.state = {
			startDate: new Date(day.setDate(day.getDate() - 7)),
			endDate: new Date(),
			faxbox_name: '',
			newcount: 0,
			faxbox_id: '',
			caller_name: '',
			faxes: '',
			searchKey: '',
			view: 0,
			perPage: 10,
			currentPage: 0,
			user_name: '',
			dropdownOpen1: false,
			checkKey: '',
			itemView: false,
			faxesState: null,
			makeCheckedFax: null,
			sendFaxModalShow: false,
			filterDropdown: false,
			pendingChk: true,
			processingChk: true,
			failedChk: true,
			sentChk: true,
			receivedChk: true,
			allType: true,
			inboundType: false,
			outboundType: false,
			pendingItem: false,
			processingItem: false,
			failedItem: false,
			sentItem: false,
			receivedItem: false,
			resendFaxTooltip: false,
			trashFaxTooltip: false
		};
		this.total = 0;
	}

	componentWillMount() {
		this.props.getallfaxes(this.state.startDate, this.state.endDate);
	}
	componentDidUpdate(preProps) {
		const { allfaxes } = this.props.faxreducer;
		if (allfaxes !== preProps.faxreducer.allfaxes) {
			let faxbox_name = allfaxes.faxbox.faxbox_name;
			let faxbox_id = allfaxes.faxbox.faxbox_id;
			let caller_name = allfaxes.faxbox.caller_name;
			let faxesArray = _.orderBy(
				[ ...allfaxes.faxes_inbox_data, ...allfaxes.faxes_outbox_data ],
				'created',
				'desc'
			);
			let user_name = allfaxes.full_name;
			this.setState(
				{
					faxbox_name: faxbox_name,
					faxbox_id: faxbox_id,
					faxes: faxesArray,
					caller_name: caller_name,
					user_name: user_name
				},
				() => {
					this.checkFaxes(this.state.faxes);
				}
			);
		}

	}
	resendFaxTooltip = () => {
		this.setState({
			resendFaxTooltip: !this.state.resendFaxTooltip
		});
	};
	trashFaxTooltip = () => {
		this.setState({
			trashFaxTooltip: !this.state.trashFaxTooltip
		});
	};
	toggle1 = () => {
		this.setState({
			dropdownOpen1: !this.state.dropdownOpen1
		});
	};

	filterToggle = () => {
		this.setState({
			filterDropdown: !this.state.filterDropdown
		});
	};

	startDateChange = (date) => {
		this.setState(
			{
				startDate: date
			},
			() => {
				var dateDiff = parseInt(
					(this.state.endDate.getTime() - this.state.startDate.getTime()) / (24 * 3600 * 1000),
					10
				);
				if (dateDiff > 30) {
					this.setState({
						endDate: new Date(this.state.startDate.getTime() + 30 * 24 * 3600 * 1000)
					});
				}
			}
		);
	};

	endDateChange = (date) => {
		this.setState(
			{
				endDate: date
			},
			() => {
				var dateDiff = parseInt(
					(this.state.endDate.getTime() - this.state.startDate.getTime()) / (24 * 3600 * 1000),
					10
				);
				if (dateDiff > 30) {
					this.setState({
						startDate: new Date(this.state.endDate.getTime() - 30 * 24 * 3600 * 1000)
					});
				}
			}
		);
	};

	apply = () => {
		this.props.getallfaxes(this.state.startDate, this.state.endDate);
	};

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

	onhandleChange = (e) => {
		var value = e.target.value;
		this.setState({ searchKey: value });
	};

	selectPerPage = (e) => {
		this.setState({ perPage: e.target.value });
	};

	setCountLabel = (total) => {
		if (this.state.perPage * (this.state.currentPage + 1) < total)
			return this.state.perPage * (this.state.currentPage + 1);
		else return total;
	};

	prev = () => {
		let tmp = this.state.currentPage;
		this.setState({
			currentPage: tmp - 1
		});
	};

	next = () => {
		let tmp = this.state.currentPage;
		this.setState({
			currentPage: tmp + 1
		});
	};

	filtermailList = (faxes, perPage, currentPage, search) => {
		let subfaxesRecords = [];
		if (faxes && faxes.length > 0) {
			let allfaxes = faxes.filter(
				(fax) =>
					this.state.allType
						? (this.state.pendingChk ? fax.status === 'pending' : '') ||
							(this.state.processingChk ? fax.status === 'processing' : '') ||
							(this.state.failedChk ? fax.status === 'failed' : '') ||
							(this.state.sentChk ? fax.status === 'completed' : '') ||
							(this.state.receivedChk ? fax.folder === 'inbox' : '')
						: this.state.inboundType
							? this.state.receivedChk ? fax.folder === 'inbox' : ''
							: (this.state.pendingChk ? fax.status === 'pending' : '') ||
								(this.state.processingChk ? fax.status === 'processing' : '') ||
								(this.state.failedChk ? fax.status === 'failed' : '') ||
								(this.state.sentChk ? fax.status === 'completed' : '')
			);

			this.total = allfaxes.length;

			for (var index = perPage * currentPage; index < perPage * (currentPage + 1); index++) {
				if (allfaxes[index]) {
					if (!search) {
						subfaxesRecords.push(allfaxes[index]);
					} else {
						let search_Key = search.toLowerCase().trim();
						var caller = this.state.caller_name.toLowerCase();
						var phoneNumber = this.getPhoneNumber(allfaxes[index].from_number).trim();
						if (
							allfaxes[index].from.includes(search_Key) ||
							caller.includes(search_Key) ||
							phoneNumber.includes(search_Key)
						)
							subfaxesRecords.push(allfaxes[index]);
					}
				}
			}
		}
		return subfaxesRecords;
	};

	pendingItem = () => {
		this.setState(
			{
				pendingItem: true,
				processingItem: false,
				failedItem: false,
				sentItem: false,
				receivedItem: false,
				checkKey: ''
			},
			() => {
				this.checkFaxes(this.state.faxes);
			}
		);
	};

	processingItem = () => {
		this.setState(
			{
				pendingItem: false,
				processingItem: true,
				failedItem: false,
				sentItem: false,
				receivedItem: false,
				checkKey: ''
			},
			() => {
				this.checkFaxes();
			}
		);
	};

	failedItem = () => {
		this.setState(
			{
				pendingItem: false,
				processingItem: false,
				failedItem: true,
				sentItem: false,
				receivedItem: false,
				checkKey: ''
			},
			() => {
				this.checkFaxes();
			}
		);
	};

	sentItem = () => {
		this.setState(
			{
				pendingItem: false,
				processingItem: false,
				failedItem: false,
				sentItem: true,
				receivedItem: false,
				checkKey: ''
			},
			() => {
				this.checkFaxes();
			}
		);
	};

	receivedItem = () => {
		this.setState(
			{
				pendingItem: false,
				processingItem: false,
				failedItem: false,
				sentItem: false,
				receivedItem: true,
				checkKey: ''
			},
			() => {
				this.checkFaxes();
			}
		);
	};

	checkFaxes = () => {
		let faxesState = [];
		if (this.state.faxes) {
			this.state.faxes.forEach((fax) => {
				if (
					!this.state.pendingItem &&
					!this.state.processingItem &&
					!this.state.failedItem &&
					!this.state.sentItem &&
					!this.state.receivedItem
				) {
					faxesState.push({ id: fax.id, state: false, folder: fax.folder });
				}
				if (this.state.pendingItem) {
					if (fax.status === 'pending') {
						faxesState.push({ id: fax.id, state: true, folder: fax.folder });
					} else {
						faxesState.push({ id: fax.id, state: false, folder: fax.folder });
					}
				}
				if (this.state.processingItem) {
					if (fax.status === 'processing') {
						faxesState.push({ id: fax.id, state: true, folder: fax.folder });
					} else {
						faxesState.push({ id: fax.id, state: false, folder: fax.folder });
					}
				}
				if (this.state.failedItem) {
					if (fax.status === 'failed') {
						faxesState.push({ id: fax.id, state: true, folder: fax.folder });
					} else {
						faxesState.push({ id: fax.id, state: false, folder: fax.folder });
					}
				}
				if (this.state.sentItem) {
					if (fax.status === 'completed') {
						faxesState.push({ id: fax.id, state: true, folder: fax.folder });
					} else {
						faxesState.push({ id: fax.id, state: false, folder: fax.folder });
					}
				}
				if (this.state.receivedItem) {
					if (fax.folder === 'inbox') {
						faxesState.push({ id: fax.id, state: true, folder: fax.folder });
					} else {
						faxesState.push({ id: fax.id, state: false, folder: fax.folder });
					}
				}
			});
		}
		this.setState({ faxesState: faxesState }, () => {
			this.setCheckedFax();
		});
	};

	faxStateChange = () => {
		let checkedFaxes = [];
		if (this.state.faxesState) {
			this.state.faxesState.forEach((fax) => {
				if (fax.id === this.state.checkKey) {
					checkedFaxes.push({ id: fax.id, state: !fax.state, folder: fax.folder });
				} else {
					checkedFaxes.push({ id: fax.id, state: fax.state, folder: fax.folder });
				}
			});
		}
		return checkedFaxes;
	};

	checkboxChange = (key) => {
		this.setState(
			{
				checkKey: key
			},
			() => {
				this.setState({ faxesState: this.faxStateChange() }, () => {
					this.setCheckedFax();
				});
			}
		);
	};

	setCheckedFax = () => {
		let makeCheckedFax = [];
		this.state.faxesState &&
			this.state.faxesState.forEach((checkedFax) => {
				if (checkedFax.state) {
					makeCheckedFax.push(checkedFax);
				}
			});
		this.setState({ makeCheckedFax: makeCheckedFax, itemView: makeCheckedFax.length > 0 ? true : false });
	};

	deleteFax = () => {
		let account_id = localStorage.getItem('account_id');
		if (this.state.makeCheckedFax && this.state.makeCheckedFax.length > 0) {
			this.state.makeCheckedFax.forEach((deleteFax) => {
				let URL = `${CONFIG.API_URL}/accounts/${account_id}/faxes/${deleteFax.folder}/${deleteFax.id}`;
				axios
					.delete(URL)
					.then((res) => {
						this.apply();
						setTimeout(() => {
							this.props.history.push('/faxes');
						}, 2000);
					})
					.catch((error) => {
						console.log(error);
					});
			});
		}
	};

	resendFax = () => {
		let account_id = localStorage.getItem('account_id');
		if (this.state.makeCheckedFax && this.state.makeCheckedFax.length > 0) {
			this.state.makeCheckedFax.forEach((resendFax) => {
				let URL = `${CONFIG.API_URL}/accounts/${account_id}/faxes/outbox/${resendFax.id}`;
				axios
					.put(URL)
					.then((res) => {
						this.apply();
						setTimeout(() => {
							this.props.history.push('/faxes');
						}, 2000);
					})
					.catch((error) => {
						console.log(error);
					});
			});
		}
	};
	sendFax = () => {
		this.setState((prevState) => ({
			sendFaxModalShow: !prevState.sendFaxModalShow
		}));
	};
	successFax = () => {
		toast.success('Sent Fax Successfully!', {
			position: toast.POSITION.TOP_RIGHT
		});
		setTimeout(() => {
			this.apply();
		}, 15000);
	};
	changePendingChk = () => {
		this.setState({
			pendingChk: !this.state.pendingChk
		});
	};

	changeProcessingChk = () => {
		this.setState({
			processingChk: !this.state.processingChk
		});
	};

	changeFailedChk = () => {
		this.setState({
			failedChk: !this.state.failedChk
		});
	};

	changeSentChk = () => {
		this.setState({
			sentChk: !this.state.sentChk
		});
	};
	changeReceivedChk = () => {
		this.setState({
			receivedChk: !this.state.receivedChk
		});
	};

	changeAllType = () => {
		this.setState({
			allType: true,
			inboundType: false,
			outboundType: false
		});
	};
	changeInboundType = () => {
		this.setState({
			allType: false,
			inboundType: true,
			outboundType: false
		});
	};

	changeOutboundType = () => {
		this.setState({
			allType: false,
			inboundType: false,
			outboundType: true
		});
	};

	resetDefault = () => {
		const day = new Date();
		this.setState(
			{
				startDate: new Date(day.setDate(day.getDate() - 7)),
				endDate: new Date(),
				faxes: '',
				pendingChk: true,
				processingChk: true,
				failedChk: true,
				sentChk: true,
				receivedChk: true,
				allType: true,
				inboundType: false,
				outboundType: false
			},
			() => {
				this.apply();
			}
		);
	};

	render() {
		let { systemmessage } = this.props.systemmessage;
		if (systemmessage === 'Authentication failed.') {
			window.location.reload();
		}

		let faxes = this.state.faxes;
		let auth_token = this.props.auth_token;
		let { lng } = this.props.language;
		let faxesRecords = this.filtermailList(faxes, this.state.perPage, this.state.currentPage, this.state.searchKey);
		return (
			<div className="faxes">
				{this.props.faxreducer.loading && (
					<div className="loader_container">
						<div className="loader" />
					</div>
				)}
				<ToastContainer autoClose={8000} />
				<Topbar title="Faxes" user_name={this.state.user_name} />

				<div className="fax-container">
					<div className="row">
						<div className="voicemail-top-wrap col-md-6">
							<div className="voicemails-top">
								<h1 className="totalcount">{this.total}</h1>
								<span className="num-title">{i18n.t('total.label', { lng })}</span>
							</div>
						</div>
						<div className="col-md-6 send-fax">
							<button className="send-fax-button" onClick={this.sendFax}>
								<svg className="apply-icon">
									<use href="telicon-2.2.0.svg#unassign" />
								</svg>
								Send Fax
							</button>
						</div>
						<Modal isOpen={this.state.sendFaxModalShow} toggle={this.sendFax} id="sendfax-modal1">
							<SendFaxPage sendFax={this.sendFax} successFax={this.successFax} />
						</Modal>
					</div>
					<div className="row">
						<div className="col-md-3">
							<div className="fax-checkbox-wrap" onClick={this.toggle1}>
								<div className="float-left">
									<input type="checkbox" checked={this.state.itemView} readOnly />
								</div>
								<div className="direction-down">
									<Dropdown direction="down" isOpen={this.state.dropdownOpen1} toggle={this.toggle1}>
										<DropdownToggle tag="div">&#9660;</DropdownToggle>
										<DropdownMenu>
											<DropdownItem onClick={this.pendingItem}>
												<svg className="process-state">
													<use href="telicon-2.2.0.svg#pie-chart--100" />
												</svg>
												Processing
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.processingItem}>
												<svg className="process-state">
													<use href="telicon-2.2.0.svg#pie-chart--100" />
												</svg>
												Pending
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.sentItem}>
												<svg className="send-state">
													<use href="telicon-2.2.0.svg#pie-chart--100" />
												</svg>
												Sent
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.failedItem}>
												<svg className="failed-state">
													<use href="telicon-2.2.0.svg#pie-chart--100" />
												</svg>
												Failed
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.receivedItem}>
												<svg className="received-state">
													<use href="telicon-2.2.0.svg#pie-chart--100" />
												</svg>
												Received
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
							</div>
							{this.state.makeCheckedFax &&
							this.state.makeCheckedFax.length > 0 &&
							this.state.failedItem && (
								<div>
									<div className="fax-checkbox-trash" onClick={this.resendFax} id="resendFax">
										<svg className="fax-icon">
											<use href="telicon-2.2.0.svg#refresh" />
										</svg>
									</div>
									<Tooltip
										placement="top"
										isOpen={this.state.resendFaxTooltip}
										target="resendFax"
										toggle={this.resendFaxTooltip}
									>
										Resend
									</Tooltip>
								</div>
							)}
							{this.state.makeCheckedFax &&
							this.state.makeCheckedFax.length > 0 && (
								<div>
									<div className="fax-checkbox-trash" onClick={this.deleteFax} id="trashFax">
										<svg className="fax-icon">
											<use href="telicon-2.2.0.svg#trash-x" />
										</svg>
									</div>
									<Tooltip
										placement="top"
										isOpen={this.state.trashFaxTooltip}
										target="trashFax"
										toggle={this.trashFaxTooltip}
									>
										Trash
									</Tooltip>
								</div>
							)}
						</div>
						<div className="col-md-9 text-right">
							<div className="fax-search">
								<div className="mr-3">
									<FilterFaxPage
										filterDropdown={this.state.filterDropdown}
										filterToggle={this.filterToggle}
										apply={this.apply}
										startDateChange={this.startDateChange}
										endDateChange={this.endDateChange}
										startDate={this.state.startDate}
										endDate={this.state.endDate}
										pendingChk={this.state.pendingChk}
										processingChk={this.state.processingChk}
										failedChk={this.state.failedChk}
										sentChk={this.state.sentChk}
										receivedChk={this.state.receivedChk}
										changePendingChk={this.changePendingChk}
										changeProcessingChk={this.changeProcessingChk}
										changeFailedChk={this.changeFailedChk}
										changeSentChk={this.changeSentChk}
										changeReceivedChk={this.changeReceivedChk}
										allType={this.state.allType}
										inboundType={this.state.inboundType}
										outboundType={this.state.outboundType}
										changeAllType={this.changeAllType}
										changeInboundType={this.changeInboundType}
										changeOutboundType={this.changeOutboundType}
										resetDefault={this.resetDefault}
									/>
								</div>
								<div className="mr-2">
									<input
										className="fax-search-text form-control"
										type="text"
										placeholder={i18n.t('search.label', { lng })}
										onChange={this.onhandleChange}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-md-12 faxtable">
							<div className="table-th">
								<div className="col-md-2 pl-5">{i18n.t('status.label', { lng })}</div>
								<div className="col-md-2">{i18n.t('from.label', { lng })}</div>
								<div className="col-md-2">{i18n.t('to.label', { lng })}</div>
								<div className="col-md-3">{i18n.t('date_time.label', { lng })}</div>
								<div className="col-md-2">{i18n.t('pages.label', { lng })}</div>
								<div className="col-md-1" />
							</div>
							{faxesRecords && faxesRecords.length > 0 ? (
								faxesRecords.map((fax, index) => {
									let account_id = localStorage.getItem('account_id');
									let URL = `${CONFIG.API_URL}/accounts/${account_id}/faxes/${fax.folder}/${fax.id}/attachment?auth_token=${auth_token}`;
									if (fax.folder === 'inbox') {
										return (
											<div className="fax-row" key={index}>
												<div className="col-md-2 table-td">
													<div className="mr-4">
														{this.state.faxesState &&
															this.state.faxesState.map((faxState, index) => {
																if (fax.id === faxState.id) {
																	return (
																		<input
																			key={index}
																			type="checkbox"
																			className="checkbox"
																			checked={faxState.state}
																			onChange={() => this.checkboxChange(fax.id)}
																		/>
																	);
																}
																return true;
															})}
													</div>
													<div>
														<span className="round-send-state">Received</span>
													</div>
												</div>
												<div className="col-md-2 table-td">
													<div className="mr-4">
														<svg className="fax-icon">
															<use href="telicon-2.2.0.svg#download" />
														</svg>
													</div>
													<div>
														<div className="name">{fax.from}</div>
														<div className="number">
															{this.getPhoneNumber(fax.from_number)}
														</div>
													</div>
												</div>
												<div className="col-md-2">
													<div className="name">{this.state.caller_name}</div>
													<div className="number">{this.state.faxbox_name}</div>
												</div>
												<div className="col-md-3">
													<div className="name text-left">
														{this.getDateTime(fax.created).date}
													</div>
													<div className="number text-left">
														{this.getDateTime(fax.created).time}
													</div>
												</div>
												<div className="col-md-2">
													<div className="name">
														{fax.rx_result.total_pages ? fax.rx_result.total_pages : '0'}
													</div>
												</div>
												<div className="col-md-1">
													<a href={URL}>
														<svg className="fax-icon">
															<use href="telicon-2.2.0.svg#download-cloud" />
														</svg>
													</a>
												</div>
											</div>
										);
									}
									if (fax.folder === 'outbox') {
										return (
											<div className="fax-row" key={index}>
												<div className="col-md-2 table-td">
													<div className="mr-4">
														{this.state.faxesState &&
															this.state.faxesState.map((faxState, index) => {
																if (fax.id === faxState.id) {
																	return (
																		<input
																			key={index}
																			type="checkbox"
																			className="checkbox"
																			checked={faxState.state}
																			onChange={() => this.checkboxChange(fax.id)}
																		/>
																	);
																}
																return true;
															})}
													</div>
													<div>
														{fax.status === 'completed' ? (
															<span className="round-send-state">Sent</span>
														) : fax.status === 'failed' ? (
															<span className="round-faild-state">Failed</span>
														) : fax.status === 'pending' ? (
															<span className="round-pending-state">Failed</span>
														) : fax.status === 'processing' ? (
															<span className="round-pending-state">Processing</span>
														) : (
															''
														)}
													</div>
												</div>
												<div className="col-md-2 table-td">
													<div className="mr-4">
														<svg className="fax-icon">
															<use href="telicon-2.2.0.svg#upload" />
														</svg>
													</div>
													<div>
														<div className="name text-left">{this.state.caller_name}</div>
														<div className="number text-left">{this.state.faxbox_name}</div>
													</div>
												</div>
												<div className="col-md-2">
													<div className="name text-left">{fax.to_name}</div>
													<div className="number text-left">
														{this.getPhoneNumber(fax.to_number)}
													</div>
												</div>
												<div className="col-md-3">
													<div className="name text-left">
														{this.getDateTime(fax.created).date}
													</div>
													<div className="number text-left">
														{this.getDateTime(fax.created).time}
													</div>
												</div>
												<div className="col-md-2">
													<div className="name">
														{fax.tx_result.total_pages ? fax.tx_result.total_pages : '0'}
													</div>
												</div>
												<div className="col-md-1">
													<a href={URL}>
														<svg className="fax-icon">
															<use href="telicon-2.2.0.svg#download-cloud" />
														</svg>
													</a>
												</div>
											</div>
										);
									}
									return true;
								})
							) : (
								<div className="fax-row">
									<h2>{i18n.t('no.label', { lng }) + ' ' + i18n.t('results.label', { lng })}!</h2>
								</div>
							)}
							{this.state.view === 0 ? (
								<nav className="bottom-nav">
									<label>{i18n.t('view.label', { lng })}</label>
									<select onChange={this.selectPerPage}>
										<option value="10">10</option>
										<option value="25">25</option>
										<option value="50">50</option>
										<option value="100">100</option>
									</select>
									<label>{i18n.t('per_page.label', { lng })}</label>
									<span id="page-num">
										{this.state.perPage * this.state.currentPage + 1}-{this.setCountLabel(this.total)}{' '}
										of {this.total}
									</span>
									{this.state.currentPage === 0 ? (
										<button onClick={this.prev} className="button-disable" disabled>
											&#60;
										</button>
									) : (
										<button onClick={this.prev} className="button-enable">
											&#60;
										</button>
									)}
									{(this.state.currentPage + 1) * this.state.perPage >= this.total ? (
										<button onClick={this.next} className="button-disable" disabled>
											&#62;
										</button>
									) : (
										<button onClick={this.next} className="button-enable">
											&#62;
										</button>
									)}
								</nav>
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	faxreducer: state.faxreducer,
	language: state.language,
	systemmessage: state.systemmessage
});
const mapDispatchToProps = (dispatch) => ({
	getallfaxes: (from, to) => dispatch(getallfaxes(from, to))
});
export default connect(mapStateToProps, mapDispatchToProps)(FaxesPage);
