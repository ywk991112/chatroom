const chat = (state = {}, action) => {
  console.log(state.username);
  switch (action.type) {
    case 'CHANGE_CHANNEL':
      return {
        ...state,
        channel: action.channel
      };
    default:
      return state;
  }
}

export default chat;
