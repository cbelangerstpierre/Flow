const colors = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"]

let board
let flows = []
let boardSize = 8
let currentFlow


window.addEventListener("load", () => {
    board = document.getElementById("board")

    createGame()
    showPoints()

    // We can add "mousedown" or "mousemove"
    board.addEventListener("mousedown", (event) => {
        let pos = getCaseClicked(event.clientX, event.clientY)

        if (pos)
        {
            flows.forEach((flow) => {
                if (pointsAreEqual(flow.first, pos) || pointsAreEqual(flow.second, pos))
                {
                    flow.lines = [ pos ]
                    flow.corners = [ pos ]
                    flow.lineCompleted = false
                    currentFlow = flow
                }
            })
        }
    })

    const mouseOut = () => {
        if (currentFlow)
        {
            currentFlow.lines = []
            currentFlow.corners = []
            currentFlow = undefined
            drawLines()
        }
    }

    board.addEventListener("mouseup", mouseOut)
    board.addEventListener("mouseleave", mouseOut)

    board.addEventListener("mousemove", handleMouseMove)
})


/**
 * Create a new level
 */
function createGame()
{
    drawBoard()
    createPoints()

    // let simFlows = []

    // colors.forEach((color, i) => {
    //     simFlows.push({
    //         color: color,
    //         first: { row: 0, column: i },
    //         second: { row: boardSize - 1, column: i },
    //         corners: [],
    //         lineCompleted: false
    //     })
    // })
}


/**
 * Create a new board
 */
function drawBoard()
{
    // Remove all existing children
    while (board.firstChild)
        board.removeChild(board.lastChild)

    for (let i = 0; i < boardSize; i++)
    {
        // Create row
        let rowDiv = document.createElement("div")
        rowDiv.className = "row"
        board.appendChild(rowDiv)

        for (let j = 0; j < boardSize; j++)
        {
            // Create case
            let caseDiv = document.createElement("div")
            caseDiv.className = "case"
            rowDiv.appendChild(caseDiv)
        }
    }
}


/**
 * Add a random pair of points for each color
 */
function createPoints()
{
    colors.forEach((color) => {
        flows.push({
            color: color,
            first: randomPoint(),
            second: randomPoint(),
            corners: [],
            lines: [],
            lineCompleted: false
        })
    });
}


/**
 * Generates a random point
 */
function randomPoint()
{
    let point = { row: Math.floor(Math.random() * boardSize), column: Math.floor(Math.random() * boardSize) }

    if (!flows.every((flow) => (!pointsAreEqual(flow.first, point) && !pointsAreEqual(flow.second, point))))
        return randomPoint()

    console.log(`New point at (${point.row};${point.column})`)
    return point
}


/**
 * Compare the position of two points
 * @param {object} first A point
 * @param {object} second A point
 * @returns {boolean} If the two points are at the same position
 */
function pointsAreEqual(first, second)
{
    return first.row == second.row && first.column == second.column
}


/**
 * Return the position of the case that the mouse is in
 * @param {number} x The X position of the mouse
 * @param {number} y The Y position of the mouse
 * @returns {object} An object containing the position of the case
 */
function getCaseClicked(x, y)
{
    for (let row = 0; row < boardSize; row++)
        for (let column = 0; column < boardSize; column++)
        {
            let rect = board.children[row].children[column].getBoundingClientRect()
            // If the (x,y) is inside the current case
            if (rect.top <= y && y <= rect.bottom && rect.left <= x && x <= rect.right)
                return { row: row, column: column }
        }

    console.warn("Can't find where the mouse clicked.")
}


/**
 * Checks wheater the game is won or not
 * @returns {boolean} If the board is completed
 */
function boardCompleted()
{
    if (!flows.every((flow) => flow.lineCompleted))
        return false

    let totalLines = 0
    flows.forEach((flow) => { totalLines += flow.lines.length })
    return totalLines == boardSize * boardSize
}


/**
 * Handles the mouse movements
 */
function handleMouseMove(event)
{
    if (!currentFlow)
        return

    let pos = getCaseClicked(event.clientX, event.clientY)
    if (!pos)
        return
        
    // Do nothing if didn't move
    if (pointsAreEqual(currentFlow.lines.at(-1), pos))
        return

    // Make sur the new line is a valid one
    if (Math.abs(currentFlow.lines.at(-1).row - pos.row) > 1 ||
        Math.abs(currentFlow.lines.at(-1).column - pos.column) > 1 ||
        (currentFlow.lines.at(-1).row != pos.row && currentFlow.lines.at(-1).column != pos.column)
    )
    {
        console.log("Invalid line. (line broke)")
        currentFlow.lines = []
        currentFlow.corners = []
        currentFlow = undefined
        drawLines()
        return
    }
    
    // Add the corner if it is one
    if (currentFlow.corners.at(-1).row != pos.row && currentFlow.corners.at(-1).column != pos.column)
    {
        console.log(currentFlow.lines.at(-1), "is a corner")
        currentFlow.corners.push(currentFlow.lines.at(-1))
    }

    // Finish flow if we touch other point
    if ((pointsAreEqual(currentFlow.second, pos) && pointsAreEqual(currentFlow.first, currentFlow.corners.at(0))) // We are at second point and started at first point
        || (pointsAreEqual(currentFlow.first, pos) && pointsAreEqual(currentFlow.second, currentFlow.corners.at(0))) // We are at first point and started at second point
    )
    {
        currentFlow.corners.push(pos)
        currentFlow.lines.push(pos)
        currentFlow.lineCompleted = true
        currentFlow = undefined
        console.log("Line completed !!")
        drawLines()
        if (boardCompleted())
            console.log("Game won !")
        return
    }

    // Wrap if we touch our own line, we start over from that line
    if (!currentFlow.lines.every((c) => {
            if (pointsAreEqual(c, pos))
            {
                while (!pointsAreEqual(currentFlow.lines.at(-1), c))
                {
                    let removedPoint = currentFlow.lines.pop()

                    // Remove the corner if we removed the point
                    currentFlow.corners.forEach((corner) => {
                        if (pointsAreEqual(corner, removedPoint))
                            currentFlow.corners.splice(currentFlow.corners.indexOf(corner), 1)
                    })
                }

                return false
            }
            
            return true
        })
    )
    {
        console.log("Line wrap")
        drawLines()
        return
    }

    // Stop if we touch another color's point
    if (!flows.filter((flow) => flow != currentFlow).every((flow) => {
            return !(pointsAreEqual(flow.first, pos) || pointsAreEqual(flow.second, pos))
        })
    )
    {
        console.log("Touched another color point")
        currentFlow.lines = []
        currentFlow.corners = []
        currentFlow = undefined
        drawLines()
        return
    }

    // Stop if we touch another color's line
    if (!flows.filter((flow) => flow != currentFlow).every((flow) => {
            return flow.lines.every((c) => {
                if (pointsAreEqual(c, pos))
                {
                    currentFlow.lines = []
                    currentFlow.corners = []
                    return false
                }

                return true
            })
        })
    )
    {
        console.log("Touched another color line")
        currentFlow.lines = []
        currentFlow.corners = []
        currentFlow = undefined
        drawLines()
        return
    }

    // Add the current pos to lines
    currentFlow.lines.push(pos)
    drawLines()
}


/**
 * Create points into the HTML
 */
function showPoints()
{
    let showPoint = (pos, color) => {
        let point = document.createElement("div")
        point.className = "dot"
        point.style.backgroundColor = color
        board.children[pos.row].children[pos.column].appendChild(point)
    }
    
    flows.forEach((flow) => {
        showPoint(flow.first, flow.color)
        showPoint(flow.second, flow.color)
    })
}


/**
 * Create lines into the HTML
 */
function drawLines()
{
    const caseSize = parseInt(getComputedStyle(board).width.slice(0, -2)) / boardSize
    const lineThickness = caseSize / 100 * 35

    let children = [ ...board.children ]
    // Remove all existing children
    for (let child of children)
    {
        if (child.className == "line")
            board.removeChild(child)
    }

    const drawLine = (first, second, color, glow) => {
        let line = document.createElement("div")
        line.className = "line"
        line.style.backgroundColor = color
        line.style.width = `${lineThickness}px`
        line.style.height = `${lineThickness}px`
        line.style.borderRadius = `${lineThickness / 2}px`
        board.appendChild(line)
        if (glow)
            line.style.boxShadow = `0 0 ${lineThickness / 1.6}px 0 ${color}`
        
        if (first.row == second.row)
        {
            line.style.width = `${caseSize * Math.abs(first.column - second.column) + lineThickness}px`
            line.style.top = `${caseSize * (first.row + 0.5) - lineThickness / 2}px`
            
            if (first.column < second.column)
                line.style.left = `${caseSize * (first.column + 0.5) - lineThickness / 2}px`
            
            else
                line.style.left = `${caseSize * (second.column + 0.5) - lineThickness / 2}px`
        }

        else if (first.column == second.column)
        {
            line.style.height = `${caseSize * Math.abs(first.row - second.row) + lineThickness}px`
            line.style.left = `${caseSize * (first.column + 0.5) - lineThickness / 2}px`
            
            if (first.row < second.row)
                line.style.top = `${caseSize * (first.row + 0.5) - lineThickness / 2}px`

            else
                line.style.top = `${caseSize * (second.row + 0.5) - lineThickness / 2}px`
        }
    }

    flows.forEach((flow) => {
        for (let i = 0; i < flow.corners.length - 1; i++)
            drawLine(flow.corners[i], flow.corners[i + 1], flow.color, flow.lineCompleted)

        if (!flow.lineCompleted && flow.lines.length > 0)
            drawLine(flow.corners.at(-1), flow.lines.at(-1), flow.color, false)

        // Make the points glow
        if (flow.lineCompleted)
        {
            board.children[flow.first.row].children[flow.first.column].children[0].style.boxShadow = `0 0 ${lineThickness / 1.7}px 0 ${flow.color}`
            board.children[flow.second.row].children[flow.second.column].children[0].style.boxShadow = `0 0 ${lineThickness / 1.7}px 0 ${flow.color}`
        }

        else
        {
            board.children[flow.first.row].children[flow.first.column].children[0].style.boxShadow = "none"
            board.children[flow.second.row].children[flow.second.column].children[0].style.boxShadow = "none"
        }
    })
}
