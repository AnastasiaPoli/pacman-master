import Player from './Player.js';

export default class ghost extends Player{
    constructor( //Konstruktor von Player wird überschrieben
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
    };

    getcolor(ClassicCoinIsActive) { 
      if (ClassicCoinIsActive=== true) 
      return this.assets.whiteGhostSprite; 
      else if (this.playerId==0)
      return this.assets.blueGhostSprite;
      else if (this.playerId==2)
      return this.assets.greenGhostSprite;
      else if (this.playerId==4)
      return this.assets.purpleGhostSprite;
      else
      return this.assets.brownGhostSprite;
    }
    

    draw(game) {
      this.spriteSheet = this.getcolor(game.ClassicCoinIsActive);
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
      } else if (this.pressedKey === 'ArrowLeft') {
        v = spritewidth;
        w = 0;
        x = spritewidth;
        y = spritewidth;
      } else if (this.pressedKey === 'ArrowDown') {
        v = spritewidth;
        w = spritewidth;
        x = spritewidth;
        y = spritewidth;
      } else if (this.pressedKey === 'ArrowRight') {
        v = 0;
        w = 0;
        x = spritewidth;
        y = spritewidth;
      }
       else {
        v = spritewidth;
        w = spritewidth;
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

  /**
   * @override
   * @param {{points: Number}} newValues 
   */
  setValues(newValues) {
    this.points = newValues.points;
  }

  getValues() {
    return {
      playerId: this.playerId,
      points: this.points,
    }
  }

  /**
  * @override
  */
  toString() {
    return 'Points: ' + this.points;
  }
}
