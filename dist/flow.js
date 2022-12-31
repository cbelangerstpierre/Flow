"use strict";
class Flow {
    constructor(color, start, end, solution) {
        this.corners = [];
        this.lines = [];
        this.completed = false;
        this.color = color;
        this.start = start;
        this.end = end;
        this.solution = solution;
    }
}
