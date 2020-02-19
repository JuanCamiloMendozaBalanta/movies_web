//REACT
import React, { Component } from 'react';

//ROUTES
import { Switch, Route } from 'react-router-dom';

//CONTEXT
import { MContext } from '../../provider/provider';

//COMPONENTS
import Header from '../header/header';
import Dashboard from '../dashboard/dashboard';
import Login from '../login/login';
import Movie from '../movie/movie';

//STYLE
import './home.scss';

class Home extends Component {
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
    return (
      <div className="home-box">
        <MContext.Consumer>
          {context => (
            <React.Fragment>
              <Header
                profile={profile}
                setProfileState={this.setProfileState}
                context={context}
              />
              <Switch>
                <Route
                  exact
                  path="/"
                  component={context.isAuthenticated ? Dashboard : Login}
                />
                <Route exact path="/login" component={Login} />
                <Route exact path="/home" component={Dashboard} />
                <Route
                  exact
                  path="/movie/:id"
                  render={props => <Movie {...props} context={context} />}
                ></Route>
                <Route component={Login} />
              </Switch>
            </React.Fragment>
          )}
        </MContext.Consumer>
      </div>
    );
  }
}

export default Home;
