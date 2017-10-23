/// <reference path="./references.ts" />
class saveRequest {
    results: number[] = [];
    gender: string;
    age: number;
    monitor: string;
    averageTime: number;
    percentile: number;
    
    // Function returns a percentile
    save(onResult: (percentile: number) => void) {
        var sum = 0;
        for (let result of this.results) {
            sum += result;
            if (result == 0) {
                sum += 50000;
            }
        }
        this.averageTime = sum/10
        
        let self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://mijnwolken.nl/save');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                let results = JSON.parse(xhr.responseText);
                onResult(results.percentile)
            }
        };
        xhr.send(JSON.stringify({
            results: this.results,
            age: this.age,
            gender: this.gender,
            monitor: this.monitor,
            averageTime: this.averageTime
        }));
    }
}