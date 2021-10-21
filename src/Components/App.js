import React, { Component } from 'react';
import Login from './Login/Login';
import Home from './Home/Home';
import { connect } from 'react-redux';
import { Route } from 'react-router';

import Voicemails from './Voicemails/Voicemails';
import History from './CallHistory/History';
import DevicesNumbers from './Devices/DevicesNumbers';
import FaxesPage from './Faxes/FaxesPage';
import VoicemailsList from './Voicemails/VoicemailsList';
import './App.css';
import axios from 'axios';
import CONFIG from '../Config.json';
import authenticate from './Common/Authenticate';
import Sidebar from './Common/Sidebar';
import { withRouter } from 'react-router-dom';
import Trouble from './Login/Trouble';

axios.defaults.baseURL = CONFIG.API_URL;
axios.defaults.headers.get['Content-Type'] = 'application/json';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			auth_token: ''
		};
	}
	componentDidUpdate(preProps) {
		const { auth_token } = this.props.auth;
		if (auth_token !== preProps.auth.auth_token) {
			this.setState({
				auth_token: auth_token
			});
			axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token;
		}
	}
	render() {
		return (
			<div className={`${this.state.auth_token ? 'App' : ''}`}>
				<Sidebar />
				<Route exact path="/" component={Login} />
				<Route exact path="/trouble" component={Trouble} />
				<Route exact path="/home" component={authenticate(Home)} />
				<Route exact path="/voicemails" component={authenticate(Voicemails)} />
				<Route exact path="/voicemails/list/:vmbox_id/" component={authenticate(VoicemailsList)} />
				<Route exact path="/history" component={authenticate(History)} />
				<Route exact path="/devices" component={authenticate(DevicesNumbers)} />
				<Route exact path="/faxes" component={authenticate(FaxesPage)} />
			</div>
		);
	}
}
const mapStateToProps = (state) => ({ auth: state.auth, language: state.language });
export default withRouter(connect(mapStateToProps)(App));
