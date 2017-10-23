/// <reference path="../references.ts" />
class experimentStep implements Step {
    id: number;
    nextStep: Step;
    rectangles: Rectangle[];
    changedRectangles: Rectangle[];
    currentAction: number = 0;
    changingRectangleIndex: number;
    changeType: number;
    reactionTime: number;
    intervalDisabled: boolean = false;
    interval: any;
    clickEventEnabled = true;
    clickFunction: (event) => void;
    
    /**
    * Create an experiment step
    * ChangeType should be a number specifying the type of change to occur: 0 for orientation changes, 1 for contrast changes.
    **/
    constructor(rectangles: Rectangle[], changingRectangleIndex: number, changeType: number) {
        this.rectangles = rectangles;
        this.changedRectangles = [];
        for (let i = 0; i < rectangles.length; i++) {
            this.changedRectangles.push(new Rectangle(rectangles[i].top, rectangles[i].left, rectangles[i].width, rectangles[i].height, rectangles[i].color, rectangles[i].orientation, rectangles[i].id))
        }
        this.changingRectangleIndex = changingRectangleIndex;
        this.changeType = changeType;
        this.id = rectangles[changingRectangleIndex].id;
        if (changeType == 1) {
            this.id += 5;
        }
    }
    
    performStep() {
        let self = this;
        let intervalTime = 500;
        var section = document.getElementById("experiment");
        if (section) {
            section.style.display = "block";
        }
        
        // Save current time
        let timeBefore = Date.now();
        
        // Code performed every 3 seconds
        let intervalFunction = function(){
            if (!self.intervalDisabled) {
                switch (self.currentAction) {
                    case 0:
                        self.drawRectangles(self.rectangles);
                        break;
                    case 1:
                        self.emptyCanvas();
                        break;
                    case 2:
                        self.evolveChangingRectangle();
                        self.drawRectangles(self.changedRectangles);
                        break;
                    case 3:
                        self.emptyCanvas();
                        break;
                }
                self.currentAction++;
                if (self.currentAction > 3) {
                    self.currentAction = 0;
                }
            } else {
                clearInterval(self.interval)
            }
        }
        intervalFunction();
        this.interval = setInterval(intervalFunction, intervalTime);
        
        // Code performed when the space bar has been pressed
        document.body.onkeyup = function(e){
            if(e.keyCode == 32){
                if (self.reactionTime == null) {
                    self.reactionTime = Date.now() - timeBefore;
                    // Make sure the interval stops
                    clearInterval(self.interval)
                    self.intervalDisabled = true;
                    // Show an empty screen for three seconds before showing the input validation
                    self.emptyCanvas();
                    setTimeout(function(){
                        self.validateInput()
                    }, intervalTime)
                }
            }
        }
    }
    
    validateInput() {
        let section = document.getElementById("message");
        if (section) {
            section.style.visibility = "visible";
        }
        let self = this;
        this.drawRectangles(this.rectangles);
        var element = this.rectangles[this.changingRectangleIndex];
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        this.clickFunction = function(event) {
            if (self.clickEventEnabled) {
                var x = event.pageX - canvas.offsetLeft,
                y = event.pageY - canvas.offsetTop;

                // Collision detection between clicked offset and element.
                if (y > element.top && y < element.top + element.height 
                    && x > element.left && x < element.left + element.width) {
                    App.save.results[self.id] = self.reactionTime;
                } else {
                    App.save.results[self.id] = 0;
                }
                if (section) {
                    section.style.visibility = "hidden";
                }   
                self.nextStep.performStep()
                self.clickEventEnabled = false
                canvas.removeEventListener("click", self.clickFunction)
            }
        }
        canvas.addEventListener('click', this.clickFunction, false);
    }
    
    evolveChangingRectangle() {
        if (this.changedRectangles[this.changingRectangleIndex].orientation - this.rectangles[this.changingRectangleIndex].orientation >= 180) {
            return null;
        }
        switch (this.changeType) {
            case 0:
                this.changedRectangles[this.changingRectangleIndex].orientation += 7.08333;
                break;
            case 1:
                this.changedRectangles[this.changingRectangleIndex].color += 5;
                break;
        }
    }
    
    emptyCanvas() {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas"),
            context = canvas.getContext("2d");
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    drawRectangles(rectangles: Rectangle[]) {
        for (let rectangle of rectangles) {
            this.drawRectangle(rectangle);
        }
    }
    
    drawRectangle(rectangle: Rectangle) {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas"),
            context = canvas.getContext("2d");
        if (context) {
            context.save()
            context.beginPath()
            context.translate(rectangle.left + rectangle.width/2, rectangle.top + rectangle.height/2);
            context.rotate(rectangle.orientation*Math.PI/180);
            context.fillStyle = "rgb("+rectangle.color+","+rectangle.color+","+rectangle.color+")";
            context.fillRect(-rectangle.width/2, -rectangle.height/2, rectangle.width, rectangle.height);
            context.restore()
        }
    }
}