// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 550;

// EVENT STUFF
let mouseIsPressed = false;
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);  
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);

function keydownHandler(event) {
    if (event.code === "KeyA") {
      player[0].left = true;
    }
    if (event.code === "KeyD") {
      player[0].right = true;
    }
}
  
function keyupHandler(event) {
    if (event.code === "KeyA") {
      player[0].left = false;
    }
    if (event.code === "KeyD") {
      player[0].right = false;
    }
}


function mousedownHandler() {
    mouseIsPressed = true;
}

function mouseupHandler() {
    mouseIsPressed = false;
}

// Global Variables
let borderY = 460;
let canvasMidWidth = cnv.width / 2;
let playerZoneMidHeight = borderY + (cnv.height - borderY) / 2;

// Reset Variables
let circles;
let player;
let bullets;
let bulletReload = 0;

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
    playerControls();

    // Bullet Helper Functions
    for (let i = 0; i < bullets.length; i++) {
        drawCircles(bullets, i);
        bulletMovement(i);
        bulletDetection(i);
    }
    

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
        ctx.arc(shape[n].circleX, shape[n].circleY, shape[n].circleR, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.fill();

        ctx.strokeStyle = shape[n].lineColor;
        ctx.lineWidth = shape[n].lineWidth;
        ctx.beginPath();
        ctx.moveTo(shape[n].lineX, shape[n].lineY);
        ctx.lineTo(shape[n].lineX1, shape[n].lineY1);
        ctx.stroke();
    }

    if (shape === bullets) {
        ctx.fillStyle = shape[n].color;
        ctx.beginPath();
        ctx.arc(shape[n].x, shape[n].y, shape[n].r, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.fill();
    }
}

function playerControls() {
    playerMovement();
    playerShoot();
}

function playerMovement() {
    if (player[0].left === true) {
        player[0].circleX -= player[0].xVelocity;
        player[0].lineX -= player[0].xVelocity;
        player[0].lineX1 -= player[0].xVelocity;
    }

    if (player[0].right === true) {
        player[0].circleX += player[0].xVelocity;
        player[0].lineX += player[0].xVelocity;
        player[0].lineX1 += player[0].xVelocity;
    }

    if (player[0].circleX < 0) {
        player[0].circleX = 0;
        player[0].lineX = 0;
        player[0].lineX1 = 0;
    } else if (player[0].circleX > cnv.width) {
        player[0].circleX = cnv.width;
        player[0].lineX = cnv.width;
        player[0].lineX1 = cnv.width;
    }
}

function playerShoot() {
    if (mouseIsPressed === true && bulletReload === 0) {
        bullets.push(newBullet(player[0].circleX, player[0].circleY, 5, "white", 0, 2, -10));
        bulletReload = 15;
    }
    bulletReload--;

    if (bulletReload < 0) {
        bulletReload = 0;
    }
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

function bulletMovement(n) {
    bullets[n].y += bullets[n].velocity;
}

function bulletDetection(n) {
    if (bullets[n].y < 0) {
        bullets.splice(n, 1);
    } else {
        for (let i = 0; i < circles.length; i++) {
            let run = circles[i].x - bullets[n].x;
            let rise = circles[i].y - bullets[n].y;
            let d = Math.sqrt(Math.pow(run, 2) + Math.pow(rise, 2));
    
            if (d < bullets[n].r + circles[i].r) {
                circles.splice(i, 1);
                bullets.splice(n, 1);
            }
        }  
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

function newPlayer(circleX1, circleY1, circleR1, startAngle1, endAngle1, circleColor1, lineX2, lineY2, lineX3, lineY3, lineWidth1, lineColor1, xVelocity1, left1, right1, shoot1) {
    return {
        circleX: circleX1,
        circleY: circleY1,
        circleR: circleR1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        circleColor: circleColor1,
        lineX: lineX2,
        lineY: lineY2,
        lineX1: lineX3,
        lineY1: lineY3,
        lineWidth: lineWidth1,
        lineColor: lineColor1,
        xVelocity: xVelocity1,
        left: left1,
        right: right1,
        shoot: shoot1
    };
}

function newBullet(x1, y1, r1, color1, startAngle1, endAngle1, velocity1) {
    return {
        x: x1,
        y: y1,
        r: r1,
        color: color1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        velocity: velocity1
    };
}

function reset() {
    circles = [];
    for (let i = 0; i < 15; i++) {
        circles.push(newCircle(randomInt(50, cnv.width - 50), randomInt(50, borderY - 50), randomInt(10, 50), 3, 0, 2, randomInt(-5, 5), randomInt(-5, 5), `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`));
    }

    player = [];
    player.push(newPlayer(canvasMidWidth, playerZoneMidHeight, 25, 0, 2, "white", canvasMidWidth, playerZoneMidHeight, canvasMidWidth, playerZoneMidHeight - 25, 5, "red", 5, false, false, false));

    bullets = [];
}