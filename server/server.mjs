import express from 'express';
import http from 'http';
import path from 'path';
var app = express();
var server = http.Server(app);
import socket from 'socket.io';
var io = socket(server);

import Labyrinth from "./Labyrinth.js";
import Powerup from "../client/Powerup.js";
import Enumerations from "../client/Enumerations.js";



console.log('Starting server...');
// Routing
const baseDir = path.resolve(path.dirname(''));
app.use(express.static(path.join(baseDir, 'client')));

/* Starts the server. */
server.listen(3050, () => {
  console.log('Listening on port 3050');
  console.log('Local: http://localhost:3050');
});


let playerIndex = 0;
let playerIndices = Array();
let mazewalls = [];
let mazecells = [];
let startpositions = [];
let currentlevel = 0; 
let extent = 10; 


/** @type { Labyrinth } */
const labyrinth = new Labyrinth(extent);
const enumerations = new Enumerations(); 
mazewalls = labyrinth.updateLabyrinth();
mazecells = labyrinth.returnMazecells();
currentlevel = 1;
startpositions = labyrinth.returnStartPositions();
// create powerups
let powerUps = Array();
for (let i = 0; i < mazecells.length; i++) { 
  const powerUp = new Powerup({ 
      x: mazecells[i].x,
      y: mazecells[i].y,
  });
  powerUps.push(powerUp);
}

io.on('connection', function(socket) {
  socket.playerIndex = playerIndex;

  console.log('socket connected: Player ', playerIndex);
  playerIndices[playerIndex] = playerIndex;
  socket.emit(enumerations.Server.S1, {
    playerId: playerIndex, 
    initialMazeWalls: mazewalls, 
    Mazecells : mazecells,
    powerUps: powerUps,
    level: currentlevel,
    inital_extent: extent,
    startPositions: startpositions});

  console.log('playerIndices: ', playerIndices);
  io.emit(enumerations.Server.S2, playerIndices);
 
  playerIndex++;


  socket.on(enumerations.Client.C3, positionupdate => {
    socket.broadcast.emit(enumerations.Server.S3, {
      playerIndex: positionupdate.index,
      pressedKey: positionupdate.pressedKey, 
      x: positionupdate.x,
      y: positionupdate.y
    });
  });

  socket.on(enumerations.Client.C4, changedplayer => {
    socket.broadcast.emit(enumerations.Server.S4, changedplayer)
  })

  socket.on(enumerations.Client.C5, newPowerups => { 
    if(newPowerups.length > 0){
      socket.broadcast.emit(enumerations.Server.S5, newPowerups)
    }
    else{
      extent = extent + 2;
      let newlabyrinth = new Labyrinth(extent);
      mazewalls = newlabyrinth.updateLabyrinth();
      mazecells = newlabyrinth.returnMazecells();
      currentlevel++;
      startpositions = newlabyrinth.returnStartPositions();
      // create new powerups
      let powerUps = Array();
      for (let i = 0; i < mazecells.length; i++) { 
        const powerUp = new Powerup({ 
          x: mazecells[i].x,
          y: mazecells[i].y,
        });
        powerUps.push(powerUp);
      }
      io.emit(enumerations.Server.S6, {
          newMazeWalls: mazewalls, 
          newMazeCells: mazecells,
          newPowerUps: powerUps,
          level: currentlevel,
          newExtent: extent, 
          startPositions: startpositions} )
    }
  }) 
  socket.on(enumerations.Client.C8, ClassicCoinactivation => {
      socket.broadcast.emit(enumerations.Server.S8, ClassicCoinactivation)
    });
  

  socket.on(enumerations.Client.C7, newvalues => {
      socket.broadcast.emit(enumerations.Server.S7, newvalues);
  })

  socket.on(enumerations.Server.S9, payload => {
    socket.broadcast.emit(enumerations.Server.S9, payload);
})


});