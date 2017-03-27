const message = (action) => {
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
  }
}

const messages = (state = [], action) => {
  switch(action.type) {
    case 'SEND_MESSAGE':
      return [
        ...state,
        message(action)
      ]
    case 'GET_MESSAGE':
      return [
        ...state,
        message(action)
      ]
  }
}

export default messages;
