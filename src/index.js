import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';

//ROUTER
import { BrowserRouter } from 'react-router-dom';

//STYLE
import './style/main.scss';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
