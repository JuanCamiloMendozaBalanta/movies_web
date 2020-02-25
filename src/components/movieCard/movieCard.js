//REACT
import React from 'react';

//STYLE
import './movieCard.scss';

//IMG
import imageNotFound from '../../assets/imageNotFound.svg';

const MovieCard = props => {
  const { image, date, title } = props;
  const imageUrl = image
    ? `https://image.tmdb.org/t/p/w500${image}`
    : imageNotFound;
  return (
    <div className="movieCard-box">
      <img className="movieCard-img" src={imageUrl} alt="movieCard-img" />
      <p className="movieCard-date">{date}</p>
      <p className="movieCard-title">{title}</p>
    </div>
  );
};

export default MovieCard;
