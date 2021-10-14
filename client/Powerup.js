import pacman from "./Pacman.js";

export const POWERUP_TYPE_BASIC_COIN = 'BASIC_COIN';
export const POWERUP_TYPE_DOUBLE_POINTS_COIN = 'DOUBLE_POINTS_COIN';
export const POWERUP_TYPE_SPECIAL_COIN = 'SPECIAL_COIN';
export const POWERUP_TYPE_HEART = 'HEART';
export const POWERUP_TYPE_SPEED = 'SPEED';
export const POWERUP_TYPE_CLASSIC_COIN = 'CLASSIC_COIN';

export default class Powerup {
  /**
   * @param { x: Number, y: Number } position of the coin { x: x, y: y }
   */
  constructor(position, type) {
    this.position = position

    // Assign random coin type
    if (type === undefined) {
      let random = Math.round(Math.random() * 100);
      if (random < 75) {
        this.type = POWERUP_TYPE_BASIC_COIN
      } else if (random < 80) {
        this.type = POWERUP_TYPE_DOUBLE_POINTS_COIN
      } else if (random < 85) {
        this.type = POWERUP_TYPE_SPECIAL_COIN
      } else if (random < 90) {
        this.type = POWERUP_TYPE_HEART
      }else if (random < 95) {
        this.type = POWERUP_TYPE_CLASSIC_COIN
      } else {
        this.type = POWERUP_TYPE_SPEED
      }
    } else {
      this.type = type;
    }
  }

  /**
   * 
   * @param {pacman} pacman
   */
  handlePacmanOnCoin(pacman, game) {
    switch (this.type) {
      //pacman gets one heart
      case POWERUP_TYPE_HEART:
        pacman.addHeart(1);
        break;

      //pacman gets one point
      case POWERUP_TYPE_BASIC_COIN: 
        pacman.addPoints(1);
        break;

      //pacman double points coin
      case POWERUP_TYPE_DOUBLE_POINTS_COIN: 
        pacman.doublePoints(pacman.points);
        break;

      //pacman gets random speed
      case POWERUP_TYPE_SPEED:
        const newSpeed = Math.floor(Math.random() * 2) + 1;
        pacman.setMovementSpeed(newSpeed);
        break;

      //pacman gets random coins
      case POWERUP_TYPE_SPECIAL_COIN: 
        pacman.addPoints(Math.floor(Math.random() * 15) - 5);
        break;

      case POWERUP_TYPE_CLASSIC_COIN:
        pacman.addPoints(10);
        game.ClassicCoinActivation();
        break;
    }
  }  
}