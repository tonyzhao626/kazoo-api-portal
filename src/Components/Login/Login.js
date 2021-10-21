import React from 'react';
import { connect } from 'react-redux';
import { getNewAuthToken } from '../../Actions/auth.action';
import './Login.css';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			accountname: '',
			rememberChk: false,
			loginCheck: true
		};
	}

	componentWillMount() {
		if (
			localStorage.getItem('userName') &&
			localStorage.getItem('userPass') &&
			localStorage.getItem('accountName')
		) {
			this.setState({ rememberChk: true });
			this.setState({ username: localStorage.getItem('userName') });
			this.setState({ password: localStorage.getItem('userPass') });
			this.setState({ accountname: localStorage.getItem('accountName') });
		}
	}

	componentDidUpdate(preProps) {
		let { auth_token } = this.props.auth;
		let { systemmessage } = this.props.systemmessage;
		if (systemmessage !== preProps.systemmessage.systemmessage) {
			if (systemmessage === 'Authentication failed.') {
				this.setState({ loginCheck: false });
			}
		}

		if (auth_token !== preProps.auth.auth_token) {
			if (auth_token) {
				if (this.state.rememberChk) {
					localStorage.setItem('userName', this.state.username);
					localStorage.setItem('userPass', this.state.password);
					localStorage.setItem('accountName', this.state.accountname);
				}
				this.props.history.push('/home');
			}
		}
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};
	handleKeyDown = (e) => {
		if (e.key === 'Enter' && e.shiftKey === false) {
			e.preventDefault();
			this.submit();
		}
	};

	checkBox = () => {
		this.setState({
			rememberChk: !this.state.rememberChk
		});
	};

	submit = () => {
		this.props.getNewAuthToken(this.state.username, this.state.password, this.state.accountname);
	};

	troubleSignin = () => {
		this.props.history.push('/trouble');
	};

	render() {
		return (
			<div className="login-main">
				<div className="login">
					<div className="login-title">Sign In</div>
					{!this.state.loginCheck && (
						<div className="invaild">
							<svg className="invalid-icon mr-1">
								<use href="telicon-2.2.0.svg#	warning--triangle" />
							</svg>
							Invalid Credentials
						</div>
					)}
					<div className="itmes">
						<div className="item-title">Username</div>
						<div>
							<input
								type="text"
								className="form-control"
								name="username"
								value={this.state.username}
								onChange={this.handleChange}
							/>
						</div>
					</div>
					<div className="itmes">
						<div className="item-title">Password</div>
						<div>
							<input
								type="password"
								className="form-control"
								name="password"
								value={this.state.password}
								onChange={this.handleChange}
							/>
						</div>
					</div>
					<div className="itmes">
						<div className="item-title">Account Name</div>
						<div>
							<input
								type="text"
								className="form-control"
								name="accountname"
								value={this.state.accountname}
								onChange={this.handleChange}
								onKeyDown={this.handleKeyDown}
							/>
						</div>
					</div>
					<div className="login-property">
						<div className="custom-control custom-checkbox mr-sm-2">
							<input
								type="checkbox"
								className="custom-control-input"
								id="customControlAutosizing"
								checked={this.state.rememberChk}
								onChange={this.checkBox}
							/>
							<label className="custom-control-label" htmlFor="customControlAutosizing">
								Remember me
							</label>
						</div>
						<div className="trouble-sign">
							<span onClick={this.troubleSignin}>Trouble Signing In?</span>
						</div>
					</div>
					<div className="login-butoon mt-3">
						<button className="btn btn-primary btn-login" onClick={this.submit}>
							Sign In
						</button>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({ auth: state.auth, language: state.language, systemmessage: state.systemmessage });
const mapDispatchToProps = (dispatch) => ({
	getNewAuthToken: (username, password, accountname) => dispatch(getNewAuthToken(username, password, accountname))
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
