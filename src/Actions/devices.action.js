import axios from 'axios';
import * as CONSTS from '../Constants';
export const getalldevices = () => {
	return (dispatch) => {
		let account_id = localStorage.getItem('account_id');
		let user_id = localStorage.getItem('user_id');

		let today = new Date();
		let year = today.getFullYear() + 1970;
		let month = today.getMonth();
		let date = today.getDate();
		let day = today.getDay();
		let countDaysFromMonday = (day || 7) - 1;
		let today_from_timestamp = Math.round(new Date(year, month, date, 0, 0, 0, 0).getTime()) / 1000;
		let today_to_timestamp = Math.round(new Date(year, month, date, 23, 59, 59, 999).getTime()) / 1000;

		let pastweek = new Date();
		pastweek.setDate(pastweek.getDate() - 7 - countDaysFromMonday);
		let pastyear = pastweek.getFullYear() + 1970;
		let pastmonth = pastweek.getMonth();
		let past_fromdate = pastweek.getDate();
		let past_todate = pastweek.getDate() + 6;

		let lastweek_from_timestamp =	Math.round(new Date(pastyear, pastmonth, past_fromdate, 0, 0, 0, 0).getTime()) / 1000;
		let lastweek_to_timestamp =	Math.round(new Date(pastyear, pastmonth, past_todate, 23, 59, 59, 999).getTime()) / 1000;

		const get_today = `/accounts/${account_id}/users/${user_id}/cdrs?created_from=${today_from_timestamp}&created_to=${today_to_timestamp}&paginate=false`;
		const get_past = `/accounts/${account_id}/users/${user_id}/cdrs?created_from=${lastweek_from_timestamp}&created_to=${lastweek_to_timestamp}&paginate=false`;
		const devices = `/accounts/${account_id}/users/${user_id}/devices`;
		const callList = `/accounts/${account_id}/callflows?filter_type=mainUserCallflow&filter_owner_id=${user_id}&paginate=false`;
		const devive_state = `/accounts/${account_id}/devices/status`;
		const username = `/accounts/${account_id}/users/${user_id}`;
		axios
			.all([
				axios.get(get_today),
				axios.get(get_past),
				axios.get(devices),
				axios.get(devive_state),
				axios.get(callList),
				axios.get(username)
			])
			.then(
				axios.spread((todayData, pastweekData, devicesData, devive_state, callList, username) => {
					let alldevices = [];
					let full_name = username.data.data.first_name + ' ' + username.data.data.last_name;
					let devices = devicesData.data.data;
					let regsiter = devive_state.data.data;
					let phone_num = callList.data.data[0].numbers;
					let today_data = todayData.data.data;
					let pastweek_data = pastweekData.data.data;
					let total_data = { today_data, pastweek_data };

					devices.forEach((element1) => {
						let flag = false;
						regsiter.forEach((element2) => {
							if (element1.id === element2.device_id) {
								alldevices.push({
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
							alldevices.push({
								device_type: element1.device_type,
								mac_address: element1.mac_address,
								name: element1.name,
								regsiter: false
							});
						}
					});

					let device_nums = { alldevices, phone_num, total_data, full_name };
					dispatch({ type: CONSTS.GET_ALL_DEVICES_ON_AN_ACCOUNT_SUCCESS, payload: device_nums });
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
