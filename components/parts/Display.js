import React, { PropTypes } from 'react'

const Display = (props) => {
  return (
    (props.if) ? <div className={props.customClass}>{props.children}</div> : null
  )
}

export default Display
