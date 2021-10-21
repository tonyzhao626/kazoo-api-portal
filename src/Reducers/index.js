import { combineReducers } from 'redux';
import vmreducer from './voicemails.reducer';
import callreducer from './callhistory.reducer';
import devicereducer from './devices.reducer';
import faxreducer from './faxes.reducer';
import auth from './auth.reducer';
import systemmessage from './systemmessage.reducer';
import notification from './notification.reducer';
import language from './language.reducer'

export default combineReducers({
  vmreducer,
  devicereducer,
  callreducer,
  faxreducer,
  auth,
  systemmessage,
  notification,
  language
})
