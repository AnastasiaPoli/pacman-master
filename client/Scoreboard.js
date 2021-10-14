import Player from "./Player.js";

export default class Scoreboard {

   /**
     * 
    * @param {Element} scoreboardView 
    * @param {Player[]} players 
    * @param {Number} mainPlayerId 
    */

    constructor(scoreboardView, players, mainPlayerId) {
        this.view = scoreboardView;
        this.players = players;
        this.mainPlayerId = mainPlayerId;
    }

    update() {
        const list = document.createElement('ul');
        const listElement = document.createElement('li')
        const leveltext = document.createElement('span');
        leveltext.innerHTML = 'Level: ' + this.level
        listElement.append(leveltext);
        list.appendChild(listElement);
            
        this.players.forEach((player) => {
            const listElement = document.createElement('li');
            if (player.playerId === this.mainPlayerId) {
            listElement.classList.add('mainPlayer');
           }
              
            const text = document.createElement('span');
            text.innerHTML = 'Player ' + player.playerId + ' [' + player.type + '] ' + player.toString();

            listElement.append(text);
               
            list.appendChild(listElement);
            });
    
            this.view.innerHTML = '';
            this.view.append(list);
    }
    
    /**
    * 
    * @param {Player[]} players 
    */
    setPlayers(players) {
        this.players = players;
    }
    
    /**
    * 
    * @param {Number} mainPlayerId 
    */
    setMainPlayerId(mainPlayerId) {
        this.mainPlayerId = mainPlayerId;
    }
    /**
    * 
    * @param {Number} level 
    */
   setLevel(currentlevel) {
        this.level = currentlevel;
    }
}