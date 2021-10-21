import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import i18n from './i18n';
import { SidebarLink } from './SidebarLink';
import './Sidebar.css';
import authenticate from './Authenticate';
import CONFIG from '../../Config.json';

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newmailscount: 0,
			missedcount: 0
		};
	}

	render() {
		let { allnotifications } = this.props.notification;
		let newmailscount = 0;
		let missedcount = 0;
		if (allnotifications) {
			if (allnotifications.calldata) {
				allnotifications.calldata.forEach((call, index) => {
					if (call.direction === 'outbound' && call.hangup_cause === 'NO_ANSWER') {
						missedcount++;
					}
				});
			}
			if (allnotifications.newvoicemails && allnotifications.newvoicemails.length > 0) {
				allnotifications.newvoicemails.forEach((message, index) => {
					newmailscount += message.newmessagecount;
				});
			}
    }

		let { lng } = this.props.language;
		return (
			<div className="Sidebar">
				<div className="kazoo-logo">{CONFIG.BUSINESS_NAME}</div>
				<nav className="sidebar-nav">
					<SidebarLink
						route="/home"
						img="home"
						title={i18n.t('home.label', { lng })}
						history={this.props.history}
						lng={lng}
					/>
					<SidebarLink
						route="/voicemails"
						img="voicemail"
						title={i18n.t('voicemails.label', { lng })}
						newmails={newmailscount}
						history={this.props.history}
						lng={lng}
					/>
					<SidebarLink
						route="/history"
						img="list"
						title={i18n.t('callhistory.label', { lng })}
						missedcalls={missedcount}
						history={this.props.history}
						lng={lng}
					/>
					<SidebarLink
						route="/devices"
						img="device-voip-phone"
						title={i18n.t('devices.label', { lng }) + ' & ' + i18n.t('numbers.label', { lng })}
						history={this.props.history}
						lng={lng}
					/>
					<SidebarLink
						route="/faxes"
						img="device-fax"
						title={i18n.t('faxes.label', { lng })}
						history={this.props.history}
						lng={lng}
					/>
				</nav>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({ notification: state.notification, language: state.language });

export default withRouter(connect(mapStateToProps)(authenticate(Sidebar)));
