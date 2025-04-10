<<<<<<< Updated upstream
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

    // Solo crear faceMesh si el filtro no es antigua.jpg
    if (!filtroURL.includes('antigua.png')) {
        const texture = new THREE.TextureLoader().load(filtroURL);
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        faceMesh = new THREE.Mesh(geometry, material);
        faceMesh.scale.set(2, 2, 1);
        const anchor = mindarThree.addAnchor(1);
        anchor.group.add(faceMesh);

        // Ajustes por tipo de filtro
        if (filtroURL.includes('romano.png')) {
            faceMesh.position.set(0, 0.35, 0);
            faceMesh.scale.set(2.5, 2.5, 2.5);
        } else if (filtroURL.includes('llama.png')) {
            faceMesh.scale.set(0.35, 0.35, 0.35);
            faceMesh.position.set(0, 0, 0);
            isLlama = true;
        } else if (filtroURL.includes('turbante.png')) {
            faceMesh.position.set(0, 0.25, 0);
        } else if (filtroURL.includes('petra.png')) {
            faceMesh.scale.set(0.6, 0.6, 0.6);
            faceMesh.position.set(0, -0.1, 0);
            isLlama = true;
        } else if (filtroURL.includes('brasil.png')) {
            faceMesh.position.set(0, 0.4, 0);
        } else if (filtroURL.includes('semuc.png')) {
            faceMesh.scale.set(0.6, 0.6, 0.6);
            faceMesh.position.set(0, 0, 0);
            isLlama = true;
        } else if (filtroURL.includes('fuentes.png')) {
            faceMesh.scale.set(0.5, 0.5, 0.5);
            faceMesh.position.set(0, 0, 0);
            isLlama = true;
        }
        else if (filtroURL.includes('mirador.png')) {
            faceMesh.scale.set(0.5, 0.5, 0.5);
            faceMesh.position.set(0, 0, 0);
            isLlama = true;
        }
    }

    // Determinar la textura de vegetación
    let leafTexturePath = './assets/vegetacion.png';
    if (filtroURL.includes('antigua.png')) {
        leafTexturePath = filtroURL;
    }

    // Cargar vegetación
    const leafTexture = new THREE.TextureLoader().load(leafTexturePath);
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

            if (faceMesh.position.x > 0.5 || faceMesh.position.x < -0.5) {
                direction *= -1;
            }
=======
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si el dispositivo es móvil para optimizar la experiencia AR
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Ajustar elementos de la UI según el dispositivo
    if (isMobile) {
        // No hacer nada especial por ahora, la página ya es responsive
    } else {
        // Añadir un mensaje para dispositivos de escritorio
        const arButton = document.querySelector('.btn-primary');
        if (arButton) {
            const originalHref = arButton.getAttribute('href');
            
            arButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Mostrar una sugerencia para una mejor experiencia en móviles
                const useDesktop = confirm("La experiencia de Realidad Aumentada es mejor en dispositivos móviles. ¿Deseas continuar de todos modos?");
                
                if (useDesktop) {
                    window.location.href = originalHref;
                }
            });
>>>>>>> Stashed changes
        }
    }
    
    // Configurar animaciones de entrada para las tarjetas de características
    const cards = document.querySelectorAll('.feature-cards .card');
    
    // Función para verificar si un elemento está visible en la pantalla
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para animar elementos cuando entran en la pantalla
    function animateOnScroll() {
        cards.forEach(card => {
            if (isElementInViewport(card)) {
                card.classList.add('animated');
            }
        });
    }
    
    // Inicializar al cargar y aplicar en el scrolling
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Opcional: Mejorar el scroll suave para navegación interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
