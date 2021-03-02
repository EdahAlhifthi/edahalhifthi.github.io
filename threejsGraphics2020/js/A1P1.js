let scene = new THREE.Scene();
let radius = 2;
let height = 0.5;
function RegularPolygon(radius,innercolor, outercolor) {

    let outerColor = new THREE.MeshPhongMaterial({color: '#ffffff'});
    let innerColor = new THREE.MeshPhongMaterial({color: "hsl(300, 90%, 50%)", vertexColors: true, shading: THREE.FlatShading});
    

 let shape = new THREE.Shape();
    let ri = radius / 2 - height / 4;
    let a = ri * 2 / Math.sqrt(3);
    shape.moveTo(-ri, -a / 2);
    shape.lineTo(0, -a);
    shape.lineTo(ri, -a / 2);
    shape.lineTo(ri, a / 2);
    shape.lineTo(0, a);
    shape.lineTo(-ri, a / 2);
    shape.lineTo(-ri, -a / 2);

    let geometry = new THREE.ExtrudeGeometry(shape, {
        steps: 2,
        amount: height / 2,
        bevelEnabled: false,
        material: 0,
        extrudeMaterial: 1
    });
for (let face of geometry.faces) {
        if (face.normal.z < - 0.99999) {
            face.materialIndex = 2;
        }
    }

    return new THREE.Mesh(geometry, new THREE.MultiMaterial([innerColor, outerColor]));
}

let tile = RegularPolygon(2, 0.1);
tile.position.y = 0;
tile.position.x = 0;
scene.add(tile);

//###############################################################

let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 15;
camera.position.y = 0;
scene.add(camera);


let ambientLight = new THREE.AmbientLight('#ffffff', 1);
ambientLight.name = 'ambientLight';
scene.add(ambientLight);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000000', 1);

document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    tile.rotation.y += 0.00;
    tile.rotation.x += 0.00;

}

animate();

