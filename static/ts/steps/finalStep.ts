/// <reference path="../references.ts" />
class finalStep implements Step {
    nextStep: Step;
    
    performStep() {
        
        App.save.save(this.setPercentile)
        
        // Show the section
        var section = document.getElementById("experiment");
        if (section) {
            section.style.display = "none";
        }
        section = document.getElementById("finished");
        if (section) {
            section.style.display = "block";
        }
    }
    
    setPercentile(percentile: number) {
        // Update the percentile on the page
        var percentileHtml = <HTMLSpanElement> document.getElementById("percentile");
        percentileHtml.textContent = ""+percentile;
    }
}