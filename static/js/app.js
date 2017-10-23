/// <reference path="./references.ts" />
var Rectangle = /** @class */ (function () {
    function Rectangle(top, left, width, height, color, orientation, id) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.color = color;
        this.orientation = orientation;
        this.id = id;
    }
    return Rectangle;
}());
/// <reference path="./references.ts" />
var saveRequest = /** @class */ (function () {
    function saveRequest() {
        this.results = [];
    }
    // Function returns a percentile
    saveRequest.prototype.save = function (onResult) {
        var sum = 0;
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var result = _a[_i];
            sum += result;
        }
        this.averageTime = sum / 10;
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://mijnwolken.nl/save');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var results = JSON.parse(xhr.responseText);
                onResult(results.percentile);
            }
        };
        xhr.send(JSON.stringify({
            results: this.results,
            age: this.age,
            gender: this.gender,
            monitor: this.monitor,
            averageTime: this.averageTime
        }));
    };
    return saveRequest;
}());
/// <reference path="./references.ts" />
/// <reference path="../references.ts" />
var experimentStep = /** @class */ (function () {
    /**
    * Create an experiment step
    * ChangeType should be a number specifying the type of change to occur: 0 for orientation changes, 1 for contrast changes.
    **/
    function experimentStep(rectangles, changingRectangleIndex, changeType) {
        this.currentAction = 0;
        this.intervalDisabled = false;
        this.clickEventEnabled = true;
        this.rectangles = rectangles;
        this.changedRectangles = [];
        for (var i = 0; i < rectangles.length; i++) {
            this.changedRectangles.push(new Rectangle(rectangles[i].top, rectangles[i].left, rectangles[i].width, rectangles[i].height, rectangles[i].color, rectangles[i].orientation, rectangles[i].id));
        }
        this.changingRectangleIndex = changingRectangleIndex;
        this.changeType = changeType;
        this.id = rectangles[changingRectangleIndex].id;
        if (changeType == 1) {
            this.id += 5;
        }
    }
    experimentStep.prototype.performStep = function () {
        var self = this;
        var intervalTime = 500;
        var section = document.getElementById("experiment");
        if (section) {
            section.style.display = "block";
        }
        // Save current time
        var timeBefore = Date.now();
        // Code performed every 3 seconds
        var intervalFunction = function () {
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
            }
            else {
                clearInterval(self.interval);
            }
        };
        intervalFunction();
        this.interval = setInterval(intervalFunction, intervalTime);
        // Code performed when the space bar has been pressed
        document.body.onkeyup = function (e) {
            if (e.keyCode == 32) {
                if (self.reactionTime == null) {
                    self.reactionTime = Date.now() - timeBefore;
                    // Make sure the interval stops
                    clearInterval(self.interval);
                    self.intervalDisabled = true;
                    // Show an empty screen for three seconds before showing the input validation
                    self.emptyCanvas();
                    setTimeout(function () {
                        self.validateInput();
                    }, intervalTime);
                }
            }
        };
    };
    experimentStep.prototype.validateInput = function () {
        var section = document.getElementById("message");
        if (section) {
            section.style.visibility = "visible";
        }
        var self = this;
        this.drawRectangles(this.rectangles);
        var element = this.rectangles[this.changingRectangleIndex];
        var canvas = document.getElementById("canvas");
        this.clickFunction = function (event) {
            if (self.clickEventEnabled) {
                var x = event.pageX - canvas.offsetLeft, y = event.pageY - canvas.offsetTop;
                // Collision detection between clicked offset and element.
                if (y > element.top && y < element.top + element.height
                    && x > element.left && x < element.left + element.width) {
                    App.save.results[self.id] = self.reactionTime;
                }
                else {
                    App.save.results[self.id] = 0;
                }
                if (section) {
                    section.style.visibility = "hidden";
                }
                self.nextStep.performStep();
                self.clickEventEnabled = false;
                canvas.removeEventListener("click", self.clickFunction);
            }
        };
        canvas.addEventListener('click', this.clickFunction, false);
    };
    experimentStep.prototype.evolveChangingRectangle = function () {
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
    };
    experimentStep.prototype.emptyCanvas = function () {
        var canvas = document.getElementById("canvas"), context = canvas.getContext("2d");
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
    experimentStep.prototype.drawRectangles = function (rectangles) {
        for (var _i = 0, rectangles_1 = rectangles; _i < rectangles_1.length; _i++) {
            var rectangle = rectangles_1[_i];
            this.drawRectangle(rectangle);
        }
    };
    experimentStep.prototype.drawRectangle = function (rectangle) {
        var canvas = document.getElementById("canvas"), context = canvas.getContext("2d");
        if (context) {
            context.save();
            context.beginPath();
            context.translate(rectangle.left + rectangle.width / 2, rectangle.top + rectangle.height / 2);
            context.rotate(rectangle.orientation * Math.PI / 180);
            context.fillStyle = "rgb(" + rectangle.color + "," + rectangle.color + "," + rectangle.color + ")";
            context.fillRect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);
            context.restore();
        }
    };
    return experimentStep;
}());
/// <reference path="../references.ts" />
var finalStep = /** @class */ (function () {
    function finalStep() {
    }
    finalStep.prototype.performStep = function () {
        App.save.save(this.setPercentile);
        // Show the section
        var section = document.getElementById("experiment");
        if (section) {
            section.style.display = "none";
        }
        section = document.getElementById("finished");
        if (section) {
            section.style.display = "block";
        }
    };
    finalStep.prototype.setPercentile = function (percentile) {
        // Update the percentile on the page
        var percentileHtml = document.getElementById("percentile");
        percentileHtml.textContent = "" + percentile;
    };
    return finalStep;
}());
/// <reference path="../references.ts" />
var informationFormStep = /** @class */ (function () {
    function informationFormStep(nextStep) {
        this.nextStep = nextStep;
    }
    informationFormStep.prototype.performStep = function () {
        var nextButton = document.getElementById("to_information");
        var section = document.getElementById("information_form");
        if (section) {
            section.style.display = "block";
        }
        var self = this;
        if (nextButton) {
            nextButton.addEventListener('click', function (event) {
                var gender = document.getElementById("gender");
                var age = document.getElementById("age");
                var monitor = document.getElementById("monitor");
                var genderValue, ageValue, monitorValue;
                if (gender && age && monitor) {
                    genderValue = gender.value;
                    ageValue = age.value;
                    monitorValue = monitor.value;
                }
                if (genderValue && ageValue && monitorValue && ageValue > 0) {
                    App.save.gender = genderValue;
                    App.save.age = ageValue;
                    App.save.monitor = monitorValue;
                    if (section) {
                        section.style.display = "none";
                    }
                    self.nextStep.performStep();
                }
                else {
                    var error = document.getElementById("oops");
                    if (error) {
                        error.style.visibility = "visible";
                    }
                }
            });
        }
    };
    return informationFormStep;
}());
/// <reference path="../references.ts" />
var informationStep = /** @class */ (function () {
    function informationStep(nextStep) {
        this.nextStep = nextStep;
    }
    informationStep.prototype.performStep = function () {
        var next_button = document.getElementById("to_experiment");
        var section = document.getElementById("information");
        if (section) {
            section.style.display = "block";
        }
        var self = this;
        if (next_button) {
            next_button.addEventListener("click", function () {
                if (section) {
                    section.style.display = "none";
                }
                self.nextStep.performStep();
            });
        }
    };
    return informationStep;
}());
/// <reference path="../references.ts" />
var welcomeStep = /** @class */ (function () {
    function welcomeStep(nextStep) {
        this.nextStep = nextStep;
    }
    welcomeStep.prototype.performStep = function () {
        var next_button = document.getElementById("to_information_form");
        var section = document.getElementById("welcome");
        var self = this;
        if (next_button) {
            next_button.addEventListener("click", function () {
                if (section) {
                    section.style.display = "none";
                }
                self.nextStep.performStep();
            });
        }
    };
    return welcomeStep;
}());
/// <reference path="./app.ts" />
/// <reference path="./rectangle.ts" />
/// <reference path="./saveRequest.ts" />
/// <reference path="./step.ts" />
/// <reference path="./steps/experimentStep.ts" />
/// <reference path="./steps/finalStep.ts" />
/// <reference path="./steps/informationFormStep.ts" />
/// <reference path="./steps/informationStep.ts" />
/// <reference path="./steps/welcomeStep.ts" /> 
/// <reference path="./references.ts" />
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.start = function () {
        this.initiateSteps().performStep();
    };
    App.prototype.initiateSteps = function () {
        return new welcomeStep(new informationFormStep(new informationStep(this.initiateExperimentalSteps(new finalStep()))));
    };
    /// new Rectangle(top: number, left: number, width: number, height: number, color: number, orientation: number, id: number)
    App.prototype.initiateRectangles = function () {
        var rectangles = [];
        rectangles.push(new Rectangle(144, 471, 74, 117, 188, 55, 0));
        rectangles.push(new Rectangle(257, 79, 135, 107, 123, 45, 1));
        rectangles.push(new Rectangle(308, 377, 89, 76, 187, 3, 2));
        rectangles.push(new Rectangle(31, 312, 120, 119, 161, 57, 3));
        rectangles.push(new Rectangle(73, 47, 76, 100, 145, 38, 4));
        rectangles.push(new Rectangle(9, 483, 117, 85, 193, 105, 5));
        rectangles.push(new Rectangle(234, 277, 75, 77, 85, 12, 6));
        rectangles.push(new Rectangle(395, 226, 135, 58, 106, 75, 7));
        rectangles.push(new Rectangle(94, 193, 70, 55, 59, 92, 8));
        rectangles.push(new Rectangle(327, 503, 90, 59, 95, 30, 9));
        rectangles.push(new Rectangle(429, 28, 81, 55, 80, 45, 10));
        rectangles.push(new Rectangle(427, 426, 68, 65, 144, 35, 11));
        rectangles.push(new Rectangle(4, 130, 69, 55, 169, 67, 12));
        rectangles.push(new Rectangle(438, 530, 67, 59, 134, 33, 13));
        rectangles.push(new Rectangle(200, 1, 66, 55, 119, 30, 14));
        rectangles.push(new Rectangle(438, 140, 66, 59, 112, 17, 15));
        return rectangles;
    };
    App.prototype.initiateExperimentalSteps = function (nextStep) {
        var rectangles = this.initiateRectangles();
        var steps = [];
        for (var i = 0; i < 5; i++) {
            steps.push(new experimentStep(rectangles, i, 0));
        }
        for (var i = 0; i < 5; i++) {
            steps.push(new experimentStep(rectangles, i, 1));
        }
        var randomSteps = this.shuffle(steps);
        for (var i = 0; i < randomSteps.length + 1; i++) {
            if (i > 0) {
                if (i == randomSteps.length) {
                    randomSteps[i - 1].nextStep = nextStep;
                }
                else {
                    randomSteps[i - 1].nextStep = randomSteps[i];
                }
            }
        }
        return randomSteps[0];
    };
    App.prototype.shuffle = function (x) {
        var a = x;
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
        }
        return a;
        var _a;
    };
    App.save = new saveRequest();
    return App;
}());
//# sourceMappingURL=app.js.map