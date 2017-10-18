import React, { PropTypes } from 'react'
import Display from "./parts/Display"
import { withRouter } from 'react-router-dom';

class Poker extends React.Component {
  constructor() {
    super();
    this.generateRoom = this.generateRoom.bind(this)
    this.start = this.start.bind(this)
    this.join = this.join.bind(this)
  }

  generateRoom() {
    return Math.floor((Math.random() * 90000000) + 10000000)
  }

  start(e) {
    var room = this.props.room
    if (room=="") {
      room = JSON.stringify(this.generateRoom())
    }
    //remove whitespaces from custom rooms
    room = room.replace(/\s/g, '');
    this.props.history.push("/" + this.props.app + "/" + room)
    this.props.handleStart(e, room)
  }


  join(e) {
    this.props.history.push("/" + this.props.app + "/" + this.props.room)
    this.props.handleJoin(e)
  }

  render () {
    return (
      <div className = "w3-half">
        <div className="w3-card-4 w3-margin">
          <div className="w3-container w3-dark-gray">
            <h2 className="w3-indie">{this.props.appname}</h2>
          </div>
          <img src={this.props.image}/>
          <form className="w3-container w3-margin-top" onSubmit={this.props.doNothing}>
            <label className="w3-text-teal">
              <b>Name</b>
            </label>
            <input name="name" className="w3-input" type="text" placeholder="Give yourself an identity" value={this.props.name} onChange={this.props.handleUserDataChange} required />

            <label className="w3-text-teal">
              <b>Room</b>
            </label>
            <input name="room" className="w3-input" type="text" placeholder="Enter a room or we will generate one for you" value={this.props.room} onChange={this.props.handleUserDataChange} />
            <div className="w3-cell w3-right">
              <div className="w3-cell">
                <input className="observer w3-check" title="Watch but don't cast votes" type="checkbox" checked={this.props.observer} onChange={this.props.setObserver}/>
                <label title="Watch but don't cast votes"> Observer</label>
              </div>
              <div className="w3-cell">
                <button className="w3-btn w3-red w3-center w3-margin" onClick={this.start} disabled={(this.props.name=="") || (this.props.urlRoom==true)}>Start Session</button>
                <button className="w3-btn w3-green w3-center w3-margin" onClick={this.join} disabled={this.props.name=="" || this.props.room==""}>Join Session</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Poker);
