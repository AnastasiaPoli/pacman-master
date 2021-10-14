import Player from './Player.js';
import Ghost from './Ghost.js';
const DEFAULT_SPEED = 1;
const MODIFIED_SPEED_DURATION =  10 * 1000;

export default class pacman extends Player{
    constructor(    //Konstruktor von Player wird überschrieben
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
      mainplayer
        
    ){
        super(
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
          mainplayer
        )

        //für Powerups
        this.hearts = 1;
        this.speed = DEFAULT_SPEED;
        this.speedObservers = Array();
        this.spriteSheet = this.getcolor();

    };

    getcolor() {
      if (this.playerId==1)
        return this.assets.yellowPacmanSprite;
      else if (this.playerId==3)
        return this.assets.orangePacmanSprite;
      else if (this.playerId==5)
        return this.assets.pinkPacmanSprite;
      else
        return this.assets.magentaPacmanSprite;

    }

    draw() {
      var v;
      var w;
      var x;
      var y;
      var spritewidth = this.spriteSheet.height/2;
        if (this.pressedKey === 'ArrowUp') {
          v = 0;
          w = spritewidth;
          x = spritewidth;
          y = spritewidth;
        } else if (this.pressedKey === 'ArrowRight') {
          v = spritewidth;
          w = 0;
          x = spritewidth;
          y = spritewidth;
        } else if (this.pressedKey === 'ArrowDown') {
          v = spritewidth;
          w = spritewidth;
          x = spritewidth;
          y = spritewidth;
        } else if (this.pressedKey === 'ArrowLeft') {
          v = 0;
          w = 0;
          x = spritewidth;
          y = spritewidth;
        }
         else {
          v = spritewidth;
          w = 0;
          x = spritewidth;
          y = spritewidth;
        }
        this.context.drawImage(
          this.spriteSheet,v,w,x,y,
          this.playerPosition.x * this.cellSizeWidth,
          this.playerPosition.y * this.cellSizeHeight,
          this.cellSizeWidth,
          this.cellSizeHeight
        );
    }

  addHeart(amount) {
    this.hearts += amount;
  }

  setMovementSpeed(speed) {
    const me = this;
    me.speed = speed;

    //resets Speed
    clearTimeout(this.speedResetTimeout);
  
    this.speedResetTimeout = setTimeout(() => {
      me.speed = DEFAULT_SPEED;
      me.notifyObservers();
    }, MODIFIED_SPEED_DURATION);

       me.notifyObservers();
  }

  getSpeed() {
      return this.speed;
  }

  addSpeedObserver(observer) {
   this.speedObservers.push(observer);
  }

  notifyObservers() {
    const me = this;
    this.speedObservers.forEach((observer) => {
    observer.pacmanSpeedChanged(me);
    })
  }

  /**
   * @override
   * @param {{points: Number, hearts: Number, speed: Number }} newValues 
   */
  setValues(newValues) {
    this.hearts = newValues.hearts;
    this.speed = newValues.speed;
    this.points = newValues.points;
  }

  getValues() {
    return {
      playerId: this.playerId,
      hearts: this.hearts,
      points: this.points,
      speed: this.speed,
    }
  }

  mutateToGhost() {
    return new Ghost(
      this.playerId,
      this.playerPosition,
      this.cellSizeHeight,
      this.cellSizeWidth,
      this.pressedKey,
      this.canvas,
      this.extent,
      this.assets,
      this.context,
      this.socket,
      'ghost',
      this.points,
      this.amIMainPlayer

    );
  }


 /**
  * @override
  */
  toString() {
    return 'Points: ' + this.points + '; Speed: ' + this.speed + '; Hearts: ' + this.hearts;
  }
}
