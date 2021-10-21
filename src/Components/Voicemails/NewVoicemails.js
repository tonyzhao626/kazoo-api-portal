import React from 'react';
import i18n from '../Common/i18n';

export class NewVoicemails extends React.Component {
	render() {
		let lng = this.props.lng;
		let newmailscount = 0;
		if (this.props.newvoicemails && this.props.newvoicemails.length > 0) {
			this.props.newvoicemails.forEach((message) => {
				newmailscount += message.newmessagecount;
			});
		}
		return (
			<div id="new-voicemails" className="common-box">
				<span className="voicemail-content">
					<svg className="voicemail-icon">
						<use href="telicon-2.2.0.svg#voicemail" />
					</svg>
				</span>
				<span className="text text-right">
					<div className="text-count">{newmailscount}</div>
					<div className="text-value">
						{i18n.t('new.label', { lng }) + ' ' + i18n.t('voicemails.label', { lng })}
					</div>
				</span>
			</div>
		);
	}
}
