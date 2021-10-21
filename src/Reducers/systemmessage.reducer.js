import * as CONSTS from '../Constants'
import uuid from 'uuid/v1'

export default (state = {systemmessage: null, msguuid: null}, action) => {
  switch (action.type) {
    case CONSTS.SET_SYSTEMMESSAGE:
      return {...state, systemmessage: action.payload, msguuid: uuid()}
    case CONSTS.DELETE_SYSTEMMESSAGE:
      return {...state, systemmessage: null, msguuid: null}
    default:
      return state
  }
}