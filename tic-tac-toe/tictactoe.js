const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');

let currentPlayer = 'x';
let gameBoard = Array(9).fill('');
let gameActive = true;

const magicSquare = [8, 1, 6, 3, 5, 7, 4, 9, 2];
let playerMoves = { x: [], o: [] };

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', restartGame);

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (gameBoard[index] === '' && gameActive && currentPlayer === 'x') {
        makeMove(index);

        if (gameActive && !checkDraw()) {
            setTimeout(computerMove, 500);
        }
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    playerMoves[currentPlayer].push(magicSquare[index]);
    cells[index].classList.add(currentPlayer);

    if (checkWin(playerMoves[currentPlayer])) {
        showVictoryPopup(`Player ${currentPlayer.toUpperCase()} Wins!`);
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        showVictoryPopup("It's a Draw!");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    statusText.textContent = `${currentPlayer === 'x' ? 'Your' : "Computer's"} Turn`;
}

function checkWin(moves) {
    if (moves.length < 3) return false;

    // Check all combinations of 3 moves
    for (let i = 0; i < moves.length; i++) {
        for (let j = i + 1; j < moves.length; j++) {
            for (let k = j + 1; k < moves.length; k++) {
                if (moves[i] + moves[j] + moves[k] === 15) {
                    return true;
                }
            }
        }
    }
    return false;
}

function computerMove() {
    if (!gameActive) return;

    // Choose the best move using the magic square logic
    let bestMove = -1;

    // Try to win
    bestMove = findWinningMove('o');
    if (bestMove !== -1) {
        makeMove(bestMove);
        return;
    }

    // Block the player's win
    bestMove = findWinningMove('x');
    if (bestMove !== -1) {
        makeMove(bestMove);
        return;
    }

    // Take the center if available
    if (gameBoard[4] === '') {
        makeMove(4);
        return;
    }

    // Choose a random available cell
    const availableMoves = gameBoard.map((val, idx) => (val === '' ? idx : null)).filter(idx => idx !== null);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove);
}

function findWinningMove(player) {
    const moves = playerMoves[player];

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            const potentialMoves = [...moves, magicSquare[i]];
            if (checkWin(potentialMoves)) {
                return i;
            }
        }
    }
    return -1;
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function restartGame() {
    gameBoard = Array(9).fill('');
    playerMoves = { x: [], o: [] };
    gameActive = true;
    currentPlayer = 'x';
    statusText.textContent = "Your Turn";

    cells.forEach(cell => {
        cell.className = 'cell';
    });

    const popup = document.querySelector('.victory-popup');
    if (popup) {
        popup.remove();
    }
}

function showVictoryPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'victory-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${message}</h2>
            <button onclick="restartGame()">Play Again</button>
        </div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('show'), 100);
}
