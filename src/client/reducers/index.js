import { combineReducers } from 'redux';
import chat from './chat';
import messages from './messages';
import login from './login';
import slide from './slide';

const chatroomApp = combineReducers({
  chat,
  messages,
  login,
  slide
})

export default chatroomApp;
