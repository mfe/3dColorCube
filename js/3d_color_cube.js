/**
 * Display a 3d color cube from red, green, blue arrays in cube container
 * @author mfe / https://github.com/mfe
 */

/**
* Get identity cube values (test purpose) 
* @return {object datacube} Return cubsize, red, green, blue values and 
* corresponding input colors
*/
function getIdentityCube() {
    var cubeSize = 32,
        maxValue = cubeSize - 1.0,
        redValues = [],
        greenValues = [],
        blueValues = [],
        inputColors = [],
        r,
        g,
        b,
        normR,
        normG,
        normB;
    for (r = 0; r < cubeSize; r += 1) {
        for (g = 0; g < cubeSize; g += 1) {
            for (b = 0; b < cubeSize; b += 1) {
                normR = r / maxValue;
                normG = g / maxValue;
                normB = b / maxValue;
                redValues.push(normR);
                greenValues.push(normG);
                blueValues.push(normB);
                inputColors.push({
                    r: normR,
                    g: normG,
                    b: normB
                });
            }
        }
    }
    return {
        cubeSize: cubeSize,
        redValues: redValues,
        greenValues: greenValues,
        blueValues: blueValues,
        inputColors: inputColors
    };
}

var controls,
    renderer,
    camera,
    scene;

/** 
* Add Cube point to GL scene
* @params {object datacube}
* @params {object scene}
*/
function addGLCube(datacube) {
    var pointSize = (1.0 / datacube.cubeSize) / 4,
        // Create default wireframe material
        wireMat = new THREE.MeshBasicMaterial({ color: 0x000000,
                                                wireframe: true,
                                                wireframeLinewidth: pointSize / 10
                                            }),
        colorMat,
        geometry = new THREE.CubeGeometry(pointSize, pointSize, pointSize),
        index,
        color = new THREE.Color(),
        colorPoint;
    for (index = 0; index < datacube.redValues.length; index += 1) {
        color.r = datacube.inputColors[index].r;
        color.g = datacube.inputColors[index].g;
        color.b = datacube.inputColors[index].b;
        colorMat = new THREE.MeshBasicMaterial({ color: color.getHex() });
        colorPoint = THREE.SceneUtils.createMultiMaterialObject(geometry,
            [colorMat, wireMat]);
        colorPoint.position.x = (datacube.redValues[index]);
        colorPoint.position.y = (datacube.greenValues[index]);
        colorPoint.position.z = datacube.blueValues[index];
        scene.add(colorPoint);
    }
}

/** 
* Add init GL scene
* @params {object datacube}
*/
function initGL(datacube) {
    // set the scene size and camera attributes
    var WIDTH = 600,
        HEIGHT = 600,
        VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    // create a WebGL renderer, camera
    // and a scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
                                ASPECT,
                                NEAR,
                                FAR);
    scene = new THREE.Scene();
    // move mouse and: left   click to rotate, 
    //                 middle click to zoom, 
    //                 right  click to pan
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 2;
    renderer.sortObjects = false;
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    // attach the render-supplied DOM element
    document.getElementById("cube").appendChild(renderer.domElement);

    // add Cube
    addGLCube(datacube, scene);

    // add camera
    scene.add(camera);

    // add light to the scene
    scene.add(new THREE.HemisphereLight());

}

function render() {
    renderer.render(scene, camera);
}

function update() {
    controls.update();
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

/** 
* Main function
* @params {object datacube}
*/
function displayCube(datacube) {
    initGL(datacube);
    animate();
}

// Display identity cube
displayCube(getIdentityCube());
