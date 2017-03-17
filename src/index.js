import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

try { 
  injectTapeEventPlugin(); 
}catch (e) {
  console.log("Inject Tape Event Error");
}

const App = () => (
  <MuiThemeProvider>
  </MuiThemeProvider>
);

render(
  <App />,
  document.getElementById('')
);
