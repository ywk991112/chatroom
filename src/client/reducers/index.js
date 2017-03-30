import { combineReducers } from 'redux';
import chat from './chat';
import messages from './messages';
import login from './login';

const chatroomApp = combineReducers({
  chat,
  messages,
  login
})

export default chatroomApp;
