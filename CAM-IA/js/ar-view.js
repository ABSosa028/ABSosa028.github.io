// Script para manejar la experiencia AR con MindAR
document.addEventListener('DOMContentLoaded', function() {
    // Configurar los listeners de eventos de UI primero
    setupEventListeners();
    
    // La inicialización de AR ocurre cuando se cargan los módulos (ver HTML)
    if (window.AFRAME) {
        console.log('A-Frame está disponible en carga inicial');
    } else {
        console.warn('A-Frame aún no está disponible, esperando eventos...');
    }
});

// Configurar listeners de eventos
function setupEventListeners() {
    // Botón para volver a la página anterior
    document.getElementById('back-button').addEventListener('click', function() {
        window.history.back();
    });
    
    // Botón para cerrar la información del sitio
    document.getElementById('close-info-btn').addEventListener('click', function() {
        hideSiteInfo();
    });
    
    // Botón para más información
    document.getElementById('more-info-btn').addEventListener('click', function() {
        const siteId = window.location.hash.substring(1);
        if (siteId) {
            window.location.href = `site.html?id=${siteId}`;
        }
    });
}

// Función que se llama cuando A-Frame está listo
function initAR() {
    console.log('A-Frame ha cargado, inicializando AR...');

    // Inicializar variables
    let currentSiteId = null;
    let sitesData = {};
    let markersData = {};
    
    // Cargar datos desde localStorage
    loadData();
    
    // Función para cargar datos desde localStorage
    function loadData() {
        try {
            // Cargar información de sitios
            const storedSites = localStorage.getItem('sitesDB');
            if (storedSites) {
                sitesData = JSON.parse(storedSites);
                console.log('Datos de sitios cargados para AR:', Object.keys(sitesData).length);
            } else {
                console.warn('No se encontraron datos de sitios en localStorage');
            }
            
            // Cargar información de marcadores
            const storedMarkers = localStorage.getItem('arMarkers');
            if (storedMarkers) {
                markersData = JSON.parse(storedMarkers);
                console.log('Datos de marcadores cargados para AR:', Object.keys(markersData).length);
            } else {
                console.warn('No se encontraron datos de marcadores en localStorage');
            }
            
            // Verificar si hay un ID de sitio en el hash de la URL
            const siteId = window.location.hash.substring(1);
            if (siteId && sitesData && sitesData[siteId]) {
                showSiteInfo(siteId);
            }
            
            // No necesitamos configurar marcadores dinámicos ahora, usamos el enfoque predefinido
        } catch (error) {
            console.error('Error al cargar datos para AR:', error);
        }
    }
}

// Estas funciones necesitan estar en el ámbito global
function showSiteInfo(siteId) {
    const sitesData = JSON.parse(localStorage.getItem('sitesDB') || '{}');
    const siteData = sitesData[siteId];
    
    if (siteData) {
        // Actualizar la UI con la información del sitio
        document.getElementById('site-name').textContent = siteData.name;
        document.getElementById('site-description').textContent = siteData.description;
        
        // Mostrar el panel de información
        const siteInfo = document.getElementById('site-info');
        siteInfo.classList.remove('hidden');
        
        // Usamos requestAnimationFrame para evitar problemas de timing
        requestAnimationFrame(() => {
            siteInfo.classList.add('visible');
        });
        
        // Ocultar las instrucciones
        document.getElementById('ar-instructions').style.display = 'none';
        
        // Mostrar el botón de "Más información"
        document.getElementById('more-info-btn').style.display = '';
    }
};

function showGenericInfo(markerData) {
    // Actualizar la UI con la información del marcador
    document.getElementById('site-name').textContent = markerData.name || "Marcador AR";
    document.getElementById('site-description').textContent = markerData.description || "Este marcador no tiene información asociada";
    
    // Mostrar el panel de información
    const siteInfo = document.getElementById('site-info');
    siteInfo.classList.remove('hidden');
    
    // Usamos requestAnimationFrame para evitar problemas de timing
    requestAnimationFrame(() => {
        siteInfo.classList.add('visible');
    });
    
    // Ocultar las instrucciones
    document.getElementById('ar-instructions').style.display = 'none';
    
    // Ocultar el botón de "Más información" para marcadores sin sitios asociados
    document.getElementById('more-info-btn').style.display = 'none';
};

function hideSiteInfo() {
    const siteInfo = document.getElementById('site-info');
    siteInfo.classList.remove('visible');
    setTimeout(() => {
        siteInfo.classList.add('hidden');
        // Mostrar nuevamente botón de "Más información" por si estaba oculto
        document.getElementById('more-info-btn').style.display = '';
    }, 300);
    
    // Mostrar instrucciones nuevamente
    document.getElementById('ar-instructions').style.display = 'block';
}
