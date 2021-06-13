import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";
import AuthContext from "../../context/auth-context";

const Navigation = () => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-nav">
            <div className="main-nav-logo">
              <h1>XpressEVent</h1>
            </div>
            <nav className="main-nav-items">
              <ul>
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                )}
                {!context.token && (
                  <Fragment>
                    <li>
                      <NavLink to="/auth">Login</NavLink>
                    </li>
                    <li>
                      <NavLink to="/register">Sign Up</NavLink>
                    </li>
                  </Fragment>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default Navigation;
