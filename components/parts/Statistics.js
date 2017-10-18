import React, { PropTypes } from 'react'
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import Display from "./Display"

const Statistics = (props) => {
    var allUsers = props.audience

    //make sure everyone voted before revealing statistics
    var currentVotes = []
    var validVotes = []
    var discloseVotes = true
    var observers = []

    //build the array of initial votes from adience data
    for (var user in allUsers) {

      //check if only observers are in the room
      observers.push(allUsers[user]["observer"])
      if (observers.every(x => x==true)) {
        discloseVotes = false
      }
      if (!allUsers[user]["observer"]) {
        currentVotes.push(allUsers[user]["vote"])
        if (allUsers[user]["vote"]=="") {
          //check if anyone is yet to vote
          discloseVotes = false
        }
      }
    }

    //show vote average if the the button to show votes is pressed
    if (props.showVotes) {discloseVotes=true}

    //build a list of valid votes
    for( var i = 0; i < currentVotes.length; i++ ) {
      if (currentVotes[i]!="") {
        if (currentVotes[i]!=="?") {
          validVotes.push(currentVotes[i])
        }
      }
    }

    //calculate the vote average
    var votesSum = 0;
    for( var i = 0; i < validVotes.length; i++ ){
      votesSum += parseInt( validVotes[i], 10 ); //don't forget to add the base
    }

    var averageScore = parseFloat(votesSum/(validVotes.length)).toFixed(2)

    //in case everyone voted "?", tell them to try harder
    if (isNaN(averageScore)) {
      averageScore="Try Harder"
    }

    //prep barchart data
    //create a value dictionary for current votes
    var voteDistribution = currentVotes.reduce(function(allVotes, vote) {
      if (vote!="") {
        if (vote in allVotes) {
          allVotes[vote]++;
        } else {
          allVotes[vote] = 1;
        }
      }
      return allVotes
    }, {});

    //generate the compatible values list
    var chartData = Object.keys(voteDistribution).map(voteValue => ({
      value: voteValue,
      Votes: voteDistribution[voteValue]
    }))

    //create a custom tooltip that will show voter names along vote values
    const votesTooltip = (props) => {

      //generate the list of users for the currently active tooltip
      const toolTipList = []
      const voterNames = (label) => {
        if (label) {
          for (user in allUsers) {
            if (allUsers[user]["vote"] == label) {
              toolTipList.push(<li key={user}>{allUsers[user]["name"]}</li>)
            }
          }
          return toolTipList
        }
        return null
      }

      //see if there is a hover action over the tooltip and create the tooltip
      //with the right data
      const { active } = props

      if (active) {
        const { payload, label } = props;
        return (
          <div className="custom-tooltip">
            <p className="label w3-indie">Total Votes: {`${payload[0].value}`}</p>
            <div className="users w3-indie">
              <p>Voters:</p>
              <ul>
                {voterNames(label)}
              </ul>
            </div>
          </div>
        );
      }
      return null
    }

  return (
    <div className="w3-container w3-center w3-margin-bottom">
      <h2 className="w3-indie w3-text-gray">Session Statistics</h2>
      <h4 className="w3-indie w3-text-gray">Average Vote</h4>
      <Display if={discloseVotes && props.status==="connected"}>
        <h1 className="w3-jumbo w3-text-gray">{averageScore}</h1>
          <BarChart width={window.innerWidth*0.48} height={window.innerHeight*0.5}
            data={chartData}
            margin={{top: 5, right: 30, left: 10, bottom: 5}}>
            <XAxis dataKey="value"/>
            <YAxis allowDecimals={false} type="number" domain={[0, 'dataMax']} />
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip content={votesTooltip}/>
            <Bar dataKey="Votes" fill="#82ca9d" />
          </BarChart>
      </Display>
    </div>
  )
}

export default Statistics
