//REACT
import React, { Component } from 'react';

//STYLE
import './dashboard.scss';

//CONTEXT
import { MContext } from '../../provider/provider';

//COMPONENTS
import MovieCard from '../movieCard/movieCard';

class Dashboard extends Component {
  render() {
    const header = (
      <section className="dashboard-wrap">
        <MContext.Consumer>
          {context => (
            <React.Fragment>
              <div className="dashboard-controls">
                {context.headerOptions.map((item, i) => {
                  return (
                    <div
                      className={`dashboard-options ${
                        item.isSelected ? 'isSelected' : ''
                      } `}
                      key={i}
                      onClick={() => context.selectHeaderOption(item.year)}
                    >
                      {item.year}
                    </div>
                  );
                })}
              </div>
              <div className="dashboard-content">
                {context.movies.results &&
                  context.movies.results.map((item, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => context.setCurrentMovie(item.id)}
                      >
                        <MovieCard
                          image={item.poster_path}
                          date={item.release_date}
                          title={item.title}
                        />
                      </div>
                    );
                  })}
              </div>
            </React.Fragment>
          )}
        </MContext.Consumer>
      </section>
    );
    return <div className="dashboard-box">{header}</div>;
  }
}

export default Dashboard;
