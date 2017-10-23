/// <reference path="./references.ts" />
interface Step {
    nextStep: Step;
    performStep();
}