const colors = ["red", "orange", "yellow", "green", "blue"]
const types = { dot: "dot", line: "line", empty: "empty" }
// pas utiliser board, noter emplacement des points et où la ligne tourne
const points = [{ color: "red", start: "0;2", end: "3;4", corners: ["4;4", "4;5"] }]

var root
var board = []


window.addEventListener("load", () => {
    root = document.getElementById("root")

    let mapSize = 8

    resetGrid(mapSize)
    createMap()
    printGrid()
})


function resetGrid(mapSize)
{
    board = []

    for (let i = 0; i < mapSize; i += 1)
    {
        board[i] = []
        
        for (let j = 0; j < mapSize; j += 1)
        {
            board[i][j] = { type: types.empty }
        }
    }
}


function createMap()
{
    for (let i = 0; i < colors.length; i++)
    {
        createPoint(colors[i])
        createPoint(colors[i])
    }
}

/**
 * Adds a point in a random spot
 * @param color the color of the point
 */
function createPoint(color)
{
    let column
    let row

    do
    {
        column = Math.floor(Math.random() * board.length)
        row = Math.floor(Math.random() * board.length)
    } while (board[row][column].type !== types.empty)

    board[row][column] = { type: types.dot, color: color }
    console.log(`New point at (${column};${row})`)
}

/**
 * Create a line between two points
 */
function createLine(row, column, color, lastCasePos)
{
    grid[row][column] = { type: types.line, color: color }
    console.log(`New line at (${column};${row})`)
}


/**
 * Create divs into the #root
*/
function printGrid()
{
    // Remove all existing children
    while (root.firstChild)
        root.removeChild(root.lastChild)

    for (let row in board)
    {
        // Create row
        let rowDiv = document.createElement("div")
        rowDiv.className = "row"
        root.appendChild(rowDiv)

        for (let c in board[row])
        {
            // Create case
            let caseDiv = document.createElement("div")
            caseDiv.className = "case"
            rowDiv.appendChild(caseDiv)

            // Add a dot inside the case if there is one
            if (board[row][c].type === types.dot)
            {
                let dot = document.createElement("div")
                dot.className = "dot"
                dot.style.backgroundColor = board[row][c].color
                caseDiv.appendChild(dot)
            } 
            
            else if (board[row][c].type === types.line)
            {
                let line = document.createElement("div")
                line.className = "line"
                line.style.backgroundColor = board[row][c].color
                caseDiv.appendChild(line)
            }
        }
    }
}
