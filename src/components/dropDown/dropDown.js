//REACT
import React, { useState } from 'react';

//STYLE
import './dropDown.scss';

const DropDown = props => {
  const { minWidth, initialText, options, changeCurrentValue } = props;
  const [show, setShow] = useState(false);

  const getSelectedOption = () => {
    const selected = options.find(ele => ele.isSelected);
    return selected;
  };

  const currentValue = getSelectedOption();
  return (
    <div className="dropDown-box" style={{ minWidth: minWidth }}>
      <div className="dropDown-header" onClick={() => setShow(!show)}>
        <span className="dropDown-current-option">
          {currentValue ? currentValue.value : initialText}
        </span>
        {show ? (
          <i className="material-icons"> keyboard_arrow_down</i>
        ) : (
          <i className="material-icons">keyboard_arrow_up</i>
        )}
      </div>
      {show && (
        <ul className="dropDown-list">
          {options.map((item, i) => {
            return (
              <li
                className={`dropDown-options ${
                  item.isSelected ? 'isSelected' : ''
                } `}
                key={i}
                onClick={() => changeCurrentValue(item)}
              >
                <span className="dropDown-options-value">{item.value}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
