interface Point {
    row: number,
    column: number
};

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

enum Color {
    red,
    orange,
    yellow,
    green,
    cyan,
    blue,
    purple,
    pink,
    silver,
    lime,
    chocolate,
    crimson,
    darksalmon,
    orangered,
    yellowgreen,
};