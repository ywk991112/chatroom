const login = (state = {}, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        login: true,
      }
    case 'LOGOUT':
      return {
        ...state,
        login: false,
        loginSuccess: false
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loginSuccess: true,
        user: action.user,
        friends: action.friends,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loginSuccess: false
      }
    default:
      return state;
  }
}

export default login;
