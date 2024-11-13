import "./style.css";
//threejs
import * as THREE from "three";
//orbit controls for camera
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//dat gui for controls
import * as dat from "dat.gui";
//import gsap for animations
import gsap from "gsap";
// import { floor } from "three/webgpu";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// perspectief ipv ortographic camera

const renderer = new THREE.WebGLRenderer({
  //shadows
  antialias: true,
});
renderer.shadowMap.enabled = true; // Enable shadow mapping on the renderer

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// add sun light (point light)
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 7, 4);
scene.add(pointLight);

// add directional light (sun) more realistic
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
directionalLight.castShadow = true; // enable shadow
scene.add(directionalLight);

//point light
const pointLight2 = new THREE.PointLight(0xffffff, 1);
pointLight2.position.set(0, 2, 0);
pointLight2.castShadow = true;
scene.add(pointLight2);

//point light helper
// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1);
// scene.add(pointLightHelper);

//dat gui, add position for pointlight
const gui = new dat.GUI();
const light1 = gui.addFolder("Light 1");
light1.add(pointLight2.position, "x").min(-6).max(6).step(0.01);
light1.add(pointLight2.position, "y").min(-3).max(3).step(0.01);
light1.add(pointLight2.position, "z").min(-3).max(3).step(0.01);
light1.add(pointLight2, "intensity").min(0).max(10).step(0.01);

//gsap pointlight z position from -5 to 0 infinite loop
// gsap.to(pointLight2.position, {
//   duration: 10,
//   z: -5,
//   y: 10,
//   x: 3,
//   yoyo: true,
//   repeat: -1,
// });

//orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
// enableDamping: If true, the controls will smoothly decelerate when ending movements.
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const wallTextureLoader = new THREE.TextureLoader();
const wallPaintingTexture = wallTextureLoader.load("wall.jpg");

//housewalls
const housewall1 = new THREE.BoxGeometry(0.5, 5, 8); // width(x), height(y), depth(z)
const housematerial1 = new THREE.MeshPhongMaterial({
  color: 0xa64833,
  map: wallPaintingTexture,
});
// set material color so it can be changed in animate function
const leftwall = new THREE.Mesh(housewall1, housematerial1);
leftwall.castShadow = true; // enable shadow casting
scene.add(leftwall); // add cube to scene
leftwall.position.set(-4, 0, 0); // set position of cube

const housewall2 = new THREE.BoxGeometry(0.5, 5, 8);
const rightwall = new THREE.Mesh(housewall2, housematerial1);
rightwall.castShadow = true;
scene.add(rightwall);
rightwall.position.set(4, 0, 0);

const housewall3 = new THREE.BoxGeometry(8.5, 5, 0.5);
const backwall = new THREE.Mesh(housewall3, housematerial1);
backwall.castShadow = true;
scene.add(backwall);
backwall.position.set(0, 0, -4);

const housewall4 = new THREE.BoxGeometry(6, 5, 0.5);
const frontwall = new THREE.Mesh(housewall4, housematerial1);
frontwall.castShadow = true;
scene.add(frontwall);
frontwall.position.set(-1.25, 0, 4);

const houseDoor = new THREE.BoxGeometry(2.6, 5, 0.5);
const doormaterial = new THREE.MeshPhongMaterial({
  color: 0xa000000,
});
const door = new THREE.Mesh(houseDoor, doormaterial);
door.castShadow = true;
scene.add(door);
door.position.set(2.9, 0, 4);
let doorSpeed = 0.0002;
let maxX = 5;
let minX = 2.9;

const floorTextureLoader = new THREE.TextureLoader();
const floorPaintingTexture = floorTextureLoader.load("floor.jpg");
// Floor
const houseFloor = new THREE.PlaneGeometry(8, 8, 8);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x404040,
  map: floorPaintingTexture,
});
const floor = new THREE.Mesh(houseFloor, floorMaterial);
floor.castShadow = false;
floor.receiveShadow = true;
floor.position.set(0, -2.4, 0);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

//roof
const roofGeometry = new THREE.ConeGeometry(6, 3, 4);
const roofMaterial = new THREE.MeshStandardMaterial({
  color: 0x404040,
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.castShadow = true;
roof.receiveShadow = true;
scene.add(roof);
roof.position.set(0, 4, 0);
roof.rotation.y = Math.PI / 4;

// plane
const planeGeometry1 = new THREE.PlaneGeometry(55, 55, 55); // width, height, width segments, height segments
const planeMmaterial1 = new THREE.MeshStandardMaterial({
  color: 0x638c26,
});
const plane = new THREE.Mesh(planeGeometry1, planeMmaterial1);
plane.rotation.x = Math.PI / 2; // rotate plane 90 degrees so it's flat
// plane.position.y = -1; // move plane down so it's below the cube
plane.receiveShadow = true;
scene.add(plane);
plane.position.set(0, -2.5, 0);

// add box, 4,2,0.01
//load textureloader for painting (public/monalisa.jpg)
const textureLoader = new THREE.TextureLoader();
const paintingTexture = textureLoader.load("Mai.jpg");

//create painting

const paintingGeometry = new THREE.BoxGeometry(2, 3, 0.02);
const paintingMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  map: paintingTexture,
});
const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
painting.position.x = -0;
painting.position.y = 0;
painting.position.z = -3.7;
painting.castShadow = true;
scene.add(painting);

//trees
const treeGeometry = new THREE.CylinderGeometry(0.5, 1, 5);
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const treeTrunk = new THREE.Mesh(treeGeometry, treeMaterial);

const treeCrownGeometry = new THREE.SphereGeometry(2, 8, 8);
const treeCrownMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const treeCrown = new THREE.Mesh(treeCrownGeometry, treeCrownMaterial);
treeCrown.position.y = 3;

const tree = new THREE.Group();
tree.add(treeTrunk);
tree.add(treeCrown);

for (let i = 0; i < 10; i++) {
  let x, z;

  // Bepalen of de boom buiten de housewalls moet staan
  do {
    x = Math.random() * 45 - 22; // Willekeurige x tussen -22 en 22
    z = Math.random() * 50 - 25; // Willekeurige z tussen -25 en 25
  } while (
    x > -4.5 &&
    x < 4.5 && // Binnen het bereik van de muren (x van -4 tot 4)
    z > -4.5 &&
    z < 4.5 // Binnen het bereik van de muren (z van -4 tot 4)
  );

  // Plaats de boom op de geldige x, z posities
  const treeClone = tree.clone();
  treeClone.position.set(x, 0, z);
  scene.add(treeClone);
}

//pinkie
const loader = new GLTFLoader();
loader.load(
  // Path to the .glb file
  "pinkie_pie.glb",
  function (gltf) {
    const model = gltf.scene;
    model.castShadow = true; // Enable shadow casting
    model.receiveShadow = true;
    model.position.set(2.5, -3, 2); // Adjust position if needed
    model.scale.set(2, 2, 1); // Adjust scale if needed
    scene.add(model); // Add the model to the scene
  },
  undefined,
  function (error) {
    console.error("An error happened loading the model", error);
  }
);
// camera.position.set(1, 1, 1);
camera.position.set(100, 313, 123); // move camera back so we can see the cube (default position is 0,0,0)

const clock = new THREE.Clock(); //timeframe manipulaties
function animate() {
  requestAnimationFrame(animate);
  door.position.x += doorSpeed;
  if (door.position.x >= maxX || door.position.x <= minX) {
    doorSpeed = -doorSpeed;
  }

  // Render the scene
  renderer.render(scene, camera);
  const elapsedTime = clock.getElapsedTime(); // get elapsed time
  console.log(elapsedTime); // log elapsed time
  plane.rotation.x = -Math.PI / 2; // Rotate plane to lie flat on the ground
  renderer.render(scene, camera);
  //move up camera
  // camera.position.y = Math.sin(elapsedTime); // move camera up and down
  camera.lookAt(scene.position); // look at torus zodat de camera altijd op de torus gericht is
}

function moveCameraToDoor() {
  gsap.to(camera.position, {
    duration: 5, // Beweging duurt 5 seconden
    x: 0, // x-positie voor de deur
    y: 0, // y-positie voor een mooi zicht
    z: 10, // z-positie vlak voor de deur
    onUpdate: () => {
      camera.lookAt(door.position); // Laat de camera altijd naar de deur kijken
    },
  });
}

moveCameraToDoor();
