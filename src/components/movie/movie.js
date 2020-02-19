//REACT
import React, { useState, useEffect } from 'react';

//COMPONENTS
import CustomButton from '../cutomButton/cutomButton';

//STYLE
import './movie.scss';

const Movie = props => {
  const { context } = props;
  const imageUrl = image => {
    return `https://image.tmdb.org/t/p/w500${image}`;
  };
  const [comment, setComment] = useState('');
  useEffect(() => {
    const textarea = document.getElementById('textarea-1');
    if (textarea) {
      textarea.value = context.currentMovie.currentComment;
    }
  });

  return (
    <div className="movie-box">
      {context.currentMovie.id && (
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
              <h1 className="movie-title">{context.currentMovie.title}</h1>
              <p className="movie-date">{context.currentMovie.release_date}</p>
              <p className="movie-overview">{context.currentMovie.overview}</p>
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
                <textarea
                  id="textarea-1"
                  value={comment}
                  className="movie-text-comment"
                  onChange={e => setComment(e.target.value)}
                ></textarea>
                <div className="movie-comment-buttons">
                  <CustomButton
                    backgroundColor="#439f9a"
                    textColor="#ffffff"
                    icon="add_comment"
                    setMovieComment={context.setMovieComment}
                    comment={comment}
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
    </div>
  );
};

export default Movie;
