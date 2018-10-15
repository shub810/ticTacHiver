/**
 * This program is a boliler plate code for the famous tic tac toe game
 * Here box represents one placeholder for either X or a 0
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 * 
 * Below are the tasks which needs to be completed
 * Imagine you are playing with Computer so every alternate move should be by Computer
 * X -> player
 * O -> Computer
 * 
 * Winner has to be decided and has to be flashed
 * 
 * Extra polets will be given for the Creativity
 * 
 * Use of Google is not encouraged
 * 
 */
let grid = [];
const GRID_LENGTH = 3;
let turn = 'X';

function initializeGrid() {
    grid = [];
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<canvas id="myCanvas"></canvas><div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    
    let newValue = 1;
    if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = newValue;
    }
    else {
        alert('Already filled. Try other block');
        return;
    }

    let getRowCol = findBestMove();
    if (getRowCol.row != -1 && getRowCol.col != -1) {
        grid[getRowCol.row][getRowCol.col] = 2;
    }
    else {
        if (!isMoveLeft()) {
            alert("Nice. It's Draw.");
            initializeGrid();
        }
    }

    renderMainGrid();
    addClickHandlers();

    let winner = evaluate();

    setTimeout(() => {
        if (winner.value === 10) {
            const xy = getXY(winner.line)
            drawLine(xy, 'Oops. Computer won.');
        }
        else if (winner.value === -10) {
            const xy = getXY(winner.line)
            drawLine(xy,'Congratualations. You won.' );
        }
    }, 100);
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function isMoveLeft() {
    for (let i=0; i < 3; i++) {
        for (let j=0; j < 3; j++) {
            if (grid[i][j] == 0) return true; 
        }
    }
    return false;
}

function evaluate() {
    for (let row=0; row < 3; row++) {
        if (grid[row][0] == grid[row][1] && grid[row][1] == grid[row][2]) {
            if (grid[row][0] == 2){ 
                return {
                    value: 10,
                    line: `row${row}`
                }
            }
            else if (grid[row][0] == 1) {
                return {
                    value: -10,
                    line: `row${row}`
                }
            }
        }
    }

    for (let col=0; col < 3; col++) {
        if (grid[0][col] == grid[1][col] && grid[1][col] == grid[2][col]) {
            if (grid[0][col] == 2) {
                return {
                    value: 10,
                    line: `col${col}`
                }
            }
            else if (grid[0][col] == 1) {
                return {
                    value: -10,
                    line: `col${col}`
                }
            }
        }
    }
    
    if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) {
        if (grid[0][0] == 2) {
            return {
                value: 10,
                line: "crossLeft"
            }
        }
        else if (grid[0][0] == 1) {
            return {
                value: -10,
                line: "crossLeft"
            }
        }         
    }

    if (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]) {
        if (grid[0][2] == 2) {
            return {
                value: 10,
                line: "crossRight"
            }
        }
        else if (grid[0][2] == 1) {
            return {
                value: -10,
                line: "crossRight"
            }
        }           
    }
    return 0;
} 

function minimax(depth, isMaxPlayer) {
    let score = evaluate().value;

    if (score === 10 || score == -10) return score;

    if (!isMoveLeft()) {
        return 0;
    }

    if (isMaxPlayer) {
        let bestMove = -1000;
        for (let i=0; i < 3; i++) {
            for (let j=0; j < 3; j++) {
                if (grid[i][j] === 0) {
                    grid[i][j] = 2;
                    bestMove = Math.max(bestMove, minimax(depth + 1, !isMaxPlayer));
                    grid[i][j] = 0;
                }
            }
        }
        return bestMove;
    }
    else {
        let bestMove = 1000;
        for (let i=0; i < 3; i++) {
            for (let j=0; j < 3; j++) {
                if (grid[i][j] === 0) {
                    grid[i][j] = 1;
                    bestMove = Math.min(bestMove, minimax(depth + 1, !isMaxPlayer));
                    grid[i][j] = 0;
                }
            }
        }
        return bestMove;
    }
}

function findBestMove () {

    let bestVal = -1000;
    let row = -1, col = -1;

    for (let i=0; i < 3; i++) {
        for (let j=0; j < 3; j++) {
            if (grid[i][j] === 0) {
                grid[i][j] = 2;
                let currentVal = minimax(0, false);
                if (currentVal > bestVal) {
                    bestVal = currentVal;
                    row = i;
                    col = j;
                }
                grid[i][j] = 0;
            }
        }
    }
    
    return {
        row,
        col
    }
}

function drawLine(xy, message) {
    document.getElementById('myCanvas').style.display = 'block';

    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(xy.startX, xy.startY);
    ctx.lineTo(xy.endX, xy.endY);
    ctx.lineWidth = 10;
    ctx.stroke();
    
    setTimeout(() => {
        alert(message);
        initializeGrid();
        renderMainGrid();
        addClickHandlers();
    }, 400);
}

function getXY(name) {

    switch (name) {
        case "row0":
            return {
                startX: 0,
                startY: 25,
                endX: 300,
                endY: 25,
            }
        case "row1":
            return {
                startX: 0,
                startY: 125,
                endX: 300,
                endY: 125,
            }
        case "row2":
            return {
                startX: 0,
                startY: 150,
                endX: 300,
                endY: 150,
            }
        case "col0":
            return {
                startX: 50,
                startY: 0,
                endX: 50,
                endY: 300,
            }
        case "col1":
            return {
                startX: 150,
                startY: 0,
                endX: 150,
                endY: 300,
            }
        case "col2":
            return {
                startX: 250,
                startY: 0,
                endX: 250,
                endY: 300,
            }
        case "crossLeft":
            return {
                startX: 0,
                startY: 0,
                endX: 600,
                endY: 300,
            }
        case "crossRight":
            return {
                startX: 300,
                startY: 0,
                endX: -300,
                endY: 300,
            }
    }
}

initializeGrid();
renderMainGrid();
addClickHandlers();
