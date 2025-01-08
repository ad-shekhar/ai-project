const gridSize = 10;  // 10x10 grid
const numMines = 10;  // 10 mines
let grid = [];
let revealed = [];
let mines = [];
let remainingMines = numMines;
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
    createGrid();
    document.getElementById("reset-button").addEventListener("click", resetGame);
});

function createGrid() {
    grid = [];
    revealed = [];
    mines = [];
    remainingMines = numMines;
    gameOver = false;

    const gridContainer = document.getElementById("grid-container");
    const mineCountDisplay = document.getElementById("mine-count");
    mineCountDisplay.textContent = remainingMines;

    gridContainer.innerHTML = "";
    for (let row = 0; row < gridSize; row++) {
        const rowCells = [];
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", handleCellClick);
            gridContainer.appendChild(cell);
            rowCells.push(cell);
        }
        grid.push(rowCells);
        revealed.push(new Array(gridSize).fill(false));
    }

    placeMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        if (!mines.some(mine => mine.row === row && mine.col === col)) {
            mines.push({ row, col });
            minesPlaced++;
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (revealed[row][col]) return;

    if (mines.some(mine => mine.row === row && mine.col === col)) {
        event.target.classList.add("mine");
        remainingMines--;
        document.getElementById("mine-count").textContent = remainingMines;
        gameOver = true;
        alert("Game Over! You hit a mine.");
    } else {
        revealCell(row, col);
        checkVictory();
    }
}

function revealCell(row, col) {
    if (revealed[row][col]) return;

    revealed[row][col] = true;
    const cell = grid[row][col];
    const surroundingMines = countAdjacentMines(row, col);
    cell.classList.add("revealed");

    if (surroundingMines > 0) {
        cell.textContent = surroundingMines;
    } else {
        const neighbors = getNeighbors(row, col);
        neighbors.forEach(neighbor => {
            if (!revealed[neighbor.row][neighbor.col]) {
                revealCell(neighbor.row, neighbor.col);
            }
        });
    }
}

function countAdjacentMines(row, col) {
    const neighbors = getNeighbors(row, col);
    return neighbors.filter(neighbor => mines.some(mine => mine.row === neighbor.row && mine.col === neighbor.col)).length;
}

function getNeighbors(row, col) {
    const neighbors = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && (r !== row || c !== col)) {
                neighbors.push({ row: r, col: c });
            }
        }
    }
    return neighbors;
}

function checkVictory() {
    const revealedCells = grid.flat().filter(cell => revealed[cell.dataset.row][cell.dataset.col]);
    if (revealedCells.length === gridSize * gridSize - numMines) {
        alert("Congratulations! You cleared the board.");
        gameOver = true;
    }
}

function resetGame() {
    createGrid();
}
