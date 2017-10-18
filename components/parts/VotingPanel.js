import React, { PropTypes } from 'react'
import Display from "./Display"
import Modal from "./Modal"

const voteValuesFibonacci = ["0.5", "1", "2", "3", "5", "8", "13", "21", "34", "?"]
const voteValuesLinear = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "?"]

export default class VotingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fibonacci: true
    }
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    this.toggleVoteModel = this.toggleVoteModel.bind(this);
  }

//TODO (Modal done) triggers show of the modal
  toggleSettingsModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

//toggles voting model type
  toggleVoteModel() {
    let voteValues = !this.state.fibonacci ? voteValuesFibonacci : voteValuesLinear
    this.setState({
      fibonacci: !this.state.fibonacci,
      activeVoteValues: voteValues
    })
    this.props.voteValuesUpdate(voteValues)
  }

  render() {

    //if speaker has not changed default voting mode, revert to fibonacci, else use
    //what speaker has defined
    if (this.props.activeVoteValues) {
      var voteValues = this.props.activeVoteValues
    } else {
      var voteValues = voteValuesFibonacci
    }
    var voteButtonsList = []

    //generates voting buttons
    for (var i = 0; i < voteValues.length; i++) {
      voteButtonsList.push(
        <button id="votes" key={voteValues[i]*10} value={voteValues[i]} className="w3-button w3-teal w3-margin-top" onClick={this.props.handleVote}>
          {voteValues[i]}
        </button>
      );
    }
    return (
      <div>
        <Display if={!this.props.observer}>
          <div className="w3-bar w3-margin-top w3-center">
            {voteButtonsList}
          </div>
        </Display>
        <div className="w3-bar w3-center">
          <button className="w3-button w3-green w3-margin-top" onClick={this.props.clearVotes}>Reset</button>
          <button className="w3-button w3-green w3-margin-top w3-margin-left" onClick={this.props.showVotes}>Show Votes</button>
          <Display if={this.props.speaker=='yes'} customClass='votesSettingsDiv'>
            <button className="w3-button w3-green w3-margin-top w3-margin-left votesSettingsButton" onClick={this.toggleVoteModel} title='Toggle voting values between fibonacci and linear for all members of the room'><i className="material-icons w3-large votesSettingsIcon">settings</i></button>
          </Display>
        </div>
        <Modal
          show={this.state.showModal}
          onClose={this.toggleSettingsModal}
          modalTitle="Configure custom voting buttons"
          >
          <h2>Test</h2>
          <button className="w3-button w3-green" onClick={this.toggleVoteModel}>Toggle Voting Model</button>
        </Modal>
      </div>
    )
  }
}
