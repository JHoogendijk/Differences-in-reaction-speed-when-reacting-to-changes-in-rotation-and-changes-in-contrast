function detectCircleCollision(x1, x2, y1, y2, r1, r2) {
    var minimundistance = 10
    var result = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y1-y2,2))<=(r1+r2+minimundistance)
    return result
}

function generateRandomRectangles() {
    var rectangles = []
    var canvasWidth = 600
    var canvasHeight = 500
    var maxWidthPercentage = 9
    var minWidthPercentage = 7
    var maxHeightPercentage = 9
    var minHeightPercentage = 7
    var i = 0
    while (rectangles.length < 20 && i < 10000000) {
        var randomHeight = Math.floor((Math.random() * (canvasHeight * (maxHeightPercentage/100))) + (canvasHeight * (minHeightPercentage/100)))
        var randomWidth = Math.floor((Math.random() *  (canvasWidth * (maxWidthPercentage/100))) + (canvasWidth * (minWidthPercentage/100)))
        var randomrectangle = {
            top: Math.floor((Math.random() * (canvasHeight - randomHeight))) + 1,
            left: Math.floor((Math.random() * (canvasWidth - randomWidth))) + 1,
            width: randomWidth,
            height: randomHeight
        }
        var collisionDetected = false
        var halfRandomHeight = randomrectangle.height*0.5
        var halfRandomWidth = randomrectangle.width*0.5
        var randomcircle = {
            x: randomrectangle.left + randomrectangle.width / 2,
            y: randomrectangle.top + randomrectangle.height / 2,
            r: Math.sqrt(Math.pow(halfRandomWidth,2)+Math.pow(halfRandomHeight,2))
        }
        for (var j = 0; j < rectangles.length; j++) {
            var halfHeight = rectangles[j].height*0.5
            var halfWidth = rectangles[j].width*0.5
            var existingcircle = {
                x: rectangles[j].left + rectangles[j].width / 2,
                y: rectangles[j].top + rectangles[j].height / 2,
                r: Math.sqrt(Math.pow(halfWidth,2) + Math.pow(halfHeight,2))
            }
            if (detectCircleCollision(randomcircle.x, existingcircle.x, randomcircle.y, existingcircle.y, randomcircle.r, existingcircle.r)) {
                collisionDetected = true
                break;
            }
        }
        if (!collisionDetected) {
            rectangles.push(randomrectangle)
        }
        i++
    }
    return rectangles
}

function drawRectangle(rectangle) {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d");
    canvas.style.backgroundColor = "#f3f5f6"
    if (context) {
        context.save()
        context.beginPath()
        context.translate(rectangle.left + rectangle.width / 2, rectangle.top + rectangle.height / 2);
        context.rotate(rectangle.orientation * Math.PI / 180);
        context.fillStyle = "rgb(100,100,100)";
        context.fillRect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);
        context.restore()
    }
}

function drawRectangles(rectangles) {
    for (var i = 0; i < rectangles.length; i++) {
        drawRectangle(rectangles[i]);
    }
}

function createStringForRectangles(rectangles) {
    var string = ""
    for (var i = 0; i<rectangles.length;i++) {
        string+="rectangles.push(new Rectangle("+rectangles[i].top+", "+rectangles[i].left+", "+rectangles[i].width+", "+rectangles[i].height+", "+(Math.floor((Math.random() * 150)) + 50)+", "+(Math.floor((Math.random() * 110)) + 0)+", "+i+"));\n"
    }
    return string
}

var rectangles = generateRandomRectangles()
console.log(createStringForRectangles(rectangles))
console.log(rectangles)
drawRectangles(rectangles)
