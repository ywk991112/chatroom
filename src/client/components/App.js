import React from 'react';
import ChatAppBar from './ChatAppBar';
import NavBar from '../containers/NavBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => (
  <MuiThemeProvider>
    <div>
      <ChatAppBar />
      <NavBar />
    </div>
  </MuiThemeProvider>
)

export default App;
