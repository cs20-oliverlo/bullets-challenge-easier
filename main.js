// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 550;

// EVENT STUFF

// Reset Variables
let circles;
let player;
let bullets;
let borderY = 460;

reset();

// Event Stuff
// document.addEventListener("mousedown", mousedownHandler);
// document.addEventListener("mouseup", mouseupHandler);


// Animation
requestAnimationFrame(animate);
function animate() {
    // Fill Background
    ctx.fillStyle = `rgb(50, 50, 50)`;
    ctx.fillRect(0, 0, cnv.width, cnv. height);

    // Food Helper Functions
    for (let i = 0; i < circles.length; i++) {
        drawCircles(circles, i);
        moveCircles(i);
    }

    // Player Helper Functions
    drawCircles(player, 0);

    // Border
    ctx.fillStyle = `white`;
    ctx.fillRect(0, borderY, cnv.width, 2);

    // Request Animation Frame
    requestAnimationFrame(animate);
}

function drawCircles(shape, n) {
    if (shape === circles) {
        ctx.strokeStyle = shape[n].color;
        ctx.lineWidth = shape[n].lineWidth;
        ctx.beginPath();
        ctx.arc(shape[n].x, shape[n].y, shape[n].r, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.stroke();
    }
    
    if (shape === player) {
        ctx.fillStyle = shape[n].circleColor;
        ctx.beginPath();
        ctx.arc(shape[n].x, shape[n].y, shape[n].r, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.fill();

        ctx.strokeStyle = shape[n].lineColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(75, 50); // Start at (x1, y1)
        ctx.lineTo(200, 100); // Go to (x2, y2)
        ctx.stroke(); // Draw line
    }
}

function playerMovement() {

}

function moveCircles(n) {
    if (circles[n].xVelocity === 0) {
        circles[n].xVelocity = randomInt(-5, 5);
    }
    if (circles[n].yVelocity === 0) {
        circles[n].yVelocity = randomInt(-5, 5);
    }

    circles[n].x += circles[n].xVelocity;
    circles[n].y += circles[n].yVelocity;

    if (circles[n].x + circles[n].r > cnv.width || circles[n].x - circles[n].r < 0) {
        circles[n].xVelocity = circles[n].xVelocity * -1;
    }
    if (circles[n].y + circles[n].r > borderY || circles[n].y - circles[n].r < 0) {
        circles[n].yVelocity = circles[n].yVelocity * -1;
    }
}

function newCircle(x1, y1, r1, lineWidth1, startAngle1, endAngle1, xVelocity1, yVelocity1, color1) {
    return {
            x: x1,
            y: y1,
            r: r1,
            lineWidth: lineWidth1,
            startAngle: startAngle1,
            endAngle: endAngle1,
            xVelocity: xVelocity1,
            yVelocity: yVelocity1,
            color: color1
        };
}

function newPlayer(circleX1, circleY1, circleR1, startAngle1, endAngle1, circleColor1, xVelocity1, lineX2, lineY2, lineX3, lineY3, lineWidth1,lineColor1) {
    return {
        circleX: circleX1,
        circleY: circleY1,
        circleR: circleR1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        circleColor: circleColor1,
        xVelocity: xVelocity1,
        lineX: lineX2,
        lineY: lineY2,
        lineX1: lineX3,
        lineY1: lineY3,
        lineWidth: lineWidth1,
        lineColor: lineColor1
        }
}

function reset() {
    circles = [];
    for (let i = 0; i < 15; i++) {
        circles.push(newCircle(randomInt(50, cnv.width - 50), randomInt(50, borderY - 50), randomInt(10, 50), 3, 0, 2, randomInt(-5, 5), randomInt(-5, 5), `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`));
    }

    player = [];
    player.push(newPlayer(cnv.width / 2, 500, 25, 0, 2, "white", 5));
}