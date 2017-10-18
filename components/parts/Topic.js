import React, { PropTypes } from 'react'

const Topic = (props) => {
  return (
    <div>
      <form className="w3-container" onSubmit={props.doNothing}>

        <input className="w3-input w3-text-orange w3-center w3-large" value={props.topic} type="text" placeholder="topic goes here..." onChange={props.handleTopicChange}/>

      </form>
    </div>
  )
}

export default Topic
