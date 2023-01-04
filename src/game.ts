import { Flow } from "./flow.js";
import { Color, Direction, Point } from "./models/models.js";
import {
  directions,
  getValidFlow,
  isCorner,
  isfinishFlow,
  isInvalidNewDot,
  isOnAnotherDot,
  isValidNewLine,
  noLineWrap,
  pointsAreEqual,
  touchingOtherFlowDot,
  touchingOtherFlowLine
} from "./utils.js";

export class Game {
  boardSize: number = 8;
  flows: Flow[] = [];
  showSolution: boolean = false;
  currentFlow?: Flow;
  timeStart: Date = new Date();
  movesCounter: number = 0;

  public reset(): void {
    this.movesCounter = 0;
    this.flows = [];
    this.currentFlow = undefined;
    this.showSolution = false;
  }

  public createLevel(): void {
    this.reset();
    this.initializeLevel();

    const iterationsMax = 10000;
    for (let i = 0; i < iterationsMax; ) {
      let flow: Flow = getValidFlow(this.flows, this.boardSize);
      let currentDot: Point =
        Math.floor(Math.random() * 2) == 0 ? flow.start : flow.end;

      let direction: Direction = directions.at(Math.floor(Math.random() * 4))!;
      let newDot: Point = {
        row: currentDot.row + direction.at(0)!,
        column: currentDot.column + direction.at(1)!,
      };
      if (isInvalidNewDot(newDot, this.boardSize)) continue;

      // If newDot is on an existing dot
      if (isOnAnotherDot(this.flows, flow, newDot)) {
        if (pointsAreEqual(flow.start, currentDot)) {
          flow.start = newDot;
          flow.solution.unshift(newDot);
        } else {
          flow.end = newDot;
          flow.solution.push(newDot);
        }
        i += 1;
      }
    }

    // Finds the corners in the newly created lines (flow.solution)
    this.flows.forEach((flow: Flow) => {
      let solutionLine: Point[] = flow.solution;
      flow.solution = [];

      flow.solution.push(flow.start);

      for (let i = 1; i < solutionLine.length - 1; i++)
        if (
          solutionLine.at(i - 1)!.row != solutionLine.at(i + 1)!.row &&
          solutionLine.at(i - 1)!.column != solutionLine.at(i + 1)!.column
        )
          flow.solution.push(solutionLine.at(i)!);

      flow.solution.push(flow.end);
    });

    this.timeStart = new Date();
  }
  public initializeLevel(): void {
    Object.values(Color)
      .slice(0, this.boardSize)
      .sort(() => Math.floor(Math.random() * 3) - 1)
      .forEach((_color: string | Color, i: number) => {
        let solution: Point[] = [];
        for (let row = 0; row < this.boardSize; row++)
          solution.push({ row: row, column: i });
        this.flows.push(
          new Flow(
            i,
            { row: 0, column: i },
            { row: this.boardSize - 1, column: i },
            solution
          )
        );
      });
  }

  public toggleSolution(): void {
    this.showSolution = !this.showSolution;
  }

  public caseClicked(pos: Point) {
    if (!this.showSolution && !this.isBoardCompleted()) {
      this.flows.forEach((flow: Flow) => {
        if (pointsAreEqual(flow.start, pos) || pointsAreEqual(flow.end, pos!)) {
          flow.lines = [pos];
          flow.corners = [pos];
          flow.completed = false;
          this.currentFlow = flow;
        }
      });
    }
  }

  public isBoardCompleted(): boolean {
    if (!this.flows.every((flow: Flow) => flow.completed)) return false;

    let totalLines = 0;
    this.flows.forEach((flow: { lines: string | any[] }) => {
      totalLines += flow.lines.length;
    });
    return totalLines == this.boardSize * this.boardSize;
  }

  private resetLine(): void {
    if (!this.currentFlow) return;
    this.currentFlow.lines = [];
    this.currentFlow.corners = [];
    this.currentFlow = undefined;
  }

  private finishFlow(pos: Point, flow: Flow): void {
    flow.corners.push(pos);
    flow.lines.push(pos);
    flow.completed = true;
    this.currentFlow = undefined;
    this.movesCounter += 1;
  }

  public handleMouseMove(pos: Point, flow: Flow): void {
    if (!isValidNewLine(pos, flow)) {
      this.resetLine();
      return;
    }
    if (isCorner(pos, flow)) flow.corners.push(flow.lines.at(-1)!);
    if (isfinishFlow(pos, flow)) {
      this.finishFlow(pos, flow);
      return;
    }
    if (noLineWrap(flow, pos)) return;
    if (touchingOtherFlowDot(this.flows, flow, pos) || touchingOtherFlowLine(this.flows, flow, pos)) {
      this.resetLine();
      return;
    }
    flow.lines.push(pos);
  }
}
