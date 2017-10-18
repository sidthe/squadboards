import React, {PropTypes} from "react"
import io from "socket.io-client"
import createHistory from 'history/createBrowserHistory'
import ReactGA from 'react-ga'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Display from "./parts/Display"
import Header from "./parts/Header"
import Poker from "./Poker"
import RoomInfo from "./parts/RoomInfo"
import Topic from "./parts/Topic"
import Audience from "./parts/Audience"
import VotingPanel from "./parts/VotingPanel"
import Statistics from "./parts/Statistics"
import NotFound from "./parts/NotFound"

//add your google analytics id
ReactGA.initialize("UA-XXXXXXXXX")

const history = createHistory()
const location = history.location
const path = location.pathname

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      status: "disconnected",
      app: "poker",
      room: "",
      urlRoom: false,
      name: "",
      speaker: "",
      observer: false,
      topic: "",
      audience: [],
      vote: "",
      showAllVotes: false,
      activeVoteValues: undefined
    };
    this.handleUserDataChange = this.handleUserDataChange.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleJoin = this.handleJoin.bind(this)
    this.setObserver = this.setObserver.bind(this)
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleVote = this.handleVote.bind(this)
    this.clearVotes = this.clearVotes.bind(this)
    this.showVotes = this.showVotes.bind(this)
    this.clearTrigger = this.clearTrigger.bind(this)
    this.clearSession = this.clearSession.bind(this)
    this.voteValuesUpdate = this.voteValuesUpdate.bind(this);
    this.doNothing = this.doNothing.bind(this)
  }

  componentWillMount() {
    this.socket = io();

    this.socket.on("connect", () => {
      var knownMember = (localStorage.name) ? localStorage.name : null
      var activeMember = (localStorage.name && sessionStorage.room) ? localStorage.name : null
      this.setState({
        status: "connected"
      })
      if (knownMember) {
        this.setState({
          name: JSON.parse(localStorage.name)
        })
      }

      if (activeMember) {
        this.setState({
          name: JSON.parse(localStorage.name),
          room: JSON.parse(sessionStorage.room),
          speaker: sessionStorage.speaker,
          vote: (sessionStorage.vote) ? JSON.parse(sessionStorage.vote) : "",
          observer: JSON.parse(sessionStorage.observer)
        })
        this.socket.emit("join", this.state.name, this.state.room, this.state.vote, this.state.observer)

        //set custom voting values for all users during reconnect
        if (sessionStorage.speaker=="yes"||sessionStorage.voteValues) {
          this.socket.emit("triggerVoteValuesChange", this.state.room, sessionStorage.voteValues.split(","))
        }
      }
    });

    this.socket.on("disconnect", () => {
      this.setState({
        status: "disconnected",
        audience: []
      })
    });

    this.socket.on("topicChange", (topic) => {
      this.setState({
        topic: topic
      })
    });

    this.socket.on("joined", (topic) => {
      this.setState({
        topic: topic
      })
    });

    this.socket.on("urlRoom", (urlRoom) => {
      this.setState({
        room: urlRoom,
        urlRoom: true
      })
    });

    this.socket.on("audience", (audience) => {
      this.setState({
        audience: audience
      })
    });

    this.socket.on("showUserVotes", (value) => {
      this.setState({
        showAllVotes: value
      })
    });

    this.socket.on("changeVoteValues", (voteValues) => {
      this.setState({
        activeVoteValues: voteValues
      })
    });

    //if user forces himself to dashboard, clear session data
    if (path=="/") {
      this.clearTrigger()
    }

    //if user got a url with a name, see if the system has users name, if not,
    //push to dashboard
    if (path.slice(1,path.lastIndexOf('/')) == "poker" && this.state.name=="") {
      let room = (0, path.slice(path.lastIndexOf('/')+1))
      this.setState({room: room, urlRoom: true})
      history.push("/")
    }

  }

  handleUserDataChange(event) {
    //keep user name in browser local storage for persistency
    event.target.name == "name" ? localStorage.setItem(event.target.name, JSON.stringify(event.target.value)) : sessionStorage.setItem(event.target.name, JSON.stringify(event.target.value))
    this.setState({[event.target.name]: event.target.value})
    event.preventDefault();
  }

  handleStart(event, room) {
    sessionStorage.room = JSON.stringify(room)
    sessionStorage.speaker = "yes"
    sessionStorage.observer = this.state.observer
    this.setState({room: room, speaker: "yes"})
    this.socket.emit("join", this.state.name, room, this.state.vote, this.state.observer)
    event.preventDefault();
  }

  handleJoin(event) {
    sessionStorage.room = JSON.stringify(this.state.room)
    sessionStorage.speaker = "no"
    sessionStorage.observer = this.state.observer
    this.socket.emit("join", this.state.name, this.state.room, this.state.vote, this.state.observer)
    this.setState({speaker: "no"})
    event.preventDefault();
  }

  setObserver(event) {
    const value = event.target.checked
    this.setState({observer: value})
  }

  handleTopicChange(event) {
    this.socket.emit("topicChange", this.state.room, event.target.value)
    this.setState({topic: event.target.value})
    event.preventDefault();
  }

  handleVote(event) {
    sessionStorage.vote = JSON.stringify(event.target.value)
    this.socket.emit("memberVote", this.state.room, event.target.value)
    this.setState({vote: event.target.value})
    event.preventDefault();
  }

  clearVotes(event) {
    this.socket.emit("clearVotes", this.state.room)
    this.socket.emit("topicChange", this.state.room, "")
    this.socket.emit("showVotes", this.state.room, false)
    this.setState({topic: "", vote: ""})
    event.preventDefault();
  }

  showVotes(event) {
    this.socket.emit("showVotes", this.state.room, true)
    event.preventDefault();
  }

  voteValuesUpdate(voteValues) {
    sessionStorage.voteValues = voteValues
    this.socket.emit("triggerVoteValuesChange", this.state.room, voteValues)
    event.preventDefault();
  }

  //I need a separate clear session function to handle clearing on
  //both route updates and manual updates
  clearSession(event) {
    this.clearTrigger()
    event.preventDefault(event);
  }

  clearTrigger() {
    sessionStorage.removeItem("room")
    sessionStorage.removeItem("speaker")
    sessionStorage.removeItem("vote")
    this.setState({
      speaker: "",
      urlRoom: false,
      topic: "",
      vote: "",
      room: "",
      observer: false
    })
    this.socket.emit("leave")
  }

  doNothing(event) {
    event.preventDefault()
  }

  render() {
    const appHeader = (history) => {
      return (
        <Header
          title="SquadBoards"
          status={this.state.status}
          onTitleClick={this.clearSession}
          history = {history}
        />
      )
    }

    const dashboard = (props) => {
      return (
        <div>
          {appHeader(props.history)}
          {ReactGA.pageview(window.location.href)}
          <div className="w3-quarter"><p> </p></div>
          <Poker
            appname = "Pointing Poker"
            image = "/images/pointing-poker.png"
            handleStart = {this.handleStart}
            handleJoin = {this.handleJoin}
            handleUserDataChange = {this.handleUserDataChange}
            setObserver = {this.setObserver}
            doNothing = {this.doNothing}
            urlRoom = {this.state.urlRoom}
            {...this.state}
            {...props}
            />
          <div className="w3-quarter"><p> </p></div>
      </div>
      )
    }

    const pokerApp = (props) => {
      return (
        <div>
          {ReactGA.pageview(window.location.href)}
          {appHeader(props.history)}
          <div className="w3-container">
            <div id="apps" className="w3-half">
              <RoomInfo
                room={this.state.room}
                name={this.state.name}
                appurl="poker/"
                speaker={this.state.speaker} />
              <Topic
                topic={this.state.topic}
                handleTopicChange={this.handleTopicChange}
                doNothing={this.doNothing}
              />
              <VotingPanel
                handleVote={this.handleVote}
                clearVotes={this.clearVotes}
                showVotes={this.showVotes}
                observer={this.state.observer}
                speaker={this.state.speaker}
                voteValuesUpdate={this.voteValuesUpdate}
                activeVoteValues={this.state.activeVoteValues}
              />
              <Audience
                audience={this.state.audience}
                userSocket={this.socket.id}
                showVotes={this.state.showAllVotes}
              />
            </div>
            <div id="apps" className="w3-half">
              <Statistics
                audience={this.state.audience}
                showVotes={this.state.showAllVotes}
                status={this.state.status}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" exact render={dashboard} />
            <Route path="/poker/:id" exact render={pokerApp} />
            <Route component = {NotFound} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default Main
