import * as types from '../constants/ActionTypes';

export const chat = (username) => {
  return {
    type: types.CHAT,
    username
  };
}

export const sendMessage = (message) => {
  return {
    type: types.SEND_MESSAGE,
    message
  }
}

export const getMessage = (message) => {
  return {
    type: types.GET_MESSAGE,
    message
  }
}

export const changeChannel = (username) => { // socket.io
  // do some socket.io username => channel
  return {
    type: types.CHANGE_CHANNEL,
    channel
  }
}

export const changeSlide = (idx) => {
  return {
    type: types.CHANGE_SLIDE,
    idx
  }
}

export const login = (username, password) => {
  console.log('login');
  return {
    type: types.LOGIN,
    username,
    password
  }
}

export const logout = () => {
  return {
    type: types.LOGOUT
  }
}

export const loginSuccess = (data) => {
  return {
    type: types.LOGIN_SUCCESS,
    user: data.user,
    friends: data.friends,
    channel: data.channel
  }
}

export const loginFailure = () => {
  return {
    type: types.LOGIN_FAILURE
  }
}

export const changeUser = (username) => {
  return {
    type: types.CHANGE_USER,
    username
  }
}

export const changePassword = (password) => {
  return {
    type: types.CHANGE_PASSWORD,
    password
  }
}
