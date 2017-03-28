const slide = (state = {}, action) => {
  switch(action.type) {
    case 'CHANGE_SLIDE':
      return {
        ...state,
        slideIndex: action.idx
      };
    default:
      return state;
  }
}

export default slide;
