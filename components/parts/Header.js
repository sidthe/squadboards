import React, {PropTypes} from 'react'
import { withRouter } from 'react-router-dom';

class Header extends React.Component {
  constructor() {
    super();
    this.goToDashboard = this.goToDashboard.bind(this)
  }

  goToDashboard(event) {
    this.props.onTitleClick(event)
    this.props.history.push("/")
  }

  render () {
    return (
      <div className="w3-display-container">
        <div className="w3-display-right">
          <div className="w3-cell-row">
            <div className="w3-cell w3-cell-middle">
              <div id="connection-status" title="Connection status" className={this.props.status} />
            </div>
            <div className="w3-cell w3-cell-middle">
              <div id="exit-icon">
                <a href="/" onClick={this.goToDashboard}>
                  <i className="material-icons w3-text-teal w3-center" title="Exit session">
                    exit_to_app
                  </i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="w3-container w3-black">
          <div className="w3-cell">
            <a id="headerLink" href="/" onClick={this.goToDashboard}>
              <div id="logo-row" className="w3-cell-row">
                <img id="logo" className="w3-cell" src="/images/logo-min.png"></img>
                <h1 className="w3-indie w3-text-teal w3-cell">{this.props.title}</h1>
              </div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header);
