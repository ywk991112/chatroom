import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/App';
import './css/index.scss';

try { 
  injectTapEventPlugin(); 
}catch (e) {
  console.log("Inject Tap Event Error");
}

const store = createStore(reducer, {chat: {username: 'hao123'}});

render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('app')
);
