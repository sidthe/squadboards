import React from 'react';
import PropTypes from 'prop-types';


const Modal = (props) => {
  if(!props.show) {
      return null;
    }

  return (
    <div className="w3-modal modal-display">
      <div className="w3-modal-content w3-card-4">
        <header className="w3-container w3-teal">
          <span onClick={props.onClose}
            className="w3-button w3-display-topright">&times;</span>
          <h5>{props.modalTitle}</h5>
        </header>
        {props.children}
      </div>
    </div>
  )
}

export default Modal
