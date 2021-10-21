import * as CONSTS from '../Constants';

export const setLanguage = (language) => {
	return (dispatch) => {
		dispatch({ type: CONSTS.SET_LANGUAGE, payload: language });
	}
}
