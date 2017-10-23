/// <reference path="./references.ts" />
class App {
    static save = new saveRequest()
    
    start() {
        this.initiateSteps().performStep();
    }
    
    initiateSteps(): Step {
        return new welcomeStep(new informationFormStep(new informationStep(this.initiateExperimentalSteps(new finalStep()))));
    }
    
    /// new Rectangle(top: number, left: number, width: number, height: number, color: number, orientation: number, id: number)
    initiateRectangles(): Rectangle[] {
        let rectangles: Rectangle[] = [];
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
        return rectangles
    }
    
    initiateExperimentalSteps(nextStep: Step): Step {
        let rectangles = this.initiateRectangles();
        let steps: experimentStep[] = []
        for (let i = 0; i < 5; i++) {
            steps.push(new experimentStep(rectangles, i, 0));
        }
        for (let i = 0; i < 5; i++) {
            steps.push(new experimentStep(rectangles, i, 1));
        }
        let randomSteps: experimentStep[] = this.shuffle(steps);
        for (let i = 0; i < randomSteps.length+1; i++) {
            if (i > 0) {
                if (i == randomSteps.length) {
                    randomSteps[i-1].nextStep = nextStep;
                } else {
                    randomSteps[i-1].nextStep = randomSteps[i];
                }
            }
        }
        return randomSteps[0];
    }
    
    shuffle(x: experimentStep[]): experimentStep[] {
        let a = x;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}