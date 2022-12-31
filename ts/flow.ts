class Flow {
  color: Color;
  start: Point;
  end: Point;
  corners: Point[] = [];
  lines: Point[] = [];
  completed: boolean = false;
  solution: Point[];

  constructor(color: Color, start: Point, end: Point, solution: Point[]) {
    this.color = color;
    this.start = start;
    this.end = end;
    this.solution = solution;
  }
}
