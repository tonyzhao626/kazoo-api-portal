import * as CONSTS from '../Constants';

export default (state = { loading: true }, action) => {
	switch (action.type) {
		case CONSTS.GET_ALL_NOTIFICATION:
			return { ...state, allnotifications: action.payload, loading: false };
		default:
			return state;
	}
};
