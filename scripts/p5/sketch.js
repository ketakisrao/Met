/// <reference path="../../p5/p5.js" />
//http://dollarakshay.com/particles.html


var canvas;

var maxParticles, particleBreakDistance, repelDist;
var particles = [];

function setup() {
    var canvas = createCanvas($('#p5-sketch-holder').width(), 600);
    canvas.parent('p5-sketch-holder');

    console.log("Canvas Size :" + width + "x" + height);
    //canvas.parent('mainCanvas');
    frameRate(15);
    stroke(255);

    maxParticles = 80;
    // repelDist = max(width, height)/8;
    particleBreakDistance = max(width, height) / 100;
    while (particles.length < maxParticles) {
        obj = [createVector(random(width), random(height)), createVector(random(4) - 2, random(4) - 2)];
        particles.push(obj);
    }
}

function drawParticles() {

    for (var i = 0; i < particles.length; i++) {
        var posi = particles[i][0];
        for (var j = i + 1; j < particles.length; j++) {
            var posj = particles[j][0];
            var dist = posi.dist(posj);
            if (dist <= particleBreakDistance) {
                strokeWeight(0.5);
                 // stroke(100*(posi.x/width), 90, 90, 255 - 255*dist/particleBreakDistance );
                stroke(0);
                line(posi.x, posi.y, posj.x, posj.y);
            }
        }
    }

    // colorMode(RGB, 255);
    // colorMode(HSB, 100);
    fill(0);
    noStroke();

    //var mousePos = createVector(mouseX, mouseY);

    for (var i = 0; i < particles.length; i++) {
        var pos = particles[i][0];
        var speed = particles[i][1];
        var randSize = 3 + random(4);
        // var d = (pos.x,pos.y,width/2,height/2);
        ellipse(pos.x, pos.y, randSize, randSize);
        pos.add(speed);

        //var distToMouse = mousePos.dist(pos);

//         if (distToMouse < repelDist) {
//             var repel = createVector(pos.x - mousePos.x, pos.y - mousePos.y);
//             var distFrac = (repelDist - distToMouse) / repelDist
//             repel.setMag(50 * distFrac * distFrac);
//             pos.add(repel);
//         }

        if (pos.x > width) {
            pos.x -= width;
            pos.y += random(height / 10) - height / 20;
        }
        else if (pos.x < 0) {
            pos.x += width;
            pos.y += random(height / 10) - height / 20;
        }

        if (pos.y > height) {
            pos.y -= height;
            pos.x += random(width / 10) - width / 20;
        }
        else if (pos.y < 0) {
            pos.y += height;
            pos.x += random(width / 10) - width / 20;
        }
        // else if(d< 150){
        //     pos.x += random(width / 10) - width / 20;
        //     pos.y += random(height / 10) - height / 20;
        // }
    }

}

function draw() {

    background(255);

    drawParticles();
    particleBreakDistance = min(particleBreakDistance + 1, width / 12);


}
