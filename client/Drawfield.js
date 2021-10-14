import { POWERUP_TYPE_BASIC_COIN, POWERUP_TYPE_SPECIAL_COIN, POWERUP_TYPE_SPEED, POWERUP_TYPE_HEART, POWERUP_TYPE_DOUBLE_POINTS_COIN, POWERUP_TYPE_CLASSIC_COIN } from './Powerup.js';

export default class Drawfield {
    constructor(context, assets, cellSizeHeight, cellSizeWidth ){
        this.context = context
        this.assets = assets
        this.cellSizeHeight = cellSizeHeight
        this.cellSizeWidth = cellSizeWidth
        this.currentAnimationStep = 0;
        this.numberOfAnimationSteps = 2;
        this.AnimationSpeed = 10; 
    }
  update(framecount){
    if(framecount % this.AnimationSpeed){
      this.currentAnimationStep = (this.currentAnimationStep+1)%this.numberOfAnimationSteps;
    }
  }
  drawMaze(canvas, listOfWalls){
    this.context.fillStyle = 'white'
    this.context.fillRect(0, 0, canvas.width, canvas.height)
    for(var i = 0; i < listOfWalls.length; i++) { 
        this.context.drawImage(
            this.assets.mazewallSprite, 0, 0, 96, 96,
            listOfWalls[i].x*this.cellSizeWidth, 
            listOfWalls[i].y*this.cellSizeHeight, 
            this.cellSizeWidth, 
            this.cellSizeHeight)
      }
    }
    drawGameOver(canvas){
      this.context.drawImage(
        this.assets.GameOverSprite, 0, 0, 500, 500,
        0, 0, 
        canvas.width, 
        canvas.height)
    }
  
  drawPowerups(powerUps) {
    for(var i = 0; i < powerUps.length; i++) {
      let asset;
      let x;
      let spritewidth; 
      let spriteheight;
      let celladjustmentwidth;
      let celladjustmentheight;
      x = 0; 
      spritewidth = 96;
      spriteheight = 96;
      celladjustmentwidth = this.cellSizeWidth/4+1
      celladjustmentheight = this.cellSizeHeight/4+1

      switch (powerUps[i].type) {
        case POWERUP_TYPE_BASIC_COIN:
          asset = this.assets.BasicCoinSprite;
          break;
        case POWERUP_TYPE_DOUBLE_POINTS_COIN:
            asset = this.assets.PowerupDoublePoints;
            break;
        case POWERUP_TYPE_SPECIAL_COIN:
          asset = this.assets.SpecialCoinSprite;
          break;
        case POWERUP_TYPE_HEART:
          asset = this.assets.HeartPowerupSprite;
          break;
        case POWERUP_TYPE_SPEED:
          asset = this.assets.SpeedPowerupSprite;
          break;
        case POWERUP_TYPE_CLASSIC_COIN:
          asset = this.assets.ClassicCoinAnimationSprite
          x = this.currentAnimationStep*92; 
          spritewidth = 92;
          spriteheight = 77;
          celladjustmentwidth = 0;
          celladjustmentheight = 0; 
          break;
        default:
            asset = this.assets.BasicCoinSprite;
      }
      this.context.drawImage(
        asset, x, 0, spritewidth, spriteheight,
        (powerUps[i].position.x*this.cellSizeWidth)+celladjustmentwidth, 
        (powerUps[i].position.y*this.cellSizeHeight)+celladjustmentheight, 
        this.cellSizeWidth, 
        this.cellSizeHeight)
      }
    }
}