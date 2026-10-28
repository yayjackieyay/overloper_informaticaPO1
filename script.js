
var raster = {
  aantalRijen: 12,
  aantalKolommen: 18,
  celGrootte: null,

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  },

  teken() {
    push();
    noFill();
    stroke('grey');

    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(kolom * this.celGrootte, rij * this.celGrootte,
          this.celGrootte, this.celGrootte);
      }
    }

    stroke('blue');
    strokeWeight(5);
    rect(0, 0, canvas.width, canvas.height);
    pop();
  }
};

var jos = {
  x: 0,
  y: 0,
  animatie: [],
  aantalFrames: 6,
  frameNummer: 3,
  stapGrootte: null,

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  },

  wordtGeraakt(vijand) {
    return this.x < vijand.x + raster.celGrootte &&
      this.x + raster.celGrootte > vijand.x &&
      this.y < vijand.y + raster.celGrootte &&
      this.y + raster.celGrootte > vijand.y;
  },

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y,
      raster.celGrootte, raster.celGrootte);
  }
};

var alice = {
  x: 0,
  y: 0,
  sprite: null,
  stapGrootte: null,

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  },

  toon() {
    image(this.sprite, this.x, this.y,
      raster.celGrootte, raster.celGrootte);
  }
};

var bob = {
  x: 0,
  y: 0,
  sprite: null,
  stapGrootte: null,

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  },

  toon() {
    image(this.sprite, this.x, this.y,
      raster.celGrootte, raster.celGrootte);
  }
};

var bom1 = {
  x: 0,
  y: 0,
  snelheid: 2,
  richting: 1,
  sprite: null,

  beweeg() {
    this.y += this.snelheid * this.richting;

    if (this.y <= 0 ||
        this.y >= canvas.height - raster.celGrootte) {
      this.richting = this.richting * -1;
    }
  },

  toon() {
    image(this.sprite, this.x, this.y,
      raster.celGrootte, raster.celGrootte);
  }
};

var bom2 = {
  x: 0,
  y: 0,
  snelheid: 4,
  richting: -1,
  sprite: null,

  beweeg() {
    this.y += this.snelheid * this.richting;

    if (this.y <= 0 ||
        this.y >= canvas.height - raster.celGrootte) {
      this.richting = this.richting * -1;
    }
  },

  toon() {
    image(this.sprite, this.x, this.y,
      raster.celGrootte, raster.celGrootte);
  }
};

var pingpongbal = {
  x: 0,
  y: 0,
  snelheidX: 3,
  snelheidY: 2,

  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;

    if (this.x <= 0 ||
        this.x >= canvas.width - raster.celGrootte) {
      this.snelheidX = this.snelheidX * -1;
    }

    if (this.y <= 0 ||
        this.y >= canvas.height - raster.celGrootte) {
      this.snelheidY = this.snelheidY * -1;
    }
  },

  toon() {
    fill('white');
    stroke('black');
    ellipse(this.x + raster.celGrootte / 2,
      this.y + raster.celGrootte / 2,
      raster.celGrootte * 0.6);
  }
};

var brug;
var canvas;
var spelStatus = 'bezig';
var achtergrondX = 0;

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");

  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  bom1.sprite = loadImage("images/sprites/bom.png");
  bom2.sprite = loadImage("images/sprites/bom.png");

  for (var b = 0; b < jos.aantalFrames; b++) {
    var frameJos = loadImage("images/sprites/Jos100px/Jos_" + b + ".png");
    jos.animatie.push(frameJos);
  }
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent('processing');
  frameRate(10);

  raster.berekenCelGrootte();

  jos.stapGrootte = raster.celGrootte;
  alice.stapGrootte = raster.celGrootte;
  bob.stapGrootte = raster.celGrootte;

  nieuwSpel();
}

function nieuwSpel() {
  jos.x = 0;
  jos.y = canvas.height - raster.celGrootte;

  alice.x = 5 * raster.celGrootte;
  alice.y = 3 * raster.celGrootte;

  bob.x = 9 * raster.celGrootte;
  bob.y = 6 * raster.celGrootte;

  // bommen in willekeurige kolommen rechts van het midden
  bom1.x = floor(random(10, 18)) * raster.celGrootte;
  bom2.x = floor(random(10, 18)) * raster.celGrootte;

  bom1.y = 0;
  bom2.y = canvas.height - raster.celGrootte;

  pingpongbal.x = 4 * raster.celGrootte;
  pingpongbal.y = 4 * raster.celGrootte;

  achtergrondX = 0;
  spelStatus = 'bezig';
  loop();
}

function eindScherm(bericht) {
  noStroke();

  if (bericht === 'gewonnen') {
    background('green');
    fill('white');
    textSize(36);
    textAlign(CENTER, CENTER);
    text('yay je hebt gewonnen!!', canvas.width / 2, canvas.height / 2);
  } else {
    background('red');
    fill('white');
    textSize(36);
    textAlign(CENTER, CENTER);
    text('volgende keer beter!', canvas.width / 2, canvas.height / 2);
  }
}

function draw() {
  if (spelStatus !== 'bezig') {
    return;
  }

  // bewegende achtergrond!!!
  image(brug, achtergrondX, 0, canvas.width, canvas.height);
  image(brug, achtergrondX + canvas.width, 0,
    canvas.width, canvas.height);

  achtergrondX -= 1;

  if (achtergrondX <= -canvas.width) {
    achtergrondX = 0;
  }

  raster.teken();

  jos.beweeg();
  alice.beweeg();
  bob.beweeg();
  bom1.beweeg();
  bom2.beweeg();
  pingpongbal.beweeg();

  jos.toon();
  alice.toon();
  bob.toon();
  bom1.toon();
  bom2.toon();
  pingpongbal.toon();

  // botsing met alice, bob of een bom is fataal
  if (jos.wordtGeraakt(alice) ||
      jos.wordtGeraakt(bob) ||
      jos.wordtGeraakt(bom1) ||
      jos.wordtGeraakt(bom2)) {
    spelStatus = 'verloren';
    eindScherm('verloren');
    noLoop();
    return;
  }

  // jos wint als hij de bovenkant bereikt!!
  if (jos.y <= 0) {
    spelStatus = 'gewonnen';
    eindScherm('gewonnen');
    noLoop();
  }
}

