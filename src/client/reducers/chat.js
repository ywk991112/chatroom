const chat = (state = {}, action) => {
  switch (action.type) {
    case 'CLICK_CHAT':
      return {
        ...state,
        chatId: action.id
      };
    default:
      return state;
  }
}

export default chat;
