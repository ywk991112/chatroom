import React from 'react';
import { connect } from 'react-redux';
import ChatAppBar from '../containers/ChatAppBar';
import Login from '../containers/Login';
import NavBar from '../containers/NavBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

let App = ({login, loginSuccess}) => {
  return (
    <MuiThemeProvider>
      <div>
        <ChatAppBar />
        {loginSuccess? <NavBar /> : <Login />};
      </div>
    </MuiThemeProvider>
  )
}

const mapStateToProps = (state) => ({
  login: state.login.login,
  loginSuccess: state.login.loginSuccess
})

App = connect(
  mapStateToProps
)(App);

export default App;
