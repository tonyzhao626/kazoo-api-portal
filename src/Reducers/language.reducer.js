
import * as CONSTS from '../Constants'

export default (state = {lng: "en"}, action) => {
  switch (action.type) {
    case CONSTS.SET_LANGUAGE:
      return {...state, lng: action.payload}
    default:
      return state
  }
}