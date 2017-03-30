import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class LoginForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="Username">User Name</label>
          <Field name="username" component="input" type="text"/>
        </div>
        <div>
          <label htmlFor="Password">Password</label>
          <Field name="password" component="input" type="text"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

// Decorate the form component
LoginForm = reduxForm({
  form: 'login' // a unique name for this form
})(LoginForm);

export default LoginForm;
