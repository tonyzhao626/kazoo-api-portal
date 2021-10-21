import React from 'react';
import i18n from '../Common/i18n';
export class NewFaxes extends React.Component {
	render() {
		let lng = this.props.lng;
		return (
			<div id="new-fax" className="common-box">
				<span className="total-fax-content">
					<svg className="fax-icon">
						<use href="telicon-2.2.0.svg#device-fax" />
					</svg>
				</span>
				<span className="text text-right">
					<div className="text-count">{this.props.allfaxescount}</div>
					<div className="text-value">
						{i18n.t('total.label', { lng }) + ' ' + i18n.t('faxes.label', { lng })}
					</div>
				</span>
			</div>
		);
	}
}
