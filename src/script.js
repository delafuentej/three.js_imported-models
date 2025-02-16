import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from 'lil-gui';

// to create complex shapes, we better use a dedicated 3D software like
// Blender, Cinema 4D, 3DS Max, Maya and than import this model into Three.js
// in this lesson we weill impor pre-made models
// many 3d models formats, each one responding to a issue: What data, weight,, compression,
// compatibility, copyrights...
//
//Popular formats: OBJ, FBX,STL, PLY, COLLADA, 3DS, GLTF
// GLTF supports different sets of data like geometries, materials, cameras, lights, 
//scene graph(groups in three.js), animations, skeletons, etc. Various formats like json, 
// binary, embed textures
// GLTF file can have different formats:
// -glTF (default format).Multiple files. 
// -glTF-Binary. Only one file. It does not be readed
// -glTF-Draco. Multiple files.Buffer data are compressed. It is much lighter
// -glTF-Embedded. One file. It is quite heavy

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Models- GLTF Loader
 */
// Instantiate a loader
const dracoLoader = new DRACOLoader();

// the decoder is also available in Web Assembly, and 
// it can run in a worker to improve preformances significantke
// we provide our dracoLoader instance, wich is using WebAssembly and Workers
//to our gltfLoader by using setDRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)

console.log(dracoLoader)
//console.log(gltfLoader);

//DRACO LOADER
// The Draco Version can be much lighter than the default version
//Compression is applied to the buffer data
//the file o.bin to apply the compression on it
//When use draco compression? is not always  a win-win situation
// the geometries are lighter but the user has to load the DRACOLoader class 
// and the decoder, and it takes time and resources for the computer to decode a 
// compressed file
let mixer;
let actions = [];
let activeAction;

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        console.log(gltf);

        scene.add(gltf.scene);
        gltf.scene.scale.set(0.025, 0.025, 0.025);

        const animations = gltf.animations;
        if (animations.length === 0) {
            console.warn('The model has no animatiosn');
            return;
        }

        mixer = new THREE.AnimationMixer(gltf.scene);

        animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            actions.push(action);
        });

        // start the random animation
        playRandomAnimation();
        setInterval(playRandomAnimation, Math.random() * 3000 + 2000);
    }
);

function playRandomAnimation() {
    if (!mixer || actions.length === 0) return;

    if (activeAction) {
        activeAction.stop(); //to stop the current animation
    }

    const randomIndex = Math.floor(Math.random() * actions.length);
    activeAction = actions[randomIndex];

    activeAction.reset().play();
}
// gltfLoader.load(
//     '/models/Fox/glTF/Fox.gltf',
//     (gltf) => 
//     {
//         console.log(gltf.animations)
//         const animations = gltf.animations;
//         // we have to create an AnimationMixer(Three.js Class): it is like a player
//         // and as parameter we have to provide the concerned object
//         if (animations.length === 0) return;
        
//          mixer = new THREE.AnimationMixer(gltf.scene);

//         //add one of the AnimationsClips to the mixer with the clipAction() method
//         const action = mixer.clipAction(animations[2]);

//         action.play();

//         console.log('action', action)
 
//     gltf.scene.scale.set(0.025, 0.025, 0.025)
//     scene.add(gltf.scene)
       
//     },
//     () => 
//     {
//         console.log('progress')
//     },
//     () => 
//     {
//         console.log('error')
//     },
// )
// gltfLoader.load(
//     '/models/Duck/glTF-Draco/Duck.gltf',
//     (gltf) => 
//     {
//         console.log(gltf)
//         //all we need is all inside scene property
//     // with multiple meshes
//     //    console.log(gltf)
//     //   const children = [...gltf.scene.children];
//     //   for (const child of children){
//     //     scene.add(child)
//     //   }

//     scene.add(gltf.scene)
       
//     },
//     () => 
//     {
//         console.log('progress')
//     },
//     () => 
//     {
//         console.log('error')
//     },
// )
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) => 
//     {
//         console.log(gltf)
//         //all we need is all inside scene property
//     // with multiple meshes
//     //    console.log(gltf)
//     //   const children = [...gltf.scene.children];
//     //   for (const child of children){
//     //     scene.add(child)
//     //   }

//     scene.add(gltf.scene)
       
//     },
//     () => 
//     {
//         console.log('progress')
//     },
//     () => 
//     {
//         console.log('error')
//     },
// )
/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //UPDATE MIXER
    // the model take time to load
    if(mixer){
        mixer.update(deltaTime);
    }
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()