import axios from 'axios';
import md5 from 'md5';
import * as CONSTS from '../Constants';
import Websocket from 'react-websocket';

export const getNewAuthToken = (username, password, accountname) => {
	return (dispatch) => {
		const URI = '/user_auth';
		const body = {
			data: {
				credentials: md5(`${username}:${password}`),
				account_name: accountname
			}
		};
		axios
			.put(URI, body)
			.then((res) => {

				localStorage.setItem('account_id', res.data.data.account_id);
				localStorage.setItem('user_id', res.data.data.owner_id);

				dispatch({ type: CONSTS.SET_SYSTEMMESSAGE, payload: 'New token generated: ' + res.data.auth_token });
				dispatch({ type: CONSTS.GET_NEW_TOKEN_SUCCESS, payload: res.data });
			})
			.catch((error) => {
				dispatch({ type: CONSTS.SET_SYSTEMMESSAGE, payload: 'Authentication failed.' });
			});
	};
};
