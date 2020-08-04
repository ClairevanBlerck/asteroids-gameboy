let canvas; // standard for JS -based games
let ctx; // refers to 'context' and refers to what happens on the canvas
let canvasWidth = 1400; // using tutorial values
let canvasHeight = 1000; // using tutorial values
let ship; // using ship constructor, works with setupCanvas "ship = new Ship()"
let keys = []; // is array because multiple keys
let bullets = []; // is array because appears multiple times, uses class constructor
let asteroids = []; // is array because appears multiple times, uses class constructor
let score = 0;
let lives = 3;

document.addEventListener('DOMContentLoaded', setupCanvas); // load page then execute first function

function setupCanvas() {
    canvas = document.getElementById('my-canvas'); // defined in html doc
    ctx = canvas.getContext('2d'); // 2d game
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // where the fill begins and ends
    // Below is how to manage multiple different key inputs at the same time - note this needs to be altered to event.key as keyCode is deprecated
    ship = new Ship(); // create ship using constructor

    for(let i = 0; i < 8; i++) {
        asteroids.push(new Asteroid()); // uses constructor and pushes 8 asteroids
    }

    // keys section - to be edited to key.event
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
        if(e.keyCode === 32) {
            bullets.push(new Bullet(ship.angle)); // if space is pressed a bullet will push out the nose at the angle of the ship
        }
    });

    render();
}

class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2; // start position in exact centre
        this.y = canvasHeight / 2; // start position in exact centre
        this.movingForward = false;
        this.speed = 0.1; // can be adjusted
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001; // can be adjusted
        this.radius = 15; // can be adjusted
        this.angle = 0;
        this.strokeColor = 'black';
        this.noseX = canvasWidth / 2 + 15; // noseX and noseY added when bullets constructor written, this determines where the bullets originate from / "Where is nose?""
        this.noseY = canvasWidth / 2; // as above
    }

    rotate(dir) {
        this.angle += this.rotateSpeed * dir;

    }

    update() {
        let radians = this.angle / Math.PI * 180; // converts degrees to radians
        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed; // cos and sin is trig: see tutorial from 0:12:00
            this.velY += Math.sin(radians) * this.speed; // as above
        }
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
        this.velX *= 0.99; // slows down the ship (less than 1)
        this.velY *= 0.99; // as above

        this.x -= this.velX; // velocity now impacts x and y values
        this.y -= this.velY; // as above
    }

    draw() {
            ctx.strokeStyle = this.strokeColor;
            ctx.beginPath(); // begin path paired with close path
            let vertAngle = ((Math.PI * 2) / 3) // vertAngle = "verticy angle"; PI * 2 = 360 degrees; divide by 3 because triangle
            let radians = this.angle / Math.PI * 180;
            this.noseX = this.x - this.radius * Math.cos(radians); // noseX and noseY added when bulletts constructor added - defines where bulletts originate from as the ship moves and is redrawn. 
            this.noseY = this.y - this.radius * Math.sin(radians); // as above
            for (let i = 0; i < 3; i++) { // 3 because triangle
                ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), 
                this.y - this.radius * Math.sin(vertAngle * i + radians)); // complicated but explained at 0:21:05 "taking 360 degrees, taking the three points, drawing the radius circle and draing the triangle"
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    class Bullet {
        constructor(angle) { // ship angle needed for bullet trajectory
            this.visible = true;
            this.x = ship.noseX; // bullets origin moves as ship moves, so this changes as the ship is redrawn.
            this.y = ship.noseY; // as above
            this.angle = angle; // passed in as each bullet is created
            this.height = 4; // height & width is 4px, folling tutorial dims
            this.width = 4; // as above
            this.speed = 5; // can be altered
            this.velX = 0; // starts at 0
            this.velY = 0; // as above
        }

        update() {
            let radians = this.angle / Math.PI * 180; // same as in ship constructor's draw()
            this.x -= Math.cos(radians) * this.speed; // bullet follows trajectory using this formula??
            this.y -= Math.sin(radians) * this.speed; // as above
        }

        draw() {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, this.width, this.height); // again, style uses this. so it can be modified via constructor(angle) above

        }
    }

    class Asteroid { // asteroids spawn at level 1 (largest) to level 3 (smallest)
        constructor(x, y, radius, level, collisionRadius) {
            this.visible = true;
            this.x = x || Math.floor(Math.random() * canvasWidth); // ensures asteroids stay in game board area, uses 'x' to mark location for level 2 and 3 asteroids spawn
            this.y = y || Math.floor(Math.random() * canvasHeight); // as above
            this.speed = 5; // can be altered
            this.radius = radius || 50; // bigger than ship, so can be blown up into reasonabley sized pieces, uses 'radius' for level 2 and 3 asteroids
            this.angle = Math.floor(Math.random() * 359) // random angles to make them look different
            this.strokeColor = 'black';
            this.collisionRadius = collisionRadius || 46 // 46 is lower than this.radius = 50, creates smaller asteroid
            this.level = level || 1;
        }

        update() {
            let radians = this.angle / Math.PI * 180; // same as in ship constructor's draw()
            this.x += Math.cos(radians) * this.speed; // asteroid follows trajectory using this formula?? "increases exposition"
            this.y -= Math.sin(radians) * this.speed; // as above
            if (this.movingForward) { // this is copy-pasted from ship update() - makes sure asteroid moves from screen edge left to enter on right etc
                this.velX += Math.cos(radians) * this.speed; 
                this.velY += Math.sin(radians) * this.speed;
            }
            if (this.x < this.radius) {
                this.x = canvas.width;
            }
            if (this.x > canvas.width) {
                this.x = this.radius;
            }
            if (this.y < this.radius) {
                this.y = canvas.height;
            }
            if (this.y > canvas.height) {
                this.y = this.radius;
            }
        }

        draw() { // uses same as ship/triangle because both are polygons
            ctx.beginPath();
            let vertAngle = ((Math.PI * 2) / 6); // 6 because hexagon
            let radians = this.angle / Math.PI * 180;
            for (let j = 0; j < 6; j++) { // 6 because hexagon
                ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * j + radians), 
                this.y - this.radius * Math.sin(vertAngle * j + radians)); // complicated but explained at 0:21:05 "taking 360 degrees, taking the three points, drawing the radius circle and draing the triangle"
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    function circleCollision(p1x, p1y, r1, p2x, p2y, r2) { // this function controls asteroids level 1 and 2 collisions - see 0:42:00
        let radiusSum;
        let xDiff;
        let yDiff;
        radiusSum = r1 + r2;
        xDiff = p1x - p2x;
        yDiff = p1y - p2y;
        if(radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * xDiff))) { // I don't know what any of this means
            return true; 
        } else {
            return false;
        }
    }

    function drawLives() { // draws lives, represented by ships, on screen
        let startX = 1350; // 1350px is where the lives will appear
        let startY = 10;
        let points = [[9, 9], [-9, 9]]; // point represent triangles - how I don't know
        ctx.strokeStyle = 'black';
        for(let i = 0; i > lives; i++) {
            ctx.beginPath()
            ctx.moveTo(startX, startY);
            for(let j = 0; j < points.length; j++) {
                ctx.lineTo(startX + points[j][0], startY + points[j][1]);
            }
            ctx.closePath();
            ctx.stroke(); // actually draws the stroke on screen?
            startX -= 30; // move from right to left of screen?
        }
    }

    function render() {
        ship.movingForward = (keys[87]);
        if (keys[68]) {
            ship.rotate(1);
        }
        if (keys[65]) {
            ship.rotate(-1);
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        // score and lives
        ctx.fillStyle = 'black';
        ctx.font = '21px Arial';
        ctx.fillText('SCORE: ' + score.toString(), 20, 35) // '20' is x value, '35' is y value

        if(lives <= 0) {
            ship.visible = false;
            ctx.fillStyle = 'black';
            ctx.font = '50px Arial';
            ctx.fillText('GAME OVER: ' + score.toString(), canvasWidth / 2 - 150, canvasHeight / 2);
        }
        drawLives()

        // check for collisions between ship & asteroid
        if(asteroids.length !== 0) { // check if we have asteroids
            for(let k = 0; k < asteroids.length; k++) { 
                if(circleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)) { // '11' is collision-radius of ship, checks if there was a collission between ship & asteroid - see 0:50:00
                    ship.x = canvasWidth / 2; // ship move to middle of screen (new life)
                    ship.y = canvasHeight / 2;
                    ship.velX = 0; // starts from no engine power (new life)
                    ship.velY = 0;
                    lives -= 1; // you loose a life
                }
            }
        }

        // check for collisions between asteroid & bullet
        if(asteroids.length !== 0 && bullets.length !== 0) { // we're going to be changing the value of the array while cycling through the array 0:51:30
    loop1: // break out of nested for loops
            for(let l = 0; l < asteroids.length; l++) {
                for(let m = 0; m < bullets.length; m++) {
                    if(circleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)) {
                        if(asteroids[l].level === 1) { // if asteroid is level 1
                            asteroids.push(new Asteroid(asteroids[l].x - 5, // move new asteroid from where it was
                                asteroids[l].y - 5 , 25, 2, 22)); // make new asteroid, change size (22 is collisionRadius)
                            asteroids.push(new Asteroid(asteroids[l].x + 5, // move new asteroid from where it was
                                asteroids[l].y + 5 , 25, 2, 22)); // make new asteroid, change size
                        } else if(asteroids[l].level === 2) { // if asteroid is level 2
                            asteroids.push(new Asteroid(asteroids[l].x - 5, // move new asteroid from where it was
                                asteroids[l].y - 5 , 15, 2, 12)); // make new asteroid, change size (15 is radius of actual asteroid)
                            asteroids.push(new Asteroid(asteroids[l].x + 5, // move new asteroid from where it was
                                asteroids[l].y + 5 , 15, 2, 12)); // make new asteroid, change size
                        }
                        asteroids.splice(l, 1); //splices out original asteroid
                        bullets.splice(m, 1); //splices out original bullet
                        score += 10;
                        break loop1; // break out of loop
                    }
                }
            }
        }

        // bulllets and asteroids
        if(ship.visible) {
            ship.update();
            ship.draw();
        }

        if(bullets.length !== 0) { // not sure what this section does tbh but it seems to update the bullets as the ship moves?
            for(let i = 0; i < bullets.length; i++) {
                bullets[i].update()
                bullets[i].draw();
            }
        }

        if(asteroids.length !== 0) { // not sure what this section does tbh?
            for(let j = 0; j < asteroids.length; j++) {
                asteroids[j].update()
                asteroids[j].draw(j); // allows us to track which asteroid
            }
        }
        requestAnimationFrame(render);
    }



// Tutorial by Derek Banas available at https://youtu.be/HWuU5ly0taA

/* Modifications: 
1. Change functions to arrow functions
2. Change keyCodes to keyEvents
3. Change CSS and general visuals 
*/