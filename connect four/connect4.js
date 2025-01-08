const board = document.getElementById('board');
const columns = document.querySelectorAll('.column');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');

const ROWS = 6;
const COLS = 7;
const EMPTY = '';
const PLAYER = 'player';
const AI = 'ai';

let gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
let gameActive = true;
let currentPlayer = PLAYER;

columns.forEach(column => {
    column.addEventListener('click', handleColumnClick);
});

restartBtn.addEventListener('click', restartGame);

function handleColumnClick(e) {
    if (!gameActive || currentPlayer === AI) return;
    
    const column = e.currentTarget;
    const colIndex = parseInt(column.dataset.col);
    
    if (isValidMove(colIndex)) {
        const rowIndex = getLowestEmptyRow(colIndex);
        makeMove(rowIndex, colIndex);
        
        if (!checkWinner(rowIndex, colIndex)) {
            if (!checkDraw()) {
                currentPlayer = AI;
                statusText.textContent = "Computer's Turn";
                setTimeout(makeAIMove, 1000);
            }
        }
    }
}

function makeMove(row, col) {
    gameBoard[row][col] = currentPlayer;
    const cell = document.querySelector(`[data-col="${col}"] [data-row="${row}"]`);
    cell.classList.add(currentPlayer);
    
    if (checkWinner(row, col)) {
        const winningCells = getWinningCells(row, col);
        highlightWinningCells(winningCells);
        showVictoryPopup(`${currentPlayer === PLAYER ? 'You' : 'Computer'} Win!`);
        gameActive = false;
        return true;
    }
    
    if (checkDraw()) {
        showVictoryPopup("It's a Draw!");
        gameActive = false;
        return true;
    }
    
    return false;
}

function makeAIMove() {
    if (!gameActive) return;
    
    const move = findBestMove();
    const row = getLowestEmptyRow(move);
    
    makeMove(row, move);
    currentPlayer = PLAYER;
    statusText.textContent = "Your Turn";
}

function findBestMove() {
    // Enhanced AI strategy using simple heuristics
    const scores = Array(COLS).fill(0);
    
    for (let col = 0; col < COLS; col++) {
        if (!isValidMove(col)) {
            scores[col] = -Infinity;
            continue;
        }
        
        const row = getLowestEmptyRow(col);
        
        // Check for immediate win
        gameBoard[row][col] = AI;
        if (checkWinner(row, col)) {
            gameBoard[row][col] = EMPTY;
            return col;
        }
        gameBoard[row][col] = EMPTY;
        
        // Check for blocking player's win
        gameBoard[row][col] = PLAYER;
        if (checkWinner(row, col)) {
            gameBoard[row][col] = EMPTY;
            scores[col] += 100;
            continue;
        }
        gameBoard[row][col] = EMPTY;
        
        // Prefer center columns
        scores[col] += 7 - Math.abs(3 - col);
        
        // Prefer moves that create opportunities
        scores[col] += evaluatePosition(row, col, AI);
        
        // Avoid moves that give opponent winning opportunities
        scores[col] -= evaluatePosition(row - 1, col, PLAYER);
    }
    
    // Find the column with highest score
    let bestScore = -Infinity;
    let bestMoves = [];
    
    for (let col = 0; col < COLS; col++) {
        if (scores[col] > bestScore) {
            bestScore = scores[col];
            bestMoves = [col];
        } else if (scores[col] === bestScore) {
            bestMoves.push(col);
        }
    }
    
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function evaluatePosition(row, col, player) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 0;
    
    let score = 0;
    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal /
        [[1, -1], [-1, 1]]  // Diagonal \
    ];
    
    directions.forEach(direction => {
        let consecutive = 0;
        let spaces = 0;
        
        direction.forEach(([dx, dy]) => {
            let newRow = row + dx;
            let newCol = col + dy;
            
            while (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                (gameBoard[newRow][newCol] === player || gameBoard[newRow][newCol] === EMPTY) &&
                spaces < 2
            ) {
                if (gameBoard[newRow][newCol] === player) consecutive++;
                else spaces++;
                newRow += dx;
                newCol += dy;
            }
        });
        
        if (consecutive >= 2 && spaces === 0) score += 10;
        if (consecutive >= 3 && spaces <= 1) score += 50;
    });
    
    return score;
}

function isValidMove(col) {
    return gameBoard[ROWS - 1][col] === EMPTY;
}

function getLowestEmptyRow(col) {
    for (let row = 0; row < ROWS; row++) {
        if (gameBoard[row][col] === EMPTY) return row;
    }
    return -1;
}

function checkWinner(row, col) {
    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal /
        [[1, -1], [-1, 1]]  // Diagonal \
    ];
    
    const player = gameBoard[row][col];
    
    return directions.some(direction => {
        let count = 1;
        
        direction.forEach(([dx, dy]) => {
            let newRow = row + dx;
            let newCol = col + dy;
            
            while (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                gameBoard[newRow][newCol] === player
            ) {
                count++;
                newRow += dx;
                newCol += dy;
            }
        });
        
        return count >= 4;
    });
}

function getWinningCells(row, col) {
    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal /
        [[1, -1], [-1, 1]]  // Diagonal \
    ];
    
    const player = gameBoard[row][col];
    
    for (const direction of directions) {
        const cells = [[row, col]];
        let count = 1;
        
        direction.forEach(([dx, dy]) => {
            let newRow = row + dx;
            let newCol = col + dy;
            
            while (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                gameBoard[newRow][newCol] === player
            ) {
                cells.push([newRow, newCol]);
                count++;
                newRow += dx;
                newCol += dy;
            }
        });
        
        if (count >= 4) return cells;
    }
    return [];
}

function highlightWinningCells(cells) {
    cells.forEach(([row, col]) => {
        const cell = document.querySelector(`[data-col="${col}"] [data-row="${row}"]`);
        cell.classList.add('winner');
    });
}

function showVictoryPopup(message) {
    statusText.textContent = message;
}

function checkDraw() {
    return gameBoard[ROWS - 1].every(cell => cell !== EMPTY);
}

function restartGame() {
    gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
    gameActive = true;
    currentPlayer = PLAYER;
    statusText.textContent = "Your Turn";
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell';
    });
}