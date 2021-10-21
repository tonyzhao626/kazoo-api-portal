import axios from 'axios';
import * as CONSTS from '../Constants';

export const getCallFlow = (start, end) => {
	let startDate = new Date(start);
	let endDate = new Date(end);
	let start_year = startDate.getFullYear() + 1970;
	let start_month = startDate.getMonth();
	let start_date = startDate.getDate();
	let end_year = endDate.getFullYear() + 1970;
	let end_month = endDate.getMonth();
	let end_date = endDate.getDate();
	let start_timestamp = Math.round(new Date(start_year, start_month, start_date, 0, 0, 0, 0).getTime()) / 1000;
	let end_timestamp = Math.round(new Date(end_year, end_month, end_date, 23, 59, 59, 999).getTime()) / 1000;

	return (dispatch) => {

		let account_id = localStorage.getItem('account_id');
		let user_id = localStorage.getItem('user_id');

		const calldata = `/accounts/${account_id}/users/${user_id}/cdrs?created_from=${start_timestamp}&created_to=${end_timestamp}&paginate=false`;
		const username = `/accounts/${account_id}/users/${user_id}`;
		axios
			.all([ axios.get(calldata), axios.get(username) ])
			.then(
				axios.spread((calldata, username) => {
					let call_data = calldata.data.data;
					let full_name = username.data.data.first_name + ' ' + username.data.data.last_name;
					var payload = { call_data, full_name };
					dispatch({ type: CONSTS.GET_ALL_CALL_FLOW_ON_AN_ACCOUNT_SUCCESS, payload: payload });
				})
			)
			.catch((error) => {
				if (
					typeof error !== 'undefined' &&
					typeof error.response !== 'undefined' &&
					error.response.status === 401
				) {
					dispatch({ type: CONSTS.SET_SYSTEMMESSAGE, payload: 'Authentication failed.' });
					dispatch({ type: CONSTS.RESET_AUTH_TOKEN });
				}
			});
	};
};
