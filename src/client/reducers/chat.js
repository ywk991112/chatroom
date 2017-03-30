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
