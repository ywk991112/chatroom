import React from 'react';
import { connect } from 'react-redux';
import { login, changeUser, changePassword } from '../actions';

class Login extends React.Component {

  constructor(props) {
    super(props);
    const { login, usr, pwd, submitLogin, changeUsr, changePwd } = this.props;
    console.log('login', login);
  }

  handleSubmit = (usr, pwd) => {
   console.log(usr, pwd); 
  }

  render() {
    return(
      <div>
        <label><b>Username</b></label>
        <input 
          id="username" 
          type="text" 
          placeholder="Enter your username" 
          value={this.usr} 
          required />
        <label><b>Password</b></label>
          <input 
            id="password" 
            type="password" 
            placeholder="Enter your password" 
            onChange={this.handle} 
            value={this.pwd} 
            required />
        <button onClick={this.handleSubmit(usr, pwd)}>Send</button>
      </div>
    )
  }
}

const mapStoreToProps = (state) => ({
  login: state.login,
  usr: state.username, 
  pwd: state.password
})

const mapDispatchToProps = (dispatch) => ({
  submitLogin: (usr, pwd) => {
    dispatch(login(usr, pwd));
  },
  changeUsr: (text) => {
    dispatch(changeUser(text));
  },
  changePwd: (text) => {
    dispatch(changePassword(text));
  } 
})

Login = connect(
  mapStoreToProps
)(Login)

export default Login;
