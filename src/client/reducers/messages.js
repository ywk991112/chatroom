const message = (state, action) => {
  switch(action.type) {
    case 'SEND_MESSAGE':
      return {
        text: action.text,
        send: true
      }
    case 'GET_MESSAGE':
      return {
        text: action.text,
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
