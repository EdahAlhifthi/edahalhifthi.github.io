var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createCylinder(n, len, rad) {
// re-use the built-in CylinderGeometry
var geom = new THREE.CylinderGeometry(rad, rad, len, n, n, false);
return geom;
}
function createScene() {
var size = 10;
var geom = createCylinder(12, 6, 2);

var mat = new THREE.MeshLambertMaterial({color: "green", shading: THREE.FlatShading, side: THREE.DoubleSide, wireframe: true});

// create mesh
var mesh = new THREE.Mesh(geom, mat);
// lights
var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(1, 10,15);
var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(light);
scene.add(ambientLight);

// add to the scene
scene.add(mesh);
}

function init() {
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvasRatio = canvasWidth / canvasHeight;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.setSize(canvasWidth, canvasHeight);
// set the clear color to black, for our open box scene
renderer.setClearColor(0x000000, 1.0);

// set the camera position for looking at our open box
// and point the camera at our target
var target = new THREE.Vector3(0, 0, 0);
camera = new THREE.PerspectiveCamera(70, canvasRatio, 1, 1000);
camera.position.set(5, 0, 10);
camera.lookAt(target);
cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.target = target;
cameraControls.center = target;
}
// end
function animate() {
window.requestAnimationFrame(animate);
render();
}

function render() {
var delta = clock.getDelta();
cameraControls.update(delta);
renderer.render(scene, camera);
}

function addToDOM() {
var container = document.getElementById('container');
var canvas = container.getElementsByTagName('canvas');
if (canvas.length>0) {
    container.removeChild(canvas[0]);
}
container.appendChild( renderer.domElement );
}


try {
init();
createScene();
addToDOM();
render();
animate();
} catch(e) {
var errorMsg = "Error: " + e;
document.getElementById("msg").innerHTML = errorMsg;
}







