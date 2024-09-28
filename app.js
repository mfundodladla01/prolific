import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 25;

const scene = new THREE.Scene();
let bee;
let mixer;
let isDragging = false;  // Indicates whether the model is being grabbed
let previousMousePosition = { x: 0, y: 0 };  // Tracks the previous mouse position

const loader = new GLTFLoader();
loader.load('/doritos_chip_bag_model.glb',
    function (gltf) {
        bee = gltf.scene;
        scene.add(bee);

        mixer = new THREE.AnimationMixer(bee);
        mixer.clipAction(gltf.animations[0]).play();
        modelMove();

        // Enable grab interaction after model is loaded
        addGrabInteraction(bee);
    },
    function (xhr) {},
    function (error) {}
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
};
reRender3D();

let arrPositionModel = [
    {
        id: 'banner',
        position: { x: -2, y: -1, z: 0 },
        rotation: { x: 0, y: 0, z: 2 }
    },
    {
        id: "intro",
        position: { x: 1, y: -1.3, z: -5 },
        rotation: { x: 0.5, y: -0.5, z: -1 },
    },
    {
        id: "description",
        position: { x: 2.5, y: -1.5, z: -5 },
        rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
        id: "contact",
        position: { x: -2, y: -1, z: 0 },
        rotation: { x: 0.7, y: -0.5, z: -2.5 },
    },
    {
        id: "gallery",
        position: { x: -1, y: -1, z: -3 },
        rotation: { x: 1, y: 5.2, z: 1.5 },
    }
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });
    let position_active = arrPositionModel.findIndex(
        (val) => val.id == currentSection
    );
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(bee.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 3,
            ease: "power1.out"
        });
        gsap.to(bee.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 3,
            ease: "power1.out"
        })
    }
};

window.addEventListener('scroll', () => {
    if (bee) {
        modelMove();
    }
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Add grab interaction
const addGrabInteraction = (model) => {
    // Mouse down: Start dragging
    window.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });

    // Mouse up: Stop dragging
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mouse move: Rotate model if dragging
    window.addEventListener('mousemove', (event) => {
        if (isDragging) {
       
            const rotationSpeed = 0.005;  // Speed of rotation

            // Rotate model based on mouse movement
            model.rotation.y += deltaMove.x * rotationSpeed;
            model.rotation.x += deltaMove.y * rotationSpeed;

            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    });
};
