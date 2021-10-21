import axios from 'axios';
import * as CONSTS from '../Constants';
import _ from 'lodash';

export const getallvmboxes = () => {
	return (dispatch) => {

		let account_id = localStorage.getItem('account_id');
		let user_id = localStorage.getItem('user_id');

		const URI = `/accounts/${account_id}/vmboxes?filter_owner_id=${user_id}`;
		const username = `/accounts/${account_id}/users/${user_id}`;
		axios
			.all([ axios.get(URI), axios.get(username) ])
			.then(
				axios.spread((res, username) => {
					let full_name = username.data.data.first_name + ' ' + username.data.data.last_name;
					let promises = [];
					const vmboxes = res.data.data;
					vmboxes.length &&
						vmboxes.forEach(function(vmbox) {
							let url = `/accounts/${account_id}/vmboxes/${vmbox.id}/messages?paginate=false`;
							promises.push(axios.get(url));
						});
					let allmessages = [];
					if (promises.length > 0) {
						axios.all(promises).then(function(promise) {
							dispatch({ type: CONSTS.SET_SYSTEMMESSAGE, payload: 'We have fresh messages now.' });
							promise.forEach(function(res) {
								let messages = res.data.data;
								let newmsgs = messages.filter((message) => message.folder === 'new');
								let vmbox_id = res.request.responseURL.split('/')[7];
								let vmbox = _.find(vmboxes, (box) => box.id === vmbox_id);

								vmbox.newcount = newmsgs ? newmsgs.length : 0;
								vmbox.messages = messages.length;
								allmessages.push({ vmbox, messages });
							});
							if (vmboxes.length === 0) {
								allmessages.push({ vmbox: { newcount: 0, messages: 0 }, messages: [] });
							}
							let allmailsdata = { allmessages, full_name };
							dispatch({ type: CONSTS.GET_ALL_MESSAGES_ON_AN_ACCOUNT_SUCCESS, payload: allmailsdata });
						});
					} else {
						let allmailsdata = { allmessages, full_name };
						dispatch({ type: CONSTS.GET_ALL_MESSAGES_ON_AN_ACCOUNT_SUCCESS, payload: allmailsdata });
					}
				})
			)
			.catch((error) => {
				if (
					typeof error !== 'undefined' &&
					typeof error.response !== 'undefined' &&
					error.response.status === 401
				) {
					dispatch({ type: CONSTS.SET_SYSTEMMESSAGE, payload: 'Authentication failed.' });
				}
			});
	};
};
