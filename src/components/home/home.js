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
  render() {
    return (
      <div className="home-box">
        <MContext.Consumer>
          {context => (
            <React.Fragment>
              <Header context={context} />
              <Switch>
                {context.isAuthenticated ? (
                  <Route
                    exact
                    path="/"
                    render={props => <Dashboard {...props} context={context} />}
                  />
                ) : (
                  <Route exact path="/" component={Login} />
                )}

                <Route exact path="/login" component={Login} />
                <Route
                  exact
                  path="/home"
                  render={props => <Dashboard {...props} context={context} />}
                />
                <Route
                  exact
                  path="/movie/:id"
                  render={props => <Movie {...props} context={context} />}
                />
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
