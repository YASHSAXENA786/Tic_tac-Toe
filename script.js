const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const xScoreText = document.getElementById('x-score');
const oScoreText = document.getElementById('o-score');
const drawScoreText = document.getElementById('draw-score');

const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const drawSound = document.getElementById('draw-sound');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill("");
let scores = { X: 0, O: 0, draw: 0 };

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function createBoard() {
  board.innerHTML = '';
  gameState = Array(9).fill("");
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = Number(e.target.dataset.index);

  if (!gameActive || gameState[index] !== "") return;

  makeMove(index);
  clickSound.play();

  if (checkEnd()) return;

  if (currentPlayer === 'O') {
    setTimeout(aiMove, 400); // Delay for realism
  }
}

function makeMove(index) {
  gameState[index] = currentPlayer;
  board.children[index].textContent = currentPlayer;
}

function checkEnd() {
  if (checkWin()) {
    statusText.textContent = `🎉 Player ${currentPlayer} wins!`;
    scores[currentPlayer]++;
    updateScore();

    // Only play win sound if Player X (human) wins
    if (currentPlayer === 'X') {
      winSound.play();
    }

    gameActive = false;
    return true;
  } else if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    scores.draw++;
    updateScore();
    drawSound.play();
    gameActive = false;
    return true;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    return false;
  }
}


function checkWin() {
  return winConditions.some(([a, b, c]) =>
    gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]
  );
}

function aiMove() {
  if (!gameActive) return;

  // 1. Try to win
  let move = findBestMove('O');
  // 2. Try to block X
  if (move === -1) move = findBestMove('X');
  // 3. Take center
  if (move === -1 && gameState[4] === "") move = 4;
  // 4. Take corners
  const corners = [0, 2, 6, 8].filter(i => gameState[i] === "");
  if (move === -1 && corners.length > 0) move = corners[Math.floor(Math.random() * corners.length)];
  // 5. Take sides
  const sides = [1, 3, 5, 7].filter(i => gameState[i] === "");
  if (move === -1 && sides.length > 0) move = sides[Math.floor(Math.random() * sides.length)];

  makeMove(move);
  clickSound.play();
  checkEnd();
}
function findBestMove(player) {
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = player;
      if (checkWin()) {
        gameState[i] = ""; // Reset the move
        return i;
      }
      gameState[i] = ""; // Reset the move
    }
  }
  return -1;
}


function updateScore() {
  xScoreText.textContent = scores.X;
  oScoreText.textContent = scores.O;
  drawScoreText.textContent = scores.draw;
}

restartBtn.addEventListener('click', createBoard);

createBoard();
