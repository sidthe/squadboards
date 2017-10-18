import React, { PropTypes } from 'react'
import Display from "./Display"

const RoomInfo = (props) => {
  return (
    <div className="w3-container w3-center w3-margin-bottom">
      <Display if={props.speaker=="yes"}>
        <h2 className="w3-indie">Hey {props.name}, you host room: <span className="w3-text-teal">{props.room}</span></h2>
      </Display>
      <Display if={props.speaker=="no"}>
        <h2 className="w3-indie">Hey {props.name}, you joined room: <span className="w3-text-teal">{props.room}</span></h2>
      </Display>
      <p>Let others know: <span className="w3-text-teal">{window.location.href}</span></p>
    </div>
  )
}

export default RoomInfo
