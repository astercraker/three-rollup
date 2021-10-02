import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene()
let mesh
let r = 0.0;
const settings = {
    metalness: 1.0,
    roughness: 0.4,
    ambientIntensity: 0.2,
    aoMapIntensity: 1.0,
    envMapIntensity: 1.0,
    displacementScale: 2.436143, // from original model
    normalScale: 1.0
};

// Lights

const pointLight = new THREE.PointLight(0x00ffff, 245000)
pointLight.position.x = 30
pointLight.position.y = 40
pointLight.position.z = 80

scene.add(pointLight)

const helper = new THREE.PointLightHelper(pointLight)
scene.add(helper)

const pointLight2 = new THREE.PointLight(0xd68813, 145000)
//pointLight2.position.set(-0.5, -1, 90);
pointLight2.position.x = -20
pointLight2.position.y = 40
pointLight2.position.z = 80
//pointLight2.intensity = 500;
scene.add(pointLight2)

const helper2 = new THREE.PointLightHelper(pointLight2)
scene.add(helper2)

const ambientLight = new THREE.AmbientLight(0xffffff, 1000);
scene.add(ambientLight);

const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );
/**
 * Sizes
 */
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientWidth
}
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = canvas.clientWidth
    sizes.height = canvas.clientWidth

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 1000)
camera.position.x = -5
camera.position.y = 5
camera.position.z = 120

const helperCamera = new THREE.CameraHelper( camera );
scene.add( helperCamera );

scene.add(camera)

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();


const gltfLoader = new GLTFLoader();
  const url = '../images/models/wolf_head.gltf';
  gltfLoader.load(url, (gltf) => {
    var material = gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0];
    // material.receiveShadow = true;
    // material.castShadow = true;
    let color2 = new THREE.Color( 0xff2b2b );
    material.material.color = color2;
    material.material.vertexColors = true;
    material.material.roughness = 1;
	material.material.metalness = 1;
    console.log(material);
    
    const root = gltf.scene || gltf.scenes[0];
    // root.position.z = 10;
    // root.position.y = -45;
    // root.position.x = 10;
    // console.log(root);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    root.position.x += (root.position.x - center.x);
    root.position.y += (root.position.y - center.y);
    root.position.z += (root.position.z - center.z);

    root.traverse((node) => {
        if (node.isLight) {
          console.log("----------  Is light -----");
        } else if (node.isMesh) {
          // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
          node.material.depthWrite = !node.material.transparent;
          mesh = node;
          console.log("----------  Is Mesh -----");
        }
      });
    scene.add(root);
  });
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
//renderer.setClearColor( 0x000000, 0 ); // the default
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * Animate
 */
document.addEventListener("mousemove", onDocumentMouseMove)
let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0


const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

const clock = new THREE.Clock()

const tick = () => {
    targetX = mouseX * .001;
    targetY = mouseY * .001;
    const elapsedTime = clock.getElapsedTime()
    // Update objects
    if(mesh){
        mesh.rotation.y += .05 * (targetY - mesh.rotation.y)
        mesh.position.z += -.05 * (targetY - mesh.rotation.x)
    }
    // pointLight2.position.x = -20 * Math.cos( r );
    // pointLight2.position.z = 20 * Math.sin( r );

    // r += 0.01;

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()