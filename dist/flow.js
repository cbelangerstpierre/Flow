"use strict";
;
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
var Color;
(function (Color) {
    Color[Color["red"] = 0] = "red";
    Color[Color["orange"] = 1] = "orange";
    Color[Color["yellow"] = 2] = "yellow";
    Color[Color["green"] = 3] = "green";
    Color[Color["cyan"] = 4] = "cyan";
    Color[Color["blue"] = 5] = "blue";
    Color[Color["purple"] = 6] = "purple";
    Color[Color["pink"] = 7] = "pink";
    Color[Color["silver"] = 8] = "silver";
    Color[Color["lime"] = 9] = "lime";
    Color[Color["chocolate"] = 10] = "chocolate";
    Color[Color["crimson"] = 11] = "crimson";
    Color[Color["darksalmon"] = 12] = "darksalmon";
    Color[Color["orangered"] = 13] = "orangered";
    Color[Color["yellowgreen"] = 14] = "yellowgreen";
})(Color || (Color = {}));
;
