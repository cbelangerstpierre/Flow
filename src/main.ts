import { Flow } from "./flow.js";
import { Game } from "./game.js";
import { html } from "./htmlElements.js";
import { Color, Point, Share } from "./models/models.js";
import { pointsAreEqual, sharedVersion } from "./utils.js";

const game: Game = new Game();

function addEventListeners() {
  html.shareButton.addEventListener("click", shareGame);
  html.shareButton.addEventListener(
    "mouseout",
    () => (html.shareToClipboardToolTip.innerHTML = `Copy url`)
  );
  html.newLevelButtonEnd.addEventListener("click", createGame);
  html.newLevelButton.addEventListener("click", createGame);
  html.toggleSolutionButton.addEventListener("click", toggleSolution);
  const mouseOut = () => {
    if (game.currentFlow) {
      game.currentFlow.lines = [];
      game.currentFlow.corners = [];
      game.currentFlow = undefined;
      updateHtml();
      drawLines();
    }
  };
  html.board.addEventListener("mouseup", mouseOut);
  html.board.addEventListener("mouseleave", mouseOut);
  html.board.addEventListener("mousemove", handleMouseMove);
  html.board.addEventListener("mousedown", mouseDown);
  window.addEventListener("resize", drawLines);
}

function init() {
  const params: URLSearchParams = new URLSearchParams(location.search);
  if (!params.get("f") || !params.get("b")) {
    createGame();
    return;
  }
  const boardSize: string = params.get("b")!;
  game.boardSize = +boardSize;
  html.boardSize.value = boardSize;
  reset();
  game.flows = JSON.parse(params.get("f")!).map((data: Share) => {
    let solution = [];
    for (let i = 0; i < data.solution.length; i += 2) {
      let point: Point = {
        row: +data.solution[i],
        column: +data.solution[i + 1],
      };
      solution.push(point);
    }

    return new Flow(
      data.color,
      { row: data.flowStartRow, column: data.flowStartColumn },
      { row: data.flowEndRow, column: data.flowEndColumn },
      solution
    );
  });
}

window.addEventListener("load", () => {
  addEventListeners();
  init();
  drawPoints();
  updateHtml();
});

function mouseDown(event: { clientX: number; clientY: number }) {
  let pos = getCaseClicked(event.clientX, event.clientY);
  if (pos !== undefined) game.caseClicked(pos);
}

function createGame() {
  game.boardSize = +html.boardSize.value;
  reset();
  game.createLevel();
  drawPoints();
}

function reset() {
  html.popupGameFinished.style.display = "none";
  while (html.board.firstChild)
    html.board.removeChild(html.board.lastChild as Node);
  for (let i = 0; i < game.boardSize; i++) {
    let rowDiv: HTMLDivElement = document.createElement("div");
    rowDiv.className = "row";
    html.board.appendChild(rowDiv);
    for (let j = 0; j < game.boardSize; j++) {
      let caseDiv: HTMLDivElement = document.createElement("div");
      caseDiv.className = "case";
      rowDiv.appendChild(caseDiv);
    }
  }
  game.reset();
  updateHtml();
}

function shareGame() {
  html.shareToClipboardToolTip.innerHTML = "Copied !";
  navigator.clipboard.writeText(
    `${location.origin + location.pathname}?f=${JSON.stringify(
      sharedVersion(game.flows)
    )}&b=${game.boardSize}`
  );
}

function getCaseClicked(x: number, y: number): Point | undefined {
  for (let row = 0; row < game.boardSize; row++)
    for (let column = 0; column < game.boardSize; column++) {
      let rect =
        html.board.children[row].children[column].getBoundingClientRect();
      if (
        rect.top <= y &&
        y <= rect.bottom &&
        rect.left <= x &&
        x <= rect.right
      )
        return { row: row, column: column };
    }
}

function gameWon() {
  html.popupGameFinished.style.display = "flex";
  html.timeToFinishGame.innerText = `You took ${Math.round(
    (new Date().getTime() - game.timeStart.getTime()) / 1000
  )} seconds to complete this level.`;
  html.moveToFinishGame.innerText = `You succeed with ${game.movesCounter} moves.`;
}

function handleMouseMove(event: { clientX: number; clientY: number }): void {
  if (!game.currentFlow || game.currentFlow === undefined) return;
  let pos = getCaseClicked(event.clientX, event.clientY);
  if (!pos || pos === undefined) return;
  if (pointsAreEqual(game.currentFlow.lines[-1], pos)) return;
  game.handleMouseMove(pos, game.currentFlow);
  if (game.isBoardCompleted()) gameWon();
  updateHtml();
  drawLines();
}

function toggleSolution() {
  game.toggleSolution();
  drawLines();
}

function updateHtml() {
  html.flowsDone.innerText = `Flows: ${
    game.flows.filter((flow: Flow) => flow.completed).length
  }/${game.boardSize}`;
  html.movesCounter.innerText = `Moves: ${game.movesCounter}`;
  html.percentDone.innerText = `Pipe: ${Math.floor(
    (game.flows.reduce(
      (prev: number, current: Flow) =>
        prev + current.lines.length,
      0
    ) /
      (game.boardSize * game.boardSize)) *
      100
  )}%`;
}

function drawPoints(): void {
  let showPoint: Function = (pos: Point, color: Color) => {
    let point: HTMLDivElement = document.createElement("div");
    point.className = "dot";
    point.style.backgroundColor = Color[color];
    html.board.children[pos.row].children[pos.column].appendChild(point);
  };

  game.flows.forEach((flow: Flow) => {
    showPoint(flow.start, flow.color);
    showPoint(flow.end, flow.color);
  });
}

function drawLines() {
  const caseSize =
    parseInt(getComputedStyle(html.board).width.slice(0, -2)) / game.boardSize;
  const lineThickness = (caseSize / 100) * 35;

  let children = [...html.board.children];
  for (let child of children) {
    if (child.className === "line") html.board.removeChild(child);
  }

  const drawLine = (
    first: { row: number; column: number },
    second: { row: number; column: number },
    color: string,
    glow: boolean
  ) => {
    const getSpacing = (pos: number): string => {
      return `${caseSize * (pos + 0.5) - lineThickness / 2}px`;
    };
    const getDimension = (pos1: number, pos2: number): string => {
      return `${caseSize * Math.abs(pos1 - pos2) + lineThickness}px`;
    };
    let line = document.createElement("div");
    line.className = "line";
    line.style.backgroundColor = color;
    line.style.width = `${lineThickness}px`;
    line.style.height = `${lineThickness}px`;
    line.style.borderRadius = `${lineThickness / 2}px`;
    html.board.appendChild(line);
    if (glow) line.style.boxShadow = `0 0 ${lineThickness / 1.6}px 0 ${color}`;
    if (first.row === second.row) {
      line.style.width = getDimension(first.column, second.column);
      line.style.top = getSpacing(first.row);
      if (first.column < second.column)
        line.style.left = getSpacing(first.column);
      else line.style.left = getSpacing(second.column);
    } else if (first.column === second.column) {
      line.style.height = getDimension(first.row, second.row);
      line.style.left = getSpacing(first.column);
      if (first.row < second.row) line.style.top = getSpacing(first.row);
      else line.style.top = getSpacing(second.row);
    }
  };

  game.flows.forEach((flow: Flow) => {
    if (game.showSolution)
      for (let i = 0; i < flow.solution.length - 1; i++)
        drawLine(
          flow.solution[i],
          flow.solution[i + 1],
          Color[flow.color],
          false
        );
    else {
      for (let i = 0; i < flow.corners.length - 1; i++)
        drawLine(
          flow.corners[i],
          flow.corners[i + 1],
          Color[flow.color],
          flow.completed
        );

      if (!flow.completed && flow.lines.length > 0)
        drawLine(
          flow.corners[-1],
          flow.lines[-1],
          Color[flow.color],
          false
        );
    }
    const setBoxShadow = (point: Point, shadow: string): void => {
      (
        html.board.children[point.row].children[point.column]
          .children[0] as HTMLElement
      ).style.boxShadow = shadow;
    };
    if (flow.completed && !game.showSolution) {
      let shadow1 = `0 0 ${lineThickness / 1.7}px 0 ${Color[flow.color]}`;
      setBoxShadow(flow.start, shadow1);
      setBoxShadow(flow.end, shadow1);
    } else {
      let shadow2 = `none`;
      setBoxShadow(flow.start, shadow2);
      setBoxShadow(flow.end, shadow2);
    }
  });
}
