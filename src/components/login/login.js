//REACT
import React, { Component } from 'react';

//STYLE
import './login.scss';

//CONTEXT
import { MContext } from '../../provider/provider';

//IMG
import login from '../../assets/login.svg';

class Login extends Component {
  render() {
    return (
      <div className="loging-box">
        <MContext.Consumer>
          {context => (
            <React.Fragment>
              <p className="loging-text">
                Please click on the CINEMA studio icon to login
              </p>
              <img
                className="loging-img"
                onClick={context.loginWithRedirect}
                src={login}
                alt="login-img"
              ></img>
            </React.Fragment>
          )}
        </MContext.Consumer>
      </div>
    );
  }
}

export default Login;
