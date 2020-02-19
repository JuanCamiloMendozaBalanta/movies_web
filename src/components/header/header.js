//REACT
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//STYLE
import './header.scss';

//COMPONENTS
import Profile from '../profile/profile';

//IMAGES
import logo from '../../assets/logo.svg';
import profile_img from '../../assets/profile.svg';
import login_img from '../../assets/login.svg';

//CONTEXT

class header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: false
    };
  }

  setProfileState = () => {
    const { profile } = this.state;
    this.setState({
      profile: profile ? false : true
    });
  };
  render() {
    const { profile } = this.state;
    const { context } = this.props;

    const header = (
      <section className="header-wrap">
        <Link to="/home" className="header-left">
          <img className="header-left-logo" src={logo} alt="logo"></img>
          <p className="header-left-name">
            {context.isAuthenticated
              ? context.user.given_name
              : 'Welcome to MOVIES'}
          </p>
        </Link>
        <div className="header-right">
          {context.isAuthenticated ? (
            <img
              className="header-right-profile"
              src={profile_img}
              alt="profile_img"
              onClick={() => this.setProfileState()}
            ></img>
          ) : (
            <img
              className="header-right-profile"
              src={login_img}
              alt="login"
              onClick={context.loginWithRedirect}
            ></img>
          )}
          <div>
            {profile ? (
              <Profile
                name={context.user.name}
                image={context.user.picture}
                logout={context.logout}
                setProfileState={this.setProfileState}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </section>
    );
    return <div className="header-box">{header}</div>;
  }
}

export default header;
