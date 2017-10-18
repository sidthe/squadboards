import React, { PropTypes } from "react"
import ReactDOM from "react-dom"
import io from "socket.io-client"
import Main from "./components/Main"

ReactDOM.render(<Main />, document.getElementById('main-container'));
