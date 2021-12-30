/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// const WIDTH = 7;
// const HEIGHT = 6;

// let currPlayer = 1; 
// let board = []; 

class Game {
  constructor (p1, p2, HEIGHT = 6, WIDTH = 7) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.currPlayer = p1; // active player: 1 or 2
    this.players = [p1, p2];
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }



  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.style.padding = "20px";

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        
        const pcHolder = document.createElement("div");
        pcHolder.classList.add("pieceholder");
        cell.append(pcHolder);

        row.append(cell);
      }

      board.append(row);
    }

    const whoseTurn = document.querySelector("#msg");
    whoseTurn.innerText = `> Player ${this.currPlayer.color}'s Turn <`;

  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // piece.classList.add(`${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.color;

    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    setTimeout(() => 
    alert(msg), 1000);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {

    // check if game is already over
    if(this.gameOver === true) {
      return;
    }

    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Congratulations! Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];

    const whoseTurn = document.querySelector("#msg");
    whoseTurn.innerText = `> Player ${this.currPlayer.color}'s Turn <`;

  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    const _win = cells => {
          
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
    
  }

}

class Player {
  constructor(color) {
    if(color === "") {
      alert("Please type in a color.");
      throw new Error("Empty String!");
    }

    if(this.isValidColor(color) !== true) {

      document.getElementById("p1-color").value = "";
      document.getElementById("p2-color").value = "";

      alert("Please type in a valid color.");
      throw new Error("Invalid color!!")
    }

    this.color = color;

  }

  isValidColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
  
    // return 'false' if color wasn't assigned
    return s.color == strColor.toLowerCase();
  }



}



let start = document.getElementById("start");
start.addEventListener("click", startGame);

function startGame() {
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1, p2);
}


