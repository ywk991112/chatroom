const chat = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_HISTORY':
      return {
        ...state,
      };
    case 'RESPONSE_HISTORY':
      return {
        ...state,
        channel: action.channel,
        slideIndex: 1
      };
    case 'GET_MESSAGE':
      if(action.fromName == state.channel.username) {
        return {
          ...state,
          channel: {
            ...state.channel,
            history: [...history, {send: false, time: action.time, text: action.text}]
          }
        };
      } else {
        return {
          ...state
        }
      }
    case 'CHANGE_SLIDE':
      return {
        ...state,
        slideIndex: action.idx
      };
    default:
      return state;
  }
}

export default chat;
