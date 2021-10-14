import Enumerations from './Enumerations.js'
export default class Player {
  constructor(
    playerId,
    playerPosition,
    cellSizeWidth,
    cellSizeHeight,
    pressedKey,
    canvas,
    extent,
    assets,
    context,
    socket, 
    type, 
    points,
    amIMainPlayer,
  ) {
    this.playerId = playerId;
    this.playerPosition = playerPosition;
    this.pressedKey = pressedKey;
    this.cellSizeHeight = cellSizeHeight;
    this.cellSizeWidth = cellSizeWidth;
    this.canvas = canvas;
    this.extent = extent;
    this.assets = assets;
    this.context = context;
    this.socket = socket;
    this.type = type;
    this.points = points;
    this.amIMainPlayer = amIMainPlayer;

    this.enumerations = new Enumerations();
    if(amIMainPlayer) {
      document.addEventListener('keyup', this.handleKeyUp.bind(this));
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  getPlayerPosition() {
    return this.playerPosition;
  }

  getPressedKey() {
    return this.pressedKey;
  }

  //falls taste losgelassen: kein Wert für PressedKey
  handleKeyUp() {
    this.pressedKey = 'NoKey';
  }

  //falls Taste gedrückt: gedrückte Taste als Wert für PressedKey 
  handleKeyDown(event) { 
   this.pressedKey = event.code;
  }

  update() {
    const newPosition = { ...this.playerPosition };
    if (this.pressedKey === 'ArrowUp') {
      newPosition.x = this.playerPosition.x;
      newPosition.y = this.playerPosition.y - 1;
    } else if (this.pressedKey === 'ArrowLeft') {
      newPosition.x = this.playerPosition.x - 1;
      newPosition.y = this.playerPosition.y;
    } else if (this.pressedKey === 'ArrowRight') {
      newPosition.x = this.playerPosition.x + 1;
      newPosition.y = this.playerPosition.y;
    } else if (this.pressedKey === 'ArrowDown') {
      newPosition.x = this.playerPosition.x;
    newPosition.y = this.playerPosition.y + 1;
    }
    
    // change position and emit event only if position changed
    if (
      newPosition.x !== this.playerPosition.x || 
      newPosition.y !== this.playerPosition.y
    ) {
    this.playerPosition = newPosition;
    this.socket.emit(this.enumerations.Client.C3, { 
        index: this.playerId,
        pressedKey: this.pressedKey,
        x: this.playerPosition.x,
        y: this.playerPosition.y
        });
    }
  }

  
  CheckCollidingWithFrame() {
    if((this.playerPosition.x-1 < 0 && this.pressedKey === 'ArrowLeft') || 
        (this.playerPosition.x+1 >= this.extent && this.pressedKey === 'ArrowRight')||
        (this.playerPosition.y-1 < 0 && this.pressedKey === 'ArrowUp') || 
        (this.playerPosition.y+1 >= this.extent && this.pressedKey === 'ArrowDown')){
        return true;
    }
  } 
 
  collisionCheck(object) {
    if ((this.playerPosition.x+1 === object.x && this.playerPosition.y === object.y &&
        this.pressedKey === 'ArrowRight') || 
        (this.playerPosition.x-1 === object.x && this.playerPosition.y === object.y &&
        this.pressedKey === 'ArrowLeft') ||
        (this.playerPosition.x === object.x && this.playerPosition.y-1 === object.y &&
        this.pressedKey === 'ArrowUp') || 
        (this.playerPosition.x === object.x && this.playerPosition.y+1 === object.y &&
        this.pressedKey === 'ArrowDown')) {
      return true;
    }
    else{
      return false;
      }
}

setPosition(position, pressedkey) {
  this.playerPosition = position;
  this.pressedKey = pressedkey;
}
setCanvasSize(Extent, Height, Width){
  this.extent = Extent;
  this.canvas.height = Height; 
  this.canvas.width = Width;
}

  addPoints(points) {
    this.points += points;
  }

  /**
   * Double the points collected by Pacman
   * if the pacman does not collect any points, then 
   *  this coin add only one point
   * @param {*} points 
   */
  doublePoints(points) {
    if (this.points === 0){
      this.points += 1;
    } else {
    this.points = points * 2;
    }
  }

  /**
   * 
   * @param {*} newValues 
   */
  setValues(newValues) {}

  getValues() {}

  toString() {
    return 'unkown player type :/'
  }

}
