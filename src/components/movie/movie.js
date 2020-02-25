//REACT
import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import ReactPlayer from 'react-player';

//UTILS
import { imageUrl, videoUrl } from '../../utils';

//COMPONENTS
import CustomButton from '../cutomButton/cutomButton';

//STYLE
import './movie.scss';

const Movie = props => {
  const { context } = props;

  const [comment, setComment] = useState('');

  useEffect(() => {
    const textarea = document.getElementById('textarea-1');
    if (textarea && context.currentMovie.currentComment) {
      textarea.value = context.currentMovie.currentComment;
    }
  });

  const callToSetComment = () => {
    const textarea = document.getElementById('textarea-1');
    if (textarea && textarea.value) {
      setComment(textarea.value);
      context.setMovieComment(textarea.value);
    }
  };

  const deleteComment = () => {
    const textarea = document.getElementById('textarea-1');
    if (textarea && textarea.value) {
      setComment('');
      context.setMovieComment('');
    }
  };

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
                      key={i}
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
                  placeholder="Add a comment"
                ></textarea>
                {!context.showLoading ? (
                  <div className="movie-comment-buttons">
                    <CustomButton
                      backgroundColor="#439f9a"
                      textColor="#ffffff"
                      icon="add_comment"
                      setMovieComment={callToSetComment}
                    />
                    <CustomButton
                      backgroundColor="#ea3e3c"
                      textColor="#ffffff"
                      icon="delete"
                      setMovieComment={deleteComment}
                    />
                  </div>
                ) : (
                  <div className="reactLoading-wrap">
                    <ReactLoading
                      className="reactLoading-img"
                      type="bars"
                      color="#439f9a"
                      height={33}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {context.currentMovie.videos && (
            <div className="movie-trailers-wrap">
              <h1 className="movie-title">Trailers</h1>
              <ul className="movie-trailer">
                {context.currentMovie.videos.map(ele => {
                  return (
                    <ReactPlayer
                      url={videoUrl(ele)}
                      className="react-player"
                      controls={true}
                      width="100%"
                      height="250px"
                      className="movie-videos"
                    />
                  );
                })}
              </ul>
            </div>
          )}
          {context.currentMovie.comments && (
            <div>
              <h1 className="movie-title">Comments</h1>
              <ul className="movie-others-comments">
                {context.currentMovie.comments.map((item, i) => {
                  return (
                    <li key={i} className="movie-other-users">
                      <p className="movie-others-comments-user">{item.user}</p>
                      <p className="movie-others-comments-comment">
                        {item.comment}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Movie;
