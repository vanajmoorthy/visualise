var mass = [];
var posX = [];
var posY = [];
var velX = [];
var velY = [];
var ballColour = [];
var mic;

var displayText = false;
var hidePromptTime;

function preload() {
	font = loadFont("AirbnbCereal-Book.ttf");
}

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("sketch-holder");
	noStroke();

	mic = new p5.AudioIn();
	mic.start();
}

function draw() {
	background(67, 61, 80);
	push();

	let alpha = 255;

	if (hidePromptTime) {
		alpha = map(millis() - hidePromptTime, 0, 200, 255, 0);
	}

	fill(255, 255, 255, alpha);
	textFont(font);
	textSize(35);

	text(
		"Please click the screen to generate some balls.",
		windowWidth / 2 - 370,
		windowHeight / 2
	);

	pop();
	fill(255);

	for (var ballA = 0; ballA < mass.length; ballA++) {
		var accellX = 0,
			accelY = 0;

		for (var ballB = 0; ballB < mass.length; ballB++) {
			if (ballA != ballB) {
				var distanceX = posX[ballB] - posX[ballA];
				var distanceY = posY[ballB] - posY[ballA];

				var distance = sqrt(
					distanceX * distanceX + distanceY * distanceY
				);
				if (distance < 1) distance = 1;

				var force = ((distance - 255) * mass[ballB]) / distance;
				accellX += force * distanceX;
				accelY += force * distanceY;
			}
		}

		micLevel = mic.getLevel();
		console.log(micLevel);

		fill("fff");
		text(constrain(micLevel * 28, 0.1, 2.1), 10, 10);
		velX[ballA] = velX[ballA] * constrain(micLevel * 30, 0.1, 2.1) + accellX * mass[ballA];
		velY[ballA] = velY[ballA] * constrain(micLevel * 30, 0.1, 2.1) + accelY * mass[ballA];
	}

	for (var particle = 0; particle < mass.length; particle++) {
		posX[particle] = constrain(posX[particle] + velX[particle], 0, 1500);
		posY[particle] = constrain(posY[particle] + velY[particle], 0, 700);
		ballColour.push(color(random(0, 255), random(0, 255), random(0, 255)));
		fill(ballColour[particle]);
		ellipse(
			posX[particle],
			posY[particle],
			mass[particle] * 1000,
			mass[particle] * 1000
		);
	}
}

function addNewParticle() {
	if (!hidePromptTime) hidePromptTime = millis();
	mass.push(random(0.003, 0.03));
	posX.push(mouseX);
	posY.push(mouseY);
	velX.push(0);
	velY.push(0);
}

function mouseClicked() {
	addNewParticle();
}

function mouseDragged() {
	addNewParticle();
}

function touchStarted() {
	getAudioContext().resume();
}
