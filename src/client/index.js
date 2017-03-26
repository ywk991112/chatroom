import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './containers/App';
import './css/index.scss';

try { 
  injectTapEventPlugin(); 
}catch (e) {
  console.log("Inject Tap Event Error");
}

render(
  <App />,
  document.getElementById('app')
);
