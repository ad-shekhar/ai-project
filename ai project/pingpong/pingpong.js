const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverModal = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 10;
const paddleSpeed = 8;

let gameState = {
    ballX: canvas.width / 2,
    ballY: canvas.height / 2,
    ballSpeedX: 5,
    ballSpeedY: 5,
    leftPaddleY: canvas.height / 2 - paddleHeight / 2,
    rightPaddleY: canvas.height / 2 - paddleHeight / 2,
    score: 0,
    isPaused: false,
    isGameOver: false,
    lastHitBy: 'none' // Track who hit the ball last
};

const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    pauseBtn.textContent = gameState.isPaused ? 'Resume' : 'Pause';
}

function moveLeftPaddle() {
    if ((keys.w || keys.ArrowUp) && gameState.leftPaddleY > 0) 
        gameState.leftPaddleY -= paddleSpeed;
    if ((keys.s || keys.ArrowDown) && gameState.leftPaddleY < canvas.height - paddleHeight) 
        gameState.leftPaddleY += paddleSpeed;
}

function moveComputerPaddle() {
    // Simulate human-like reaction time and movement
    if (gameState.ballSpeedX > 0) { // Only move when ball is coming towards computer
        const reactionDistance = canvas.width * 0.6; // Start reacting at 60% of court width
        
        if (gameState.ballX > reactionDistance) {
            const targetY = gameState.ballY - paddleHeight / 2;
            const currentY = gameState.rightPaddleY;
            
            if (Math.abs(targetY - currentY) > paddleSpeed) {
                if (targetY > currentY) {
                    gameState.rightPaddleY += paddleSpeed;
                } else {
                    gameState.rightPaddleY -= paddleSpeed;
                }
            }
        }
    }
    
    // Keep paddle within bounds
    gameState.rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, gameState.rightPaddleY));
}

function moveBall() {
    gameState.ballX += gameState.ballSpeedX;
    gameState.ballY += gameState.ballSpeedY;

    // Wall collisions
    if (gameState.ballY < 0 || gameState.ballY > canvas.height) {
        gameState.ballSpeedY = -gameState.ballSpeedY;
    }

    // Left paddle collision
    if (gameState.ballX < paddleWidth + ballSize && 
        gameState.ballY > gameState.leftPaddleY && 
        gameState.ballY < gameState.leftPaddleY + paddleHeight) {
        if (gameState.lastHitBy !== 'player') {
            gameState.score += 10;
            updateScore();
            gameState.lastHitBy = 'player';
        }
        gameState.ballSpeedX = -gameState.ballSpeedX * 1.1;
        gameState.ballSpeedY *= 1.1;
    }

    // Right paddle collision
    if (gameState.ballX > canvas.width - paddleWidth - ballSize && 
        gameState.ballY > gameState.rightPaddleY && 
        gameState.ballY < gameState.rightPaddleY + paddleHeight) {
        gameState.ballSpeedX = -gameState.ballSpeedX * 1.1;
        gameState.ballSpeedY *= 1.1;
        gameState.lastHitBy = 'computer';
    }

    // Miss detection
    if (gameState.ballX < 0 || gameState.ballX > canvas.width) {
        gameOver();
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${gameState.score}`;
}

function gameOver() {
    gameState.isGameOver = true;
    finalScoreElement.textContent = gameState.score;
    gameOverModal.style.display = 'flex';
}

function restartGame() {
    gameState = {
        ballX: canvas.width / 2,
        ballY: canvas.height / 2,
        ballSpeedX: 5,
        ballSpeedY: 5,
        leftPaddleY: canvas.height / 2 - paddleHeight / 2,
        rightPaddleY: canvas.height / 2 - paddleHeight / 2,
        score: 0,
        isPaused: false,
        isGameOver: false,
        lastHitBy: 'none'
    };
    updateScore();
    gameOverModal.style.display = 'none';
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, gameState.leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, gameState.rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ballX, gameState.ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function gameLoop() {
    if (!gameState.isPaused && !gameState.isGameOver) {
        moveLeftPaddle();
        moveComputerPaddle();
        moveBall();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();