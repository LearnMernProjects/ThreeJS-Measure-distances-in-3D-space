import * as THREE from "three";
 import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
/* Scene */

const scene = new THREE.Scene();
const textLoader = new THREE.TextureLoader(); 


const sunTexture = textLoader.load('/sunTex.jpg');

const earthTexture = textLoader.load('/earthTex.jpg');
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });

const marsTexture = textLoader.load('/marsTex.jpg');
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });

const mercuryTexture = textLoader.load('/mercuryTex.jpg');
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });


const venusTexture = textLoader.load('/venusTex.jpg');
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });

const jupiterTexture = textLoader.load('/jupiterTex.jpg');
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });

const saturnTexture = textLoader.load('/saturnTex.jpg');
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });

const uranusTexture = textLoader.load('/uranusTex.jpg');
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });

const neptuneTexture = textLoader.load('/neptuneTex.jpg');
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });

const moonTexture = textLoader.load('/moonTex.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });


const textureLoader = new THREE.TextureLoader();

// Fallback background
const fallbackBackground = textureLoader.load('/milkyTex.jpg');

// Load cubemap
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/cubeMap/Standard-Cube-Map/');

const backgroundCubemap = cubeTextureLoader.load(
  ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
  () => {
    console.log('Cubemap loaded successfully');
  },
  undefined,
  (error) => {
    console.log('Cubemap failed, using fallback');
    scene.background = fallbackBackground;
  }
);

scene.background = backgroundCubemap;




/* Camera */
const camera = new THREE.PerspectiveCamera(
  50,
  (window.innerWidth / window.innerHeight),
  0.1,
  1000
);
camera.position.z = 150;
camera.position.y = 50;

/* Renderer */
const canvas = document.querySelector("#webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* Geometry */
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(6);
scene.add(sun);
const planets = [
  {
    name: 'Mercury',
    radius: 0.38,
    distance: 12,
    speed: 0.015,
    material: mercuryMaterial,
    moons: []
  },
  {
    name: 'Venus',
    radius: 0.95,
    distance: 18,
    speed: 0.012,
    material: venusMaterial,
    moons: []
  },
  {
    name: 'Earth',
    radius: 4,
    distance: 25,
    speed: 0.010,
    material: earthMaterial,
    moons: [
      {
        name: 'Moon',
        material: moonMaterial,
        radius: 0.27,
        distance: 3,
        speed: 0.016
      }
    ]
  },
  {
    name: 'Mars',
    radius: 0.53,
    distance: 35,
    speed: 0.008,
    material: marsMaterial,
    moons: [
      {
        name: 'Phobos',
        radius: 0.1,
        distance: 2,
        speed: 0.02,
        material: moonMaterial
      },
      {
        name: 'Deimos',
        radius: 0.05,
        distance: 3,
        speed: 0.015,
        material: moonMaterial
      }
    ]
  },
  {
    name: 'Jupiter',
    radius: 11.2,
    distance: 50,
    speed: 0.005,
    material: jupiterMaterial,
    moons: [
      {
        name: 'Io',
        radius: 0.29,
        distance: 5,
        speed: 0.02,
        material: moonMaterial
      }
    ]
  },
  {
    name: 'Saturn',
    radius: 9.45,
    distance: 65,
    speed: 0.003,
    material: saturnMaterial,
    moons: [
      {
        name: 'Titan',
        radius: 0.41,
        distance: 5,
        speed: 0.015,
        material: moonMaterial
      }
    ]
  },
  {
    name: 'Uranus',
    radius: 4.01,
    distance: 80,
    speed: 0.0015,
    material: uranusMaterial,
    moons: []
  },
  {
    name: 'Neptune',
    radius: 3.88,
    distance: 95,
    speed: 0.001,
    material: neptuneMaterial,
    moons: [
      {
        name: 'Triton',
        radius: 0.21,
        distance: 4,
        speed: 0.02,
        material: moonMaterial
      }
    ]
  }
];

const createPlanet = (planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  return planetMesh;
};

const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moon.material);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;
};

const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  if (planet.moons && planet.moons.length > 0) {
    planet.moons.forEach((moon) => {
      const moonMesh = createMoon(moon);
      planetMesh.add(moonMesh);
    });
  }

  return planetMesh;
});





/* Light */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2);
scene.add(pointLight);
const directionalLight = new THREE.DirectionalLight(0xffff00, 2);

directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/* Controls */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxDistance = 500;
controls.minDistance = 50;

/* Resize */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* Animation loop */
const renderloop = () => {

  planetMeshes.forEach((planet, planetIndex) => {
    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance;
    planet.rotation.y += planets[planetIndex].speed;

    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[planetIndex].moons[moonIndex].speed;
      moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
      moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
    });
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderloop);
};
renderloop();