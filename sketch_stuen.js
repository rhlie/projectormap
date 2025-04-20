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
let allItems = [];
// line modes
let lineMode = 0;
const CENTER_PULSE = 0;
const DISPLAY = 1;
const LEFT_PULSE = 2;
const NUM_MODES = LEFT_PULSE + 1;

let howManyLines = 0;
let howManyBeziers = 0;
let howManyPolys = 0;
let howManyCircles = 0;
let howManyDots = 0;
let howManyTriangles = 0;
let allObjects = { "dots": [], "circles": [], "lines": [], "beziers": [], "polys": [], "polys4": [], "polys5": [], "polys6": [], "polys7": [], "triangles": [], "quads": [] };
let objectCount = { "dots": 0, "circles": 0, "lines": 0, "beziers": 0, "polys4": 0, "polys5": 0, "polys6": 0, "polys7": 0, "triangles": 0, "quads": 0 };
let bezmaps = []
let polyMaps = []

let startC, endC;
let lastObject;
let myFont;
let lastType = [];
let displayLineNumbers = true;
let soundSensitivity = 2;


function preload() {
    myFont = loadFont("Roboto.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    mic = new p5.AudioIn();
    mic.start(); // Load the library 
    pMapper = createProjectionMapper(this);
    k = 0;
    textFont(myFont);
    // initialize empty lines

    pMapper.load("maps/map.json");

    // initialize gradient colors
    setStartColors();
}

function draw() {
    background(0);
    var vol = mic.getLevel();

    cycleColors(1000);
    

    // display gradient lines
    let index = 0;
    for (const lineMap of allObjects.lines) {
        myDisplay(lineMap, "line", index)
        index++;
    }
    for (const bezMap of allObjects.beziers) {
       myDisplay(bezMap, "surface")
    }
    for (const polyMap of allObjects.dots) {
        myDisplay(polyMap, "surface")
    }
    for (const polyMap of allObjects.circles) {
        myDisplay(polyMap, "surface")
    }
    for (const polyMap of allObjects.triangles) {
        myDisplay(polyMap, "surface")

    }
    for (const polyMap of allObjects.quads) {
        myDisplay(polyMap, "surface")
    }
    for (const polyMap of allObjects.polys) {
        myDisplay(polyMap, "surface")
    }
    for (const polyMap of allObjects.polys4) {
        myDisplay(polyMap, "surface")
    }
    for (const polyMap of allObjects.polys5) {
        myDisplay(polyMap, "surface")
    }
    for (const polyMap of allObjects.polys6) {
        myDisplay(polyMap, "surface")
    }
    for (const polyMap of allObjects.polys7) {
        myDisplay(polyMap, "surface")
    }


    displayFrameRate();
}
function myDisplay(map, type = "surface", index=0) {

    displayControl = {
        "line":
        {
            "-1": { "display_mode": "center_pulse", "ocilator": "oscilate", "color": lerpColor(startC, endC, map.id/allObjects.lines.length ), group: "lines" },
            "0": { "display_mode": "display",  "ocilator": "oscilate","color": lerpColor(startC, endC, map.id/allObjects.lines.length) ,  group: "lines"},
            "1": { "display_mode": "side_pulse",  "ocilator": "oscilate","color": lerpColor(startC, endC, map.id/allObjects.lines.length),  group: "lines" },
            "2": { "display_mode": "width_pulse",  "ocilator": "oscilate","color": lerpColor(startC, endC,map.id/allObjects.lines.length) ,  group: "lines"}
        },
        "surface":
        {
            "-1": { "display_mode": "display",  "color": lerpColor(startC, endC,0.5), "display_contents": dots, "group": "eyes" },
            "0": { "display_mode": "display",  "color": color("red"),  "display_contents": rainbow, "group": "eyes"  },
            "1": { "display_mode": "sketch",  "color": color("green"),"display_contents": rainbow ,"group": "eyes" },
            "2": { "display_mode": "sketch", "color": color("blue"), "display_contents": dots,"group": "eyes" }
        }
    }

    if (type == "line" && showLineNumber) {
       
        map.displayNumber();
       

    }
    if (type == "surface" && showLineNumber) {
        showLineNumber(map);
    }
    thisId = map.id.toString();
    if (thisId in displayControl[type] == false) {
        
        thisId= "-1";
    }
    currentConfig= displayControl[type][thisId];
    if (type == "line") {
        
        //map.display(currentConfig.color);
        
        map.displayNumber();
        let offset = (index / 9) * 2 * PI;
        let percent = pMapper.getOscillator(3, offset);
        if (currentConfig.ocilator == "sound") {
            percent = mic.getLevel() * soundSensitivity;
        }
        offset=  (index / allObjects.lines.length) * 2 * PI;
        if (currentConfig.display_mode == "display") {
            map.display(currentConfig.color);
        }
        else if (currentConfig.display_mode == "center_pulse") {
            map.displayCenterPulse(percent, currentConfig.color);
        }
        else if (currentConfig.display_mode == "side_pulse") {
            map.displayPercent(percent, currentConfig.color);
        }
        else if (currentConfig.display_mode == "width_pulse") {
            map.displayPercentWidth(percent, currentConfig.color);
        }
        
    }
    else {
        
        if (currentConfig.display_mode == "display") {
            map.display(currentConfig.color);
        }
        else if (currentConfig.display_mode == "texture") {
            map.displayTexture(currentConfig.display_contents);
        }
        else if (displayControl.surface[thisId].display_mode == "sketch") {
            map.displaySketch(currentConfig.display_contents);
        }
    }




}


function getLineMode(l, index, c) {
    let offset = (index / allObjects.lines.length) * 2 * PI;
    let percent = pMapper.getOscillator(3, offset);
    percent = mic.getLevel() * soundSensitivity;
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

function showLineNumber(instance) {
    if (displayLineNumbers) {
        instance.pInst.push();
        instance.pInst.translate(instance.x + 20, instance.y + 5, 2);
        instance.pInst.textAlign(instance.pInst.CENTER, instance.pInst.CENTER);

        instance.pInst.noStroke();

        instance.pInst.fill(255, 0, 0);
        instance.pInst.ellipse(0, 0, 10, 10);

        instance.pInst.fill(255);
        instance.pInst.text(instance.id.toString(), 0, 0);

        instance.pInst.pop();
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


function drawCoords(pg) {
    pg.clear();
    pg.push();
    pg.background(0, 255, 0);
    pg.fill(0);

    for (let i = 0; i < 1000; i += 50) {
        pg.text(i, i, 150);
        pg.text(i, 150, i);
    }
    pg.fill(255);
    pg.ellipse(mouseX, mouseY, 50);
    pg.pop();
}

function dots(pg) {
    randomSeed(0);
    pg.clear();
    pg.push();
    pg.background("pink");
    pg.fill(255);
    pg.noStroke();
    for (let i = 0; i < 60; i++) {
        pg.ellipse(random(), random(), random(10, 80));
    }
    pg.pop();
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


        case "0":
            //Create circle
            
            thisMap = pMapper.createBezierMap(4)
            lastObject = thisMap;
            
            allObjects.circles.push(thisMap);
            objectCount.circles++;
            lastType.push("circles");
            break;
        case "1":
            console.log("creating dot");
            thisMap = pMapper.createBezierMap(2)
            lastObject = thisMap;
            allObjects.dots.push(thisMap);
            objectCount.dots++;
            lastType.push("dots");
            break;
        //create dot
        case "2":

            let lineMap = pMapper.createLineMap();


            lineMap.lineW = prompt("Enter line width", "10");

            lastObject = lineMap;
            allObjects.lines.push(lineMap);
            objectCount.lines++;
            lastType.push("lines");

            break;


        // end cap display
        // lineMap.setEndCapsOff();
        // lineMap.setEndCapsOn();

        //create line
        case "3":
            thisMap = pMapper.createTriMap(100, 100)
            lastType.push("triangles");
            allObjects.triangles.push(thisMap);
            objectCount.triangles++;
            break;
        //create triangle
        case "4":
            thisPoly = pMapper.createPolyMap(4)

            allObjects.polys4.push(thisPoly);
            objectCount.polys4++;
            lastType.push("polys4");
            break;
        //create quad
        case "5":
            thisPoly = pMapper.createPolyMap(5)

            allObjects.polys5.push(thisPoly);
            objectCount.polys5++;
            lastType.push("polys5");
            break;
        //create ploymap
        case "6":
            allObjects.polys6.push(pMapper.createPolyMap(6));
            objectCount.polys6++;
            lastType.push("polys6");
            break;

        case "7":
            allObjects.polys7.push(pMapper.createPolyMap(7));
            objectCount.polys7++;
            lastType.push("polys7");
            break;
        //create poly
        case "8":
            allObjects.quads.push(pMapper.createQuadMap(100, 100));
            objectCount.quads++;
            lastType.push("quads");

            break;
        //create poly
        case "9":
            allObjects.beziers.push(pMapper.createBezierMap(6));
            objectCount.beziers++;
            lastType.push("beziers");
            break;
        //create bezier

        case "s":
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
            saveItem = { "mapping": thisJson, "items": objectCount };
            JSON.stringify(saveItem);
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveItem));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "settings.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            break;
        case "r":
            objectCountLoad = JSON.parse(localStorage.getItem("items"));
            for (type in objectCountLoad) {
                console.log("objectCountType" + type);
                for (let i = 0; i < objectCountLoad[type]; i++) {
                    console.log("Creating " + type);
                    if (type == "lines") {
                        allObjects.lines.push(pMapper.createLineMap());
                        objectCount.lines++;
                    }
                    else if (type == "beziers") {
                        allObjects.beziers.push(pMapper.createBezierMap(5));
                        objectCount.beziers++;
                    }
                    else if (type == "polys4") {
                        allObjects.polys.push(pMapper.createPolyMap(4));
                        objectCount.polys4++;
                    }
                    else if (type == "polys5") {
                        allObjects.polys.push(pMapper.createPolyMap(5));
                        objectCount.polys5++;
                    }
                    else if (type == "polys6") {
                        allObjects.polys.push(pMapper.createPolyMap(6));
                        objectCount.polys6++;
                    }
                    else if (type == "polys7") {
                        allObjects.polys.push(pMapper.createPolyMap(7));
                        objectCount.polys7++;
                    }
                    else if (type == "triangles") {
                        allObjects.triangles.push(pMapper.createTriMap(100, 100));
                        objectCount.triangles++;
                    }
                    else if (type == "quads") {
                        allObjects.quads.push(pMapper.createQuadMap(100, 100));
                        objectCount.quads++;
                    }
                    else if (type == "dots") {
                        allObjects.dots.push(pMapper.createBezierMap(2));
                        objectCount.dots++;
                    }
                    else if (type == "circles") {
                        allObjects.circles.push(pMapper.createBezierMap(4));
                        objectCount.circles++;
                    }
                }

            }
            console.log(allObjects);
            mapping = JSON.parse(localStorage.getItem("mapping"));
            console.log(mapping);
            pMapper.loadSurfaces(mapping);
            pMapper.loadLines(mapping);
            console.log(mapping);
            console.log(pMapper);
            console.log(objectCount);
            break;
        case "d":
            console.log("Deleting last object");

            console.log(pMapper.surfaces)
            console.log(pMapper.lines)
            toDelete = lastType.pop();
            allObjects[toDelete].pop();
            objectCount[toDelete]--;

            if (toDelete == "lines") {
                pMapper.lines.pop();
            }
            else {
                pMapper.surfaces.pop();
            }
            break;
        case "l":
            if (displayLineNumbers) {
                displayLineNumbers = false;
            }
            else {
                displayLineNumbers = true;
            }

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