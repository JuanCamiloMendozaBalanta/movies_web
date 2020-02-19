//REACT
import React from 'react';

//STYLE
import './profile.scss';

const Profile = props => {
  const { image, name, setProfileState, logout } = props;
  return (
    <div className="profile-box">
      <div className="profile-header">
        <i className="material-icons" onClick={() => setProfileState()}>
          close
        </i>
      </div>
      <div className="profile-content">
        <img className="profile-img" src={image} alt="profile-img" />
        <p className="profile-name">{name}</p>
      </div>
      <div className="profile-exit" onClick={() => logout()}>
        <i className="material-icons">exit_to_app</i>
        <p className="profile-logout">Log out</p>
      </div>
    </div>
  );
};

export default Profile;
