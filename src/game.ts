import { Flow } from "./flow.js";
import { Color, Direction, Point } from "./models/models.js";
import {
  directions,
  getValidFlow,
  isCorner,
  isfinishFlow,
  isInvalidNewDot,
  isOnAnotherDot as isNewDotOnAnExistingDot,
  isValidNewLine,
  noLineWrap,
  pointsAreEqual,
  touchingOtherFlowDot,
  touchingOtherFlowLine,
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
    this.createNewlyGeneratedLevel();
    this.findCorners();
    this.timeStart = new Date();
  }

  private createNewlyGeneratedLevel(): void {
    const iterationsMax: number = 10000;
    // Increment is at the bottom, in order to not always increment
    for (let i = 0; i < iterationsMax; ) {
      const flow: Flow = getValidFlow(this.flows, this.boardSize);
      const currentDot: Point =
        Math.floor(Math.random() * 2) === 0 ? flow.start : flow.end;
      const direction: Direction =
        directions[Math.floor(Math.random() * directions.length)];
      const newDot: Point = {
        row: currentDot.row + direction[0],
        column: currentDot.column + direction[1],
      };

      if (isInvalidNewDot(newDot, this.boardSize)) {
        continue;
      }

      if (isNewDotOnAnExistingDot(this.flows, flow, newDot)) {
        if (pointsAreEqual(flow.start, currentDot)) {
          flow.start = newDot;
          flow.solution.unshift(newDot);
        } else {
          flow.end = newDot;
          flow.solution.push(newDot);
        }
        i++;
      }
    }
  }

  private findCorners(): void {
    this.flows.forEach((flow: Flow) => {
      const solutionLine: Point[] = flow.solution;
      flow.solution = [];

      flow.solution.push(flow.start);

      // Start at 1 and finish to 1 less since we want to access the one before and one after every time
      for (let i = 1; i < solutionLine.length - 1; i++)
        if (
          solutionLine[i - 1].row !== solutionLine[i + 1]!.row &&
          solutionLine[i - 1].column !== solutionLine[i + 1]!.column
        ) {
          flow.solution.push(solutionLine[i]);
        }

      flow.solution.push(flow.end);
    });
  }

  private initializeLevel(): void {
    Object.values(Color)
      .slice(0, this.boardSize)
      // will generate number of -1, 0 or 1 to sort the colors
      .sort(() => Math.floor(Math.random() * 3) - 1)
      .forEach((_color: string | Color, index: number) => {
        const solution: Point[] = [];

        for (let row = 0; row < this.boardSize; row++)
          solution.push({ row: row, column: index });

        this.flows.push(
          new Flow(
            index,
            { row: 0, column: index },
            { row: this.boardSize - 1, column: index },
            solution
          )
        );
      });
  }

  public toggleSolution(): void {
    this.showSolution = !this.showSolution;
  }

  public caseClicked(pos: Point): void {
    if (!this.showSolution && !this.isBoardCompleted()) {
      this.flows.forEach((flow: Flow) => {
        if (pointsAreEqual(flow.start, pos) || pointsAreEqual(flow.end, pos)) {
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

    let totalLines: number = 0;
    this.flows.forEach((flow: Flow) => {
      totalLines += flow.lines.length;
    });
    return totalLines === this.boardSize * this.boardSize;
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

    if (isCorner(pos, flow)) flow.corners.push(flow.lines[-1]);

    if (isfinishFlow(pos, flow)) {
      this.finishFlow(pos, flow);
      return;
    }

    if (noLineWrap(flow, pos)) return;

    if (
      touchingOtherFlowDot(this.flows, flow, pos) ||
      touchingOtherFlowLine(this.flows, flow, pos)
    ) {
      this.resetLine();
      return;
    }

    flow.lines.push(pos);
  }
}
