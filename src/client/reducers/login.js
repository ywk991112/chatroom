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
      console.log("login success");
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
    case 'CHANGE_USER':
        return {
          ...state,
          username: action.username
        }
    case 'CHANGE_PASSWORD':
        return {
          ...state,
          password: action.password
        }
    default:
      return state;
  }
}

export default login;
