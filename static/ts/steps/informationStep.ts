/// <reference path="../references.ts" />
class informationStep implements Step {
    nextStep: Step;
    
    constructor(nextStep: Step) {
        this.nextStep = nextStep;
    }
    
    performStep() {
        let next_button = document.getElementById("to_experiment");
        let section = document.getElementById("information");
        if (section) {
            section.style.display = "block";
        }
        let self = this;
        if (next_button) {
            next_button.addEventListener("click", function() {
                if (section) {
                    section.style.display = "none";
                }
                self.nextStep.performStep();
            });
        }
    }
}