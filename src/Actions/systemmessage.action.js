import * as CONSTS from '../Constants';

export const setsystemmessage = (msg) => {
	return {
		type: CONSTS.SET_SYSTEMMESSAGE,
		payload: msg
	}
}
