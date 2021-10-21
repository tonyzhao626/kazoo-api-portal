import React from 'react';
import i18n from '../Common/i18n';
import './Voicemails.css';

class VoicemailBox extends React.Component {
	render() {
		let lng = this.props.lng;
		return (
			<div className="voicemailbox-container">
				<div className="voicemailbox-title">
					<p>{i18n.t('vboxtext.label', { lng })}</p>
				</div>
				<div className="row">
					{this.props.allmessages &&
						this.props.allmessages.map((box, index) => (
							<div className="col-md-4  mb-3" key={index}>
								<MailboxContainer {...box.vmbox} history={this.props.history} lng={this.props.lng} />
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default VoicemailBox;

const MailboxContainer = (props) => {
	let lng = props.lng;
	return (
		<div className="voicemailbox">
			<div
				className={`voicemailbox-wrapper ${props.newcount > 0 ? 'voicemails-top-1' : 'voicemails-top-2'}`}
				onClick={() => props.history.push('/voicemails/list/' + props.id)}
			>
				<div className="pb-4">
					<h2>{props.name}</h2>
				</div>
				<div className="voicemail-mailbox">
					<div>
						<h1 className={props.newcount > 0 ? 'newcount' : ''}>{props.newcount}</h1>
						<span className="num-title">{i18n.t('new.label', { lng })}</span>
					</div>
					<div>
						<h1 className="totalcount">{props.messages}</h1>
						<span className="num-title">{i18n.t('total.label', { lng })}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
