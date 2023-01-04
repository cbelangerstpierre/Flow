import { Flow } from "./flow";
import { Direction, Point, Share } from "./models/models";

export const directions: Direction[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function getValidFlow(flows: Flow[], boardSize: number): Flow {
  let validFlows: Flow[] = flows.filter(
    (f: Flow) => f.solution.length < Math.pow(boardSize, 1.2)
  );

  return validFlows.at(Math.floor(Math.random() * validFlows.length))!;
}

export function isCorner(pos: Point, flow: Flow): boolean {
  return (
    flow.corners.at(-1)?.row != pos.row &&
    flow.corners.at(-1)?.column != pos.column
  );
}

export function noLineWrap(flow: Flow, pos: Point): boolean {
  return !flow.lines.every((point: Point) => {
    if (pointsAreEqual(point, pos)) {
      while (!pointsAreEqual(flow.lines.at(-1)!, point)) {
        let removedPoint: Point = flow.lines.pop()!;

        // Remove the corner if we removed the point
        flow.corners.forEach((corner: any) => {
          if (pointsAreEqual(corner, removedPoint))
            flow.corners.splice(flow.corners.indexOf(corner), 1);
        });
      }

      return false;
    }

    return true;
  });
}

export function touchingOtherFlowDot(
  flows: Flow[],
  flow: Flow,
  pos: Point
): boolean {
  return !flows
    .filter((f: Flow) => f != flow)
    .every((f: Flow) => {
      return !(pointsAreEqual(f.start, pos!) || pointsAreEqual(f.end, pos!));
    });
}

export function touchingOtherFlowLine(
  flows: Flow[],
  flow: Flow,
  pos: Point
): boolean {
  return !flows
    .filter((f: Flow) => f !== flow)
    .every((f: Flow) => {
      return f.lines.every((c: any) => {
        if (pointsAreEqual(c, pos!)) {
          flow.lines = [];
          flow.corners = [];
          return false;
        }

        return true;
      });
    });
}

export function isOnAnotherDot(
  flows: Flow[],
  flow: Flow,
  newDot: Point
): boolean {
  return flows
    .filter((f: Flow) => f !== flow)
    .some((f: Flow) => {
      if (f.solution.length <= 3) return false;

      if (pointsAreEqual(f.start, newDot)) {
        f.start = f.solution.at(1)!;
        f.solution.shift();
        return true;
      }
      if (pointsAreEqual(f.end, newDot)) {
        f.end = f.solution.at(-2)!;
        f.solution.pop();
        return true;
      }
    });
}

export function isInvalidNewDot(newDot: Point, boardSize: number): boolean {
  return (
    newDot.row < 0 ||
    newDot.row >= boardSize ||
    newDot.column < 0 ||
    newDot.column >= boardSize
  );
}

export function isValidNewLine(pos: Point, flow: Flow): boolean {
  return !(
    Math.abs(flow.lines.at(-1)!.row - pos.row) > 1 ||
    Math.abs(flow.lines.at(-1)!.column - pos.column) > 1 ||
    (flow.lines.at(-1)!.row != pos.row &&
      flow.lines.at(-1)!.column != pos.column)
  );
}

export function isfinishFlow(pos: Point, flow: Flow): boolean {
  return (
    (pointsAreEqual(flow.end, pos) &&
      pointsAreEqual(flow.start, flow.corners.at(0)!)) || // We are at second point and started at first point
    (pointsAreEqual(flow.start, pos) &&
      pointsAreEqual(flow.end, flow.corners.at(0)!))
  );
}

export function pointsAreEqual(start: Point, end: Point): boolean {
  return start.row == end.row && start.column == end.column;
}

export function pointsAreNeighboors(start: Point, end: Point): boolean {
  return (
    (Math.abs(start.row - end.row) == 1 && start.column == end.column) ||
    (Math.abs(start.column - end.column) == 1 && start.row == end.row)
  );
}

export function sharedVersion(flows: Flow[]): Share[] {
  let share: Share[] = [];
  flows.forEach((flow: Flow) => {
    let solution: any[] = [];
    flow.solution.forEach((s: { row: any; column: any }) => {
      solution.push(s.row);
      solution.push(s.column);
    });
    share.push({
      color: flow.color,
      flowStartRow: flow.start.row,
      flowStartColumn: flow.start.column,
      flowEndRow: flow.end.row,
      flowEndColumn: flow.end.column,
      solution: solution,
    });
  });
  return share;
}
