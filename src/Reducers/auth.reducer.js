import * as CONSTS from '../Constants'

let defaultState = { auth_token: null, authenticated: false }
export default (state = defaultState, action) => {
  switch (action.type) {
    case CONSTS.GET_NEW_TOKEN_SUCCESS:
      return { ...state, auth_token: action.payload.auth_token }
    case CONSTS.RESET_AUTH_TOKEN:
      return { ...state, auth_token: null }

    default:
      return state
  }
}
