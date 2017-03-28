import * as types from '../constants/ActionTypes';

export const loginSuccess = () => {
  return {
    type: types.LOGIN_SUCCESS
  }
}

export const loginFailure = () => {
  return {
    type: types.LOGIN_FAILURE
  }
}

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
