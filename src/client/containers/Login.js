import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import { connect } from 'react-redux';

class Login extends React.Component {
  constructor(props) {
    super(props);
    const {login} = this.props;
    console.log('login', login);
  }

  submit = (values) => {
    // Do something with the form values
    console.log('fuck');
    console.log(values);
  }

  render() {
    return (
      <LoginForm handleSubmit={this.submit} />
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login
})

Login = connect(
  mapStateToProps
)(Login)

export default Login;
