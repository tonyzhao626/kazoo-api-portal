import React from 'react';
import './Audioplayer.css';
import CONFIG from '../../Config.json';

export default class Audioplayer extends React.Component {
	render() {
		let vmbox_id = this.props.props.vmbox_id;
		let media_id = this.props.props.media_id;
		let auth_token = this.props.props.auth_token;
		let account_id = localStorage.getItem('account_id');
		let URL = `${CONFIG.API_URL}/accounts/${account_id}/vmboxes/${vmbox_id}/messages/${media_id}/raw?auth_token=${auth_token}`;
		return (
			<div className="container-audio">
				<audio controls autoPlay id="player" controlsList="nodownload">
					<source src={URL} />
					<p> Your browser doesn't support the audio tag </p>
				</audio>
			</div>
		);
	}
}
