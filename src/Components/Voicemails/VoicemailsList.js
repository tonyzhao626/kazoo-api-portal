import React from 'react';
import { connect } from 'react-redux';
import Topbar from '../Common/Topbar';
import VoicemailsTable from './VoicemailsTable';
import { getallnotification } from '../../Actions/notification.action';
import { getallvmboxes } from '../../Actions/voicemails.action';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from 'lodash';
import axios from 'axios';
import i18n from '../Common/i18n';
import CONFIG from '../../Config.json';

class VoicemailsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: null,
			checkVoiceMail: null,
			checkedMail: null,
			makeStateMail: null,
			searchKey: '',
			new: 0,
			total: 0,
			dropdownOpen1: false,
			dropdownOpen2: false,
			itemView: false,
			vmbox_id: '',
			allItem: false,
			newItem: false,
			listenedItem: false,
			deletedItem: false,
			noneItem: false,
			checkKey: '',
			view: 0,
			perPage: 10,
			currentPage: 0,
			user_name: '',
			checkBox: false
		};
	}
	componentDidMount() {
		let vmbox_id;
		if (!this.props.vmboxID) {
			vmbox_id = this.props.match.params.vmbox_id;
			this.setState({ checkBox: true });
		} else {
			vmbox_id = this.props.vmboxID;
			this.setState({ checkBox: false });
		}

		const vmbox = _.find(this.props.vmreducer.allmessages.allmessages, (message) => message.vmbox.id === vmbox_id);
		const messages = vmbox.messages;
		this.setState(
			{
				messages,
				new: vmbox.vmbox.newcount,
				total: vmbox.vmbox.messages,
				title: vmbox.vmbox.name,
				user_name: this.props.vmreducer.allmessages.full_name,
				vmbox_id: vmbox_id
			},
			() => {
				this.checkVoiceMail(this.state.messages);
			}
		);
	}

	toggle1 = () => {
		this.setState({
			dropdownOpen1: !this.state.dropdownOpen1
		});
	}

	toggle2 = () => {
		this.setState({
			dropdownOpen2: !this.state.dropdownOpen2
		});
	}

	onhandleChange = (e) => {
		var value = e.target.value;
		this.setState({ searchKey: value });
	}

	allItem = () => {
		this.setState(
			{
				allItem: true,
				newItem: false,
				listenedItem: false,
				deletedItem: false,
				noneItem: false,
				checkKey: '',
				checkState: false
			},
			() => {
				this.checkVoiceMail(this.state.messages);
			}
		);
	}

	newItem = () => {
		this.setState(
			{
				allItem: false,
				newItem: true,
				listenedItem: false,
				deletedItem: false,
				noneItem: false,
				checkKey: '',
				checkState: false
			},
			() => {
				this.checkVoiceMail(this.state.messages);
			}
		);
	}

	listenedItem = () => {
		this.setState(
			{
				allItem: false,
				newItem: false,
				listenedItem: true,
				deletedItem: false,
				checkKey: '',
				noneItem: false
			},
			() => {
				this.checkVoiceMail(this.state.messages);
			}
		);
	}

	deletedItem = () => {
		this.setState(
			{
				allItem: false,
				newItem: false,
				listenedItem: false,
				deletedItem: true,
				checkKey: '',
				noneItem: false
			},
			() => {
				this.checkVoiceMail(this.state.messages);
			}
		);
	}

	noneItem = () => {
		this.setState(
			{
				allItem: false,
				newItem: false,
				listenedItem: false,
				deletedItem: false,
				noneItem: true,
				itemView: false,
				checkKey: '',
				checkState: false
			},
			() => {
				this.checkVoiceMail(this.state.messages);
			}
		);
	}

	checkVoiceMail = (messages) => {
		let checkVoiceMails = [];
		if (messages) {
			messages.forEach((message, index) => {
				if (
					!this.state.noneItem &&
					!this.state.allItem &&
					!this.state.newItem &&
					!this.state.listenedItem &&
					!this.state.deletedItem
				) {
					checkVoiceMails.push({ media_id: message.media_id, state: false });
				} else {
					if (this.state.noneItem) {
						checkVoiceMails.push({ media_id: message.media_id, state: false });
					}
					if (this.state.allItem) {
						checkVoiceMails.push({ media_id: message.media_id, state: true });
					}
					if (this.state.newItem) {
						if (message.folder === 'new') {
							checkVoiceMails.push({ media_id: message.media_id, state: true });
						} else {
							checkVoiceMails.push({ media_id: message.media_id, state: false });
						}
					}
					if (this.state.listenedItem) {
						if (message.folder === 'saved') {
							checkVoiceMails.push({ media_id: message.media_id, state: true });
						} else {
							checkVoiceMails.push({ media_id: message.media_id, state: false });
						}
					}
					if (this.state.deletedItem) {
						if (message.folder === 'deleted') {
							checkVoiceMails.push({ media_id: message.media_id, state: true });
						} else {
							checkVoiceMails.push({ media_id: message.media_id, state: false });
						}
					}
				}
			});
		}
		this.setState({ checkVoiceMail: checkVoiceMails }, () => {
			this.makeStateMail();
		});
	};

	mailStateChange = (messages) => {
		let checkVoiceMails = [];
		if (messages) {
			messages.forEach((message, index) => {
				if (message.media_id === this.state.checkKey) {
					checkVoiceMails.push({ media_id: message.media_id, state: !message.state });
				} else {
					checkVoiceMails.push({ media_id: message.media_id, state: message.state });
				}
			});
		}
		return checkVoiceMails;
	};

	checkboxChange = (key) => {
		this.setState(
			{
				checkKey: key
			},
			() => {
				this.setState({ checkVoiceMail: this.mailStateChange(this.state.checkVoiceMail) }, () => {
					this.makeStateMail();
				});
			}
		);
	};

	makeStateMail = () => {
		let makeStateMail = [];
		this.state.checkVoiceMail &&
			this.state.checkVoiceMail.forEach((checkedMail, index) => {
				if (checkedMail.state) {
					makeStateMail.push(checkedMail);
				}
			});
		this.setState({ makeStateMail: makeStateMail, itemView: makeStateMail.length > 0 ? true : false });
	};

	makeNewItem = () => {
		let account_id = localStorage.getItem('account_id');
		if (this.state.makeStateMail) {
			this.state.makeStateMail.forEach((makenew, index) => {
				let URL = `${CONFIG.API_URL}/accounts/${account_id}/vmboxes/${this.state.vmbox_id}/messages/${makenew.media_id}`;
				let data = { data: { folder: 'new' } };
				axios
					.post(URL, data)
					.then((res) => {
						this.props.getallvmboxes();
						this.props.getallnotification();
						setTimeout(() => {
							if (this.state.checkBox) {
								this.props.history.push('/voicemails/list/' + this.state.vmbox_id);
							} else {
								this.props.history.push('/voicemails/');
							}
						}, 4000);
					})
					.catch((error) => {
						console.log(error);
					});
			});
		}
	};

	makeDeletedItem = () => {
		let account_id = localStorage.getItem('account_id');
		if (this.state.makeStateMail) {
			this.state.makeStateMail.forEach((makenew, index) => {
				let URL = `${CONFIG.API_URL}/accounts/${account_id}/vmboxes/${this.state.vmbox_id}/messages/${makenew.media_id}`;
				let data = { data: { folder: 'deleted' } };
				axios
					.post(URL, data)
					.then((res) => {
						this.props.getallvmboxes();
						this.props.getallnotification();
						setTimeout(() => {
							if (this.state.checkBox) {
								this.props.history.push('/voicemails/list/' + this.state.vmbox_id);
							} else {
								this.props.history.push('/voicemails/');
							}
						}, 4000);
					})
					.catch((error) => {
						console.log(error);
					});
			});
		}
	};

	makeListenedItem = () => {
		let account_id = localStorage.getItem('account_id');
		if (this.state.makeStateMail) {
			this.state.makeStateMail.forEach((makenew, index) => {
				let URL = `${CONFIG.API_URL}/accounts/${account_id}/vmboxes/${this.state.vmbox_id}/messages/${makenew.media_id}`;
				let data = { data: { folder: 'saved' } };
				axios
					.post(URL, data)
					.then((res) => {
						this.props.getallvmboxes();
						this.props.getallnotification();
						setTimeout(() => {
							if (this.state.checkBox) {
								this.props.history.push('/voicemails/list/' + this.state.vmbox_id);
							} else {
								this.props.history.push('/voicemails/');
							}
						}, 4000);
					})
					.catch((error) => {
						console.log(error);
					});
			});
		}
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

	getallnotification = () => {
		this.props.getallvmboxes();
		this.props.getallnotification();
		setTimeout(() => {
			if (this.state.checkBox) {
				this.props.history.push('/voicemails/list/' + this.state.vmbox_id);
			} else {
				this.props.history.push('/voicemails/');
			}
		}, 4000);
	};

	render() {
		let { lng } = this.props.language;
		return (
			<div className="voicemails">
				{this.props.vmreducer.loading && (
					<div className="loader_container">
						<div className="loader" />
					</div>
				)}
				<Topbar title={i18n.t('voicemails.label', { lng })} user_name={this.state.user_name} />
				<div className="main-container text-left">
					{!this.props.vmboxID && (
						<div className="back-box" onClick={() => this.props.history.push('/voicemails/')}>
							<i className="fa fa-arrow-circle-left mr-1" aria-hidden="true" />
							Back to voicemail list
						</div>
					)}
					<div className="text-left vmbox-title">{this.state.title}</div>
					<div className="row">
						<div className="voicemail-top-wrap col-md-12">
							<div
								className={`voicemails-top ${this.state.new > 0
									? 'voicemails-top-1'
									: 'voicemails-top-2'}`}
							>
								<h1 className={this.state.new > 0 ? 'newcount' : ''}>{this.state.new}</h1>
								<span className="num-title">{i18n.t('new.label', { lng })}</span>
							</div>
							<div className="voicemails-top voicemails-top-2">
								<h1 className="totalcount">{this.state.total}</h1>
								<span className="num-title">{i18n.t('total.label', { lng })}</span>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="checkbox-wrap" onClick={this.toggle1}>
								<div className="float-left">
									<input type="checkbox" checked={this.state.itemView} readOnly />
								</div>
								<div className="direction-down">
									<Dropdown direction="down" isOpen={this.state.dropdownOpen1} toggle={this.toggle1}>
										<DropdownToggle tag="div">&#9660;</DropdownToggle>
										<DropdownMenu>
											<DropdownItem onClick={this.allItem}>
												{i18n.t('all_on_page.label', { lng })}
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.newItem}>
												{i18n.t('new.label', { lng })}
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.listenedItem}>
												{i18n.t('listened.label', { lng })}
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.deletedItem}>
												{i18n.t('deleted.label', { lng })}
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem onClick={this.noneItem}>
												{i18n.t('none.label', { lng })}
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
							</div>
							{this.state.itemView &&
							this.state.makeStateMail && (
								<div className="checkbox-wrap ml-2" onClick={this.toggle2}>
									<div className="float-left">
										<i className="fa fa-list-ul" />
									</div>
									<div className="direction-down">
										<Dropdown
											direction="down"
											isOpen={this.state.dropdownOpen2}
											toggle={this.toggle2}
										>
											<DropdownToggle tag="div">&#9660;</DropdownToggle>
											<DropdownMenu>
												<DropdownItem onClick={this.makeNewItem}>
													{i18n.t('make_as_new.label', { lng })}
												</DropdownItem>
												<DropdownItem divider />
												<DropdownItem onClick={this.makeListenedItem}>
													{i18n.t('make_as_listened.label', { lng })}
												</DropdownItem>
												<DropdownItem divider />
												<DropdownItem onClick={this.makeDeletedItem}>
													{i18n.t('make_as_deleted.label', { lng })}
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</div>
								</div>
							)}
						</div>
						<div className="col-md-6">
							<div id="voicemail-search" className="text-right">
								<input
									className="fax-search-text form-control"
									type="text"
									placeholder={i18n.t('search.label', { lng })}
									onChange={this.onhandleChange}
								/>
							</div>
						</div>
					</div>
					<VoicemailsTable
						allmessages={this.state.messages}
						history={this.props.history}
						auth_token={this.props.auth.auth_token}
						checkboxChange={this.checkboxChange}
						itemState={this.state}
						vmbox_id={this.state.vmbox_id}
						perPage={this.state.perPage}
						currentPage={this.state.currentPage}
						searchKey={this.state.searchKey}
						checkVoiceMail={this.state.checkVoiceMail}
						lng={lng}
						getallnotification={this.getallnotification}
					/>
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
								{this.state.perPage * this.state.currentPage + 1}-{this.setCountLabel(this.state.total)}{' '}
								of {this.state.total}
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
							{(this.state.currentPage + 1) * this.state.perPage >= this.state.total ? (
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
		);
	}
}

const mapStateToProps = (state) => ({ auth: state.auth, vmreducer: state.vmreducer, language: state.language });
const mapDispatchToProps = (dispatch) => ({
	getallnotification: () => dispatch(getallnotification()),
	getallvmboxes: () => dispatch(getallvmboxes())
});
export default connect(mapStateToProps, mapDispatchToProps)(VoicemailsList);
