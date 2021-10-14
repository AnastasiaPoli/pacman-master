import Pacman from './Pacman.js';
import Ghost from './Ghost.js';
import Powerup from './Powerup.js';
import Scoreboard from './Scoreboard.js';
import Player from './Player.js';
import Drawfield from './Drawfield.js'
import Enumerations from './Enumerations.js'

const PLAYER_TYPES = ['ghost', 'pacman'];
const DEFAULT_LOOP_RATE = 400;
const MAX_LEVELS = 3;
const POINTSFOREATINGPACMAN = 400; 

export default class Game {
  /** @type {Player[]} */
  PlayerArray;
  
  constructor(canvas, assets, scoreboardView) {
    this.canvas = canvas;
    this.assets = assets;
    this.socket = io();
    this.extent = 0;
    this.cellSizeWidth = 40;
    this.cellSizeHeight = 40;
    this.context = this.canvas.getContext('2d');
    this.drawfield = new Drawfield(this.context, this.assets, this.cellSizeHeight, this.cellSizeWidth );
    this.enumerations = new Enumerations(); 
    this.PlayerIndices = [];
    this.PlayerArray = [];
    this.newPlayerIndices = [];
    this.MainPlayers = [];
    this.listOfWalls = [];
    this.coinPositions = [];
    this.startPositions = [];
    this.playerId = undefined;
    this.level = 0;
    this.framecount = 0;

    /*---- EVENT LISTENER START ---*/
    this.socket.on(this.enumerations.Server.S1, initGame => {
      console.log("Game.js: welcome_player - this.playerId: " + this.playerId);
      this.playerId = initGame.playerId;
      this.playerType = PLAYER_TYPES[this.playerId%2];
      console.log('I am a ' + this.playerType + ' with ID: ' + this.playerId);
      this.listOfWalls = initGame.initialMazeWalls;
      this.coinPositions = initGame.Mazecells;
      this.powerUps = initGame.powerUps;
      this.level = initGame.level;
      this.extent = initGame.inital_extent;
      this.canvas.width = this.cellSizeWidth * this.extent;
      this.canvas.height = this.cellSizeHeight * this.extent;
      this.startPositions = initGame.startPositions;
      this.scoreboard.setMainPlayerId(initGame.playerId);
      this.scoreboard.setLevel(this.level)
    });

    this.socket.on(this.enumerations.Server.S2, playerinformation => {
      playerinformation.forEach(index => {
        if(this.PlayerIndices[index] !== index){
          this.newPlayerIndices.push(index)
          this.MainPlayers.push(false);
          this.MainPlayers[this.playerId] = true;
        }
      })
      if(this.PlayerIndices.length !== playerinformation.length){ //falls neue player hinzugekommen: update playerliste
        this.addNewPlayers(this.newPlayerIndices);
      }
    });

    this.socket.on(this.enumerations.Server.S3, positioninformation => {
      this.PlayerArray[positioninformation.playerIndex].setPosition(
        { x: positioninformation.x, y: positioninformation.y }, 
        positioninformation.pressedKey);
    });

    this.socket.on(this.enumerations.Server.S5, newPowerups =>{
      this.powerUps = newPowerups;
    });

    this.socket.on(this.enumerations.Server.S6, LevelInformation =>{ 
      this.updateLevelParameters(
        LevelInformation.newMazeWalls, 
        LevelInformation.newMazeCells, 
        LevelInformation.newPowerUps,
        LevelInformation.level, 
        LevelInformation.newExtent,
        LevelInformation.startPositions)
    })

    this.socket.on(this.enumerations.Server.S7, newvalues => {
      if (this.playerId !== newvalues.playerId || (newvalues.force !== undefined && newvalues.force === true)) {
        this.PlayerArray[newvalues.playerId].setValues(newvalues);
      }
    })

    this.socket.on(this.enumerations.Server.S4, changedplayer =>{
      this.PlayerArray[changedplayer.playerId] = this.PlayerArray[changedplayer.playerId].mutateToGhost();
    });

    this.socket.on(this.enumerations.Server.S8, payload =>{
      if(payload.ClassicCoin===true){
        this.ClassicCoinIsActive = true;
      } else{
        this.ClassicCoinIsActive = false;
      }
    });
    /*---- EVENT LISTENER ENDE ---*/
    this.loopInterval = setInterval(this.loop.bind(this), DEFAULT_LOOP_RATE);

    this.scoreboard = new Scoreboard(scoreboardView);

  }

  draw() {
    this.drawfield.drawMaze(this.canvas, this.listOfWalls);
    this.drawfield.drawPowerups(this.powerUps);
    this.PlayerArray.forEach(player => player.draw(this))
  }
  addNewPlayers(indexArray) {
    indexArray.forEach(index => {
      if(index%2 === 1) {
        this.PlayerArray[index] = new Pacman(
        index, 
        {x: this.startPositions[index%8].x, y: this.startPositions[index%8].y},
        this.cellSizeWidth,
        this.cellSizeHeight,
        'NoKey',
        this.canvas,
        this.extent,
        this.assets,
        this.context,
        this.socket, 
        'pacman',
        0,
        this.MainPlayers[index]
      )
    } else { 
        this.PlayerArray[index] = new Ghost(
        index, 
        {x: this.startPositions[index%8].x, y: this.startPositions[index%8].y},
        this.cellSizeWidth,
        this.cellSizeHeight,
        'NoKey',
        this.canvas,
        this.extent,
        this.assets,
        this.context,
        this.socket, 
        'ghost',
        0,
        this.MainPlayers[index]
      )
    }
  });
  this.MainPlayer = this.PlayerArray[this.playerId];
    if (this.MainPlayer instanceof Pacman) {
     this.MainPlayer.addSpeedObserver(this);
    }
  this.scoreboard.setPlayers(this.PlayerArray);
  }
  updateLevelParameters(newWalls, newCoins,newPowerUps, newLevel, newExtent, newPositions){
    this.listOfWalls = newWalls;
      this.coinPositions = newCoins;
      this.level = newLevel;
      this.powerUps = newPowerUps;
      this.extent = newExtent;
      this.canvas.width = this.cellSizeWidth * newExtent;
      this.canvas.height = this.cellSizeHeight * newExtent;
      this.startPositions = newPositions;
      this.PlayerArray.forEach(player =>{
        player.setCanvasSize(this.extent, this.canvas.height, this.canvas.width);
        player.setPosition(
          { x: this.startPositions[player.playerId%8].x, 
            y: this.startPositions[player.playerId%8].y }, 
            'noKey')
      })
      this.scoreboard.setLevel(newLevel)
  }

  update() {
    console.log("Game.js: update()");
    this.framecount++;
    if (
      ! this.checkCollisionbetweenPlayerandWalls(this.PlayerArray[this.playerId]) &&
      ! this.checkAndHandlePlayerCollision(this.PlayerArray[this.playerId])
    ) {
      console.log("Game.js: inside update() after first if");
      this.PlayerArray[this.playerId].update();
      }

    if (this.PlayerArray[this.playerId] instanceof Pacman) {
    this.checkPacmanPowerupCollision(this.PlayerArray[this.playerId]);
       }
    this.scoreboard.update();
    this.drawfield.update(this.framecount);
  }

  loop() {
    console.log("Game.js: loop ()");
    if (this.checkGameOver() === false && this.level < MAX_LEVELS){ 
      //Damit spiel läuft muss mind. 1 Pacman vorhanden sein oder maximale Anzahl an Levels unterschritten
      this.update();
      this.draw();
    }
    else {
      this.drawfield.drawGameOver(this.canvas); //GAME OVER
    }
  }

  /**
   * Check and handle collision of one specific player with all other players.
   *   - Pacmans cannot go through each other, ghosts can.
   *   - Pacmans colliding with ghosts (or vice verca) will be eaten and 
   *     converted to Ghosts as well (their points will be reset)
   * 
   * @param { Player } player which should be checked against all other players
   */
  checkAndHandlePlayerCollision (player) {
    let collsion = false
    // filter player with same id and players, which don't collide at all
    this.PlayerArray.filter(otherPlayer => { 
      return (
        player.playerId !== otherPlayer.playerId &&
        player.collisionCheck(otherPlayer.playerPosition)
      );
    }).forEach(otherPlayer => {
      // colliding players are of _same type_
      if (player instanceof Pacman && otherPlayer instanceof Pacman) {
        collsion = true;
      // colliding players are of _different type_
      } else {
        return this.handleCollisionOfDifferentPlayerTypes(player, otherPlayer);
      }
    });
    return collsion;
  }

  /**
   * Handle collision of two players of different types.
   * 
   * @param {*} player "main" player
   * @param {*} otherPlayer player that the "main" player collides with
   */
  handleCollisionOfDifferentPlayerTypes(player, otherPlayer) {
    // CLASSIC_COIN ist aktiv und Pacman frisst einen Geist: Geist bekommt neue Position und verliert punkte
    if (this.ClassicCoinIsActive === true){
      if (player instanceof Pacman){
        this.PlayerArray[otherPlayer.playerId].addPoints(-10);
        this.PlayerArray[player.playerId].addPoints(5);
        this.PlayerArray[otherPlayer.playerId].setPosition({x: this.extent/2, y: 0}, 'noKey')
        this.socket.emit(this.enumerations.Client.C3, { 
          index: otherPlayer.playerId, pressedKey: 'noKey',
          x: this.extent/2, y: 0 }
        );
      }
      else if (player instanceof Ghost){
        this.PlayerArray[player.playerId].addPoints(-10);
        this.PlayerArray[otherPlayer.playerId].addPoints(5);
        this.PlayerArray[player.playerId].setPosition({x: this.extent/2, y: 0}, 'noKey')
        }
        this.socket.emit(this.enumerations.Client.C3, { 
          index: player.playerId, pressedKey: 'noKey',
          x: this.extent/2, y: 0}
        );
        this.socket.emit(this.enumerations.Client.C7, 
            { ...otherPlayer.getValues(), force: true }
          );
        this.socket.emit(this.enumerations.Client.C7, player.getValues());
    }
    else{ //CLASSICCOIN ist nicht active
      // Pacman collided with Ghost
      if (player instanceof Pacman && otherPlayer instanceof Ghost) { 
        if (player.hearts === 1) {
          this.pacmanTypeChange(player);
          otherPlayer.points += POINTSFOREATINGPACMAN;
          /*this.socket.emit('I_changed_values', 
            { ...otherPlayer.getValues(), force: true }
          );*/
        } else {
          player.hearts = player.hearts - 1;
          this.PlayerArray[otherPlayer.playerId].addPoints(50);
         // this.socket.emit('I_changed_values', player.getValues());
        }
        this.socket.emit(this.enumerations.Client.C7, 
            { ...otherPlayer.getValues(), force: true }
          );
        this.socket.emit(this.enumerations.Client.C7, player.getValues());
      // Ghost collided with Pacman
      } else if (player instanceof Ghost && otherPlayer instanceof Pacman) {
        if (otherPlayer.hearts === 1) {
          this.pacmanTypeChange(otherPlayer);
          player.points += POINTSFOREATINGPACMAN;
          
        } else {
          otherPlayer.hearts = otherPlayer.hearts - 1;
          this.PlayerArray[player.playerId].addPoints(50);
          
        }
        this.socket.emit(this.enumerations.Client.C7, 
            { ...otherPlayer.getValues(), force: true }
          );
        this.socket.emit(this.enumerations.Client.C7, player.getValues());

      } 
    }
  } 

  /** @param {Pacman} pacman */
  pacmanTypeChange(pacman) {
    this.PlayerArray[pacman.playerId] = pacman.mutateToGhost();
    this.socket.emit(this.enumerations.Client.C4, { playerId: pacman.playerId });
  }

  checkCollisionbetweenPlayerandWalls(player) {
    this.collision = false;
    let j = this.listOfWalls.length;
    while(j >= 0 && this.collision === false){
        for (let i = 0; i<this.listOfWalls.length; i++){
        if (player.collisionCheck(this.listOfWalls[i]) === true){
            this.collision = true;
            }
        } j--;   
    }
    if (!this.collision && !player.CheckCollidingWithFrame()){
      //No Collision
      return false;
    }
    else{
      //Collision 
      return true;
    }
  }

  /**
   * 
   * @param {Pacman} pacman 
   */
  checkPacmanPowerupCollision(pacman) {
    const me = this;

    this.powerUps.forEach((powerup, index) => {
      if (pacman.playerPosition.x === powerup.position.x && 
        pacman.playerPosition.y === powerup.position.y
      ) {
        const pup = new Powerup(powerup.position, powerup.type);
        pup.handlePacmanOnCoin(pacman, this);

        me.powerUps.splice(index, 1);
        this.socket.emit(this.enumerations.Client.C5, me.powerUps);
        this.socket.emit(this.enumerations.Client.C7, pacman.getValues());

        return;
      }
    });
  } 
 

  /**
  * 
  * @param {Pacman} pacman 
  *    */
  pacmanSpeedChanged(pacman) {
    clearInterval(this.loopInterval);
    const newUpdateRate = DEFAULT_LOOP_RATE / pacman.getSpeed();
    this.loopInterval = setInterval(this.loop.bind(this), newUpdateRate);
    this.socket.emit(this.enumerations.Client.C7, pacman.getValues());
  }
  ClassicCoinActivation(){  // Soll aufgerufen werden wenn CLASSIC_COIN gefressen wurde. Nach einer Zeit soll die Wirkung wieder nachlassen.
    this.ClassicCoinIsActive = true;
    this.socket.emit(this.enumerations.Client.C8,{ClassicCoin:true})
    setTimeout(this.setClassicCoinInactive.bind(this), 20000)
  } 
  setClassicCoinInactive(){
    this.ClassicCoinIsActive = false
    this.socket.emit(this.enumerations.Client.C8, {ClassicCoin:false})
  }
  checkGameOver(){
    let check; 
    if(this.PlayerArray.length > 1){
      check = 0
      this.PlayerArray.forEach(player => {
        if (player instanceof Ghost){
          check++
        }
      })
    } 
    if(check === this.PlayerArray.length){
      return true
    }
    else{
      return false
    }
  }

}