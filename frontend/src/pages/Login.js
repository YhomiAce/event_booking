import React, { Component } from "react";
import "./Auth.css";
import AuthContext from '../context/auth-context';

class Login extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }
  static contextType = AuthContext;

  loginhandler = (e) => {
    e.preventDefault();
    const email = this.email.current.value;
    const password = this.password.current.value;
    const body = {
      query: `
                query {
                    login(email:"${email}", password:"${password}"){
                        userId
                        token
                        tokenExpire
                    }
                }
            `,
    };
    fetch("http://localhost:5000/api/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resp) => {
        console.log(resp);
        this.context.login(resp.data.login.token, resp.data.login.userId, resp.data.login.tokenExpire)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.loginhandler}>
        <h2>Login User</h2>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.email} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.password} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
export default Login;
