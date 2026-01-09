import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
  PointLight,
  DirectionalLight,
  PointLightHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new Scene();
const camera = new PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let canvas = document.querySelector(".canvas");
const renderer = new WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  depth: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setSize( window.innerWidth / 4, window.innerHeight / 4 );
renderer.setAnimationLoop(animate);

if (isMobile) {
  canvas.style.pointerEvents = "none";
}

const geometry = new SphereGeometry(
  3,
  64 * (isMobile ? 0.5 : 2),
  32 * (isMobile ? 0.5 : 2)
);
// new TorusGeometry(15, 5, 16, 100);
// new TorusKnotGeometry( 15,3,100,16,1,1 );
// new DodecahedronGeometry(15,5)
const material = new MeshStandardMaterial({
  // depthTest: false,
  // depthWrite: false,
  flatShading: true,
  color: 0xffffff,
  wireframe: true,
  // simplify: false, // Remove some edges from wireframes
  // fill: "#00ff00", // Color of the inside of the wireframe
  // fillMix: 0, // Mix between the base color and the Wireframe 'fill'. 0 = base; 1 = wireframe
  // fillOpacity: 0.25, // Opacity of the inner fill
  // stroke: "#ff0000", // Color of the stroke
  // strokeOpacity: 1, // Opacity of the stroke
  // thickness: 0.05, // Thinkness of the lines
  // colorBackfaces: false, // Whether to draw lines that are facing away from the camera
  // backfaceStroke: "#0000ff", // Color of the lines that are facing away from the camera
  // dashInvert: true, // Invert the dashes
  // dash: false, // Whether to draw lines as dashes
  // dashRepeats: 4, // Number of dashes in one seqment
  // dashLength: 0.5, // Length of each dash
  // squeeze: false, // Narrow the centers of each line segment
  // squeezeMin: 0.2, // Smallest width to squueze to
  // squeezeMax: 1, // Largest width to squeeze from

  // roughness: 0.4,
});

let sphere = new Mesh(geometry, material);
scene.add(sphere);

// const loader = new FBXLoader();

// loader.load(
//   "./models/hero.fbx",
//   function (object) {
//     // 'object' is the loaded 3D model (a Group)
//     scene.add(object);

//     // If the FBX model contains animations, you can set up an AnimationMixer
//     // mixer = new AnimationMixer(object);
//     // const action = mixer.clipAction(object.animations[0]); // Assuming one animation
//     // action.play();
//   },
//   function (xhr) {
//     // Optional: Progress callback
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   function (error) {
//     // Optional: Error callback
//     console.error("An error occurred:", error);
//   }
// );

const pointLight = new PointLight(0xffffff, 4000);
pointLight.position.set(100, 0, 100);

// const ambientLight = new AmbientLight(0xffffff);
// scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 3);
// directionalLight.position.set(100, 10, 100);

// const lightHelper = new PointLightHelper(pointLight);
// scene.add(pointLight, lightHelper);
const lightHelper = new PointLightHelper(directionalLight);
scene.add(directionalLight);

const controls = new OrbitControls(camera, document.querySelector(".canvas"));

if (isMobile) {
  controls.enabled = false;
}

controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = -1;

camera.position.z = 20;

renderer.shadowMap.enabled = true;
sphere.castShadow = true;

let angle = 0;
function animate() {
  // directionalLight.position.set(100, 0, 100);
  angle += 0.01; // speed
  const radius = 100;
  directionalLight.position.set(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius
  );
  renderer.render(scene, camera);
  controls.update();
}

// Customizable sphere size based on screen width
function getSphereRadius() {
  if (window.innerWidth < 600) return 1.5; // Small screens
  if (window.innerWidth < 1200) return 2.5; // Medium screens
  return 3; // Large screens
}

// Function to update sphere geometry size
function updateSphereSize() {
  const newGeometry = new SphereGeometry(getSphereRadius(), 64 * 2, 32 * 2);
  sphere.geometry.dispose();
  sphere.geometry = newGeometry;
}

// Initial sphere size
updateSphereSize();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateSphereSize();
});

// import * as THREE from "three";

// const scene = new Scene();

// const camera = new PerspectiveCamera(
//   45,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   10000
// );

// const renderer = new WebGLRenderer({
//   canvas: document.querySelector(".canvas"),
//   alpha: true,
//   antialias: true,
//   depth: true,
// });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// // camera.position.setZ(100);
// renderer.render(scene, camera);

// const geometry = new SphereGeometry(15, 100, 100);
// // new TorusGeometry( 15, 5, 16, 100 );
// // new TorusKnotGeometry( 15,3,100,16,1,1 );
// // new DodecahedronGeometry(15,5)
// const material = new MeshStandardMaterial({
//   // flatShading:true,
//   // depthTest: false,
//   // depthWrite: false,
//   color: 0x049ef4,
//   // wireframe:true,
//   roughness: 0.4,
// });
// let sphere = new Mesh(geometry, material);
// scene.add(sphere);

// const pointLight = new PointLight(0xffffff, 0.8);
// pointLight.position.set(40, 30, 90);

// // const ambientLight = new AmbientLight(0xffffff);
// // scene.add(ambientLight);
// const lightHelper = new PointLightHelper(pointLight);
// // const gridHelper = new GridHelper(200, 50);

// scene.add(pointLight, lightHelper);

// const controls = new OrbitControls(camera, document.querySelector(".canvas"));

// controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 3;

// function animate() {
//   renderer.render(scene, camera);
//   controls.update();
//   requestAnimationFrame(animate);
// }
// animate();
