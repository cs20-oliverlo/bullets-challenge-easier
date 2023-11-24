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
      player.left = true;
    }
    if (event.code === "KeyD") {
      player.right = true;
    }
}
  
function keyupHandler(event) {
    if (event.code === "KeyA") {
      player.left = false;
    }
    if (event.code === "KeyD") {
      player.right = false;
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
let player;
let circles;
let bullets;

reset();

// Animation
requestAnimationFrame(animate);
function animate() {
    // Fill Background
    ctx.fillStyle = `rgb(50, 50, 50)`;
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // Food Helper Functions
    for (let i = 0; i < circles.length; i++) {
        drawCircles(circles, i);
        moveCircles(i);
    }

    // Player Helper Functions
    drawCircles(player);
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
        ctx.fillStyle = shape.circleColor;
        ctx.beginPath();
        ctx.arc(shape.circleX, shape.circleY, shape.circleR, shape.startAngle, shape.endAngle * Math.PI);
        ctx.fill();

        ctx.strokeStyle = shape.lineColor;
        ctx.lineWidth = shape.lineWidth;
        ctx.beginPath();
        ctx.moveTo(shape.lineX, shape.lineY);
        ctx.lineTo(shape.lineX1, shape.lineY1);
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
    if (player.left === true) {
        player.circleX -= player.xVelocity;
        player.lineX -= player.xVelocity;
        player.lineX1 -= player.xVelocity;
    }

    if (player.right === true) {
        player.circleX += player.xVelocity;
        player.lineX += player.xVelocity;
        player.lineX1 += player.xVelocity;
    }

    if (player.circleX < 0) {
        player.circleX = 0;
        player.lineX = 0;
        player.lineX1 = 0;
    } else if (player.circleX > cnv.width) {
        player.circleX = cnv.width;
        player.lineX = cnv.width;
        player.lineX1 = cnv.width;
    }
}

function playerShoot() {
    if (mouseIsPressed === true && player.reload === 0) {
        bullets.push(newBullet(player.circleX, player.circleY, 5, "white", 0, 2, -10));
        player.reload = 15;
    }
    player.reload--;

    if (player.reload < 0) {
        player.reload = 0;
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
            let d = Math.sqrt(run ** 2 + rise ** 2);
    
            if (d < bullets[n].r + circles[i].r) {
                circles.splice(i, 1);
                bullets.splice(n, 1);
                return;
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

    player = {
        circleX: canvasMidWidth,
        circleY: playerZoneMidHeight,
        circleR: 25,
        startAngle: 0,
        endAngle: 2,
        circleColor: "white",
        lineX: canvasMidWidth,
        lineY: playerZoneMidHeight,
        lineX1: canvasMidWidth,
        lineY1: playerZoneMidHeight - 25,
        lineWidth: 5,
        lineColor: "red",
        xVelocity: 5,
        left: false,
        right: false,
        shoot: false,
        reload: 0
    };

    bullets = [];
}