import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'babel-polyfill'

import configureStore from './store';
import App from './components/App';
import './css/index.scss';

try { 
  injectTapEventPlugin(); 
}catch (e) {
  console.log("Inject Tap Event Error");
}

render(
  <Provider store={configureStore()}>
    <App />
  </Provider>, 
  document.getElementById('app')
);
