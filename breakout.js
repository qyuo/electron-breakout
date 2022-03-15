let canvas = document.getElementById("breakoutGame"); let ctx = canvas.getContext("2d");
let hits = 0; let CURRENTLEVEL = 0;

hits = parseInt(localStorage.getItem("lastLevelHits"), 10);
CURRENTLEVEL = parseInt(localStorage.getItem("lvlNum"), 10);

if (hits==null || isNaN(hits)) hits=0; 
if (CURRENTLEVEL==null || isNaN(CURRENTLEVEL)) CURRENTLEVEL=0;
if (CURRENTLEVEL == 5)window.location.href = "win.html";
if (CURRENTLEVEL == 0) alert("The darker the block, the more health it has\n Red blocks are power ups and power downs \n The default health of a red block is 1 hit")

let LEVELS = [
    {
        lives: 5,
        paddleWidth: 75,
        brickRows: 3,
        xSpeed: 2,
        ySpeed: -2
    },
    {
        lives: 4,
        paddleWidth: 65,
        brickRows: 3,
        xSpeed: 2,
        ySpeed: -2
    },
    {
        lives: 3,
        paddleWidth: 55,
        brickRows: 4,
        xSpeed: 3,
        ySpeed: -3
    },
    {
        lives: 3,
        paddleWidth: 45,
        brickRows:4 ,
        xSpeed: 3,
        ySpeed: -3
    },
    {
        lives: 3,
        paddleWidth: 35,
        brickRows: 5,
        xSpeed: 4,
        ySpeed: -4
    }
]

let ballRadius = 8;
let x = canvas.width/2, y = canvas.height-55;
let xSpeed = LEVELS[CURRENTLEVEL].xSpeed; let ySpeed = LEVELS[CURRENTLEVEL].ySpeed;
let paddleWidth = LEVELS[CURRENTLEVEL].paddleWidth,paddleHeight = 10;
let paddleX = (canvas.width-paddleWidth)/2;
let lives = LEVELS[CURRENTLEVEL].lives; let randomNum;
let totalNeeded = hits; let level = CURRENTLEVEL+1; let healthColor; 
let paddleColor = "#0095DD";

// Power Ups + Downs

let powerUpChance, hasPower;
let POWERS = [
    {
        paddleWidth: paddleWidth - 10
    },
    {
        paddleWidth: paddleWidth + 10
    },
    {
        xSpeed: xSpeed+1,
        ySpeed: ySpeed-1
    },
    {
        xSpeed: xSpeed-0.5,
        ySpeed: ySpeed+0.5
    }
]

// Bricks

let bricks = [];
let brickCols = 5; let brickRows = LEVELS[CURRENTLEVEL].brickRows; 
let brickH = 18, brickW = 75;
let brickMargin = 10; let brickOL = 30, brickOT = 50;

for(let c=0; c<brickCols; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRows; r++) {
        let brickHealth = Math.floor((Math.random() * 3) + 1);
        totalNeeded += brickHealth;
        if(brickHealth == 3) healthColor = "#002f4d";
        if(brickHealth == 2) healthColor = "#0078c2";
        hasPower = false;
        if(brickHealth == 1) {
            powerUpChance = Math.floor((Math.random() * 3) + 1);
            if(powerUpChance != 2){
                healthColor = "#59bfff";
            }
            else {
                hasPower = true;
                healthColor = "#8b0000";
            }
        }
        bricks[c][r] = { x: 0, y: 0, alive: true, color: healthColor, health: brickHealth, power: hasPower};
    }
}

function brickHit() {
    for ( let c = 0; c < brickCols; c++) {
        for ( let r = 0; r < brickRows; r++) {
            let b = bricks[c][r];
            if (b.alive) {
                if (x > b.x && x < b.x + brickW && y > b.y && y < b.y + brickH) {
                    ySpeed = -ySpeed;
                    hits+=1;
                    b.health = b.health - 1;    
                  
                    if(b.health==0) b.alive=false;
                    if(b.health == 1) b.color = "#59bfff";
                    if(b.health == 2) b.color = "#0078c2";

                    if(b.power) {
                        powerUpChance = Math.floor(Math.random() * (5))
                        if (powerUpChance==1 || powerUpChance==0) {
                            paddleWidth = POWERS[powerUpChance].paddleWidth;
                            alert("Your paddle width has been changed");
                        }
                        else if (powerUpChance==4) {
                            paddleColor = "#222222";
                            alert("Your paddle is now transparent");
                        }
                        else {
                            xSpeed = POWERS[powerUpChance].xSpeed;
                            ySpeed = POWERS[powerUpChance].ySpeed;
                            if (xSpeed < 1 && ySpeed < 1){
                                xSpeed = 1;
                                ySpeed = -1;
                            }
                            alert("Your speed has been changed");
                        }
                    }
                    
                    if(hits == totalNeeded) {
                        alert("Level "+level+ " Completed");
                        CURRENTLEVEL+=1;
                        localStorage.setItem("lastLevelHits", hits);
                        localStorage.setItem("lvlNum", CURRENTLEVEL);
                        document.location.reload();
                        clearInterval(interval); 
                    }
                }
            }
        }
    }
}

// Mouse controls

let pointerX = -1;

document.onmousemove = function(event) {
	pointerX = event.pageX;
}

function pointerCheck() {
    return pointerX - paddleWidth/2 - paddleWidth/8
}

// Graphics

function drawPlayerInfo(){
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + hits, 75, 35);
    ctx.fillText("Level: " + level, 240, 35);
    ctx.fillText("Lives: " + lives, canvas.width/2 +160, 35);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#999999";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-(paddleHeight + 35), paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickCols; c++) {  
        for(let r=0; r<brickRows; r++) {
            if (bricks[c][r].alive) {
                let brickX = (c*(brickW+brickMargin))+brickOL;
                let brickY = (r*(brickH+brickMargin))+brickOT;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickW, brickH);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    brickHit();
    drawPlayerInfo();
    if(x + xSpeed > canvas.width-ballRadius || x + xSpeed < ballRadius) {
        xSpeed = -xSpeed;
    }
    if(y + ySpeed < ballRadius) {
        ySpeed = -ySpeed;
    }
    else if(y + ySpeed > canvas.height-(ballRadius+35+paddleHeight)) {
        if(x > paddleX && x < paddleX + paddleWidth && y < canvas.height-40) {
            ySpeed = -ySpeed;
        }
        if (y > canvas.height - 5) {
            lostLife();
        }
    }
    paddleX = pointerCheck() < canvas.width-paddleWidth ? pointerCheck() : canvas.width - paddleWidth;
    paddleX = paddleX < 0 ? 0 : paddleX;

    x += xSpeed;
    y += ySpeed;
}

function lostLife() {
    x = canvas.width/2; y = canvas.height-60; 
    xSpeed = LEVELS[CURRENTLEVEL].xSpeed; ySpeed = LEVELS[CURRENTLEVEL].ySpeed;
    paddleWidth = LEVELS[CURRENTLEVEL].paddleWidth;
    lives = lives - 1;
    paddleColor = "#0095DD";
    paddleX = (canvas.width-paddleWidth)/2;
    if(lives<1) window.location.href = "lose.html";
}

 let interval = setInterval(draw, 10);