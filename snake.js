
class SnakeGame {

    static NUM_ROWS = 60;
    static NUM_COLS = 120;
    food_x = 0;
    food_y = 0;
    boardCells = [];
    score = 60;
    leftDirection = false;
    rightDirection = false;
    upDirection = false;
    downDirection = false;

    constructor(board, controls) {

        this.board = board;
        this.controls = controls;
        this.scoreCounter = this.controls.querySelector('.score');
        this.dirsound = new Audio('static/dir.wav');
        this.eatSound = new Audio('static/eat.wav');
        this.hitSound = new Audio('static/hit.wav');
        this.initBoard();

        this.snake = new Snake(this);
        this.food = new Food(this);

        window.addEventListener('keydown', (event) => {
        this.dirsound.play();
            switch (event.key) {
                case 'ArrowLeft':
                case 'a':
                    this.snake.setDirection('left');
                    break;

                case 'ArrowUp':
                case 'w':
                    this.snake.setDirection('up');
                    break;

                case 'ArrowRight':
                case 'd':
                    this.snake.setDirection('right');
                    break;

                case 'ArrowDown':
                case 's':
                    this.snake.setDirection('down');
                    break;

                case 'Escape':
                    this.snake.pause();
                    break;
            }
        });

    }

    /**
     * Build the board using rows of cells
     */
    initBoard() {
        // Generate a new row
        const newRow = (rowNum) => {
            const row = document.createElement('div');
            row.classList.add('row');
            row.classList.add('row-' + rowNum);
            console.log("row:"+ row);
            return row;
        }
        // Generate a new column
        const newCol = (colNum) => {
            const col = document.createElement('div');
            col.classList.add('col');
            col.classList.add('col-' + colNum);
            console.log("col:"+ col);
            return col;
        }

        // For each number of rows make a new row element and fill with columns
        for (let r = 0; r < SnakeGame.NUM_ROWS; r++) {

            const row = newRow(r);
            const boardCellsRow = [];

            // For each number of columns make a new column element and add to the row
            for (let c = 0; c < SnakeGame.NUM_COLS; c++) {

                const col = newCol(c);
                row.appendChild(col);
                boardCellsRow.push(col);

            }

            this.board.appendChild(row);
            this.boardCells.push(boardCellsRow);

        }

    }

    /**
     * Begin the game
     */
    play() {

        this.controls.classList.add('playing');
        this.snake.move();

    }

    /**
     * Restart the game after game over
     */
    restart() {

        this.snake.reset();
        this.controls.classList.remove('game-over');
        this.board.classList.remove('game-over');

    }

    /**
     * Increment the user's score
     */
    increaseScore(amount) {

        this.score += amount;
        this.scoreCounter.innerText = this.score;

    }
    

    /**
     * End the game
     */
    async gameOver() {
        this.hitSound.play();
        this.snake.pause();
        this.controls.classList.add('game-over');
        this.controls.classList.remove('playing');
        this.board.classList.add('game-over');
        setTimeout(() => { this.snake.myFunction(); }, 1600);
        setTimeout(() => { this.snake.getFunction();  }, 2100);

    }

}

class Snake {

    static STARTING_EDGE_OFFSET = 20;
    tail = [];
    tailLength = 6;
    direction = 'up';
    speed = 160;
    moving = false;
    dx = 1;
    dy = 0;
 

    constructor(game) {

        this.game = game;
        this.init();
    }

    /**
     * Place the snake initially
     */
    init() {

        const x = Math.floor(Math.random() * (SnakeGame.NUM_COLS - Snake.STARTING_EDGE_OFFSET)) + (Snake.STARTING_EDGE_OFFSET / 2);
        const y = Math.floor(Math.random() * (SnakeGame.NUM_ROWS - Snake.STARTING_EDGE_OFFSET)) + (Snake.STARTING_EDGE_OFFSET / 2);
        this.position = { x, y };
        const startCell = this.game.boardCells[y][x];
        console.log("startCell:"+startCell);
        startCell.classList.add('snake');
        this.start = startCell;
        this.tail.push(this.position);

    }

    /**
     * Move the snake
     */
    move() {

        // If this is the first move, make sure the game isn't paused
        if (!this.moving) {
            this.moving = true;
            this.game.controls.classList.remove('paused');
        }
        
         console.log("I'm in move");
      
       let x= this.tail[0].x + this.dx;
       let y= this.tail[0].y + this.dy;
       let cell = this.game.boardCells[y][x];
       cell.classList.add('snake');
       this.tail.unshift({x, y});
       
        
       //x overflow
        if(x >= SnakeGame.NUM_COLS-1){
            console.log("Hit right wall");
            
            this.game.gameOver();
           }
           
        else if(x <= 0){
            console.log("Hit left wall");
            this.game.gameOver();
            }

        //y overflow
        if(y >= SnakeGame.NUM_ROWS-1){
            console.log("Hit bottom wall");
            this.game.gameOver();

            }
        else if(y <= 0){
            console.log("Hit Upper wall");
            this.game.gameOver();
            }
        
        const has_eaten_food = (x === SnakeGame.food_x && y === SnakeGame.food_y);
       
        if (has_eaten_food) {
           console.log("Eaten me!");
           this.game.eatSound.play();
           this.game.increaseScore(5);
           this.speed -= 20;
           // Generate new food location
           this.game.food.rem.classList.remove('food');
           this.game.food.fnit();
           
          } 
        else{  
       
       let a= this.tail[this.tail.length-1].x;
       let b= this.tail[this.tail.length-1].y;
       cell = this.game.boardCells[b][a];
       cell.classList.remove('snake');
       this.tail.pop();
      
      }
      
      if(this.tail.length > 4){
      
      for (let i = 4; i < this.tail.length; i++) {    
      const didCollide = (this.tail[i].x === this.tail[0].x && this.tail[i].y === this.tail[0].y);
      if(didCollide){
        this.game.gameOver();
        break;
      }
      
      }
     }
          // Move another step in `this.speed` number of milliseconds
        this.movementTimer = setTimeout(() => { this.move(); }, this.speed);

    }
    

 
 /* Function for retrieving and displaying High Score data */
 
    getFunction(){
     
     const http = new XMLHttpRequest();
     const data = "";
     http.addEventListener("readystatechange", function() {
     console.log(http.responseText);
     });
     http.open("GET", "https://snake.howbout.app/api/prity/high-scores");
     http.setRequestHeader("Content-Type", "application/json");
     http.onload = function(){ 
     
     let res=[];
     for(let i=0;i<http.responseText.length;i++){
     res.push(Object.values(http.responseText[i]));
     }

     document.write("<TABLE BORDER=ON>");
     document.write("<TH>Id</TH><TH>Name</TH><TH>Score</TH><TH>Created-On</TH><TH>Updated-on</TH>");
     for(let x=0; x<res.length; x++) {
     for(let y=0; y<res.length; y++){
     document.write("<TD>",res[x][y],"</TD>");
      }
     document.write("</TR>");
      }
     document.write("</TABLE>");
     }
     http.onerror = function(){ alert ("Please turn on your internet and enter details to see High Score data"); }  
     http.send(data);
      } 
      
  /* Function for creating High Score data */    
     
    myFunction() {
    
     let txt;
     let person = prompt("Please enter your name:", "Harry Potter");
     if (person == null || person == "") {
      alert("Gamer cancelled the prompt.");
      } else {

     let data = JSON.stringify({
      "name": person,
      "score": SnakeGame.score
      });

     const xhr = new XMLHttpRequest();
     xhr.addEventListener("readystatechange", function() {
     if(this.readyState === 4) {
       console.log(xhr.responseText);
     }
       });

     xhr.open("POST", "https://snake.howbout.app/api/prity/high-scores");
     xhr.setRequestHeader("Content-Type", "application/json");
     //xhr.setRequestHeader("Access-Control-Allow-Origin", "https://snake.howbout.app/");
     xhr.onload = function(){ 
       console.log("POST Successful");
     }
     
     xhr.onerror = function(){ alert ("Please turn on your internet and enter details to see High Score data"); }   
 
     xhr.send(data);

  }
 }
 
    /**
     * Set the snake's direction
     */

    setDirection(direction) {
      
       if(direction === 'left' && !SnakeGame.rightDirection){

         this.dx = -1;
         this.dy = 0;
         SnakeGame.leftDirection = true;
         SnakeGame.upDirection = false;
         SnakeGame.downDirection = false;
         
        }
        if(direction === 'right' && !SnakeGame.leftDirection){
         this.dx = 1;
         this.dy = 0;
         SnakeGame.rightDirection = true;
         SnakeGame.upDirection = false;
         SnakeGame.downDirection = false;
         
        }
        if(direction === 'up' && !SnakeGame.downDirection){
         this.dx = 0;
         this.dy = -1;
         SnakeGame.leftDirection = false;
         SnakeGame.rightDirection = false;
         SnakeGame.upDirection = true;

        }
        if(direction === 'down' && !SnakeGame.upDirection){
         this.dx = 0;
         this.dy = 1;
         SnakeGame.downDirection = true;
         SnakeGame.leftDirection = false;
         SnakeGame.rightDirection = false;
        }
        // Todo: update the snake's direction here

    }

    /**
     * Pause the snake's movement
     */
    pause() {
        clearTimeout(this.movementTimer);
        this.moving = false;
        this.game.controls.classList.add('paused');
    }

    /**
     * Reset the snake back to the initial defaults
     */
    reset() {

        for (let i = 0; i < this.tail.length; i++) {
            let x= this.tail[i].x;
            let y= this.tail[i].y;
            let van= this.game.boardCells[y][x];
            van.classList.remove('snake');
        }
        
        this.game.food.rem.classList.remove('food');
        this.tail.length = 0;
        this.tailLength = 6;
        this.direction = 'up';
        this.speed = 160;
        this.moving = false;
        this.dx = 1;
        this.dy = 0;
        this.init();
        this.game.food.fnit();

    }

}

class Food {

    
    constructor(game) {

        this.game = game;
        this.fnit();

    }
  
   fnit() {

     SnakeGame.food_x = Math.round((Math.random() * (SnakeGame.NUM_COLS-1) + 0) / 1) * 1;
     SnakeGame.food_y = Math.round((Math.random() * (SnakeGame.NUM_ROWS-1) + 0) / 1) * 1;
     let foodCell = this.game.boardCells[SnakeGame.food_y][SnakeGame.food_x];
     this.rem = foodCell;
     foodCell.classList.add('food');
     this.game.snake.tail.forEach(function isFoodOnSnake(part) {    
     const foodIsOnSnake = (part.x == SnakeGame.food_x && part.y == SnakeGame.food_y); 
     if (foodIsOnSnake){  
     this.rem.classList.remove('food');
     this.fnit();  }
     });
     
     }
    
}
