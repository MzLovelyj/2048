//2048 Game Model Logic
function Game2048() {
    this.board = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
    ];

    this.score = 0;
    this.won = false;
    this.lost = false;
    this._generateTile();
    this._generateTile();
}

//Private Method to generate a title
Game2048.prototype._generateTile = function() {
    //initial Value is equal to a random < .8
    //condition = true ? return x :
    var initialValue = (Math.random() < 0.8) ? 2 : 4;
    //call private method _getAvailablePosition
    var emptyTile = this._getAvailablePosition();

    //if we have a emptyTile
    if (emptyTile) {
        //update the board with the found position
        this.board[emptyTile.x][emptyTile.y] = initialValue;
    }
};

Game2048.prototype._getAvailablePosition = function() {
    var emptyTiles = [];

    this.board.forEach(function(row, rowIndex) {
        row.forEach(function(elem, colIndex) {
            if (!elem) emptyTiles.push({
                x: rowIndex,
                y: colIndex
            });
        });
    });

    if (emptyTiles.length === 0)
        return false;

    var randomPosition = Math.floor(Math.random() * emptyTiles.length);
    return emptyTiles[randomPosition];
};

//render the board
Game2048.prototype._renderBoard = function () {
  //for each row in the board, console.log the new row.
  this.board.forEach(function(row){ console.log(row); });
  console.log ('score: ' + this.score);
};

//Move left
Game2048.prototype._moveLeft = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

//loop though the newRow until length
    for(i = 0; i < newRow.length - 1; i++) {
      //if the next element equals the current element
      if (newRow[i+1] === newRow[i]) {
        //current index equals new Row multipulated by 2
        newRow[i]   = newRow[i] * 2;
        //set next element to null (empty)
        newRow[i+1] = null;
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.push(null);
    }

    if (newRow.length !== row.length)
      boardChanged = true;

    newBoard.push(merged);
  });

  this.board = newBoard;
  return boardChanged;
};

//Move right
Game2048.prototype._moveRight = function () {
  var newBoard = [];
  var that = this;
  //initial flag to for the board change.
  var boardChanged = false;

//For each row in th board
  this.board.forEach (function (row) {
    //newRow equals the row filitered for an empty element
    var newRow = row.filter(function (i) {
      return i !== null;
    });

//Loop through newRow, with index starting at newRow.length
//start at the end of the row.
//while i greater than 0, decerement i
    for(i = 0; i < newRow.length - 1; i++) {
      //If previous element equals current element
      if (newRow[i+1] === newRow[i]) {
        //set the current index to the multiple of itself by 2
        newRow[i]   = newRow[i] * 2;
        //Empty the previous index contents
        newRow[i+1] = null;
        //update the score with the new Value title.
        that._updateScore(newRow[i]);
      }
    }

//if the length of the new row does not equal current row length
if (newRow.length != row.length) boardChanged = true; //boardChanged

//merged
var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.unshift(null);
    }

    newBoard.push(merged);
});

this.board = newBoard;
return boardChanged;
};

//moving up
Game2048.prototype._moveUp = function () {
  //flip and rotate the board
  this._transposeMatrix();
  //move left, which is moving up on the flipped board
  var boardChanged = this._moveLeft();
  //flip and rotate the board back
  this._transposeMatrix();
  //return the updated board
  return boardChanged;
};
//moving down
Game2048.prototype._moveDown = function () {
  this._transposeMatrix();
  var boardChanged = this._moveRight();
  this._transposeMatrix();
  return boardChanged;
};

//transpose the 4x4 board. (turn it to 90 degrees essentially)
Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};
//
Game2048.prototype.move = function (direction) {
//
  if (!this._gameFinished()) {
    switch (direction) {
      case "up":    boardChanged = this._moveUp();    break;
      case "down":  boardChanged = this._moveDown();  break;
      case "left":  boardChanged = this._moveLeft();  break;
      case "right": boardChanged = this._moveRight(); break;
    }

    if (boardChanged) {
      this._generateTile();
    }
  }
};

Game2048.prototype._updateScore = function (value) {
  this.score += value;
};

Game2048.prototype._gameFinished = function() {
return this.lost;
};
//this is a method that is called to check if the game lost
Game2048.prototype._isGameLost = function () {
  //if there is a postition aviable, then return
  if (this._getAvailablePosition())
    return;

  var that   = this;
  var isLost = true;

//For each row in the board
  this.board.forEach(function (row, rowIndex) {
    //for each cell in the row
    row.forEach(function (cell, cellIndex) {
      //current is equal to this position at border[r][c].
      var current = that.board[rowIndex][cellIndex];
      //create empty movement variables
      var top, bottom, left, right;

//if the element to the left exsits
      if (that.board[rowIndex][cellIndex - 1]) {
        //assign left to that element
        left  = that.board[rowIndex][cellIndex - 1];
      }
      //if the element to the right exsits
      if (that.board[rowIndex][cellIndex + 1]) {
        //assign right to that element
        right = that.board[rowIndex][cellIndex + 1];
      }
      //if the elementat the top exsits
      if (that.board[rowIndex - 1]) {
        //assign right to the found element
        top    = that.board[rowIndex - 1][cellIndex];
      }
      //if the element on the bottom exsits
      if (that.board[rowIndex + 1]) {

        bottom = that.board[rowIndex + 1][cellIndex];
      }

      if (current === top || current === bottom || current === left || current === right)
        isLost = false;
    });
  });

  this.lost = isLost;
};
// 
// function renderTiles () {
//   game.board.forEach(function(row, rowIndex){
//     row.forEach(function (cell, cellIndex) {
//       if (cell) {
//         var tileContainer = document.getElementById("tile-container");
//         var newTile       = document.createElement("div");
//
//         newTile.classList  = "tile val-" + cell;
//         newTile.classList += " tile-position-" + rowIndex + "-" + cellIndex;
//         newTile.innerHTML  = (cell);
//
//         tileContainer.appendChild(newTile);
//       }
//     });
//   });
// }
//updates the score
function updateScore () {
  //stores the current game score
  var score          = game.score;
  //grabs elements by js-score class name
  var scoreContainer = document.getElementsByClassName("js-score");

  Array.prototype.slice.call(scoreContainer).forEach(function (span) {
    span.innerHTML = score;
  });
}

function gameStatus () {
  if (game.win()) {
    document.getElementById("game-over").classList = "show-won";
  } else if (game.lose()) {
    document.getElementById("game-over").classList = "show-lost";
  }
}

//KeyBoard move Listener
function moveListeners (event) {
  //keys that represent movement
  var keys = [37, 38, 39, 40];
//if there is no keycode on this event, then return nothing.
  if (keys.indexOf(event.keyCode) < 0)
    return;
//Based on the KeyCode received
  switch (event.keyCode) {
    case 37: game.move("left");  break;
    case 38: game.move("up");    break;
    case 39: game.move("right"); break;
    case 40: game.move("down");  break;
  }

  //resetTiles
resetTiles();
  //renderTiles
renderTiles();

updateScore();

  gameStatus();
}

//reset tiles
function resetTiles () {
  //targeting the tiles container based on id
  var tilesContainer = document.getElementById("tile-container");

//grab all the tiles off the tilesContainer
  var tiles          = tilesContainer.getElementsByClassName("tile");

  Array.prototype.slice.call(tiles).forEach(function (tile) {
//removes the child
    tilesContainer.removeChild(tile);
  });
}



//Interaction Logic
$(document).ready(function() {
  game = new Game2048();
  resetTiles();
  var game = new Game2048();

  game._renderBoard();
  game.move("up");
  game._renderBoard();
  game.move("down");
  game._renderBoard();
game.move("left");
game._renderBoard();
game.move("right");
game._renderBoard();
console.log('game is ready');
});
