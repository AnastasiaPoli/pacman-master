export default class Labyrinth {
    constructor(extent){
        this.extent = extent; 
        this.ListOfCellfraction = [];
        this.ListOfAllCells = [];
        this.WallsToInspect = [];
        this.NeigborCells = [];
        this.IndividualLabyrinthStartcoordinates =[];
        this.IndividualLabyrinths = [];
        this.LabyrinthPositions = [];
        this.CenterPoints = [];
        this.ListOfWalls = [];
        this.CellsForCoins = [];
        this.StartpositionsPacman = [];
        this.StartpositionsGhost = [];
        this.Startpositions = [];
        this.individualLabyrinthsPerX = 2;
        this.individualLabyrinthsPerY = 2;
        this.cellsforFrame = 1;
        this.cellsforPassage = 1;
        this.amountOfIndividualLabyrinths = this.individualLabyrinthsPerX * this.individualLabyrinthsPerY;
        this.gridFractionHeight = Math.round((this.extent - this.cellsforFrame*2)/this.individualLabyrinthsPerY)-this.cellsforPassage*2
        this.gridFractionWidth = Math.round((this.extent - this.cellsforFrame*2)/this.individualLabyrinthsPerX)-this.cellsforPassage*2
        this.distancetowall = this.cellsforFrame + this.cellsforPassage
        this.distanceinbetween = this.cellsforPassage * 2
        this.distanceToNextLabyrinthX = this.gridFractionWidth + this.distanceinbetween
        this.distanceToNextLabyrinthY = this.gridFractionHeight + this.distanceinbetween
        this.centerDimension = 1;
        
        this.level = 0; 
        this.powerUps = [ //?
            /* Zeile 1: */ [1, 2, 3, 4],
            /* Zeile 2: */ [1, 2, 3, 4]
        ]
    }
 
 
    updateLabyrinth(){//when requested, a new random labyrinth is created
        this.createWholeLabyrinth();
        return this.ListOfWalls;
    }
    returnMazecells(){
        return this.CellsForCoins;
    }
    returnStartPositions(){
        return this.Startpositions
    }

    setListOfWalls(Array){
        this.ListOfWalls = Array; 
    }
    createWholeLabyrinth(){
        for(let i = 0; i < this.extent; i++) { //Start with a grid full of walls fitting any canvas and any extent
            for(var j = 0; j < this.extent; j++) {
                this.ListOfAllCells.push({
                    partofmaze: true, 
                    x: j,
                    y: i,
                    });      
            }
        }
        this.getIndividualLabrinths(); //create a predefined number of individual, small labrinths
        this.getIndividualIndices(); // get indices of full grid to put labytinths on
        this.setIndividualLabyrinthsOnGrid(); // lay the small labrinths over the big grid
        this.setFixedFrame(); //Insert fixed frame of walls in the Corner
        this.createFinalListOfWalls(); //create list containing only the walls to use in other classes of the game
        this.createFinalListforCoins();
    }
 
    creategridFraction(){    //Start with a grid full of walls fitting any canvas
        this.ListOfCellfraction = []; 
        for(var i = 0; i < this.gridFractionHeight; i++) {
            for(var j = 0; j < this.gridFractionWidth; j++) {
                this.ListOfCellfraction.push({
                    index: 0,
                    partofmaze: false, 
                    x: j,
                    y: i
                    });      
            }
        }
        for(let i = 0; i < this.ListOfCellfraction.length; i++) {
            this.ListOfCellfraction[i].index = i; 
        }
    }
    //Choose random cell of lines to keep as part of the maze: 
    ChooseRandomMazeCell(){
        let randomindex = Math.round(Math.random()*(this.ListOfCellfraction.length-1)); 
        this.ListOfCellfraction[randomindex].partofmaze = true;
        return randomindex;
    }
 
    addWallstoList(){ //Add the walls of the cell to the wall list.
        this.getNeigborCells(this.ListOfCellfraction[this.ChooseRandomMazeCell()]);
        for(var i=0; i<this.NeigborCells.length; i++){
            this.WallsToInspect.push({
                index: this.ListOfCellfraction[this.NeigborCells[i]].index, 
                partofmaze: false, 
                x: this.ListOfCellfraction[this.NeigborCells[i]].x,
                y: this.ListOfCellfraction[this.NeigborCells[i]].y
            })
        } 
    }
 
    getNeigborCells(currentCell){
        this.NeigborCells = []; 
        for(let i=0; i<this.ListOfCellfraction.length; i++){
            if (this.ListOfCellfraction[i].x === currentCell.x-1 && this.ListOfCellfraction[i].y === currentCell.y){
                this.NeigborCells.push(i);  //North
            }
            else if (this.ListOfCellfraction[i].x === currentCell.x && this.ListOfCellfraction[i].y === currentCell.y+1){
                this.NeigborCells.push(i);  //East
            }
            else if (this.ListOfCellfraction[i].x === currentCell.x && this.ListOfCellfraction[i].y === currentCell.y-1){
                this.NeigborCells.push(i);  //West
            }
            else if (this.ListOfCellfraction[i].x === currentCell.x+1 && this.ListOfCellfraction[i].y === currentCell.y){
                this.NeigborCells.push(i);  //South
            }
        }
    }
 
    UpdateWalls(){//While there are walls in the list: Pick a random wall from the list. 
        this.addWallstoList(); 
        let wallcount = 0; 
        while (this.WallsToInspect.length > 0){
            let randomindex = Math.round(Math.random()*((this.WallsToInspect.length)-1));
            this.getNeigborCells(this.WallsToInspect[randomindex]);
            wallcount = 0;
            for(let i=0; i<this.NeigborCells.length; i++){
                 //gibt es mehr als einen nachbarn der part of maze is? 
                    if(this.ListOfCellfraction[this.NeigborCells[i]].partofmaze === true){  
                        wallcount++; 
                    }
            }
            if(wallcount === 1){ //If only one of the cells that the wall divides is visited, then:
                //Make the wall a passage (Remove the wall from the list)
                for(let i=0; i<this.NeigborCells.length; i++){
                    if(this.ListOfCellfraction[this.NeigborCells[i]].partofmaze === false){ //Nachbarn die noch nicht part of maze sind zu WallsToInspect hinzufügen
                        this.WallsToInspect.push(this.ListOfCellfraction[this.NeigborCells[i]]);
                    }
                }
                this.ListOfCellfraction[this.WallsToInspect[randomindex].index].partofmaze = true;   //Wall ist jetzt Teil des Maze 
            }
            this.WallsToInspect.splice(randomindex, 1); //remove inspected wall from the list
    }
    return this.ListOfCellfraction;
    }
 

 
    getIndividualStartCoordinates(){
        for (let j=0; j<this.individualLabyrinthsPerY; j++){
            for (let i=0; i<this.individualLabyrinthsPerX; i++){
                this.IndividualLabyrinthStartcoordinates.push({
                    x: (this.cellsforPassage + this.cellsforFrame) + this.distanceToNextLabyrinthX * i, 
                    y: this.cellsforPassage + this.cellsforFrame+ this.distanceToNextLabyrinthY* j})
            }
        }
    }
    getIndividualIndices(){ 
        this.getIndividualStartCoordinates();
        for(let p=0; p<this.amountOfIndividualLabyrinths; p++){
            this.LabyrinthPositions[p]=[];
        }
        for(let k=0; k<this.IndividualLabyrinthStartcoordinates.length; k++){
            for(let l=0; l<this.gridFractionHeight; l++){
                for(let m=0; m<this.gridFractionWidth; m++){
                    for(let n=0; n<this.ListOfAllCells.length; n++){
                        if(this.ListOfAllCells[n].x === this.IndividualLabyrinthStartcoordinates[k].x + m &&
                            this.ListOfAllCells[n].y === this.IndividualLabyrinthStartcoordinates[k].y + l){
                            this.LabyrinthPositions[k].push(n)
                        }
                    }
                }
            }
        }
    }
 
    getIndividualLabrinths(){
        for (let i = 0; i < this.amountOfIndividualLabyrinths; i++){
            this.creategridFraction(); //for each of the for IndividualLabyrinths, a new clear grid must be created
            this.IndividualLabyrinths.push(this.UpdateWalls())//save random maze for each of the 4 IndividualLabyrinths
        }
    }
 
    setIndividualLabyrinthsOnGrid(){
        for(let i=0; i<this.amountOfIndividualLabyrinths; i++){
            for(let j=0; j<this.IndividualLabyrinths[i].length; j++){
                this.ListOfAllCells[this.LabyrinthPositions[i][j]].partofmaze = this.IndividualLabyrinths[i][j].partofmaze
            }   
        }
    }
    setFixedFrame(){  
        for (let i=0; i<this.ListOfAllCells.length; i++){ // create walls west for x 
            for (let j=0; j<this.gridFractionWidth+1; j++){
                if(this.ListOfAllCells[i].x === j && 
                    (this.ListOfAllCells[i].y === 0 || this.ListOfAllCells[i].y === this.extent-1)){
                    this.ListOfAllCells[i].partofmaze = false
                }
            }
        }
        for (let i=0; i<this.ListOfAllCells.length; i++){ // create walls east for x 
            for (let j=this.gridFractionWidth+1; j>0; j--){
                if(this.ListOfAllCells[i].x === this.extent-j && 
                    (this.ListOfAllCells[i].y === 0 || this.ListOfAllCells[i].y === this.extent-1)){
                    this.ListOfAllCells[i].partofmaze = false
                }
            }
        }
        for (let i=0; i<this.ListOfAllCells.length; i++){ // create walls north for y
            for (let j=0; j<this.gridFractionHeight+1; j++){
                if(this.ListOfAllCells[i].y === j && 
                    (this.ListOfAllCells[i].x === 0 || this.ListOfAllCells[i].x === this.extent-1)){
                    this.ListOfAllCells[i].partofmaze = false
                }
            }
        }
        for (let i=0; i<this.ListOfAllCells.length; i++){ // create walls south for y 
            for (let j=this.gridFractionHeight+1; j>0; j--){
                if(this.ListOfAllCells[i].y === this.extent-j && 
                    (this.ListOfAllCells[i].x === 0 || this.ListOfAllCells[i].x === this.extent-1)){
                    this.ListOfAllCells[i].partofmaze = false
                }
            }
        }
    }

    createFinalListOfWalls(){
        for(let i=0; i<this.ListOfAllCells.length; i++){
            if(this.ListOfAllCells[i].partofmaze === false){
                this.ListOfWalls.push({x: this.ListOfAllCells[i].x, y: this.ListOfAllCells[i].y})
            }
        }
    }
    createFinalListforCoins(){
        this.setCenterPoints();
        this.createStartPositions()
        for(let i=0; i<this.ListOfAllCells.length; i++){
            if(this.ListOfAllCells[i].partofmaze === true){
                this.CellsForCoins.push({x: this.ListOfAllCells[i].x, y: this.ListOfAllCells[i].y})
            }
        }
        for(let i=0; i<this.CellsForCoins.length; i++){
            for(let j=0; j<this.StartpositionsPacman.length; j++){
                if(this.CellsForCoins[i].x === this.StartpositionsPacman[j].x &&
                    this.CellsForCoins[i].y === this.StartpositionsPacman[j].y){
                        this.CellsForCoins.splice(i, 1)
                }   
            }
        }
    }
    setCenterPoints(){
        for(let i=this.centerDimension; i>0; i--){
            this.CenterPoints.push(this.extent/2-i)
        }
        for(let i=0; i<this.centerDimension; i++){
            this.CenterPoints.push(this.extent/2+i)
        }
    }
    createStartPositions(){
        for(let i=0; i<this.CenterPoints.length; i++){
            for(let j=0; j<this.CenterPoints.length; j++){
                this.StartpositionsPacman.push({x: this.CenterPoints[i], y: this.CenterPoints[j]})
            }
        }
        this.StartpositionsGhost = [
            {x: this.cellsforFrame, y: this.cellsforFrame},
            {x: this.extent-1-this.cellsforFrame, y: this.cellsforFrame},
            {x: this.cellsforFrame, y: this.extent-1-this.cellsforFrame},
            {x: this.extent-1-this.cellsforFrame, y:this.extent-1-this.cellsforFrame}] 
        for(let i=0; i<this.StartpositionsPacman.length; i++){
            this.Startpositions.push(this.StartpositionsGhost[i%4])
            this.Startpositions.push(this.StartpositionsPacman[i])
        }
    }
 }
