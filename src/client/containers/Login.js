import React from 'react';
import { connect } from 'react-redux';
import { login, changeUser, changePassword } from '../actions';

class Login extends React.Component {

  constructor(props) {
    super(props);
    const { login } = this.props;
    console.log('login', login);
  }

  handleSubmit = () => {
    const { submitLogin, usr, pwd } = this.props;
    submitLogin(usr, pwd);
  }

  handleChangeUsr = (event) => {
    const { changeUsr } = this.props;
    changeUsr(event.target.value);
  }

  handleChangePwd = (event) => {
    const { changePwd } = this.props;
    changePwd(event.target.value);
  }

  render() {
    return(
      <div>
        <label><b>Username</b></label>
        <input 
          id="username" 
          type="text" 
          placeholder="Enter your username" 
          onChange={this.handleChangeUsr}
          required />
        <label><b>Password</b></label>
          <input 
            id="password" 
            type="password" 
            placeholder="Enter your password" 
            onChange={this.handleChangePwd} 
            required />
        <button onClick={this.handleSubmit}>Send</button>
      </div>
    )
  }
}

const mapStoreToProps = (state) => ({
  login: state.login,
  usr: state.login.username, 
  pwd: state.login.password
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
  mapStoreToProps,
  mapDispatchToProps
)(Login)

export default Login;
