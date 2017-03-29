const message = (state, action) => {
  switch(action.type) {
    case 'SEND_MESSAGE':
      return {
        message: action.message,
        send: true
      }
    case 'GET_MESSAGE':
      return {
        message: action.message,
        send: false
      }
    default:
      return state;
  }
}

const messages = (state = [], action) => {
  switch(action.type) {
    case 'SEND_MESSAGE':
      return [
        ...state,
        message(undefined, action)
      ]
    case 'GET_MESSAGE':
      return [
        ...state,
        message(undefined, action)
      ]
    default:
      return state;
  }
}

export default messages;
