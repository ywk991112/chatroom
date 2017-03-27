const login = (state = {}, action) => {
  switch(action.type) {
    case 'LOGIN_SUCCESS':
      return {
        login: true,
        success: true
      }
    case 'LOGIN_FAILURE':
      return {
        login: true,
        success: false
      }
    default:
      return state;
  }
}

export default login;
