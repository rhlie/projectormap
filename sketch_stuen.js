/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

// projection mapping objects
let pMapper;
const lineMaps = [];
let mic;
let sensitivity;
let sens;
let volHistory = [];
let allItems=[];
// line modes
let lineMode = 0;
const CENTER_PULSE = 0;
const DISPLAY = 1;
const LEFT_PULSE = 2;
const NUM_MODES = LEFT_PULSE + 1;

const howManyLines=25;
const howManyBeziers=5;
const howManyPolys=5;
let bezmaps=[]
let polyMaps=[]
let startC, endC;

let myFont;

function preload() {
  myFont = loadFont("Roboto.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  mic = new p5.AudioIn(); 
  mic.start(); // Load the library 
  pMapper = createProjectionMapper(this);
  k=0;
  // initialize empty lines
  for (let i = 0; i < howManyLines; i++) {
    let lineMap = pMapper.createLineMap();
    lineMaps.push(lineMap);

    // decrease line width for higher stairs (farther away)
    linewidth=4
    k=k+1
    if (k==1) {
        lineMap.lineW = linewidth;
    }
    if (k==2) {
        lineMap.lineW = linewidth*2;
    }
    if (k==3) {
        lineMap.lineW = linewidth*3;
    }
    if (k==4) {
        lineMap.lineW = linewidth*4;
        k=0;
    }
    

    textFont(myFont);

    // end cap display
    // lineMap.setEndCapsOff();
    // lineMap.setEndCapsOn();
  }
  for (let i=0; i < howManyBeziers; i++) {
    let bezMap = pMapper.createBezierMap();
    bezmaps.push(bezMap);
  }
  for (let i=0; i < howManyPolys; i++) {
    let polyMap = pMapper.createPolyMap(5);
    polyMaps.push(polyMap);
  }
  pMapper.load("maps/map.json");

  // initialize gradient colors
  setStartColors();
}

function draw() {
  background(0);
  var vol = mic.getLevel();
  
  cycleColors(100);
  cycleLineMode(2500);

  // display gradient lines
  let index = 0;
  for (const lineMap of lineMaps) {
    let c = lerpColor(startC, endC, index / howManyLines);
    lineMap.displayNumber();
    getLineMode(lineMap, index++, c);
  }
  for (const bezMap of bezmaps) {
    let c = lerpColor(startC, endC, index / howManyLines);
    bezMap.display(c);
  }
  for (const polyMap of polyMaps) {
    let c = lerpColor(startC, endC, index / howManyLines);
    polyMap.display(c);
  }

  displayFrameRate();
}

function getLineMode(l, index, c) {
  let offset = (index / howManyLines) * 2 * PI;
  let percent = pMapper.getOscillator(3, offset);
  switch (lineMode) {
    case LEFT_PULSE:
      l.displayPercent(percent, c);
      break;
    case CENTER_PULSE:
      l.displayCenterPulse(percent, c);
      break;
    case DISPLAY:
      l.display(c);
      break;
    case WIDTH_PULSE:
      l.displayPercentWidth(percent, c);
      break;
    default:
      l.display(c);
  }
}

function setStartColors() {
  colorMode(HSB, 100);
  startC = color(random(100), 100, 100);
  let endHue = (hue(startC) + random(25, 75)) % 100;
  endC = color(endHue, 100, 100);
  colorMode(RGB, 255);
}

function cycleColors(framesPerCycle) {
  if (frameCount % framesPerCycle === 0) {
    setStartColors();
  }
}

function cycleLineMode(framesPerCycle) {
  if (frameCount % framesPerCycle === 0) {
    lineMode++;
    lineMode %= NUM_MODES;
  }
}

function keyPressed() {
  switch (key) {
    case "c":
      pMapper.toggleCalibration();
      break;
    case "f":
      let fs = fullscreen();
      fullscreen(!fs);
      break;
    case "l":
      pMapper.load("maps/map.json");
      break;

    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
  fill(255);
  noStroke();
  text(round(frameRate()), -width / 2 + 50, -height / 2 + 50);
}