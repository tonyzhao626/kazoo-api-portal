import React from 'react';
import i18n from '../Common/i18n';

export class MissedCalls extends React.Component {
	render() {
		let lng = this.props.lng;
		let missedcount = 0;
		if (this.props.missedcount && this.props.missedcount.length > 0) {
			this.props.missedcount.forEach((call, index) => {
				if (call.direction === 'outbound' && call.hangup_cause !== 'USER_BUSY') {
					missedcount++;
				}
			});
		}
		return (
			<div id="missed-calls" className="common-box">
				<span className="missed-content">
					<svg className="missed-call-icon">
						<use href="telicon-2.2.0.svg#phone-missed" />
					</svg>
				</span>
				<span className="text text-right">
					<div className="text-count">{missedcount}</div>
					<div className="text-value">
						{i18n.t('missed.label', { lng }) + ' ' + i18n.t('calls.label', { lng })}
					</div>
				</span>
			</div>
		);
	}
}
