import React, { Component, Fragment } from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import Navigation from "./components/Navigation/Navigation";
import AuthContext from "./context/auth-context";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };
  login = (token, userId, tokenExpire) => {
    this.setState({ token, userId });
  };
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <Navigation />
          <main className="main-content">
            <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact />}
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              {!this.state.token && (
                <Fragment>
                  <Route path="/auth" exact component={Login} />
                  <Route path="/register" exact component={Register} />
                </Fragment>
              )}
              <Route path="/events" exact component={EventsPage} />
              {this.state.token && (
                <Route path="/bookings" exact component={BookingsPage} />
              )}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
