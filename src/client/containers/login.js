import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions';

class Login extends React.Component {

  constructor(props) {
    super(props);
    const {login} = this.props;
    console.log('login', login);
  }

  handleSubmit = () => {
    
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
        <button onClick={this.handleSubmit}>Send</button>
      </div>
    )
  }
}

const mapStoreToProps = (state) => ({
  login: state.login
})

const mapDispatchToProps = (dispatch) => ({
  submitLogin: (usr, pwd) => {
    dispatch(login(usr, pwd))
  } 
})

Login = connect(
  mapStoreToProps
)(Login)

export default Login;
