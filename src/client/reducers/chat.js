const chat = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_CHANNEL':
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
