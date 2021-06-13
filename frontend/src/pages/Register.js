import React, { Component } from "react";
import "./Auth.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.nameEl = React.createRef();
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }
  submitHandler = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const name = this.nameEl.current.value;
    const password = this.passwordEl.current.value;
    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0
    ) {
      return;
    }
    const request = {
        query: `
            mutation {
                createUser(userInput: {name: "${name}", email:"${email} ", password:"${password}"}){
                    _id
                    email
                }
            }
        `
    }
    fetch('http://localhost:5000/api/graphql', {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(res =>{
        if(res.status !== 200 && res.status !== 201){
            throw new Error("Failed!")
        }
        return res.json();
    }).then(result =>{
        console.log(result);
    })
    .catch(err =>{
        console.log(err);
    })
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h2>Register User</h2>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" ref={this.nameEl} />
        </div>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
export default Register;
