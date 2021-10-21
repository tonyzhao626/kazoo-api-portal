import React from 'react';
import './Login.css';
import CONFIG from '../../Config.json';

class Trouble extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			troubleAPI: false,
			troubleURL: `${CONFIG.API_URL}`
		};
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	changeAPIURL = () => {
		this.setState({ troubleURL: this.state.troubleURL, troubleAPI: false });
	};

	changeTroubleURL = () => {
		this.setState({ troubleAPI: !this.state.troubleAPI });
	};

	cancelAPIURL = () => {
		this.setState({ troubleAPI: false });
	};

	render() {
		return (
			<div className="login-main">
				<div className="login">
					<div className="back-login" onClick={() => this.props.history.push('/')}>
						<svg className="trouble-icon mr-2">
							<use href="telicon-2.2.0.svg#arrow-left--circle" />
						</svg>
						<span className="trouble-change">Back to Sign In </span>
					</div>
					<div className="login-title">Trouble Signing In?</div>
					<div className="trouble-body">
						Please visit your usual web portal and click the "Forgot Password?" feature on the main page.
						You'll receive an email notification to reset your password.
					</div>
					<div className="trouble-url-title">
						API Server URL
						<svg className="trouble-icon ml-2" title="Help">
							<use href="telicon-2.2.0.svg#question--circle" />
						</svg>
					</div>
					<div className="trouble-url">
						{this.state.troubleAPI ? (
							<div className="trouble-items">
								<input
									type="text"
									className="form-control trouble-items-input"
									name="troubleURL"
									value={this.state.troubleURL}
									onChange={this.handleChange}
								/>
								<button className="trouble-btn-grey" onClick={this.cancelAPIURL}>
									<svg className="trouble-icon">
										<use href="telicon-2.2.0.svg#x--circle" />
									</svg>
								</button>
								<button className="trouble-btn-green" onClick={this.changeAPIURL}>
									<svg className="trouble-icon">
										<use href="telicon-2.2.0.svg#check--circle" />
									</svg>
								</button>
							</div>
						) : (
							<div>
								{this.state.troubleURL}{' '}
								<span className="trouble-change" onClick={this.changeTroubleURL}>
									Change
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
export default Trouble;
