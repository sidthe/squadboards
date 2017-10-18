import React, { PropTypes } from 'react'
import Display from "./Display"

const Audience = (props) => {
    var allUsers = props.audience
    var userStyle=""

    //make sure everyone voted before revealing the final results
    var currentVotes = []
    for (var user in allUsers) {
      if (!allUsers[user]["observer"]) {
        currentVotes.push(allUsers[user]["vote"])
      }
    }
    var emptyVotes = currentVotes.some(x => x === "");
    if (props.showVotes) {emptyVotes=false}
    var voteStyle = (emptyVotes ? "w3-text-white" : "w3-text-green")


    //generate the actual audience view with votes
    var playersGeneratedList = [];
    var observersGeneratedList = [];
    for (var user in allUsers) {
      if (!allUsers[user]["observer"]) {
        if(allUsers[user]["vote"]==""){
          userStyle="w3-text-gray"
        } else {
          userStyle="w3-text-green"
        }
        playersGeneratedList.push(
          <li key={user}>
            <span className={userStyle}>{allUsers[user]["name"]}</span>
            <span className="w3-right w3-indie w3-xlarge">
            {(user==props.userSocket) ? <span className="w3-text-green">{allUsers[user]["vote"]}</span> : <span className={voteStyle}>{allUsers[user]["vote"]}</span> }
            </span>
          </li>
        );
      } else {
        observersGeneratedList.push(
          <li key={user}>
            <span className="w3-text-gray">{allUsers[user]["name"]+" (observer)"}</span>
          </li>
        );
      }
    }

  return (
    <Display if={true}>
      <div className="w3-container w3-margin">
        <h3 className="w3-text-teal w3-margin w3-indie">Players</h3>
        <ul className="w3-ul w3-large">
          {playersGeneratedList}
        </ul>
        <h3 className="w3-text-cyan w3-margin w3-indie">Observers</h3>
        <ul className="w3-ul w3-large">
          {observersGeneratedList}
        </ul>
      </div>
    </Display>
  )
}

export default Audience
