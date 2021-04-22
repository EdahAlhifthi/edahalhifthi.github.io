//
//

var camera, scene, ،material, renderer, light, controls;
var keyboard_set;
// keyC, keyCprim, keyD, keyDprim, keyE, keyEprim;
var raycaster, mouse = new THREE.Vector2();
var pickables = [];

//var Cdown = false, Ddown = false,  Edown = false;


//////////////////////////////////////////////////////////////
var keyNames = ['k4','z4','c4','d4','e4','f4','g4','a4', 'b4', 'h4', 'i4', 'j4', 'l4',
'm4', 'n4', 'o4'];
var noteTable = [
    {name: 'k4', frequency: 290.63},
    {name: 'z4', frequency: 270.63},
    {name: 'c4', frequency: 261.63},
    {name: 'd4', frequency: 293.7},
    {name: 'e4', frequency: 329.63},
    {name: 'f4', frequency: 349.2},
    {name: 'g4', frequency: 392},
    {name: 'a4', frequency: 440},
    {name: 'b4', frequency: 221},
    {name: 'h4', frequency: 480},
    {name: 'i4', frequency: 230},
    {name: 'j4', frequency: 440.3},
    {name: 'l4', frequency: 450.3},
    {name: 'm4', frequency: 460.3},
    {name: 'n4', frequency: 470.3},
    {name: 'o4', frequency: 435.3}
];
var keys = [];
var sounds = [];
var thiskey = null;


var ac = new (window.AudioContext || window.webkitAudioContext);



/////////////////////////////////////////////////////////////
initWebAudio();
init();
animate();



////////////////////////////////////////////////////////////
function Sound (frequency, type) {
    this.osc = ac.createOscillator();
   
    if (typeof frequency != 'undefined') {
        this.osc.frequency.value = frequency;
    }
       
    this.osc.type = type || 'sine';
    this.osc.start(0);

};
Sound.prototype.noteOn = function() {
    this.osc.connect(ac.destination);
};
Sound.prototype.noteOff = function() {
    this.osc.disconnect();
};



///////////////////////////////////////////////////////////////


function initWebAudio () {
    for (var i = 0; i < noteTable.length; i++) {
        var ss = new Sound (noteTable[i].frequency);
        ss.name = noteTable[i].name;
        sounds.push(ss);
    }
}

function FindSound (name) {
    debugger;
    for (var i = 0; i < sounds.length; i++) {
        if (sounds[i].name === name)
            return sounds[i];
    }
    return null;
}

function Key(name, obj3d) {
    this.name = name;
    this.obj3d = obj3d;  // for rotation
    this.pressed = false;
    debugger;
    this.sound = FindSound (name);
}

function FindKey (name) {
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].name === name)
            return keys[i];
    }
    return null;
}

////////////////////////////////////////////////////////////////
function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 30, 40); // = 50;
    //camera.rotation.x = -0.35;
    camera.lookAt (new THREE.Vector3(0,0,0));
   
    scene.add(camera);
    light = new THREE.PointLight(0xffffff);
    light.position.set(10, 30, 20);
    scene.add(light);

   
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("0x7777ff");

  //  controls = new THREE.OrbitControls(camera, renderer.domElement);

    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    raycaster = new THREE.Raycaster();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    function touchStarted() {
  getAudioContext().resume();
}

    ///////////////////////////////////////////////////////////////////////////
    keyboard_set = new THREE.Object3D(); // the complete set
    scene.add(keyboard_set);

    var geometry = new THREE.BoxGeometry(2.5, 1.5, 9);
    var material = new THREE.MeshLambertMaterial({transparent: true})

    for (var kk = 0; kk < keyNames.length; kk++) {
        var prim = new THREE.Mesh (geometry,material);
        prim.name = keyNames[kk];
        pickables.push (prim); // only mesh is pickable
        prim.position.set(-18.25 + kk*(2.5 + 0.05), -0.75, 4.5);
        var keybody = new THREE.Object3D();
        keybody.add (prim);
        keyboard_set.add (keybody);
        var newkey = new Key (keyNames[kk], keybody);    
        keys.push (newkey);
    }
/*    
    keyCprim = new THREE.Mesh(geometry, material);
    keyCprim.position.set(1.25, -0.75, 4.5);
    keyC = new THREE.Object3D();
    keyC.add(keyCprim);
    keyboard_set.add(keyC);

    keyDprim = new THREE.Mesh(geometry, material);
    keyDprim.position.set(1.25 + (2.5 + 0.05), -0.75, 4.5);
    keyD = new THREE.Object3D();
    keyD.add(keyDprim);
    keyboard_set.add(keyD);
    scene.add(keyboard_set);

    pickables.push(keyCprim);
    keyCprim.name = "keyC";
    pickables.push(keyDprim);
    keyDprim.name = "keyD";
*/


}
var control = new function() {
    this.soundRange = 10;
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {

    // PICKING DETAILS:
    // convert mouse.xy = [-1,1]^2 (NDC)
    // unproject (mouse.xy, 1) to a point on the far plane (in world coordinate)
    // set raycaster (origin, direction)
    // find intersection objects, (closest first)
    // each record as
    // [ { distance, point, face, faceIndex, object }, ... ]

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // find intersections
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1).unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(pickables);
    if (intersects.length > 0) {
//        console.log (intersects[0].object.name);
        thiskey = FindKey (intersects[0].object.name);
        thiskey.obj3d.rotation.x = 0.15;
        thiskey.sound.noteOn();
   /*    
        if (intersects[0].object.name === 'keyC') {
            keyC.rotation.x = 0.15;
            Cdown = true;
            sounds[0].noteOn();
        } else if (intersects[0].object.name === 'keyD') {
            keyD.rotation.x = 0.15;
            Ddown = true;
        } else if (intersects[0].object.name === 'keyE') {
            keyE.rotation.x = 0.15;
            Edown = true;
        }
   */    

    }

}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1).unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(pickables);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'auto';
    }
}

function onDocumentMouseUp(event) {
    event.preventDefault();
    thiskey.sound.noteOff();
    thiskey.obj3d.rotation.x = 0;
 /*  
    if (Cdown) {keyC.rotation.x = 0; Cdown = false; sounds[0].noteOff();}
    else if (Ddown) {keyD.rotation.x = 0; Ddown = false;}
    else if (Edown) keyE.rotation.x = 0;
 */  
}
function render() {
    material.soundRange = control.soundRange;
renderer.render(scene, camera);
}

function initGui() {
    var gui = new dat.GUI();
   
    gui.add(control, 'soundRange', 2.0, 10.0).step(0.1);
}

function animate() {
  //  controls.update();
    //   console.log (camera.position);
    // console.log (camera.rotation);

    requestAnimationFrame(animate);
    render();
}
function render() {

renderer.render(scene, camera);
}
initGui();
render();
animate();


    
