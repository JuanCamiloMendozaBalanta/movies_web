//REACT
import React from 'react';

//STYLE
import './movieCard.scss';

const MovieCard = props => {
  const { image, date, title } = props;
  const imageUrl = `https://image.tmdb.org/t/p/w500${image}`;
  return (
    <div className="movieCard-box">
      <img className="movieCard-img" src={imageUrl} alt="movieCard-img" />
      <p className="movieCard-date">{date}</p>
      <p className="movieCard-title">{title}</p>
    </div>
  );
};

export default MovieCard;
