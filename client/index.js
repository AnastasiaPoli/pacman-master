import AssetLoader from "./AssetLoader.js";
import Game from "./Game.js";

new AssetLoader()
  .loadAssets([
    { name: "yellowPacmanSprite", url: "./assets/pacman-yellow.png" },
    { name: "orangePacmanSprite", url: "./assets/pacman-orange.png" },
    { name: "pinkPacmanSprite", url: "./assets/pacman-pink.png" },
    { name: "magentaPacmanSprite", url: "./assets/pacman-magenta.png" },
    { name: "redGhostSprite", url: "./assets/ghost-red.png" },
    { name: "blueGhostSprite", url: "./assets/ghost-blue.png" },
    { name: "greenGhostSprite", url: "./assets/ghost-green.png" },
    { name: "brownGhostSprite", url: "./assets/ghost-brown.png" },
    { name: "whiteGhostSprite", url: "./assets/ghost-white.png" },
    { name: "purpleGhostSprite", url: "./assets/ghost-purple.png" },
    { name: "mazewallSprite", url: "./assets/maze.png" },
    { name: "BasicCoinSprite", url: "./assets/basicCoin.png" },
    { name: "PowerupDoublePoints", url: "./assets/powerupDoublePoints.png" },
    { name: "randomSpeedPowerup", url: "./assets/powerupRandomSpeed.png" },
    { name: "SpecialCoinSprite", url: "./assets/powerupRandomCoins.png" },
    { name: "SpeedPowerupSprite", url: "./assets/powerupRandomSpeed.png" },
    { name: "HeartPowerupSprite", url: "./assets/powerupHeart.png" },
    { name: "ClassicCoinSprite", url: "./assets/classicCoin.png" },
    { name: "ClassicCoinAnimationSprite", url: "./assets/ClassicCoinAnimation.png" },
    { name: "GameOverSprite", url: "./assets/gameover.png"}
  ])
  .then(assets => {
    const game = new Game(
      document.getElementById("myCanvas"), 
      assets,
      document.getElementById('scoreboard')
      );
    game.loop();
  });
