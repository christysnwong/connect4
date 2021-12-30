/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

const reset = document.getElementById('reset');
reset.addEventListener('click', resetGame);

const whoseTurn = document.querySelector("#msg");

/** makeBoard: create in-JS board structure:
*    board = array of rows, each row is array of cells  (board[y][x])
*/

function resetGame() {
  const htmlBoard = document.querySelector("#board");
  htmlBoard.innerHTML = '';
  board = [];
  makeBoard();
  makeHtmlBoard();

  currPlayer = 1;
  whoseTurn.innerText = `> Player ${currPlayer}'s Turn <`;
  
}



function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array(WIDTH).fill(null, 0));
  }
  return board;
}
   


/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // Adding row of column tops to the htmlBoard
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Addign the remaining rows to the htmlBoard
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      

      const pcHolder = document.createElement("div");
      pcHolder.classList.add("pieceholder");
      cell.append(pcHolder);

      row.append(cell);

    }
    htmlBoard.append(row);
  }


  whoseTurn.innerText = `> Player ${currPlayer}'s Turn <`;

}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT-1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;

}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const tableCell = document.getElementById(`${y}-${x}`);
  console.log(`${y}-${x}`);
  const pc = document.createElement("div");
  
  pc.classList.add("piece", `p${currPlayer}`)

  tableCell.append(pc);

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message


  setTimeout(() => 
    alert(msg), 1000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {

  if (checkForWin()) {
    return;
  }
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board

  board[y][x] = currPlayer;
    
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Congratulations! Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(subArr => subArr.indexOf(null) === -1)) {
    alert("Tie!");
  }



  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1? currPlayer = 2: currPlayer = 1;

  whoseTurn.innerText = `> Player ${currPlayer}'s Turn <`;

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // Check if it matches any 1 of the 4 winning requirements

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
