const empty = 1
const dot = 2
const line = 3

var root
var grid = []


window.addEventListener("load", () => {
    root = document.getElementById("root")

    createGrid(8)
    createPoint(8)
    printGrid()

})

function createGrid(size)
{
    grid = []

    for (let i = 0; i < size; i += 1)
    {
        grid[i] = []
        
        for (let j = 0; j < size; j += 1)
        {
            grid[i][j] = { type: empty }
        }
    }
}

function createPoint(size)
{
    let pos = Math.floor(Math.random() * size * size)
    let column = pos % size
    let row = (pos - column) / size
    grid[row][column] = { type: dot, color: "red" }
}


function printGrid()
{
    for (let row in grid)
    {
        let rowDiv = document.createElement("div")
        rowDiv.className = "row"
        root.appendChild(rowDiv)

        for (let c in grid[row])
        {
            let caseDiv = document.createElement("div")
            caseDiv.className = "case"
            rowDiv.appendChild(caseDiv)

            if (grid[row][c].type === dot)
            {
                let dot = document.createElement("div")
                dot.className = "dot " + grid[row][c].color
                caseDiv.appendChild(dot)
            }
        }
    }
}
