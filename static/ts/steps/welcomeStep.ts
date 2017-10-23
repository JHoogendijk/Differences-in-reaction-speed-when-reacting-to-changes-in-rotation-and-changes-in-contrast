/// <reference path="../references.ts" />
class welcomeStep implements Step {
    nextStep: Step;
    
    constructor(nextStep: Step) {
        this.nextStep = nextStep;
    }
    
    performStep() {
        let next_button = document.getElementById("to_information_form");
        let section = document.getElementById("welcome");
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