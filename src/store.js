import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './Reducers';
import logger from 'redux-logger';

const store = () => {
	return createStore(rootReducer, applyMiddleware(thunk, logger));
};

export default store;
