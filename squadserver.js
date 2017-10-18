var express = require("express");
var app = express();
var path = require("path");
var _ = require("underscore")
var port = process.env.PORT || 3000;
var server = app.listen(port);
var io = require("socket.io").listen(server);
var urlRoom = false;

var connections = [];
var audience = {};
var topics = {};
var votes = {};
var roomVoteValues = {};
var fibonacci = ["0.5", "1", "2", "3", "5", "8", "13", "21", "34", "?"]

var debug = false

app.use(express.static("./public"));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

io.sockets.on("connection", function(socket) {

  socket.once("disconnect", function() {
    //trigger user removal from rooms
    leaveSession(socket)

    //remove member from connections list
    connections.splice(connections.indexOf(socket),1);
    socket.disconnect();

    if (debug) {
      console.log("Disconnected: %s", socket.id)
      console.log("Sockets Connected: %s sockets", connections.length);
    }
  });

  //parse the url and if user came via shared url pass this as state
  //to the app and make sure the user has the room prefilled for joining
  if (urlRoom) {
    socket.emit("urlRoom", urlRoom);
    urlRoom=false;
  };

  //handles members joining or starting poker sessions
  socket.on("join", function(name, room, memberVote, observer) {
    if (debug) {
      console.log("User %s joined room %s, user observer: %s", name, room, observer);
    }

    var memberProfile = {
      name: name,
      room: room,
      vote: memberVote,
      observer: observer
    }

    //on join check if the room exists and if yes add member details,
    //if no, create the room object
    var topic = topics[room]
    if (Object.keys(audience).indexOf(room) != -1) {
      audience[room][socket.id] = memberProfile
    } else {
      audience[room]= {}
      audience[room][socket.id] =  memberProfile
    }

    //on room join make sure user joins the proper oom on socket server
    socket.join(room);

    //if a topic is already set in the room, sync it to the new member on join
    if (topics[room]) {
      io.to(room).emit("joined", topics[room])
    }

    //see if custom voting values are set for the room and sync all
    if (roomVoteValues[room]) {
      io.to(room).emit("changeVoteValues", roomVoteValues[room])
    }

    //broadcast an update about current audience on new member join
    io.to(room).emit("audience", audience[room])
    if (debug) {
      console.log("Current state of the audience \n" + JSON.stringify(audience))
    }
  });

  //broadcast real time topic changes to all room members
  socket.on("topicChange", function(room, topic) {
    topics[room] = topic;
    socket.broadcast.to(room).emit("topicChange", topic);
  });

  //broadcast new votes for poker member voting
  socket.on("memberVote", function(room, memberVote) {
    audience[room][socket.id].vote = memberVote
    io.to(room).emit("audience", audience[room]);
  });

  //clear user votes
  socket.on("clearVotes", function(room) {
    for (i in audience[room]) {
      var clearVote = ""
      audience[room][i]["vote"] = clearVote
    }
    io.to(room).emit("audience", audience[room]);
  });

  //show all votes even if not everyone voted
  socket.on("showVotes", function(room, value) {
    io.to(room).emit("showUserVotes", value);
  });

  //change values of the vote buttons - triggered by the speaker
  socket.on("triggerVoteValuesChange", function(room, voteValues) {
    roomVoteValues[room] = voteValues ? voteValues : fibonacci
    io.to(room).emit("changeVoteValues", voteValues);
    if (debug) {
      console.log("Custom votes list %s", JSON.stringify(roomVoteValues));
    }
  });

  socket.on("leave", function() {
    //remove users from rooms
    leaveSession(socket)
  });

  //this is a common function that removes user from rooms on leave and
  //disconnect
  function leaveSession(socket) {
    var roomId = ""
    for (i in audience) {
      if (Object.keys(audience[i]).some(x => x == socket.id)) {
        //remove user from room
        roomId = audience[i][socket.id].room
        if (debug) {
          console.log("User %s left room %s", audience[i][socket.id].name, roomId);
        }
        delete audience[i][socket.id]

        //remove room if no users are in the room
        if (Object.keys(audience[i])== "") {
          delete audience[i]
        }
      }
    }

    //update the rest of the audience when user gone
    io.to(roomId).emit("audience", audience[roomId])
    if (debug) {
      console.log("Current state of the audience \n" + JSON.stringify(audience));
    }
  }

  //add socket to current connections list
  connections.push(socket);
  if (debug) {
    console.log("New socket connected: %s", socket.id)
    console.log("Total sockets connected: %s sockets", connections.length);
  }
});

console.log("SquadBoards server listening on port " + port);
