let canvas; // standard for JS -based games
let ctx; // refers to 'context' and refers to what happens on the canvas
let canvasWidth = 1400; // using tutorial values
let canvasHeight = 1000; // using tutorial values
let keys = [];

document.addEventListener('DOMContentLoaded', setupCanvas); // load page then execute first function

function setupCanvas() {
    canvas = document.getElementById('my-canvas'); // defined in html doc
    ctx = canvas.getContext('2d'); // 2d game
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // where the fill begins and ends
    // Below is how to manage multiple different key inputs at the same time - note this needs to be altered to event.key as keyCode is deprecated
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });

    render();
}

class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'black';
    }

    rotate(dir) {
        this.angle += this.rotateSpeed * dir;

    }

    update() {
        let radians = this.angle / Math.PI * 180; // converts degrees to radians
        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed; // cos and sin is trig: see tutorial from 0:12:00
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
        this.velX *= 0.99; // slows down the ship (less than 1)
        this.velY *= 0.99;

        this.x -= this.velX; // velocity now impacts x and y values
        this.y -= this.velY;
    }

    draw() {
            ctx.strokeStyle = this.strokeColor;
            ctx.beginPath(); // begin path paired with close path
            let vertAngle = ((Math.PI * 2) / 3) // vertAngle = "verticy angle"; PI * 2 = 360 degrees; divide by 3 because triangle
            let radians = this.angle / Math.PI * 180;
            for (let i = 0; i < 3; i++) { // 3 because triangle
                ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), 
                this.y - this.radius * Math.sin(vertAngle * i + radians)); // complicated but explained at 0:21:05 "taking 360 degrees, taking the three points, drawing the radius circle and draing the triangle"
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    let ship = new Ship();

    function render() {
        ship.movingForward = (keys[87]);
        if (keys[68]) {
            ship.rotate(1);
        }
        if (keys[65]) {
            ship.rotate(-1);
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ship.update();
        ship.draw();
        requestAnimationFrame(render);

    }



// Tutorial by Derek Banas available at https://youtu.be/HWuU5ly0taA

/* Modifications: 
1. Change functions to arrow functions
2. Change keyCodes to keyEvents
3. Change CSS and general visuals 
*/