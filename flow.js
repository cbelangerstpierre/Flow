const colors = ["red", "orange", "yellow", "green", "blue"]
const types = { dot: "dot", line: "line", empty: "empty" }
// pas utiliser board, noter emplacement des points et où la ligne tourne
const points = [{ color: "red", start: "0;2", end: "3;4", corners: ["4;4", "4;5"] }]

var root
var board = []


window.addEventListener("load", () => {
    root = document.getElementById("root")

    let mapSize = 8

    createMap(mapSize)
    printGrid()
    // We can add "mousedown" or "mousemove"
    // $("#root").mousedown(function () {
    //     $("#root").mousemove(function () {
    //         console.log("OK moved")
    //     })
    // }).mouseup(function () {
    //     $("#root").unbind('mousemove');
    // }).mouseout(function () {
    //     $("#root").unbind('mousemove');
    // });
    document.addEventListener("click", function(){
        createLine(event, color="red")
        printGrid()
    })
})


/**
 * Return the Board position of the mouse
 * @param {Array} event
 * @returns {Array}
 */
function mousePos(event)
{
    if (isInsideRoot(event.clientX, event.clientY))
    {
        for (let i = 0; i < board.length; i ++)
        {
            for (let j = 0; j < board.length; j ++)
            {
                let coordinates = root.children[i].children[j].getBoundingClientRect()
                if (isBetween(event.clientY, coordinates.top, coordinates.bottom) && 
                    isBetween(event.clientX, coordinates.left, coordinates.right)
                ) {
                    return [i, j]
                }
            }
        }
    }
}

/**
 * Return True if the x and y is inside the root.
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */

function isInsideRoot(x, y)
{
    root_coords = root.getBoundingClientRect()
    return isBetween(x, root_coords.left, root_coords.right) &&
        isBetween(y, root_coords.bottom, root_coords.top)
}

/**
 * Return True if the value a is between b and c
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {boolean}
 */
function isBetween(a, b, c)
{
    return (b <= a && a <= c) || (c <= a && a <= b)
}

function createMap(mapSize)
{
    resetBoard(mapSize)
    createPoints()
}


function resetBoard(mapSize)
{
    board = []

    for (let i = 0; i < mapSize; i ++)
    {
        board[i] = []
        
        for (let j = 0; j < mapSize; j ++)
        {
            board[i][j] = { type: types.empty }
        }
    }
}

/**
 * Add a random pair of points for each color
 */
function createPoints()
{
    colors.forEach(color => {
        createPoint(color);
        createPoint(color)
    });
}

/**
 * Adds a point in a random spot
 * @param {string} color the color of the point
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
 * @param {Array} event
 * @param {string} color 
 * @param {*} lastCasePos 
 */
function createLine(event, color, lastCasePos)
{
    let pos = mousePos(event)
    if (pos)
    {
        let row = pos[0]
        let column = pos[1]
        if (board[row][column].type === types.empty)
        {
            console.log(color)
            board[row][column] = { type: types.dot, color: color }
            console.log(`New line at (${column};${row})`)
        }
    }
}


/**
 * Create divs into the #root
*/
function printGrid()
{
    // Remove all existing children
    while (root.firstChild)
        root.removeChild(root.lastChild)

    board.forEach(row => {
        // Create row
        let rowDiv = document.createElement("div")
        rowDiv.className = "row"
        root.appendChild(rowDiv)

        row.forEach(c => {
            // Create case
            let caseDiv = document.createElement("div")
            caseDiv.className = "case"
            rowDiv.appendChild(caseDiv)

            // Add a dot/line inside the case if there is one
            if (c.type !== types.empty)
            {
                let type = document.createElement("div")
                type.className = c.type
                type.style.backgroundColor = c.color
                caseDiv.appendChild(type)
            }
        });
    });
}
