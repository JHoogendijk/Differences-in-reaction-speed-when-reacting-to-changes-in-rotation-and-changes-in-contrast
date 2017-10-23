/// <reference path="../references.ts" />
class informationFormStep implements Step {
    nextStep: Step;
    
    constructor(nextStep: Step) {
        this.nextStep = nextStep
    }
    
    performStep() {
        let nextButton = document.getElementById("to_information");
        let section = document.getElementById("information_form");
        if (section) {
            section.style.display = "block";
        }
        let self = this;
        if (nextButton) {
            nextButton.addEventListener('click', function(event) {
                let gender = <HTMLInputElement> document.getElementById("gender");
                let age = <HTMLInputElement> document.getElementById("age");
                let monitor = <HTMLInputElement> document.getElementById("monitor");
        
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
                } else {
                    let error = document.getElementById("oops");
                    if (error) {
                        error.style.visibility = "visible";
                    }
                }
            });
        }
    }
}