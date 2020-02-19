//REACT
import React from 'react';

//CONTEXT
import { MContext } from '../../provider/provider';

//COMPONENTS
import CustomButton from '../cutomButton/cutomButton';

//STYLE
import './movie.scss';

const Movie = () => {
  const imageUrl = image => {
    return `https://image.tmdb.org/t/p/w500${image}`;
  };

  return (
    <div className="movie-box">
      <MContext.Consumer>
        {context => (
          <React.Fragment>
            {context.currentMovie && (
              <section className="movie-wrap">
                <div className="movie-header">
                  <div className="movie-left">
                    <img
                      className="movie-img"
                      src={imageUrl(context.currentMovie.poster_path)}
                      alt="movieCard-img"
                    />
                  </div>
                  <div className="movie-right">
                    <h1 className="movie-title">
                      {context.currentMovie.title}
                    </h1>
                    <p className="movie-date">
                      {context.currentMovie.release_date}
                    </p>
                    <p className="movie-overview">
                      {context.currentMovie.overview}
                    </p>
                    <ul className="movie-score">
                      {context.currentMovie.score.map((item, i) => {
                        return (
                          <li
                            className="movie-start"
                            onClick={() => context.setMovieScore(item.id)}
                          >
                            {item.isSelected ? (
                              <i className="material-icons isSelected">star</i>
                            ) : (
                              <i className="material-icons">star</i>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <div className="movie-comment">
                      <textarea className="movie-text-comment"></textarea>
                      <div className="movie-comment-buttons">
                        <CustomButton
                          backgroundColor="#439f9a"
                          textColor="#ffffff"
                          text=""
                          icon="add_comment"
                        />
                        <CustomButton
                          backgroundColor="#ea3e3c"
                          textColor="#ffffff"
                          icon="delete"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </React.Fragment>
        )}
      </MContext.Consumer>
    </div>
  );
};

export default Movie;
