/// <reference path="./references.ts" />
class Rectangle {
    top: number;
    left: number;
    width: number;
    height: number;
    color: number;
    orientation: number;
    id: number;
    
    constructor(top: number, left: number, width: number, height: number, color: number, orientation: number, id: number) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.color = color;
        this.orientation = orientation;
        this.id = id;
    }
}