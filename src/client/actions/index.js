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

export const chat = (id) => {
  return {
    type: types.CHAT,
    id
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
