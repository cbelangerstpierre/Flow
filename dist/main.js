"use strict";
console.log(5);
console.log(html);
let movesCounter;
let flows;
let currentFlow;
let showSolution = false;
let timeStart;
// let game = new Game(3);
html.board;
window.addEventListener("load", () => {
    let params = new URLSearchParams(location.search);
    let boardSize;
    if (params.get("b")) {
        boardSize = params.get("b");
        html.boardSize.value = boardSize;
    }
    if (params.get("f")) {
        reset();
        timeStart = new Date();
        flows = JSON.parse(params.get("f")).map((data) => {
            let solution = [];
            for (let i = 0; i < data[5].length; i += 2)
                solution.push({ row: data[5][i], column: data[5][i + 1] });
            return { color: colors.at(data[0]), first: { row: data[1], column: data[2] }, second: { row: data[3], column: data[4] }, solution: solution, corners: [], lines: [], lineCompleted: false };
        });
    }
    else
        createGame();
    drawPoints();
    updateHtml();
    // When a point is clicked
    html.board.addEventListener("mousedown", (event) => {
        let pos = getCaseClicked(event.clientX, event.clientY);
        if (pos && !showSolution && !boardCompleted()) {
            flows.forEach((flow) => {
                if (pointsAreEqual(flow.first, pos) || pointsAreEqual(flow.second, pos)) {
                    flow.lines = [pos];
                    flow.corners = [pos];
                    flow.lineCompleted = false;
                    currentFlow = flow;
                }
            });
        }
    });
    // "mouseOut" is called on "MouseOp" or "MouseLeave"
    const mouseOut = () => {
        if (currentFlow) {
            // Remove half-finished lines
            currentFlow.lines = [];
            currentFlow.corners = [];
            currentFlow = undefined;
            updateHtml();
            drawLines();
        }
    };
    html.board.addEventListener("mouseup", mouseOut);
    html.board.addEventListener("mouseleave", mouseOut);
    // "handleMouseMove" is always called on "MouseMove"
    html.board.addEventListener("mousemove", handleMouseMove);
});
// Redraw lines when the window is resized
window.addEventListener("resize", drawLines);
/**
 * Create a new level
 */
function createGame() {
    boardSize = parseInt(html.boardSize.value);
    reset();
    colors.slice(0, boardSize).sort(() => Math.floor(Math.random() * 3) - 1).forEach((color, i) => {
        let solution = [];
        for (let row = 0; row < boardSize; row++)
            solution.push({ row: row, column: i });
        flows.push({
            color: color,
            first: { row: 0, column: i },
            second: { row: boardSize - 1, column: i },
            corners: [],
            lines: [],
            lineCompleted: false,
            solution: solution
        });
    });
    let directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];
    let iterationsMax = 10000;
    for (let i = 0; i < iterationsMax;) {
        let validFlows = flows.filter((f) => f.solution.length < Math.pow(boardSize, 1.2));
        let flow = validFlows.at(Math.floor(Math.random() * validFlows.length));
        let currentDot = (Math.floor(Math.random() * 2) == 0) ? flow.first : flow.second;
        let direction = directions.at(Math.floor(Math.random() * 4));
        let newDot = { row: currentDot.row + direction.at(0), column: currentDot.column + direction.at(1) };
        if (newDot.row < 0 || newDot.row >= boardSize || newDot.column < 0 || newDot.column >= boardSize)
            continue;
        // If newDot is on an existing dot
        if (flows.filter((f) => f != flow).some((f) => {
            if (f.solution.length <= 3)
                return false;
            if (pointsAreEqual(f.first, newDot)) {
                f.first = f.solution.at(1);
                f.solution.shift();
                return true;
            }
            else if (pointsAreEqual(f.second, newDot)) {
                f.second = f.solution.at(-2);
                f.solution.pop();
                return true;
            }
        })) {
            if (pointsAreEqual(flow.first, currentDot)) {
                flow.first = newDot;
                flow.solution.unshift(newDot);
            }
            else // if (pointsAreEqual(flow.second, currentDot))
             {
                flow.second = newDot;
                flow.solution.push(newDot);
            }
            i += 1;
        }
    }
    // Finds the corners in the newly created lines (flow.solution)
    flows.forEach((flow) => {
        let solutionLine = flow.solution;
        flow.solution = [];
        flow.solution.push(flow.first);
        for (let i = 1; i < solutionLine.length - 1; i++)
            if (solutionLine.at(i - 1).row != solutionLine.at(i + 1).row && solutionLine.at(i - 1).column != solutionLine.at(i + 1).column)
                flow.solution.push(solutionLine.at(i));
        flow.solution.push(flow.second);
    });
    timeStart = new Date();
}
/**
 * Create a new board
 */
function reset() {
    html.popupGameFinished.style.display = "none";
    // Remove all existing children
    while (html.board.firstChild)
        html.board.removeChild(html.board.lastChild);
    for (let i = 0; i < boardSize; i++) {
        // Create row
        let rowDiv = document.createElement("div");
        rowDiv.className = "row";
        html.board.appendChild(rowDiv);
        for (let j = 0; j < boardSize; j++) {
            // Create case
            let caseDiv = document.createElement("div");
            caseDiv.className = "case";
            rowDiv.appendChild(caseDiv);
        }
    }
    movesCounter = 0;
    flows = [];
    currentFlow = undefined;
    showSolution = false;
    updateHtml();
}
/**
 * Share the current game via an url
 */
function shareGame() {
    let share = [];
    flows.forEach((flow) => {
        let solution = [];
        flow.solution.forEach((s) => {
            solution.push(s.row);
            solution.push(s.column);
        });
        share.push([colors.indexOf(flow.color), flow.first.row, flow.first.column, flow.second.row, flow.second.column, solution]);
    });
    html.shareToClipboardToolTip.innerHTML = "Copied !";
    navigator.clipboard.writeText(`${location.origin + location.pathname}?f=${JSON.stringify(share)}&b=${boardSize}`);
}
/**
 * Compare the position of two points
 * @param {object} first A point
 * @param {object} second A point
 * @returns {boolean} If the two points are at the same position
 */
function pointsAreEqual(first, second) {
    return first.row == second.row && first.column == second.column;
}
/**
 * Compare the position of two points
 * @param {object} first A point
 * @param {object} second A point
 * @returns {boolean} If the two points are at the same position
 */
function pointsAreNeighboors(first, second) {
    return (Math.abs(first.row - second.row) == 1 && first.column == second.column) || (Math.abs(first.column - second.column) == 1 && first.row == second.row);
}
/**
 * Return the position of the case that the mouse is in
 * @param {number} x The X position of the mouse
 * @param {number} y The Y position of the mouse
 * @returns {object} An object containing the position of the case
 */
function getCaseClicked(x, y) {
    for (let row = 0; row < boardSize; row++)
        for (let column = 0; column < boardSize; column++) {
            let rect = html.board.children[row].children[column].getBoundingClientRect();
            // If the (x,y) is inside the current case
            if (rect.top <= y && y <= rect.bottom && rect.left <= x && x <= rect.right)
                return { row: row, column: column };
        }
}
/**
 * Checks wheater the game is won or not
 * @returns {boolean} If the board is completed
 */
function boardCompleted() {
    if (!flows.every((flow) => flow.lineCompleted))
        return false;
    let totalLines = 0;
    flows.forEach((flow) => { totalLines += flow.lines.length; });
    return totalLines == boardSize * boardSize;
}
/**
 * Handles the mouse movements
 */
function handleMouseMove(event) {
    if (!currentFlow)
        return;
    let pos = getCaseClicked(event.clientX, event.clientY);
    if (!pos)
        return;
    // Do nothing if didn't move
    if (pointsAreEqual(currentFlow.lines.at(-1), pos))
        return;
    // Make sur the new line is a valid one
    if (Math.abs(currentFlow.lines.at(-1).row - pos.row) > 1 ||
        Math.abs(currentFlow.lines.at(-1).column - pos.column) > 1 ||
        (currentFlow.lines.at(-1).row != pos.row && currentFlow.lines.at(-1).column != pos.column)) {
        currentFlow.lines = [];
        currentFlow.corners = [];
        currentFlow = undefined;
        updateHtml();
        drawLines();
        return;
    }
    // Add the corner if it is one
    if (currentFlow.corners.at(-1).row != pos.row && currentFlow.corners.at(-1).column != pos.column)
        currentFlow.corners.push(currentFlow.lines.at(-1));
    // Finish flow if we touch other point
    if ((pointsAreEqual(currentFlow.second, pos) && pointsAreEqual(currentFlow.first, currentFlow.corners.at(0))) // We are at second point and started at first point
        ||
            (pointsAreEqual(currentFlow.first, pos) && pointsAreEqual(currentFlow.second, currentFlow.corners.at(0))) // We are at first point and started at second point
    ) {
        currentFlow.corners.push(pos);
        currentFlow.lines.push(pos);
        currentFlow.lineCompleted = true;
        currentFlow = undefined;
        movesCounter += 1;
        updateHtml();
        drawLines();
        // If the game is won
        if (boardCompleted()) {
            html.popupGameFinished.style.display = "flex";
            html.timeToFinishGame.innerText = `You took ${Math.round((new Date().getTime() - timeStart.getTime()) / 1000)} seconds to complete this level.`;
            html.moveToFinishGame.innerText = `You succeed with ${movesCounter} moves.`;
        }
        return;
    }
    // Wrap if we touch our own line, we start over from that line
    if (!currentFlow.lines.every((c) => {
        if (pointsAreEqual(c, pos)) {
            while (!pointsAreEqual(currentFlow.lines.at(-1), c)) {
                let removedPoint = currentFlow.lines.pop();
                // Remove the corner if we removed the point
                currentFlow.corners.forEach((corner) => {
                    if (pointsAreEqual(corner, removedPoint))
                        currentFlow.corners.splice(currentFlow.corners.indexOf(corner), 1);
                });
            }
            return false;
        }
        return true;
    })) {
        updateHtml();
        drawLines();
        return;
    }
    // Stop if we touch another color's point
    if (!flows.filter((flow) => flow != currentFlow).every((flow) => {
        return !(pointsAreEqual(flow.first, pos) || pointsAreEqual(flow.second, pos));
    })) {
        currentFlow.lines = [];
        currentFlow.corners = [];
        currentFlow = undefined;
        updateHtml();
        drawLines();
        return;
    }
    // Stop if we touch another color's line
    if (!flows.filter((flow) => flow != currentFlow).every((flow) => {
        return flow.lines.every((c) => {
            if (pointsAreEqual(c, pos)) {
                currentFlow.lines = [];
                currentFlow.corners = [];
                return false;
            }
            return true;
        });
    })) {
        currentFlow.lines = [];
        currentFlow.corners = [];
        currentFlow = undefined;
        updateHtml();
        drawLines();
        return;
    }
    // Add the current pos to lines
    currentFlow.lines.push(pos);
    updateHtml();
    drawLines();
}
/**
 * Toggle the visibility of the solution
 */
function toggleSolution() {
    showSolution = !showSolution;
    drawLines();
}
/**
 * Update the HTML's statistics
 */
function updateHtml() {
    html.flowsDone.innerText = `Flows: ${flows.filter((f) => f.lineCompleted).length}/${boardSize}`;
    html.movesCounter.innerText = `Moves: ${movesCounter}`;
    html.percentDone.innerText = `Pipe: ${Math.floor(flows.reduce((prev, current) => prev + current.lines.length, 0) / (boardSize * boardSize) * 100)}%`;
}
/**
 * Create points into the HTML
 */
function drawPoints() {
    let showPoint = (pos, color) => {
        let point = document.createElement("div");
        point.className = "dot";
        point.style.backgroundColor = color;
        html.board.children[pos.row].children[pos.column].appendChild(point);
    };
    flows.forEach((flow) => {
        showPoint(flow.first, flow.color);
        showPoint(flow.second, flow.color);
    });
}
/**
 * Create lines into the HTML
 */
function drawLines() {
    const caseSize = parseInt(getComputedStyle(html.board).width.slice(0, -2)) / boardSize;
    const lineThickness = caseSize / 100 * 35;
    let children = [...html.board.children];
    // Remove all existing children
    for (let child of children) {
        if (child.className == "line")
            html.board.removeChild(child);
    }
    const drawLine = (first, second, color, glow) => {
        let line = document.createElement("div");
        line.className = "line";
        line.style.backgroundColor = color;
        line.style.width = `${lineThickness}px`;
        line.style.height = `${lineThickness}px`;
        line.style.borderRadius = `${lineThickness / 2}px`;
        html.board.appendChild(line);
        if (glow)
            line.style.boxShadow = `0 0 ${lineThickness / 1.6}px 0 ${color}`;
        if (first.row == second.row) {
            line.style.width = `${caseSize * Math.abs(first.column - second.column) + lineThickness}px`;
            line.style.top = `${caseSize * (first.row + 0.5) - lineThickness / 2}px`;
            if (first.column < second.column)
                line.style.left = `${caseSize * (first.column + 0.5) - lineThickness / 2}px`;
            else
                line.style.left = `${caseSize * (second.column + 0.5) - lineThickness / 2}px`;
        }
        else if (first.column == second.column) {
            line.style.height = `${caseSize * Math.abs(first.row - second.row) + lineThickness}px`;
            line.style.left = `${caseSize * (first.column + 0.5) - lineThickness / 2}px`;
            if (first.row < second.row)
                line.style.top = `${caseSize * (first.row + 0.5) - lineThickness / 2}px`;
            else
                line.style.top = `${caseSize * (second.row + 0.5) - lineThickness / 2}px`;
        }
    };
    flows.forEach((flow) => {
        if (showSolution)
            for (let i = 0; i < flow.solution.length - 1; i++)
                drawLine(flow.solution[i], flow.solution[i + 1], flow.color, false);
        else {
            for (let i = 0; i < flow.corners.length - 1; i++)
                drawLine(flow.corners[i], flow.corners[i + 1], flow.color, flow.lineCompleted);
            if (!flow.lineCompleted && flow.lines.length > 0)
                drawLine(flow.corners.at(-1), flow.lines.at(-1), flow.color, false);
        }
        // Make the points glow
        if (flow.lineCompleted && !showSolution) {
            html.board.children[flow.first.row].children[flow.first.column].children[0].style.boxShadow = `0 0 ${lineThickness / 1.7}px 0 ${flow.color}`;
            html.board.children[flow.second.row].children[flow.second.column].children[0].style.boxShadow = `0 0 ${lineThickness / 1.7}px 0 ${flow.color}`;
        }
        else {
            html.board.children[flow.first.row].children[flow.first.column].children[0].style.boxShadow = "none";
            html.board.children[flow.second.row].children[flow.second.column].children[0].style.boxShadow = "none";
        }
    });
}
