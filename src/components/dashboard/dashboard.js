//REACT
import React, { useState } from 'react';

//STYLE
import './dashboard.scss';

//COMPONENTS
import MovieCard from '../movieCard/movieCard';

const Dashboard = props => {
  const { context } = props;
  const [search, setSearch] = useState('a');
  const callToSetSearch = async value => {
    setSearch(value);
    await context.setCurrentSearch(value);
  };
  return (
    <div className="dashboard-box">
      {context && (
        <section className="dashboard-wrap">
          <div className="dashboard-controls">
            <ul className="dashboard-years">
              {context.headerOptions.map((item, i) => {
                return (
                  <li
                    className={`dashboard-options ${
                      item.isSelected ? 'isSelected' : ''
                    } `}
                    key={i}
                    onClick={() => context.selectHeaderOption(item.year)}
                  >
                    {item.year}
                  </li>
                );
              })}
            </ul>
            <div className="dashboard-search-wrap">
              <input
                id="search-1"
                value={search}
                className="dashboard-search-input"
                onChange={e => callToSetSearch(e.target.value)}
              ></input>
              <i className="material-icons">search</i>
            </div>
          </div>
          <div className="dashboard-content">
            {context.movies.results &&
              context.movies.results.map((item, i) => {
                return (
                  <div key={i} onClick={() => context.setCurrentMovie(item.id)}>
                    <MovieCard
                      image={item.poster_path}
                      date={item.release_date}
                      title={item.title}
                    />
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
