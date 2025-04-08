import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';

let mindarThree = null;
let faceMesh = null;
let leaf = null;
let isLlama = false;
let direction = 1; // 1 para derecha, -1 para izquierda

const setup = async () => {
    mindarThree = new MindARThree({
        container: document.querySelector("#container"),
    });

    const { renderer, scene, camera } = mindarThree;

    // Luz ambiental
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Obtener la URL del filtro desde los parámetros
    const urlParams = new URLSearchParams(window.location.search);
    const filtroURL = urlParams.get('filtro');

    // Cargar filtro facial dinámicamente
    const texture = new THREE.TextureLoader().load(filtroURL);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    faceMesh = new THREE.Mesh(geometry, material);
    faceMesh.scale.set(2, 2, 1);
    const anchor = mindarThree.addAnchor(1);
    anchor.group.add(faceMesh);

    if (filtroURL.includes('romano.png')) {
        faceMesh.position.set(0, 0.35, 0);
        faceMesh.scale.set(2.5, 2.5, 2.5);
    } else if (filtroURL.includes('llama.png')) {
        faceMesh.scale.set(0.35, 0.35, 0.35);
        faceMesh.position.set(0, 0, 0);
        isLlama = true; // Activamos la animación de la llama
    } else if (filtroURL.includes('turbante.png')) {
        faceMesh.position.set(0, 0.25, 0);
    } else if (filtroURL.includes('petra.png')) {
        faceMesh.scale.set(0.6, 0.6, 0.6);
        faceMesh.position.set(0, -0.1, 0);
        isLlama = true;
    } else if (filtroURL.includes('brasil.png')) {
        // faceMesh.scale.set(0.7, 0.7, 0.7);
        faceMesh.position.set(0, 0.4, 0);
    }

    // Cargar vegetación
    const leafTexture = new THREE.TextureLoader().load('./assets/vegetacion.png');
    const leafGeometry = new THREE.PlaneGeometry(1, 1);
    const leafMaterial = new THREE.MeshBasicMaterial({ map: leafTexture, transparent: true });
    leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    scene.add(leaf);

    adjustVegetation();
    window.addEventListener('resize', adjustVegetation);
};

const adjustVegetation = () => {
    if (!leaf) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = screenWidth / screenHeight;

    const baseWidth = 3;
    const baseHeight = baseWidth * (9 / 16);

    if (aspectRatio > 1) {
        leaf.scale.set(baseWidth * aspectRatio, baseHeight * aspectRatio, 1);
    } else {
        leaf.scale.set(baseWidth, baseHeight, 1);
    }
    leaf.position.set(0, -1.2, -4);
};

const start = async () => {
    if (!mindarThree) {
        await setup();
    }

    await mindarThree.start();
    const { renderer, scene, camera } = mindarThree;
    renderer.setAnimationLoop(() => {
        if (isLlama && faceMesh) {
            faceMesh.position.x += 0.01 * direction;

            // Cambiar de dirección si alcanza los límites
            if (faceMesh.position.x > 0.5 || faceMesh.position.x < -0.5) {
                direction *= -1;
            }
        }

        renderer.render(scene, camera);
    });
};

start();

// Captura de imagen
const captureBtn = document.getElementById("capture-btn");

captureBtn.addEventListener("click", () => {
    const video = document.querySelector("video");
    const canvas3D = mindarThree.renderer.domElement;

    const captureCanvas = document.createElement("canvas");
    const context = captureCanvas.getContext("2d");

    captureCanvas.width = canvas3D.width;
    captureCanvas.height = canvas3D.height;

    context.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    context.drawImage(canvas3D, 0, 0, captureCanvas.width, captureCanvas.height);

    const dataURL = captureCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "captura.png";
    link.click();
});
