/**
 * Display a 3d color cube from red, green, blue arrays in cube container
 * @author mfe / https://github.com/mfe
 */

var controls,
    renderer,
    camera,
    scene,
    RED_INDEX=0,
    GREEN_INDEX=1,
    BLUE_INDEX=2;

/**
* Set triangle coords in BufferGeometry arrays
* @params {int k} triangle index
* @params {float x,y,z} cube coords
* @params {THREE.Vector3 va, vb, vc} triangle vertices relative positions
* @params {THREE.Color color} triangle color
* @params {arrays positions, normals, colors} BufferGeometry arrays
*/
function addTriangle(k, x, y, z, va, vb, vc, color, positions, normals, colors) {
    var t = new THREE.Vector3(),
        pA = new THREE.Vector3(),
        pB = new THREE.Vector3(),
        pC = new THREE.Vector3(),
        cb = new THREE.Vector3(),
        ab = new THREE.Vector3(),
        ax,
        ay,
        az,
        bx,
        by,
        bz,
        cx,
        cy,
        cz,
        nx,
        ny,
        nz,
        j;

    // positions
    t.set(x, y, z);
    pA.copy(t);
    pB.copy(t);
    pC.copy(t);

    pA.add(va);
    pB.add(vb);
    pC.add(vc);


    ax = pA.x;
    ay = pA.y;
    az = pA.z;

    bx = pB.x;
    by = pB.y;
    bz = pB.z;

    cx = pC.x;
    cy = pC.y;
    cz = pC.z;

    j = k * 9;

    positions[j] = ax;
    positions[j + 1] = ay;
    positions[j + 2] = az;

    positions[j + 3] = bx;
    positions[j + 4] = by;
    positions[j + 5] = bz;

    positions[j + 6] = cx;
    positions[j + 7] = cy;
    positions[j + 8] = cz;

    // normals
    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab);

    cb.normalize();

    nx = cb.x;
    ny = cb.y;
    nz = cb.z;

    normals[j] = nx;
    normals[j + 1] = ny;
    normals[j + 2] = nz;

    normals[j + 3] = nx;
    normals[j + 4] = ny;
    normals[j + 5] = nz;

    normals[j + 6] = nx;
    normals[j + 7] = ny;
    normals[j + 8] = nz;

    // colors
    colors[j] = color.r;
    colors[j + 1] = color.g;
    colors[j + 2] = color.b;

    colors[j + 3] = color.r;
    colors[j + 4] = color.g;
    colors[j + 5] = color.b;

    colors[j + 6] = color.r;
    colors[j + 7] = color.g;
    colors[j + 8] = color.b;
}

/**
* Add BufferGeometry Cube to GL scene
* @params {object datacube}
*/
function createBufferGeometry(datacube) {
    var cubes_nb = Math.pow(datacube.cubeSize, 3),
    // 12 triangles per cube (6 quads)
        triangles_nb = cubes_nb * 12,
        pointSize = (1.0 / datacube.cubeSize) / 4,
    // BufferGeometry with unindexed triangles
        geometry = new THREE.BufferGeometry(),
        positions,
        normals,
        colors,
    // Point size
        d = pointSize,
    //    .5------6
    //  .' |    .'|
    // 1---+--4'  |
    // |   |  |   |
    // |  ,7--+---8
    // |.'    | .'
    // 2------3'
        vertex1 = new THREE.Vector3(0, d, 0),
        vertex2 = new THREE.Vector3(0, 0, 0),
        vertex3 = new THREE.Vector3(d, 0, 0),
        vertex4 = new THREE.Vector3(d, d, 0),
        vertex5 = new THREE.Vector3(0, d, d),
        vertex6 = new THREE.Vector3(d, d, d),
        vertex7 = new THREE.Vector3(0, 0, d),
        vertex8 = new THREE.Vector3(d, 0, d),
    // index
        i,
        j,
    // coords
        x,
        y,
        z,
    // color
        color = new THREE.Color(),
        material,
        mesh;

    geometry.attributes = {
        position: {
            itemSize: 3,
            array: new Float32Array(triangles_nb * 3 * 3),
            numItems: triangles_nb * 3 * 3
        },
        normal: {
            itemSize: 3,
            array: new Float32Array(triangles_nb * 3 * 3),
            numItems: triangles_nb * 3 * 3
        },

        color: {
            itemSize: 3,
            array: new Float32Array(triangles_nb * 3 * 3),
            numItems: triangles_nb * 3 * 3
        }
    };
    positions = geometry.attributes.position.array;
    normals = geometry.attributes.normal.array;
    colors = geometry.attributes.color.array;

    for (i = 0; i < datacube.redValues.length; i += 1) {
        color.r = datacube.inputColors[i][RED_INDEX];
        color.g = datacube.inputColors[i][GREEN_INDEX];
        color.b = datacube.inputColors[i][BLUE_INDEX];
        x = datacube.redValues[i];
        y = datacube.greenValues[i];
        z = datacube.blueValues[i];
        j = i * 12;
        // quad 1
        addTriangle(j, x, y, z, vertex1, vertex2, vertex3, color, positions, normals, colors);
        addTriangle(j + 1, x, y, z, vertex3, vertex4, vertex1, color, positions, normals, colors);
        // quad 2
        addTriangle(j + 2, x, y, z, vertex1, vertex5, vertex6, color, positions, normals, colors);
        addTriangle(j + 3, x, y, z, vertex6, vertex4, vertex1, color, positions, normals, colors);
        // quad 3
        addTriangle(j + 4, x, y, z, vertex1, vertex5, vertex7, color, positions, normals, colors);
        addTriangle(j + 5, x, y, z, vertex7, vertex2, vertex1, color, positions, normals, colors);
        // quad 4
        addTriangle(j + 6, x, y, z, vertex5, vertex7, vertex8, color, positions, normals, colors);
        addTriangle(j + 7, x, y, z, vertex8, vertex6, vertex5, color, positions, normals, colors);
        //quad 5
        addTriangle(j + 8, x, y, z, vertex4, vertex6, vertex8, color, positions, normals, colors);
        addTriangle(j + 9, x, y, z, vertex8, vertex3, vertex4, color, positions, normals, colors);
        //quad 6
        addTriangle(j + 10, x, y, z, vertex7, vertex8, vertex3, color, positions, normals, colors);
        addTriangle(j + 11, x, y, z, vertex3, vertex2, vertex7, color, positions, normals, colors);
    }

    geometry.computeBoundingSphere();

    material = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
        ambient: 0xaaaaaa,
        specular: 0xffffff,
        shininess: 250,
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}


/** 
* Add Cube point to GL scene
* @params {object datacube}
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
    //addGLCube(datacube);

    // add triangulate cubes
    createBufferGeometry(datacube);

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
* Convert key names into js naming convention
* @params {object datacube}
*/
function convertNames(datacube) {
    return {
        cubeSize: datacube.cubesize,
        redValues: datacube.red_values,
        greenValues: datacube.green_values,
        blueValues: datacube.blue_values,
        inputColors: datacube.input_colors
    };
}

/** 
* Main function
* @params {object datacube}
*/
function displayCube(datacube) {
    // convert json datacube naming into js naming
    datacube = convertNames(datacube)
    initGL(datacube);
    animate();
}

// Display identity cube
$.getJSON('json/color_transformation_32.json', displayCube);
