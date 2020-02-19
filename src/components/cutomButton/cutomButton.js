//REACT
import React from 'react';

//STYLE
import './cutomButton.scss';

const CustomButton = props => {
  const { backgroundColor, textColor, text, icon } = props;
  return (
    <div
      className="cutomButton-box"
      style={{ backgroundColor: `${backgroundColor}`, color: `${textColor}` }}
    >
      {text ? <p className="cutomButton-tex">{text}</p> : ''}
      <div>
        {icon ? <i className="material-icons cutomButton-icon ">{icon}</i> : ''}
      </div>
    </div>
  );
};

export default CustomButton;
