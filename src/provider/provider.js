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
      { id: 9, isSelected: false, value: 2019 },
      { id: 8, isSelected: false, value: 2018 },
      { id: 7, isSelected: false, value: 2017 },
      { id: 6, isSelected: false, value: 2016 },
      { id: 5, isSelected: false, value: 2015 },
      { id: 4, isSelected: false, value: 2014 },
      { id: 3, isSelected: false, value: 2013 },
      { id: 2, isSelected: false, value: 2012 },
      { id: 1, isSelected: false, value: 2011 },
      { id: 0, isSelected: false, value: 2010 }
    ],
    othersOptions: [
      { id: 0, isSelected: false, value: 'Top 10' },
      { id: 1, isSelected: false, value: 'Latest' }
    ],
    currentYear: 2019,
    currentSearch: 'a',
    auth0Client: null,
    isLoading: true,
    user: null,
    isAuthenticated: false,
    showLoading: false,
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
      comments: [],
      currentComment: ''
    }
  };

  /**
   * selectHeaderOption
   * Change the current header option
   * @param {*} year
   */
  selectHeaderOption = async item => {
    const year = item.value;
    this.setState({
      headerOptions: [
        { id: 9, isSelected: year === 2019 ? true : false, value: 2019 },
        { id: 8, isSelected: year === 2018 ? true : false, value: 2018 },
        { id: 7, isSelected: year === 2017 ? true : false, value: 2017 },
        { id: 6, isSelected: year === 2016 ? true : false, value: 2016 },
        { id: 5, isSelected: year === 2015 ? true : false, value: 2015 },
        { id: 4, isSelected: year === 2014 ? true : false, value: 2014 },
        { id: 3, isSelected: year === 2013 ? true : false, value: 2013 },
        { id: 2, isSelected: year === 2012 ? true : false, value: 2012 },
        { id: 1, isSelected: year === 2011 ? true : false, value: 2011 },
        { id: 0, isSelected: year === 2010 ? true : false, value: 2010 }
      ],
      othersOptions: [
        { id: 0, isSelected: false, value: 'Top 10' },
        { id: 1, isSelected: false, value: 'Latest' }
      ],
      currentYear: year
    });
    await this.initMovies(year, this.state.currentSearch);
  };

  selectOthersOptions = async item => {
    const { value } = item;
    this.setState({
      othersOptions: [
        {
          id: 0,
          isSelected: value === 'Top 10' ? true : false,
          value: 'Top 10'
        },
        {
          id: 1,
          isSelected: value === 'Latest' ? true : false,
          value: 'Latest'
        }
      ]
    });
    this.callToOthersFilters(item);
  };
  setCurrentSearch = async value => {
    const search = value && value !== '' ? value : 'a';
    this.setState({
      currentSearch: search
    });
    await this.initMovies(this.state.currentYear, search);
  };
  setCurrentMovie = async id => {
    const movie = await this.initCurrentMovie(id);
    await this.getVideoUrls(id);
    await this.updateScoreAndComments(movie);
    this.props.history.push(`/movie/${id}`);
  };

  setMovieScore = async scoreId => {
    const { currentScore, score } = this.state.currentMovie;
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

    const newMovie = this.state.currentMovie;
    newMovie.score = newScore;
    newMovie.currentScore = scoreId;

    this.setState({
      currentMovie: newMovie
    });
    await this.save(newMovie);
  };

  setMovieComment = async comment => {
    const { id } = this.state.currentMovie;
    const newMovie = this.state.currentMovie;
    newMovie.currentComment = comment;

    this.setState({
      currentMovie: newMovie,
      showLoading: true
    });
    await this.save({ id, comment });
  };

  save = async data => {
    const { id, currentScore, comment } = data;
    const { email } = this.state.user;
    const getInfoMovies = await this.getInfoMovies(id, email);
    const info = {
      movie: id,
      user: email,
      score: currentScore,
      comment
    };
    if (getInfoMovies && getInfoMovies.length > 0) {
      await this.updateInfoMovies(info);
    } else {
      await this.saveInfoMovies(info);
    }
  };

  getInfoMovies = (idMovie, email) => {
    try {
      return axios
        .get(`${api_url}/movies/?movie=${idMovie}&user=${email}`)
        .then(response => {
          return response.data;
        })
        .catch(e => console.error(`error ${e}`));
    } catch (error) {
      console.error(error);
    }
  };

  getVideoUrls = id => {
    try {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${movie_key}&append_to_response=videos`
        )
        .then(response => {
          const videos = response.data.videos.results
            ? response.data.videos.results
            : [];
          const newMovie = this.state.currentMovie;
          newMovie.videos = videos;
          this.setState({
            currentMovie: newMovie
          });
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
          this.setState({
            showLoading: false
          });
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
          this.setState({
            showLoading: false
          });
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
      const { currentYear, currentSearch } = this.state;
      await this.initMovies(currentYear, currentSearch);
      this.setState({
        user: userLocalStorage,
        isAuthenticated: true,
        isLoading: false
      });
    }
  };

  initMovies = async (year, search) => {
    try {
      axios
        .get(
          `${movie_api_url}/search/movie?api_key=${movie_key}&query=${search}&page=1&region=US&year=${year}`
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

  callToOthersFilters = async item => {
    const { id } = item;
    if (id) {
      try {
        axios
          .get(`${movie_api_url}/movie/latest?api_key=${movie_key}`)
          .then(response => {
            const res = {
              results: [response.data]
            };
            this.setState({
              movies: res
            });
          })
          .catch(e => console.error(`error ${e}`));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        axios
          .get(`${movie_api_url}/movie/top_rated?api_key=${movie_key}`)
          .then(response => {
            response.data.results = response.data.results.slice(0, 10);
            this.setState({
              movies: response.data
            });
          })
          .catch(e => console.error(`error ${e}`));
      } catch (error) {
        console.log(error);
      }
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
    if (data) {
      const otherComments = data.filter(
        ele => ele.user !== user.email && ele.comment
      );
      const userInfo = data.find(
        ele => ele.user === user.email && ele.movie === id.toString()
      );
      const newMovie = movie;
      newMovie.comments = otherComments;
      if (userInfo) {
        const { score, comment } = userInfo;
        const newScore = movie.score.map(ele => {
          if (ele.id <= score) {
            ele.isSelected = true;
          } else {
            ele.isSelected = false;
          }
          return ele;
        });
        newMovie.score = newScore;
        newMovie.currentComment = comment;
      }
      this.setState({
        currentMovie: newMovie
      });
    }
  };

  handleRedirectCallback = async () => {
    this.setState({ isLoading: true });
    const { auth0Client } = this.state;
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    if (user) {
      const { currentYear, currentSearch } = this.state;
      await this.initMovies(currentYear, currentSearch);
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
    window.scrollTo(0, 0);
    await this.initializeAuth0();
  };

  componentWillMount = async () => {
    const route = this.props.history.location.pathname;
    if (route.includes('movie')) {
      const id = route.split('/').pop();
      const movie = await this.initCurrentMovie(id);
      await this.getVideoUrls(id);
      await this.updateScoreAndComments(movie);
    }
  };

  render() {
    const {
      auth0Client,
      isLoading,
      isAuthenticated,
      headerOptions,
      othersOptions,
      user,
      movies,
      currentMovie,
      showLoading
    } = this.state;
    const {
      selectHeaderOption,
      selectOthersOptions,
      setCurrentMovie,
      setMovieScore,
      setMovieComment,
      setCurrentSearch,
      logout
    } = this;
    const configObject = {
      isLoading,
      isAuthenticated,
      user,
      movies,
      currentMovie,
      showLoading,
      selectHeaderOption,
      setCurrentMovie,
      setMovieScore,
      setMovieComment,
      headerOptions,
      othersOptions,
      selectOthersOptions,
      setCurrentSearch,
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
