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

let howManyLines=0;
let howManyBeziers=0;
let howManyPolys=0;
let howManyCircles=0;
let howManyDots=0;
let howManyTriangles=0;
let allObjects = {"dots":[], "circles":[], "lines":[], "beziers":[], "polys":[], "triangles":[], "quads":[]};
let objectCount= {"dots":0, "circles":0, "lines":0, "beziers":0, "polys":0, "triangles":0, "quads":0};
let bezmaps=[]
let polyMaps=[]
let dots;
let startC, endC;
let lastObject;
let myFont;
let lastType=[];

function preload() {
  myFont = loadFont("Roboto.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  mic = new p5.AudioIn(); 
  mic.start(); // Load the library 
  pMapper = createProjectionMapper(this);
  k=0;
  textFont(myFont);
  // initialize empty lines
  
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
  for (const lineMap of allObjects.lines) {
    let c = lerpColor(startC, endC, index/allObjects.lines.length );
    lineMap.displayNumber();
    getLineMode(lineMap, index++, c);
  }
  for (const bezMap of allObjects.beziers) {
    let c = lerpColor(startC, endC, index/allObjects.beziers.length );
    bezMap.display(c);
  }
  for (const polyMap of allObjects.dots) {
    let c = lerpColor(startC, endC, index/allObjects.dots.length  );
    polyMap.display(c);
  }
  for (const polyMap of allObjects.circles) {
    let c = lerpColor(startC, endC, index/allObjects.circles.length );
    polyMap.display(c);
  } 0
  for (const polyMap of allObjects.triangles) {
    let c = lerpColor(startC, endC, index/allObjects.triangles.length );
    polyMap.display(c);
  }
  for (const polyMap of allObjects.quads) {
    let c = lerpColor(startC, endC, index/allObjects.quads.length );
    polyMap.display(c);
  }
  for (const polyMap of allObjects.polys) {
    let c = lerpColor(startC, endC, index/allObjects.polys.length );
    polyMap.display(c);
  }


  displayFrameRate();
}

function getLineMode(l, index, c) {
  let offset = (index / allObjects.lines.length) * 2 * PI;
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
function rainbow(pg) {
    pg.clear();
    pg.push();
    pg.background("pink");
    pg.colorMode(HSB, 255);
  
    for (let i = 0; i < 1000; i++) {
      pg.stroke(i % 255, 255, 255);
      pg.line(i, 0, i, 300);
    }
    pg.pop();
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

    case "0":
        //Create circleß
        console.log("creating dot");
        thisMap=pMapper.createBezierMap(4)
        lastObject=thisMap;
        console.log(thisMap);
        allObjects.circles.push(thisMap);
        objectCount.circles++;
        lastType.push("circles");ß
        break;
    case "1":
        console.log("creating dot");
        thisMap=pMapper.createBezierMap(2)
        lastObject=thisMap;
        allObjects.dots.push(thisMap);
        objectCount.dots++;
        lastType.push("dots");
        break;
        //create dot
    case "2":
       
            let lineMap = pMapper.createLineMap();
            

            lineMap.lineW =  prompt("Enter line width", "10");
            
            lastObject=lineMap;
            allObjects.lines.push(lineMap);
            objectCount.lines++;
            lastType.push("lines");
            
            break;
            
        
            // end cap display
            // lineMap.setEndCapsOff();
            // lineMap.setEndCapsOn();
          
        //create line
    case "3":
        thisMap=pMapper.createTriMap(100, 100)
        lastType.push("triangles");
        allObjects.triangles.push(thisMap);
        objectCount.triangles++;
        break;
        //create triangle
    case "4":
        allObjects.quads.push(pMapper.createQuadMap(100, 100));
        objectCount.quads++;
        lastType.push("quads");
        break;
        //create quad
    case "5":
        thisPoly=pMapper.createPolyMap(5)
        
        allObjects.polys.push(thisPoly);
        objectCount.polys++;
        lastType.push("polys");
        break;
        //create ploymap
    case "6":
            allObjects.polys.push(pMapper.createPolyMap(6));
            objectCount.polys++;
            lastType.push("polys");
            break;

    case "7":
        allObjects.polys.push(pMapper.createPolyMap(7));
        objectCount.polys++;
        lastType.push("polys");
        break;
        //create poly
    case "8":
        allObjects.polys.push(pMapper.createPolyMap(8));
        objectCount.polys++;
        lastType.push(   "polys");
        break;
        //create poly
    case "9":
        allObjects.beziers.push(pMapper.createBezierMap(6));
        objectCount.beziers++;
        lastType.push("beziers");
        break;
        //create bezier

    case "r":
        let thisJson = { surfaces: [], lines: [] };
        for (const surface of pMapper.surfaces) {
            thisJson.surfaces.push(surface.getJson());
          }
      
          for (const line of pMapper.lines) {
            thisJson.lines.push(line.getJson());
          }
          console.log(thisJson);
        localStorage.setItem("mapping", JSON.stringify(thisJson));
        localStorage.setItem("items", JSON.stringify(objectCount));
        break;
    case "p":
        objectCountLoad=JSON.parse(localStorage.getItem("items"));
        for (type in objectCountLoad) {
            console.log("objectCountType" + type);
            for (let i=0; i<objectCountLoad[type]; i++) {
                console.log("Creating " + type);
                if (type =="lines") {
                    allObjects.lines.push(pMapper.createLineMap());
                    objectCount.lines++;
                }
                else if (type =="beziers") {
                    allObjects.beziers.push(pMapper.createBezierMap(5));
                    objectCount.beziers++;
                }
                else if( type =="polys") { 
                    allObjects.polys.push(pMapper.createPolyMap(5));
                    objectCount.polys++;
                }
                else if (type =="triangles") {
                    allObjects.triangles.push(pMapper.createTriMap(100,100));
                    objectCount.triangles++;
                }
                else if (type =="quads") {
                    allObjects.quads.push(pMapper.createQuadMap(100,100));
                    objectCount.quads++;
                }
                else if (type =="dots") {
                    allObjects.dots.push(pMapper.createBezierMap(2));
                    objectCount.dots++;
                }
                else if (type =="circles") {
                    allObjects.circles.push(pMapper.createBezierMap(4));
                    objectCount.circles++;
                }
            }
            
        }
        console.log(allObjects);
        mapping=JSON.parse(localStorage.getItem("mapping"));
        console.log(mapping);
        pMapper.loadSurfaces(mapping);
        pMapper.loadLines(mapping);
        console.log(mapping);
        console.log(pMapper);
        console.log(objectCount);
        break;
    case "d":
        console.log("Deleting last object");
        toDelete=lastType.pop();
        allObjects[toDelete].pop();
        objectCount[toDelete]--;


        
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