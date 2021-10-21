import React from 'react';
import { connect } from 'react-redux';
import Topbar from '../Common/Topbar';
import axios from 'axios';
import { MissedCalls } from '../CallHistory/MissedCalls';
import { NewVoicemails } from '../Voicemails/NewVoicemails';
import { getallnotification } from '../../Actions/notification.action';
import { NewFaxes } from '../Faxes/NewFaxes';
import CallHistory from '../CallHistory/CallHistory';
import Devices from '../Devices/Devices';
import { Numbers } from '../Devices/Numbers';
import { Faxes } from '../Faxes/Faxes';
import i18n from '../Common/i18n';
import '../Home/Home.css';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_name: '',
			calldata: '',
			userdata: '',
			unregister_device: '',
			register_device: '',
			phone_num: '',
			today_data: '',
			faxes_outbox_data: '',
			faxes_inbox_data: '',
			faxesdata_length: 0,
			faxbox: '',
			history: '',
			lng: 'en'
		};
	}

	componentWillMount() {
		axios.defaults.headers.common['X-AUTH-TOKEN'] = this.props.auth.auth_token;
	}
	componentDidMount() {
		if (this.props.notification.loading) {
			this.props.getallnotification();
		} else {
			let allnotifications = this.props.notification.allnotifications;
			this.setState({
				newvoicemails: allnotifications.newvoicemails,
				user_name: allnotifications.full_name,
				calldata: allnotifications.calldata,
				userdata: allnotifications.userdata,
				unregister_device: allnotifications.unregister_device,
				register_device: allnotifications.register_device,
				phone_num: allnotifications.phone_num,
				today_data: allnotifications.today_data,
				faxesdata_length: allnotifications.faxes_inbox_data.length + allnotifications.faxes_outbox_data.length,
				faxbox: allnotifications.faxbox,
				loading_state: allnotifications.faxbox,
				faxes_outbox_data: allnotifications.faxes_outbox_data,
				faxes_inbox_data: allnotifications.faxes_inbox_data,
				user_photo: allnotifications.user_photo
			});
		}
	}
	componentDidUpdate(preProps) {
		let allnotifications = this.props.notification.allnotifications;
		if (allnotifications !== preProps.notification.allnotifications) {
			this.setState({
				newvoicemails: allnotifications.newvoicemails,
				user_name: allnotifications.full_name,
				calldata: allnotifications.calldata,
				userdata: allnotifications.userdata,
				unregister_device: allnotifications.unregister_device,
				register_device: allnotifications.register_device,
				phone_num: allnotifications.phone_num,
				today_data: allnotifications.today_data,
				faxesdata_length: allnotifications.faxes_inbox_data.length + allnotifications.faxes_outbox_data.length,
				faxbox: allnotifications.faxbox,
				loading_state: allnotifications.faxbox,
				faxes_outbox_data: allnotifications.faxes_outbox_data,
				faxes_inbox_data: allnotifications.faxes_inbox_data,
				user_photo: allnotifications.user_photo
			});
		}
	}

	render() {
		let { lng } = this.props.language;
		let { systemmessage } = this.props.systemmessage;
		if (systemmessage === 'Authentication failed.') {
			window.location.reload();
		}
		return (
			<div className="home">
				{this.props.notification.loading && (
					<div className="loader_container">
						<div className="loader" />
					</div>
				)}
				<Topbar title={i18n.t('home.label', { lng })} user_name={this.state.user_name} lng={lng} />

				<div className="main-container">
					<div className="row  mt-4">
						<div className="col-md-4 ">
							<MissedCalls missedcount={this.state.calldata} lng={lng} />
						</div>
						<div className="col-md-4">
							<NewVoicemails newvoicemails={this.state.newvoicemails} lng={lng} />
						</div>
						<div className="col-md-4">
							<NewFaxes allfaxescount={this.state.faxesdata_length} lng={lng} />
						</div>
					</div>
					<div className="row mt-4">
						<div className="col-md-6">
							<CallHistory calldata={this.state.calldata} history={this.props.history} lng={lng} />
						</div>
						<div className="col-md-6">
							<Numbers
								phone_num={this.state.phone_num}
								history={this.props.history}
								today_data={this.state.today_data}
								lng={lng}
							/>
						</div>
					</div>
					<div className="row mt-4 mb-4">
						<div className="col-md-6">
							<Devices
								unregister_device={this.state.unregister_device}
								register_device={this.state.register_device}
								history={this.props.history}
								lng={lng}
							/>
						</div>
						<div className="col-md-6">
							<Faxes
								faxbox={this.state.faxbox}
								faxes_outbox_data={this.state.faxes_outbox_data}
								faxes_inbox_data={this.state.faxes_inbox_data}
								history={this.props.history}
								auth_token={this.props.auth_token}
								lng={lng}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	notification: state.notification,
	language: state.language,
	systemmessage: state.systemmessage,
	auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
	getallnotification: () => dispatch(getallnotification())
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
