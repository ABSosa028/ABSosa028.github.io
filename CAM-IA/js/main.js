document.addEventListener('DOMContentLoaded', function() {
    loadSitesFromStorage();
    setupUI();
});

function loadSitesFromStorage() {
    // Intentar cargar sitesDB desde localStorage
    const storedSites = localStorage.getItem('sitesDB');
    
    if (storedSites) {
        window.sitesDB = JSON.parse(storedSites);
        console.log('Sitios cargados desde localStorage:', window.sitesDB);
        
        // Renderizar los sitios en la interfaz
        renderSites();
    } else {
        console.log('No se encontraron sitios en localStorage');
        // Puedes manejar este caso, por ejemplo mostrando un mensaje o creando sitios por defecto
    }
}

function renderSites() {
    // Obtener los contenedores para sitios
    const worldWondersContainer = document.querySelector('.world-wonders-grid') || document.getElementById('world-wonders');
    const guatemalaWondersContainer = document.querySelector('.guatemala-wonders-grid') || document.getElementById('guatemala-wonders');
    const otherSitesContainer = document.querySelector('.other-sites-grid') || document.getElementById('other-sites');
    
    // Verificar si los contenedores existen
    if (!worldWondersContainer && !guatemalaWondersContainer && !otherSitesContainer) {
        console.error('No se encontraron los contenedores para sitios turísticos');
        return;
    }
    
    // Limpiar contenedores si existen
    if (worldWondersContainer) worldWondersContainer.innerHTML = '';
    if (guatemalaWondersContainer) guatemalaWondersContainer.innerHTML = '';
    if (otherSitesContainer) otherSitesContainer.innerHTML = '';
    
    // Contador de sitios
    let worldSitesCount = 0;
    let guatemalaSitesCount = 0;
    let otherSitesCount = 0;
    
    // Iterar sobre los sitios y agregarlos a los contenedores correspondientes
    for (const [id, site] of Object.entries(window.sitesDB)) {
        const siteElement = createSiteElement(id, site);
        
        if (site.type === 'guatemala' && guatemalaWondersContainer) {
            guatemalaWondersContainer.appendChild(siteElement);
            guatemalaSitesCount++;
        } else if (site.type === 'other' && otherSitesContainer) {
            otherSitesContainer.appendChild(siteElement);
            otherSitesCount++;
        } else if (worldWondersContainer) {
            worldWondersContainer.appendChild(siteElement);
            worldSitesCount++;
        }
    }
    
    // Mostrar mensaje si no hay sitios
    if (worldWondersContainer && worldSitesCount === 0) {
        worldWondersContainer.innerHTML = `
            <div class="no-sites-message">
                <p>No hay sitios turísticos del mundo agregados aún.</p>
                <p>Agrega sitios desde el panel de administración.</p>
            </div>
        `;
    }
    
    if (guatemalaWondersContainer && guatemalaSitesCount === 0) {
        guatemalaWondersContainer.innerHTML = `
            <div class="no-sites-message">
                <p>No hay sitios turísticos de Guatemala agregados aún.</p>
                <p>Agrega sitios desde el panel de administración.</p>
            </div>
        `;
    }
    
    if (otherSitesContainer && otherSitesCount === 0) {
        otherSitesContainer.innerHTML = `
            <div class="no-sites-message">
                <p>No hay otros sitios turísticos agregados aún.</p>
                <p>Agrega sitios desde el panel de administración.</p>
            </div>
        `;
    }
    
    console.log(`Total de sitios cargados: ${worldSitesCount + guatemalaSitesCount + otherSitesCount}`);
}

function createSiteElement(id, site) {
    // Crear elemento para el sitio
    const siteElement = document.createElement('div');
    siteElement.className = 'site-card';
    siteElement.setAttribute('data-site-id', id);
    
    // Imagen de fondo (usar la primera imagen disponible)
    const backgroundImage = site.images && site.images.length > 0 
        ? `background-image: url('${site.images[0]}')` 
        : '';
    
    siteElement.innerHTML = `
        <div class="site-image" style="${backgroundImage}"></div>
        <div class="site-info">
            <h3>${site.name}</h3>
            <p class="site-country">${site.country}</p>
            <p class="site-description">${site.description}</p>
            <a href="site.html?id=${id}" class="site-btn">Ver más</a>
        </div>
    `;
    
    // Añadir evento para abrir detalles del sitio
    siteElement.querySelector('.site-btn').addEventListener('click', function(e) {
        // Si necesitas hacer algo antes de navegar
        // e.preventDefault();
        // window.location.href = `site.html?id=${id}`;
    });
    
    return siteElement;
}

function setupUI() {
    // Configurar eventos de la interfaz de usuario, como filtros, búsqueda, etc.
    // Esto dependerá de la estructura específica de tu index.html
}
