import axios from 'axios';
import * as CONSTS from '../Constants';

export const getallnotification = () => {
	return (dispatch) => {

		let account_id = localStorage.getItem('account_id');
		let user_id = localStorage.getItem('user_id');

		let today = new Date();
		let year = today.getFullYear() + 1970;
		let month = today.getMonth();
		let date = today.getDate();
		let today_from_timestamp = Math.round(new Date(year, month, date, 0, 0, 0, 0).getTime()) / 1000;
		let today_to_timestamp = Math.round(new Date(year, month, date, 23, 59, 59, 999).getTime()) / 1000;

		let lastday = new Date(today.setDate(today.getDate() - 7));
		let year1 = lastday.getFullYear() + 1970;
		let month1 = lastday.getMonth();
		let date1 = lastday.getDate();
		let lastday_from_timestamp = Math.round(new Date(year1, month1, date1, 0, 0, 0, 0).getTime()) / 1000;

		const today_call_count = `/accounts/${account_id}/users/${user_id}/cdrs?created_from=${today_from_timestamp}&created_to=${today_to_timestamp}&paginate=false`;
		const devices = `/accounts/${account_id}/users/${user_id}/devices`;
		const device_num = `/accounts/${account_id}/callflows?filter_type=mainUserCallflow&filter_owner_id=${user_id}&paginate=false`;
		const devive_state = `/accounts/${account_id}/devices/status`;
		const missedcall = `/accounts/${account_id}/users/${user_id}/cdrs?created_from=${lastday_from_timestamp}&created_to=${today_to_timestamp}&paginate=false`;
		const faxes_inbox = `/accounts/${account_id}/faxes/inbox?paginate=false`;
		const faxes_outbox = `/accounts/${account_id}/faxes/outbox?paginate=false`;
		const faxesbox = `/accounts/${account_id}/faxboxes?filter_owner_id=${user_id}`;
		const vmbox = `/accounts/${account_id}/vmboxes?filter_owner_id=${user_id}`;
		const username = `/accounts/${account_id}/users/${user_id}`;
		axios
			.all([
				axios.get(today_call_count),
				axios.get(devices),
				axios.get(device_num),
				axios.get(devive_state),
				axios.get(missedcall),
				axios.get(faxes_inbox),
				axios.get(faxes_outbox),
				axios.get(faxesbox),
				axios.get(vmbox),
				axios.get(username)
			])
			.then(
				axios.spread(
					(
						today_call_count,
						devices,
						device_num,
						devive_state,
						missedcall,
						faxes_inbox,
						faxes_outbox,
						faxesbox,
						vmbox,
						username
					) => {
						let newvoicemails = [];
						let promises = [];
						let unregister_device = [];
						let register_device = [];
						let today_data = today_call_count.data.data;
						let calldata = missedcall.data.data;
						let faxes_inbox_data = faxes_inbox.data.data;
						let faxes_outbox_data = faxes_outbox.data.data;
						let full_name = username.data.data.first_name + ' ' + username.data.data.last_name;
						let userdata = username.data.data;
						let phone_num = device_num.data.data[0].numbers;
						let devices_data = devices.data.data;
						let regsiter = devive_state.data.data;
						let vmboxes = vmbox.data.data;
						let faxbox_name = faxesbox.data.data.length ? faxesbox.data.data[0].name : [];
						let caller_name = faxesbox.data.data.length ? faxesbox.data.data[0].caller_name : [];
						let faxbox = { faxbox_name, caller_name };

						devices_data.forEach((element1) => {
							let flag = false;
							regsiter.forEach((element2) => {
								if (element1.id === element2.device_id) {
									register_device.push({
										id: element1.id,
										device_type: element1.device_type,
										mac_address: element1.mac_address,
										name: element1.name,
										regsiter: true
									});
									flag = true;
									return;
								}
							});
							if (!flag) {
								unregister_device.push({
									id: element1.id,
									device_type: element1.device_type,
									mac_address: element1.mac_address,
									name: element1.name,
									regsiter: false
								});
							}
						});

						vmboxes.forEach(function(vmbox) {
							let url = `/accounts/${account_id}/vmboxes/${vmbox.id}/messages`;
							promises.push(axios.get(url));
						});
						axios.all(promises).then(function(promise) {
							promise.forEach(function(res4) {
								let messages = res4.data.data;
								let newmsgs = messages.filter((message) => message.folder === 'new');
								let newmessagecount = newmsgs ? newmsgs.length : 0;
								newvoicemails.push({ newmessagecount });
							});
							let notifications = {
								faxes_inbox_data,
								faxes_outbox_data,
								faxbox,
								newvoicemails,
								full_name,
								calldata,
								userdata,
								register_device,
								unregister_device,
								phone_num,
								today_data
							};
							dispatch({ type: CONSTS.GET_ALL_NOTIFICATION, payload: notifications });
						});
					}
				)
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
