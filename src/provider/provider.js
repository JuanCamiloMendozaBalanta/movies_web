//REACT
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {
  auth0_domain,
  auth0_client_id,
  redirect_uri,
  movie_key,
  api_url,
  movie_api_url
} from '../configuration/config';
import createAuth0Client from '@auth0/auth0-spa-js';

//AXIOS
import axios from 'axios';

//CONTEXT
const MyContext = React.createContext();

class Provider extends Component {
  state = {
    headerOptions: [
      { id: 9, isSelected: true, year: 2019 },
      { id: 8, isSelected: false, year: 2018 },
      { id: 7, isSelected: false, year: 2017 },
      { id: 6, isSelected: false, year: 2016 },
      { id: 5, isSelected: false, year: 2015 },
      { id: 4, isSelected: false, year: 2014 },
      { id: 3, isSelected: false, year: 2013 },
      { id: 2, isSelected: false, year: 2012 },
      { id: 1, isSelected: false, year: 2011 },
      { id: 0, isSelected: false, year: 2010 }
    ],
    currentYear: 2019,
    auth0Client: null,
    isLoading: true,
    user: null,
    isAuthenticated: false,
    movies: [],
    currentMovie: {
      id: null,
      release_date: null,
      title: null,
      overview: null,
      poster_path: null,
      score: [
        { id: 1, isSelected: false },
        { id: 2, isSelected: false },
        { id: 3, isSelected: false },
        { id: 4, isSelected: false },
        { id: 5, isSelected: false }
      ],
      currentScore: 0,
      comments: ''
    }
  };

  /**
   * selectHeaderOption
   * Change the current header option
   * @param {*} year
   */
  selectHeaderOption = async year => {
    this.setState({
      headerOptions: [
        { id: 9, isSelected: year === 2019 ? true : false, year: 2019 },
        { id: 8, isSelected: year === 2018 ? true : false, year: 2018 },
        { id: 7, isSelected: year === 2017 ? true : false, year: 2017 },
        { id: 6, isSelected: year === 2016 ? true : false, year: 2016 },
        { id: 5, isSelected: year === 2015 ? true : false, year: 2015 },
        { id: 4, isSelected: year === 2014 ? true : false, year: 2014 },
        { id: 3, isSelected: year === 2013 ? true : false, year: 2013 },
        { id: 2, isSelected: year === 2012 ? true : false, year: 2012 },
        { id: 1, isSelected: year === 2011 ? true : false, year: 2011 },
        { id: 0, isSelected: year === 2010 ? true : false, year: 2010 }
      ],
      currentYear: year
    });
    await this.saveInfoMovie(this.state.currentMovie);
  };

  setCurrentMovie = async id => {
    const movie = await this.initCurrentMovie(id);
    await this.updateScoreAndComments(movie);
    this.props.history.push(`/movie/${id}`);
  };

  setMovieScore = async scoreId => {
    const {
      id,
      release_date,
      title,
      overview,
      poster_path,
      comments,
      currentScore,
      score
    } = this.state.currentMovie;

    if (scoreId === currentScore) {
      scoreId--;
    }
    const newScore = score.map(ele => {
      if (ele.id <= scoreId) {
        ele.isSelected = true;
      } else {
        ele.isSelected = false;
      }
      return ele;
    });

    const newMovie = {
      id,
      release_date,
      title,
      overview,
      poster_path,
      score: newScore,
      currentScore: scoreId,
      comments
    };
    this.setState({
      currentMovie: newMovie
    });
    await this.save(newMovie);
  };

  save = async data => {
    const { id, currentScore, comment } = data;
    const { email } = this.state.user;
    const movies = await this.getInfoMovies(id);
    const info = {
      movie: id,
      user: email,
      score: currentScore,
      comment
    };
    if (movies && movies.length === 0) {
      await this.saveInfoMovies(info);
    } else {
      await this.updateInfoMovies(info);
    }
  };

  getInfoMovies = idMovie => {
    try {
      return axios
        .get(`${api_url}/movies/?id=${idMovie}`)
        .then(response => {
          return response.data;
        })
        .catch(e => console.error(`error ${e}`));
    } catch (error) {
      console.error(error);
    }
  };

  saveInfoMovies = async data => {
    try {
      return await axios
        .post(`${api_url}/movies`, data)
        .then(response => {
          return response.data;
        })
        .catch(e => console.error(`error ${e}`));
    } catch (error) {
      console.log(error);
    }
  };

  updateInfoMovies = async data => {
    const { movie, user, score, comment } = data;
    try {
      return await axios
        .put(`${api_url}/movies/${movie}/${user}`, { score, comment })
        .then(response => {
          return response.data;
        })
        .catch(e => console.error(`error ${e}`));
    } catch (error) {
      console.log(error);
    }
  };

  initializeAuth0 = async () => {
    const userLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (!userLocalStorage) {
      const auth0Client = await createAuth0Client({
        domain: auth0_domain,
        client_id: auth0_client_id,
        redirect_uri
      });
      this.setState({ auth0Client });
      if (window.location.search.includes('code=')) {
        return this.handleRedirectCallback();
      }
      const isAuthenticated = await auth0Client.isAuthenticated();
      const user = isAuthenticated ? await auth0Client.getUser() : null;
      this.setState({ user, isLoading: false, isAuthenticated });
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    } else {
      await this.initMovies(this.state.currentYear);
      this.setState({
        user: userLocalStorage,
        isAuthenticated: true,
        isLoading: false
      });
    }
  };

  initMovies = async year => {
    try {
      axios
        .get(
          `${movie_api_url}/search/movie?api_key=${movie_key}&query=a&page=1&region=US&year=${2019}`
        )
        .then(response => {
          this.setState({
            movies: response.data
          });
        })
        .catch(e => console.error(`error ${e}`));
    } catch (error) {
      console.log(error);
    }
  };

  initCurrentMovie = async id => {
    try {
      return await axios
        .get(`${movie_api_url}/movie/${id}?api_key=${movie_key}`)
        .then(response => {
          const {
            id,
            release_date,
            title,
            overview,
            poster_path
          } = response.data;
          const newMovie = {
            id,
            release_date,
            title,
            overview,
            poster_path,
            score: [
              { id: 1, isSelected: false },
              { id: 2, isSelected: false },
              { id: 3, isSelected: false },
              { id: 4, isSelected: false },
              { id: 5, isSelected: false }
            ],
            comments: []
          };
          this.setState({
            currentMovie: newMovie
          });
          return newMovie;
        })
        .catch(e => console.error(`error ${e}`));
    } catch (error) {
      console.error(error);
    }
  };

  updateScoreAndComments = async movie => {
    const { id } = movie;
    const data = await this.getInfoMovies(id);
    const { user } = this.state;
    console.log();
    const userInfo = data.find(ele => {
      if (ele.user === user.email && ele.movie === id.toString()) {
        return ele;
      }
    });
    if (userInfo) {
      const { score } = userInfo;
      const newMovie = movie;
      const newScore = movie.score.map(ele => {
        if (ele.id <= score) {
          ele.isSelected = true;
        } else {
          ele.isSelected = false;
        }
        return ele;
      });
      newMovie.score = newScore;
      this.setState({
        currentMovie: newMovie,
        currentScore: score
      });
    }
  };

  handleRedirectCallback = async () => {
    this.setState({ isLoading: true });
    const { auth0Client } = this.state;
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    if (user) {
      await this.initMovies(this.state.currentYear);
      this.setState({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  logout = async (...p) => {
    const auth0Client = await createAuth0Client({
      domain: auth0_domain,
      client_id: auth0_client_id,
      redirect_uri
    });
    localStorage.clear();
    auth0Client.logout(...p);
  };

  componentDidMount = async () => {
    await this.initializeAuth0();
  };

  componentWillMount = async () => {
    const route = this.props.history.location.pathname;
    if (route.includes('movie')) {
      const id = route.split('/').pop();
      const movie = await this.initCurrentMovie(id);
      await this.updateScoreAndComments(movie);
    }
  };

  render() {
    const {
      auth0Client,
      isLoading,
      isAuthenticated,
      headerOptions,
      user,
      movies,
      currentMovie
    } = this.state;
    const { selectHeaderOption, setCurrentMovie, setMovieScore, logout } = this;
    const configObject = {
      isLoading,
      isAuthenticated,
      user,
      movies,
      currentMovie,
      selectHeaderOption,
      setCurrentMovie,
      setMovieScore,
      headerOptions,
      loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
      getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
      getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
      logout: logout
    };
    return (
      <MyContext.Provider value={configObject}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export const MProvider = withRouter(Provider);
export const MContext = MyContext;
