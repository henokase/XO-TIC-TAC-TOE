const body = document.querySelector('body');
const playerOneName = document.querySelector('.player-name-1');
const playerTwoName = document.querySelector('.player-name-2');
const restart = document.querySelector('.restart-btn');
const reset = document.querySelector('.reset-btn');
const changeModeBtn = document.querySelector('.change-mode');
const resX = document.querySelector('#pt-x');
const resO = document.querySelector('#pt-o');
const resTie = document.querySelector('#pt-tie');
const difficultBtn = document.querySelector('.change-difficulty');

let currentPlayer = 'x';
let pointX = 0, pointO = 0, pointTie = 0;
let point1 = 0, point2 = 0, point0 = 0;

let playerMode = 1, playerTurn = 1, gameDifficulty = 1;
let gameEnd = false;

let board = ['', '', '', '', '', '', '', '', ''];

let gameCount = 0;


function cellClickHandler(i) {
    if(board[i] === '' && !gameEnd){
        board[i] = currentPlayer;
        if(playerMode === 1){
            if(!checkWinner()){
                if(!checkBoardfull()){
                    updateBoard();
                    setTimeout(() => {
                        switchPlayer();
                        if(!checkWinner()) {
                            computerMove();
                            if(!checkWinner()){
                                checkBoardfull();
                                updateBoard();
                                checkWinner();
                            }
                            updateBoard();
                            switchPlayer();
                        }
                    }, 500);
                }
            }
        }
        else {
            if(!checkWinner()){
                checkBoardfull();
            }
        }
        updateBoard();
        if(!gameEnd) {
            switchPlayer();
        }
    } 
    resultShow(currentPlayer);    
}

// shows the current player
function resultShow() {
    const x = document.querySelector('.win-x');
    const o = document.querySelector('.win-o');
    const tie = document.querySelector('.no-win');
    if(playerMode === 2){
        if(!gameEnd) {
            tie.classList.add('shadePlayer');
            if(currentPlayer === 'x') {
                o.classList.add('shadePlayer');
                x.classList.remove('shadePlayer');
            } else {
                x.classList.add('shadePlayer');
                o.classList.remove('shadePlayer');
            }
        } else {
            x.classList.remove('shadePlayer');
            o.classList.remove('shadePlayer');
            tie.classList.remove('shadePlayer');
        }
    }
    else {
        x.classList.remove('shadePlayer');
        o.classList.remove('shadePlayer');
        tie.classList.remove('shadePlayer');
    }
}
resultShow();

// switches player
function switchPlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

function getEmptyCells() {
    const emptyCells = [];
    board.forEach((box, i) => {
        if(box === ''){
            emptyCells.push(i);
        }
    });
    return emptyCells;
}



function evaluate() {
    let winner = null;
    const winList = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const list of winList) {
        const [a, b, c] = list;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a];
            break;
        }
    }
    let openSpots = board.filter((box) => box === '').length;
    if (winner === null && openSpots === 0) {
        return 'tie';
    } else {
        return winner;
    }
}


// handles computer move
function computerMove() {
    if(gameDifficulty === 1) {
        // easy mode
        let emptyCells = getEmptyCells();
        if(emptyCells.length > 0){
            switchPlayer();
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const computerMovePosition = emptyCells[randomIndex];
            board[computerMovePosition] = currentPlayer;
        }
    } else {
        // hard mode
        let bestMove;
        // if(board[0]==='') {
        //     if(playerTurn === 2) {
        //         bestMove = 0;
        //     }
        // }
        switchPlayer();
        let bestScore = -Infinity;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === ''){
                board[i] = currentPlayer;
                let score = minimax(board, 0, -Infinity, Infinity, false);
                board[i] = '';
                if(score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        board[bestMove] = currentPlayer;
    }
}

let scores = {
    x: -10, o: 10, tie: 0
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
    if( depth <= 3){
        
    }
    let result = evaluate();
    if (result !== null) {
        let score = scores[result];
        return score;
    }
    if (maximizingPlayer) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'o';
                let score = minimax(board, depth + 1, alpha, beta, false);
                board[i] = '';
                best = Math.max(score, best);
                alpha = Math.max(alpha, score);
                if(beta <= alpha) {
                    break;
                }
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'x';
                let score = minimax(board, depth + 1, alpha, beta, true);
                board[i] = '';
                best = Math.min(score, best);
                beta = Math.min(score, beta);
                if(beta <= alpha) {
                    break;
                }
            }
        }
        return best;
    }
}


// depending on the status of the game changes the content of the cells of the board 
function updateBoard() {
    resultShow();
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell-${i + 1}`);
        cell.innerHTML = board[i];
    }
    document.querySelectorAll('.cell').forEach((cell) => {
        cell.classList.remove('gold', 'blue', 'done');
    });

    document.querySelectorAll('.cell').forEach((cell, i) => {
        board[i] === 'x' ? cell.classList.add('gold') : cell.classList.add('blue');
        if(board[i] !== ''){
            cell.classList.add('done');
        }
    });
    if(playerMode === 1) {
        resX.innerHTML = point1;
        resO.innerHTML = point2;
        resTie.innerHTML = point0;
    }
    else {
        resX.innerHTML = pointX;
        resO.innerHTML = pointO;
        resTie.innerHTML = pointTie;
    }
}


// highlights the winner line
function highlightWinner(a, b, c) {
    document.querySelectorAll('.cell').forEach((cell, i) => {
        if(i === a || i === b || i === c){
            cell.classList.add('win');
        }
        else {
            cell.classList.add('lose');
        }
    });
}


// checks whether a player has won the game
function checkWinner() {
    const winList = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const list of winList) {
        const [a, b, c] = list;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            const winSound = document.querySelector('#winSound');
            winSound.play();
            gameEnd = true;
            gameCount++;
            if(playerMode === 1){
                currentPlayer === 'o' ? point2++ : point1++;
            }
            else {
                currentPlayer === 'x' ? pointX++ : pointO++;
            }
            highlightWinner(a, b, c);
            return true;
        }
    }
    return false;
}

// checks whether the game is tie or not
function checkBoardfull() {
    for(let cell of board){
        if(cell === ''){
            return false;
        }
    }
    const tieSound = document.querySelector('#tieSound');
    tieSound.play();
    const cell = document.querySelectorAll('.cell');
    cell.forEach((cell, i) => {
        cell.classList.add('lose');
    });
    playerMode === 1 ? point0++ : pointTie++;
    gameEnd = true;
    gameCount++;
    return true;
}


// clears the cells of the board and changes the player turn
function clearCell() {
    const cell = document.querySelectorAll('.cell');
    cell.forEach((cell, i) => {
        board[i] = '';
        cell.classList.remove('win', 'lose');
    });
    undoBoard = [];
    redoBoard = [];
    currentPlayer = 'x';
    gameEnd = false;
    playerTurn = playerTurn == 1 ? 2 : 1;
    if(playerMode === 1) {
        if(playerTurn === 2) {
            const intervalId = setInterval(() => {
                computerMove();
                updateBoard();
                switchPlayer();
                clearInterval(intervalId);
            }, 500);
        }
    } else {
        if(gameCount === 0) {
            playerTurn = 1;
        }
        playerTurn == 1 ? currentPlayer = 'x' : currentPlayer = 'o';
    }

    updateBoard();
}


// hides or shows the button for changing difficulty according to the game mode
function dHider() {
    if(playerMode === 2) {
        document.querySelector('.change-difficulty').style.display = 'none';
    } else {
        document.querySelector('.change-difficulty').style.display = 'flex';
    }
}


// resets all the scores and empty the cells for the current game mode
function resetAll() {
    gameCount = 0;
        if (playerMode === 1) {
            point0 = 0;
            point1 = 0;
            point2 = 0;

            playerTurn = 2;
        } else {
            playerTurn = 2;
            pointX = 0;
            pointO = 0;
            pointTie = 0;
        }
        clearCell();
        document.querySelector('.warning-box').style.display = 'none';
        document.querySelector('.difficulty-box').style.display = 'none';
}


// if the calling parameter is 0 it calls resetAll function. if not it calls the clearCell function
function restartGame(c) {
    if (c === 0) {
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    const warnBox = document.querySelector('.warning-box');
    warnBox.style.display = 'flex';
    document.querySelector('.difficulty-box').style.display = 'none';

    yesBtn.addEventListener('click', function() {
        warnBox.style.display = 'none';
        resetAll();
    });
    noBtn.addEventListener('click', function() {
        warnBox.style.display = 'none';
        return;
    });
    } else {
        clearCell();
    }
}


// changes the game mode by clearing the cells
function changePlayingMode() {
    if(playerMode === 1){
        playerOneName.innerHTML = 'player(x)';
        playerTwoName.innerHTML = 'computer(o)';
        changeModeBtn.innerHTML = '1 player';

        resX.innerHTML = point1;
        resO.innerHTML = point2;
        resTie.innerHTML = point0;
    }
    else {
        playerOneName.innerHTML = 'player 1(x)';
        playerTwoName.innerHTML = 'player 2(o)';
        changeModeBtn.innerHTML = '2 player';

        resX.innerHTML = pointX;
        resO.innerHTML = pointO;
        resTie.innerHTML = pointTie;
    }
    restartGame(1);
}


// changes the difficulty for mode 1
function changeDifficulty() {
    const dBox = document.querySelector('.difficulty-box');
    const easyBtn = document.querySelector('.easy-btn');
    const hardBtn = document.querySelector('.hard-btn');
    if(document.querySelector('.warning-box').style.display !== 'flex'){
        if(dBox.style.display === 'flex'){
            dBox.style.display = 'none';
        } else {
            dBox.style.display = 'flex';
        }
        easyBtn.addEventListener('click', function() {
            gameDifficulty = 1;
            playerTurn = 2;
            dBox.style.display = 'none';
            difficultBtn.style.backgroundColor = '#04ff04';
            difficultBtn.textContent = 'Easy';
            restartGame(1);
        });
        hardBtn.addEventListener('click', function() {
            gameDifficulty = 2;
            playerTurn = 2;
            dBox.style.display = 'none';
            difficultBtn.style.backgroundColor = '#ff0000';
            difficultBtn.textContent = 'Impossible';
            restartGame(1);
        });
    }
}


// handles key presses on the keyboard
function keyboardFunctionality(event) {
    const keyPressed = parseInt(event.key);
    // for marking the cells using cell numbers
    if(keyPressed <= 9){
        cellClickHandler(keyPressed - 1);
    }
    if(gameEnd && event.key === 'Enter'){
        restartGame(1);
    }
}


difficultBtn.addEventListener('click', changeDifficulty);
for (let i = 1; i <= 9; i++) {
    const cell = document.getElementById(`cell-${i}`);
    cell.addEventListener('click', () => cellClickHandler(i - 1));
}
restart.addEventListener('click',() => restartGame(1));
reset.addEventListener('click',() => restartGame(0));
changeModeBtn.addEventListener('click', function(){
    playerMode = playerMode === 1 ? 2 : 1;
    changePlayingMode();
    dHider();
});
body.addEventListener('keydown', keyboardFunctionality);