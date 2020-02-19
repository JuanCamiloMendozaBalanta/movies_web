const config = {
  auth0_domain: process.env.REACT_APP_AUTH0_DOMAIN,
  auth0_client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirect_uri: `${window.location.origin}/home`,
  api_url:
    process.env.REACT_APP_ENV === 'DEV'
      ? process.env.REACT_APP_API_URL_DEV
      : process.env.REACT_APP_API_URL_PROD,
  movie_key: process.env.REACT_APP_MOVIE_KEY,
  movie_api_url: process.env.REACT_APP_MOVIE_API_URL
};

module.exports = config;
