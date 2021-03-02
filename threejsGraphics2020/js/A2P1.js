

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let mat, starRing, starsPerSide;
let trans = 20;

function starburstA(maxRays, maxRad) {
    let rad = 0.5;   // had been rad = 10?????
    let origin = new THREE.Vector3(0, 0, 0);
    let innerColor = getRandomColor(0.8, 0.1, 0.8);
    let black = new THREE.Color(0x000000);
    let geom = new THREE.Geometry();
    let nbrRays = getRandomInt(1, maxRays);
    for (let i = 0; i < nbrRays; i++) {
        let r = rad * getRandomFloat(0.1, maxRad);
        let dest = getRandomPointOnSphere(r);
        geom.vertices.push(origin, dest);
        geom.colors.push(innerColor, black);
    }
    let args = {vertexColors: true, linewidth: 2};
    let mat = new THREE.LineBasicMaterial(args);
    return new THREE.Line(geom, mat, THREE.LineSegments);
}



function createRing(obj, n, t) {
    let root = new THREE.Object3D();
    let angleStep = 2 * Math.PI / n;
    for (let i = 0, a = 0; i < n; i++, a += angleStep) {
        let s = new THREE.Object3D();
        s.rotation.y = a;
        let m = obj.clone();
        m.position.z = t;
        s.add(m);
        root.add(s);
    }
    return root;
}

function createScene() {
    starsPerSide = 20;
    let starMatrix = starburstA(starsPerSide, starsPerSide, starsPerSide, starsPerSide);
    starRing = createRing(starMatrix, 15, trans);
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light.position.set(0, 0, 10);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(starRing);
    scene.add(light);
    scene.add(ambientLight);
}

var controls = new function() {
    this.burstRadius = 0.5;
    this.maxRays = 20;
    this.Go = updateRing;
}


function animate() {
    window.requestAnimationFrame(animate);
    render();
}


function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);
    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, 40, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}
function initGui() {
    let gui = new dat.GUI();
    gui.add(controls, 'burstRadius', 0.1, 5.0).name('Burst radius').onChange(updateRing);;
    gui.add(controls, 'maxRays', 5, 200).name('Max nbr of rays').step(1).onChange(updateRing);

    gui.add(controls, 'Go');
}




function updateRing() {
    let burstRadius = controls.burstRadius;
    let maxRays = controls.maxRays;
    if (starRing)
        scene.remove(starRing);
    let starMatrix = starburstA(starsPerSide, starsPerSide, starsPerSide);
    starRing = createRing(starMatrix, trans);
    scene.add(starRing);
}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}



init();
createScene();
initGui();
addToDOM();
render();
animate();