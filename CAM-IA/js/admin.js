document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupNavigation();
    loadSitesData();
    loadMarkersData();
    loadFiltersData();
    setupModalEvents();
    setupConfigSection();
    setupOriginalJSONButton();
});

function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('turisarAuth');
    if (!isAuthenticated) {
        window.location.href = 'login.html?redirect=admin';
    }
    
    const username = localStorage.getItem('turisarUsername');
    document.getElementById('user-name').textContent = username || 'Admin';
}

function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn[data-section]');
    const sections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            navBtns.forEach(item => item.classList.remove('active'));
            
            this.classList.add('active');
            
            const sectionId = this.getAttribute('data-section');
            
            sections.forEach(section => section.classList.remove('active'));
            
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            sectionTitle.textContent = this.textContent;
        });
    });
    
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const action = this.getAttribute('data-action');
            
            document.querySelector(`.nav-btn[data-section="${sectionId}"]`).click();
            
            if (action === 'add') {
                if (sectionId === 'sites') {
                    openSiteModal();
                } else if (sectionId === 'markers') {
                    openMarkerModal();
                } else if (sectionId === 'filters') {
                    openFilterModal();
                }
            }
        });
    });
    
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('turisarAuth');
        localStorage.removeItem('turisarUsername');
        window.location.href = '../login.html';
    });
}

function loadSitesData() {
    const siteDB = JSON.parse(localStorage.getItem('siteDB')) || {};
    const sites = Object.values(siteDB);
    renderSitesTable(sites);
    document.getElementById('site-search').addEventListener('keyup', function() {
        const searchText = this.value.toLowerCase();
        const filteredSites = sites.filter(site =>
            site.name.toLowerCase().includes(searchText) ||
            site.country.toLowerCase().includes(searchText)
        );
        renderSitesTable(filteredSites);
    });
    document.getElementById('add-site-btn').addEventListener('click', openSiteModal);
}

function renderSitesTable(sites) {
    const sitesTableBody = document.getElementById('sites-table-body');
    sitesTableBody.innerHTML = '';
    
    sites.forEach(site => {
        const row = document.createElement('tr');
        
        let siteTypeText = 'Maravilla del Mundo';
        if (site.type === 'guatemala') {
            siteTypeText = 'Maravilla de Guatemala';
        } else if (site.type === 'other') {
            siteTypeText = 'Otro Sitio Turístico';
        }
        
        row.innerHTML = `
            <td>${site.id}</td>
            <td>${site.name}</td>
            <td>${site.country}</td>
            <td>${siteTypeText}</td>
            <td>${site.marker || 'No asignado'}</td>
            <td>
                <i class="action-icon edit-icon" data-id="${site.id}">✏️</i>
                <i class="action-icon delete-icon" data-id="${site.id}">🗑️</i>
            </td>
        `;
        
        sitesTableBody.appendChild(row);
    });
    
    document.getElementById('total-sites').textContent = sites.length;

    assignSiteButtonEvents();
}

function assignSiteButtonEvents() {
    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const siteId = this.getAttribute('data-id');
            openSiteModal(siteId);
        });
    });
    
    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const siteId = this.getAttribute('data-id');
            deleteSite(siteId);
        });
    });
}

function openSiteModal(siteId = null) {
    const modal = document.getElementById('site-modal');
    const modalTitle = document.getElementById('site-modal-title');
    const form = document.getElementById('site-form');
    
    form.reset();
    document.getElementById('preview-1').style.display = 'none';
    document.getElementById('preview-2').style.display = 'none';
    
    if (siteId) {
        modalTitle.textContent = 'Editar Sitio';
        
        const siteDB = JSON.parse(localStorage.getItem('siteDB')) || {};
        const site = siteDB[siteId];
        
        if (site) {
            document.getElementById('site-id').value = site.id;
            document.getElementById('site-id').readOnly = true; 
            document.getElementById('site-name').value = site.name;
            document.getElementById('site-country').value = site.country;
            document.getElementById('site-type').value = site.type;
            document.getElementById('site-description').value = site.description;
            document.getElementById('site-history').value = site.history;
            document.getElementById('site-map').value = site.mapLink;
            document.getElementById('site-web').value = site.webLink;
            
            if (site.marker) {
                document.getElementById('site-marker').value = site.marker;
            }
            if (site.filterType) {
                document.getElementById('site-filter').value = site.filterType;
            }
            
            if (site.images && site.images.length > 0) {
                document.getElementById('preview-1').style.backgroundImage = `url('${site.images[0]}')`;
                document.getElementById('preview-1').style.display = 'block';
                
                if (site.images.length > 1) {
                    document.getElementById('preview-2').style.backgroundImage = `url('${site.images[1]}')`;
                    document.getElementById('preview-2').style.display = 'block';
                }
            }
        }
    } else {
        modalTitle.textContent = 'Agregar Nuevo Sitio';
        document.getElementById('site-id').readOnly = false;
    }
    
    loadMarkerOptions();
    loadFilterOptions();
    
    modal.classList.remove('hidden');
}

function loadMarkerOptions() {
    const markerSelect = document.getElementById('site-marker');
    const markers = JSON.parse(localStorage.getItem('turisarMarkers')) || [];
    
    markerSelect.innerHTML = '<option value="">Seleccione un marcador</option>';
    
    markers.forEach(marker => {
        const option = document.createElement('option');
        option.value = marker.id;
        option.textContent = marker.name;
        markerSelect.appendChild(option);
    });
}

function loadFilterOptions() {
    const filterSelect = document.getElementById('site-filter');
    const filters = JSON.parse(localStorage.getItem('turisarFilters')) || [];
    
    filterSelect.innerHTML = '<option value="">Seleccione un filtro</option>';
    
    filters.forEach(filter => {
        const option = document.createElement('option');
        option.value = filter.id;
        option.textContent = filter.name;
        filterSelect.appendChild(option);
    });
}

function saveSite(siteData) {
    const siteDB = JSON.parse(localStorage.getItem('siteDB')) || {};
    siteDB[siteData.id] = siteData;
    localStorage.setItem('siteDB', JSON.stringify(siteDB));
    const sites = Object.values(siteDB);
    renderSitesTable(sites);
}

function syncSitesWithMainPage(sites) {
    try {
        const mainPageSitesDB = {};
        
        sites.forEach(site => {
            mainPageSitesDB[site.id] = {
                name: site.name,
                country: site.country,
                description: site.description,
                history: site.history || "",
                mapLink: site.mapLink || "#",
                webLink: site.webLink || "#",
                images: site.images || [],
                filterType: site.filterType || "",
                type: site.type,
                videos: site.videos || [],
                index: site.index || []
            };
        });
        
        try {
            localStorage.setItem('sitesDB', JSON.stringify(mainPageSitesDB));
            const externalFormat = convertToExternalFormat(mainPageSitesDB);
            localStorage.setItem('originalMaravillasJSON', JSON.stringify(externalFormat));
            console.log('Datos guardados correctamente en ambos formatos');
        } catch (storageError) {
            console.warn('Error al guardar en localStorage:', storageError);
            const tempDB = {};
            Object.keys(mainPageSitesDB).forEach(key => {
                tempDB[key] = {...mainPageSitesDB[key]};
                if (tempDB[key].images && tempDB[key].images.length > 0) {
                    tempDB[key].images = tempDB[key].images.slice(0, 1);
                }
            });
            
            try {
                localStorage.setItem('sitesDB', JSON.stringify(tempDB));
                alert('Se ha guardado una versión simplificada de los datos debido a limitaciones de espacio. Algunas imágenes pueden no estar disponibles.');
                return;
            } catch (error2) {
                if (cleanupStorage()) {
                    try {
                        localStorage.setItem('sitesDB', JSON.stringify(mainPageSitesDB));
                    } catch (finalError) {
                        handleStorageFailure();
                    }
                } else {
                    handleStorageFailure();
                }
            }
        }
    } catch (error) {
        console.error('Error al procesar los sitios:', error);
        alert('Ha ocurrido un error al guardar los datos. Por favor, inténtelo de nuevo.');
    }
}

function cleanupStorage() {
    try {
        const nonEssentialKeys = [
            'arMarkers', 
            'turisarFilters'
        ];
        
        for (const key of nonEssentialKeys) {
            localStorage.removeItem(key);
        }
        
        const sitesDB = JSON.parse(localStorage.getItem('sitesDB') || '{}');
        const sites = JSON.parse(localStorage.getItem('turisarSites') || '[]');
        
        if (Object.keys(sitesDB).length > 0) {
            Object.keys(sitesDB).forEach(key => {
                const site = sitesDB[key];
                
                if (site.images && site.images.length > 0) {
                    site.images = [compressImageDataUrl(site.images[0], 0.3, 400)];
                } else {
                    site.images = [];
                }
            });
            
            localStorage.setItem('sitesDB', JSON.stringify(sitesDB));
            console.log('Datos comprimidos y optimizados');
        }
        
        return true;
    } catch (error) {
        console.error('Error durante la limpieza de almacenamiento:', error);
        return false;
    }
}

function compressImageDataUrl(dataUrl, quality = 0.5, maxWidth = 800) {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.onload = function() {
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            
            img.onerror = function() {
                reject(new Error('Error al cargar la imagen para compresión'));
            };
            
            img.src = dataUrl;
        } catch (error) {
            reject(error);
        }
    });
}

function handleStorageFailure() {
    console.error('Error crítico de almacenamiento');
    alert('No hay espacio suficiente para guardar los datos. Por favor, elimine algunos sitios o imágenes antes de continuar.');
}

function processImageForStorage(imageFile, callback) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        compressImage(e.target.result, function(compressedImageUrl) {
            callback(compressedImageUrl);
        }, 0.4, 800);
    };
    
    reader.readAsDataURL(imageFile);
}

function compressImage(dataUrl, callback, quality = 0.4, maxWidth = 800) {
    const img = new Image();
    img.onload = function() {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        callback(compressedDataUrl);
        
        const originalSize = Math.round(dataUrl.length / 1024);
        const compressedSize = Math.round(compressedDataUrl.length / 1024);
        const savings = Math.round((dataUrl.length - compressedDataUrl.length) / dataUrl.length * 100);
        console.log(`Compresión: ${originalSize}KB → ${compressedSize}KB (${savings}% reducción)`);
    };
    
    img.src = dataUrl;
}

function deleteSite(siteId) {
    if (confirm('¿Estás seguro de que deseas eliminar este sitio?')) {
        const siteDB = JSON.parse(localStorage.getItem('siteDB')) || {};
        delete siteDB[siteId];
        localStorage.setItem('siteDB', JSON.stringify(siteDB));
        renderSitesTable(Object.values(siteDB));
    }
}

function loadMarkersData() {
    const markersGrid = document.getElementById('markers-grid');
    let markers = JSON.parse(localStorage.getItem('turisarMarkers')) || [];
    
    renderMarkers(markers);
    
    document.getElementById('add-marker-btn').addEventListener('click', openMarkerModal);
}

function renderMarkers(markers) {
    const markersGrid = document.getElementById('markers-grid');
    markersGrid.innerHTML = '';
    
    markers.forEach(marker => {
        const markerCard = document.createElement('div');
        markerCard.className = 'marker-card';
        
        markerCard.innerHTML = `
            <div class="marker-image" style="background-image: url('${marker.image}')"></div>
            <div class="marker-info">
                <h4>${marker.name}</h4>
                <p>${marker.description}</p>
                <small>ID: ${marker.id} | Índice: ${marker.targetIndex}</small>
            </div>
            <div class="marker-actions">
                <button class="edit-marker-btn" data-id="${marker.id}">Editar</button>
                <button class="delete-btn" data-id="${marker.id}">Eliminar</button>
            </div>
        `;
        
        markersGrid.appendChild(markerCard);
    });
    
    document.getElementById('total-markers').textContent = markers.length;

    assignMarkerButtonEvents();
}

function assignMarkerButtonEvents() {
    document.querySelectorAll('.edit-marker-btn').forEach(button => {
        button.addEventListener('click', function() {
            const markerId = this.getAttribute('data-id');
            openMarkerModal(markerId);
        });
    });
    
    document.querySelectorAll('.marker-actions .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const markerId = this.getAttribute('data-id');
            deleteMarker(markerId);
        });
    });
}

function openMarkerModal(markerId = null) {
    let modal = document.getElementById('marker-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'marker-modal';
        modal.className = 'admin-modal hidden';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="marker-modal-title">Agregar Nuevo Marcador AR</h2>
                    <span class="close-modal">&times;</span>
                </div>
                
                <form id="marker-form">
                    <div class="form-group">
                        <label for="marker-id">ID del marcador</label>
                        <input type="text" id="marker-id" name="marker-id" placeholder="Ej: coliseo" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="marker-name">Nombre del marcador</label>
                        <input type="text" id="marker-name" name="marker-name" placeholder="Ej: Coliseo Romano" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="marker-description">Descripción</label>
                        <textarea id="marker-description" name="marker-description" rows="3" placeholder="Breve descripción del marcador" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="marker-target-index">Índice de target (0-9)</label>
                        <input type="number" id="marker-target-index" name="marker-target-index" min="0" max="9" value="0" required>
                        <p class="help-text">El índice corresponde a la posición en el archivo targets.mind</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="marker-image">Imagen del marcador (referencia visual)</label>
                        <input type="file" id="marker-image" name="marker-image" accept="image/*" required>
                        <div class="image-preview" id="marker-preview"></div>
                        <p class="help-text">Esta imagen se utiliza solo para la visualización en el panel. Para que funcione como marcador AR, debe agregarse la imagen al sistema AR.</p>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Guardar</button>
                        <button type="button" class="cancel-btn">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        const markerImage = modal.querySelector('#marker-image');
        markerImage.addEventListener('change', function() {
            previewImage(this, 'marker-preview');
        });
        
        const markerForm = modal.querySelector('#marker-form');
        markerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const markerData = {
                id: document.getElementById('marker-id').value,
                name: document.getElementById('marker-name').value,
                description: document.getElementById('marker-description').value,
                targetIndex: parseInt(document.getElementById('marker-target-index').value, 10)
            };
            
            const imageFile = document.getElementById('marker-image').files[0];
            
            if (!imageFile && !markerId) {
                alert('Debe seleccionar una imagen para el marcador');
                return;
            }
            
            saveMarker(markerData, imageFile);
        });
    }
    
    const modalTitle = document.getElementById('marker-modal-title');
    const markerIdInput = document.getElementById('marker-id');
    const markerNameInput = document.getElementById('marker-name');
    const markerDescInput = document.getElementById('marker-description');
    const markerTargetIndexInput = document.getElementById('marker-target-index');
    const markerPreview = document.getElementById('marker-preview');
    
    document.getElementById('marker-form').reset();
    markerPreview.style.backgroundImage = '';
    markerPreview.style.display = 'none';
    
    if (markerId) {
        modalTitle.textContent = 'Editar Marcador AR';
        
        const markers = JSON.parse(localStorage.getItem('turisarMarkers')) || [];
        const marker = markers.find(m => m.id === markerId);
        
        if (marker) {
            markerIdInput.value = marker.id;
            markerIdInput.readOnly = true;
            markerNameInput.value = marker.name;
            markerDescInput.value = marker.description;
            markerTargetIndexInput.value = marker.targetIndex;
            
            if (marker.image) {
                markerPreview.style.backgroundImage = `url('${marker.image}')`;
                markerPreview.style.display = 'block';
            }
        }
    } else {
        modalTitle.textContent = 'Agregar Nuevo Marcador AR';
        markerIdInput.readOnly = false;
        
        const markers = JSON.parse(localStorage.getItem('turisarMarkers')) || [];
        const usedIndices = markers.map(m => m.targetIndex);
        let availableIndex = 0;
        
        while (usedIndices.includes(availableIndex) && availableIndex < 10) {
            availableIndex++;
        }
        
        markerTargetIndexInput.value = availableIndex;
    }
    
    modal.classList.remove('hidden');
}

function saveMarker(markerData, imageFile) {
    let markers = JSON.parse(localStorage.getItem('turisarMarkers')) || [];
    
    if (imageFile) {
        processImageForStorage(imageFile, function(imageUrl) {
            markerData.image = imageUrl;
            completeMarkerSave(markerData, markers);
        });
    } else {
        const existingMarker = markers.find(marker => marker.id === markerData.id);
        if (existingMarker && existingMarker.image) {
            markerData.image = existingMarker.image;
        }
        completeMarkerSave(markerData, markers);
    }
}

function completeMarkerSave(markerData, markers) {
    const existingIndex = markers.findIndex(marker => marker.id === markerData.id);
    
    const conflictingMarker = markers.find(marker => 
        marker.targetIndex === markerData.targetIndex && marker.id !== markerData.id);
    
    if (conflictingMarker) {
        if (!confirm(`El índice ${markerData.targetIndex} ya está siendo usado por el marcador "${conflictingMarker.name}". ¿Desea reasignar este índice?`)) {
            return;
        }
    }
    
    if (existingIndex >= 0) {
        markers[existingIndex] = { ...markers[existingIndex], ...markerData };
    } else {
        markers.push(markerData);
    }
    
    localStorage.setItem('turisarMarkers', JSON.stringify(markers));
    syncMarkersWithARSystem(markers);
    renderMarkers(markers);
    const modal = document.getElementById('marker-modal');
    if (modal) modal.classList.add('hidden');
}

function syncMarkersWithARSystem(markers) {
    const arMarkers = {};
    
    markers.forEach(marker => {
        arMarkers[marker.id] = {
            targetIndex: marker.targetIndex,
            name: marker.name,
            description: marker.description,
            image: marker.image
        };
    });
    
    localStorage.setItem('arMarkers', JSON.stringify(arMarkers));
    updateSitesWithMarkers(markers);
}

function updateSitesWithMarkers(markers) {
    const sites = JSON.parse(localStorage.getItem('turisarSites')) || [];
    let updated = false;
    
    sites.forEach(site => {
        const marker = markers.find(m => m.id === site.marker);
        if (marker) {
            updated = true;
        }
    });
    
    if (updated) {
        syncSitesWithMainPage(sites);
    }
}

function deleteMarker(markerId) {
    if (confirm('¿Estás seguro de que deseas eliminar este marcador?')) {
        let markers = JSON.parse(localStorage.getItem('turisarMarkers')) || [];
        markers = markers.filter(marker => marker.id !== markerId);
        localStorage.setItem('turisarMarkers', JSON.stringify(markers));
        renderMarkers(markers);
    }
}

function loadFiltersData() {
    const filtersGrid = document.getElementById('filters-grid');
    let filters = JSON.parse(localStorage.getItem('turisarFilters')) || [];
    
    renderFilters(filters);
    
    document.getElementById('add-filter-btn').addEventListener('click', openFilterModal);
}

function renderFilters(filters) {
    const filtersGrid = document.getElementById('filters-grid');
    filtersGrid.innerHTML = '';
    
    filters.forEach(filter => {
        const filterCard = document.createElement('div');
        filterCard.className = 'filter-card';
        
        filterCard.innerHTML = `
            <div class="filter-image" style="background-image: url('${filter.image}')"></div>
            <div class="filter-info">
                <h4>${filter.name}</h4>
                <p>${filter.description}</p>
                <small>ID: ${filter.id}</small>
            </div>
            <div class="filter-actions">
                <button class="edit-filter-btn" data-id="${filter.id}">Editar</button>
                <button class="delete-btn" data-id="${filter.id}">Eliminar</button>
            </div>
        `;
        
        filtersGrid.appendChild(filterCard);
    });
    
    document.getElementById('total-filters').textContent = filters.length;
    
    document.querySelectorAll('.edit-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const filterId = this.getAttribute('data-id');
            openFilterModal(filterId);
        });
    });
    
    document.querySelectorAll('.filter-actions .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const filterId = this.getAttribute('data-id');
            deleteFilter(filterId);
        });
    });
}

function saveFilter(filterData, imageFile) {
    let filters = JSON.parse(localStorage.getItem('turisarFilters')) || [];
    
    if (imageFile) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            filterData.image = e.target.result;
            
            const existingFilterIndex = filters.findIndex(filter => filter.id === filterData.id);
            
            if (existingFilterIndex >= 0) {
                filters[existingFilterIndex] = { ...filters[existingFilterIndex], ...filterData };
            } else {
                filters.push(filterData);
            }
            
            localStorage.setItem('turisarFilters', JSON.stringify(filters));
            
            renderFilters(filters);
            
            const modal = document.getElementById('filter-modal');
            if (modal) modal.classList.add('hidden');
        };
        
        reader.readAsDataURL(imageFile);
    } else {
        const existingFilterIndex = filters.findIndex(filter => filter.id === filterData.id);
        
        if (existingFilterIndex >= 0) {
            filters[existingFilterIndex] = { ...filters[existingFilterIndex], ...filterData };
        } else {
            alert('Debe proporcionar una imagen para el nuevo filtro');
            return;
        }
        
        localStorage.setItem('turisarFilters', JSON.stringify(filters));
        
        renderFilters(filters);
        
        const modal = document.getElementById('filter-modal');
        if (modal) modal.classList.add('hidden');
    }
}

function uploadFilterModel(filterId, modelFile) {
    if (!modelFile) {
        alert('Debe seleccionar un archivo de modelo 3D (.glb)');
        return;
    }
    
    if (!modelFile.name.toLowerCase().endsWith('.glb')) {
        alert('El archivo debe ser un modelo 3D en formato .glb');
        return;
    }
    
    let filters = JSON.parse(localStorage.getItem('turisarFilters')) || [];
    const existingFilterIndex = filters.findIndex(filter => filter.id === filterId);
    
    if (existingFilterIndex >= 0) {
        filters[existingFilterIndex].modelPath = `../models/${filterId}.glb`;
        
        localStorage.setItem('turisarFilters', JSON.stringify(filters));
        
        alert(`Modelo para ${filterId} cargado con éxito (simulación)`);
    } else {
        alert('Filtro no encontrado');
    }
}

function openFilterModal(filterId = null) {
    let modal = document.getElementById('filter-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'filter-modal';
        modal.className = 'admin-modal hidden';
        
        modal.innerHTML = `
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        const filterImage = modal.querySelector('#filter-image');
        filterImage.addEventListener('change', function() {
            previewImage(this, 'filter-preview');
        });
        
        const filterForm = modal.querySelector('#filter-form');
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const filterData = {
                id: document.getElementById('filter-id').value,
                name: document.getElementById('filter-name').value,
                description: document.getElementById('filter-description').value,
                modelPath: `../models/${document.getElementById('filter-id').value}.glb`
            };
            
            const imageFile = document.getElementById('filter-image').files[0];
            const modelFile = document.getElementById('filter-model').files[0];
            
            saveFilter(filterData, imageFile);
            
            if (modelFile) {
                uploadFilterModel(filterData.id, modelFile);
            }
        });
    }
    
    const modalTitle = document.getElementById('filter-modal-title');
    const filterIdInput = document.getElementById('filter-id');
    const filterNameInput = document.getElementById('filter-name');
    const filterDescInput = document.getElementById('filter-description');
    const filterPreview = document.getElementById('filter-preview');
    
    document.getElementById('filter-form').reset();
    filterPreview.style.backgroundImage = '';
    filterPreview.style.display = 'none';
    
    if (filterId) {
        modalTitle.textContent = 'Editar Filtro';
        
        const filters = JSON.parse(localStorage.getItem('turisarFilters')) || [];
        const filter = filters.find(f => f.id === filterId);
        
        if (filter) {
            filterIdInput.value = filter.id;
            filterIdInput.readOnly = true;
            filterNameInput.value = filter.name;
            filterDescInput.value = filter.description;
            
            if (filter.image) {
                filterPreview.style.backgroundImage = `url('${filter.image}')`;
                filterPreview.style.display = 'block';
            }
        }
    } else {
        modalTitle.textContent = 'Agregar Nuevo Filtro';
        filterIdInput.readOnly = false;
    }
    
    modal.classList.remove('hidden');
}

function deleteFilter(filterId) {
    if (confirm('¿Estás seguro de que deseas eliminar este filtro?')) {
        let filters = JSON.parse(localStorage.getItem('turisarFilters')) || [];
        filters = filters.filter(filter => filter.id !== filterId);
        localStorage.setItem('turisarFilters', JSON.stringify(filters));
        renderFilters(filters);
    }
}

function setupModalEvents() {
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.admin-modal').classList.add('hidden');
        });
    });
    
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.admin-modal').classList.add('hidden');
        });
    });
    
    document.getElementById('site-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const siteData = {
            id: document.getElementById('site-id').value,
            name: document.getElementById('site-name').value,
            country: document.getElementById('site-country').value,
            type: document.getElementById('site-type').value,
            description: document.getElementById('site-description').value,
            history: document.getElementById('site-history').value,
            mapLink: document.getElementById('site-map').value,
            webLink: document.getElementById('site-web').value,
            marker: document.getElementById('site-marker').value,
            filterType: document.getElementById('site-filter').value,
            images: []
        };
        
        const siteDB = JSON.parse(localStorage.getItem('siteDB')) || {};
        const existingSite = siteDB[siteData.id];
        if (existingSite && existingSite.images) {
            siteData.images = existingSite.images;
        }
        
        const image1 = document.getElementById('site-image-1').files[0];
        const image2 = document.getElementById('site-image-2').files[0];
        
        let imagesProcessed = 0;
        const totalImagesToProcess = (image1 ? 1 : 0) + (image2 ? 1 : 0);
        
        function saveWhenReady() {
            imagesProcessed++;
            if (imagesProcessed === totalImagesToProcess || totalImagesToProcess === 0) {
                saveSite(siteData);
                document.getElementById('site-modal').classList.add('hidden');
            }
        }
        
        if (image1) {
            processImageForStorage(image1, function(imageUrl) {
                siteData.images[0] = imageUrl;
                saveWhenReady();
            });
        }
        
        if (image2) {
            processImageForStorage(image2, function(imageUrl) {
                siteData.images[1] = imageUrl;
                saveWhenReady();
            });
        }
        
        if (totalImagesToProcess === 0) {
            saveSite(siteData);
            document.getElementById('site-modal').classList.add('hidden');
        }
    });
    
    document.getElementById('site-image-1').addEventListener('change', function(e) {
        previewImage(this, 'preview-1');
    });
    
    document.getElementById('site-image-2').addEventListener('change', function(e) {
        previewImage(this, 'preview-2');
    });
}

function processImageForStorage(imageFile, callback) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        compressImage(e.target.result, function(compressedImageUrl) {
            callback(compressedImageUrl);
        });
    };
    
    reader.readAsDataURL(imageFile);
}

function compressImage(dataUrl, callback, quality = 0.5, maxWidth = 800) {
    const img = new Image();
    img.onload = function() {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        callback(compressedDataUrl);
        
        console.log('Compresión de imagen:', 
            Math.round((dataUrl.length - compressedDataUrl.length) / dataUrl.length * 100) + '% reducción');
    };
    
    img.src = dataUrl;
}

function cleanupUnusedData() {
    try {
        const sites = JSON.parse(localStorage.getItem('turisarSites')) || [];
        const sitesDB = {};
        
        sites.forEach(site => {
            if (site.id && site.name) {
                sitesDB[site.id] = {
                    name: site.name,
                    country: site.country,
                    description: site.description,
                    history: site.history || "",
                    mapLink: site.mapLink || "#",
                    webLink: site.webLink || "#",
                    images: site.images || [],
                    filterType: site.filterType || "",
                    type: site.type
                };
            }
        });
        
        localStorage.setItem('sitesDB', JSON.stringify(sitesDB));
        return true;
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return false;
    }
}

function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.style.display = 'block';
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

function setupConfigSection() {
    const exportBtn = document.getElementById('export-config-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportConfigToJSON);
    }
    
    const importFileInput = document.getElementById('import-json-file');
    const importBtn = document.getElementById('import-config-btn');
    
    if (importFileInput && importBtn) {
        importFileInput.addEventListener('change', function() {
            importBtn.disabled = !this.files || !this.files.length;
            
            if (this.files && this.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const jsonContent = e.target.result;
                        document.getElementById('json-editor').value = formatJSON(jsonContent);
                    } catch (error) {
                        console.error('Error al leer el archivo JSON:', error);
                        showNotification('Error al leer el archivo JSON', true);
                    }
                };
                reader.readAsText(this.files[0]);
            }
        });
        
        importBtn.addEventListener('click', importConfigFromFile);
    }
    
    loadCurrentConfigToEditor();
    
    const applyJsonBtn = document.getElementById('apply-json-btn');
    if (applyJsonBtn) {
        applyJsonBtn.addEventListener('click', applyJSONFromEditor);
    }
    
    const formatJsonBtn = document.getElementById('format-json-btn');
    if (formatJsonBtn) {
        formatJsonBtn.addEventListener('click', function() {
            const jsonEditor = document.getElementById('json-editor');
            try {
                jsonEditor.value = formatJSON(jsonEditor.value);
            } catch (error) {
                showNotification('Error al formatear: JSON inválido', true);
            }
        });
    }
    
    const configOptions = document.querySelector('.config-options');
    if (configOptions) {
        const sitesCard = document.createElement('div');
        sitesCard.className = 'config-card';
        sitesCard.innerHTML = `
            <h3>Sitios Turísticos</h3>
            <p>Exporta o importa solo la información de sitios turísticos para la página de maravillas.</p>
            <div class="config-actions">
                <button id="export-sites-btn" class="action-btn">Exportar Sitios</button>
                <div class="file-input-container">
                    <input type="file" id="import-sites-file" accept=".json">
                    <label for="import-sites-file" class="file-input-label">Importar Sitios</label>
                </div>
            </div>
        `;
        configOptions.appendChild(sitesCard);

        document.getElementById('export-sites-btn').addEventListener('click', exportSitesToJSON);
        
        const importSitesInput = document.getElementById('import-sites-file');
        importSitesInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                importSitesFromFile(this.files[0]);
            }
        });
    }
}

function loadCurrentConfigToEditor() {
    try {
        const currentConfig = {
            sites: JSON.parse(localStorage.getItem('turisarSites') || '[]'),
            markers: JSON.parse(localStorage.getItem('turisarMarkers') || '[]'),
            filters: JSON.parse(localStorage.getItem('turisarFilters') || '[]'),
            sitesDB: JSON.parse(localStorage.getItem('sitesDB') || '{}'),
            arMarkers: JSON.parse(localStorage.getItem('arMarkers') || '{}'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const jsonEditor = document.getElementById('json-editor');
        if (jsonEditor) {
            jsonEditor.value = formatJSON(JSON.stringify(currentConfig));
        }
    } catch (error) {
        console.error('Error al cargar la configuración actual:', error);
        showNotification('Error al cargar la configuración actual en el editor', true);
    }
}

function exportConfigToJSON() {
    try {
        const config = {
            sites: JSON.parse(localStorage.getItem('turisarSites') || '[]'),
            markers: JSON.parse(localStorage.getItem('turisarMarkers') || '[]'),
            filters: JSON.parse(localStorage.getItem('turisarFilters') || '[]'),
            sitesDB: JSON.parse(localStorage.getItem('sitesDB') || '{}'),
            arMarkers: JSON.parse(localStorage.getItem('arMarkers') || '{}'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `turisar-config-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        showNotification('Configuración exportada correctamente');
    } catch (error) {
        console.error('Error al exportar configuración:', error);
        showNotification('Error al exportar la configuración', true);
    }
}

function exportSitesToJSON() {
    try {
        const sitesDB = JSON.parse(localStorage.getItem('sitesDB') || '{}');
        
        const sitesExport = {
            sitesDB: sitesDB,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(sitesExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `turisar-sitios-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        showNotification('Sitios turísticos exportados correctamente');
    } catch (error) {
        console.error('Error al exportar sitios turísticos:', error);
        showNotification('Error al exportar sitios turísticos', true);
    }
}

function importConfigFromFile() {
    const fileInput = document.getElementById('import-json-file');
    
    if (!fileInput.files || !fileInput.files.length) {
        showNotification('Por favor seleccione un archivo JSON', true);
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const jsonConfig = JSON.parse(e.target.result);
            applyConfigFromJSON(jsonConfig);
        } catch (error) {
            console.error('Error al importar el archivo JSON:', error);
            showNotification('El archivo no contiene un JSON válido', true);
        }
    };
    
    reader.onerror = function() {
        showNotification('Error al leer el archivo', true);
    };
    
    reader.readAsText(file);
}

function applyJSONFromEditor() {
    const jsonEditor = document.getElementById('json-editor');
    if (!jsonEditor.value.trim()) {
        showNotification('No hay JSON para aplicar.', true);
        return;
    }

    try {
        const config = JSON.parse(jsonEditor.value);

        if (config.sitesDB) {
            localStorage.setItem('sitesDB', JSON.stringify(config.sitesDB));
            showNotification('Sitios turísticos importados correctamente. Actualizando...');
        } else if (config.maravillas && Array.isArray(config.maravillas)) {
            const sitesDB = {};
            config.maravillas.forEach((item, index) => {
                const siteKey = `maravilla_${index}`;
                sitesDB[siteKey] = {
                    name: item.nombre || '',
                    description: item.descripcion_breve || '',
                    history: item.historia_detalles || '',
                    mapLink: item.link_mapa || '#',
                    webLink: item.link_web || '#',
                    type: item.tipo || 'other',
                    images: item.images || []
                };
            });
            localStorage.setItem('sitesDB', JSON.stringify(sitesDB));
            showNotification('Maravillas importadas correctamente. Actualizando...');
        }

        loadSitesData();
        loadMarkersData();
        loadFiltersData();
        setupModalEvents();
        assignSiteButtonEvents();
        assignMarkerButtonEvents();
        setupNavigation();
    } catch (error) {
        console.error('Error al aplicar JSON:', error);
        showNotification('Error al aplicar JSON: ' + error.message, true);
    }
}

function showPreviewModal(config) {
    let previewModal = document.getElementById('preview-modal');

    if (!previewModal) {
        previewModal = document.createElement('div');
        previewModal.id = 'preview-modal';
        previewModal.className = 'admin-modal hidden';
        previewModal.innerHTML = `
           
        `;
        document.body.appendChild(previewModal);

        previewModal.querySelector('.close-preview-modal').addEventListener('click', () => {
            previewModal.classList.add('hidden');
        });
        
        previewModal.querySelector('#cancel-preview-btn').addEventListener('click', () => {
            previewModal.classList.add('hidden');
        });
    }
    
    const formattedJson = JSON.stringify(config, null, 2);
    
    document.getElementById('preview-json').value = formattedJson;
    
    document.getElementById('json-editor').value = formattedJson;
    
    previewModal.classList.remove('hidden');
    
    document.getElementById('confirm-preview-btn').onclick = function() {
        previewModal.classList.add('hidden');
        applyConfigFromJSON(config);
    };
}

function applyConfigFromJSON(config) {
    try {
        if (!config || typeof config !== 'object') {
            throw new Error('Formato de configuración inválido');
        }
        
        const backup = {
            turisarSites: localStorage.getItem('turisarSites'),
            turisarMarkers: localStorage.getItem('turisarMarkers'),
            turisarFilters: localStorage.getItem('turisarFilters'),
            sitesDB: localStorage.getItem('sitesDB'),
            arMarkers: localStorage.getItem('arMarkers')
        };

        if (config.maravillas && Array.isArray(config.maravillas)) {
            localStorage.setItem('originalMaravillasJSON', JSON.stringify(config));
            
            const sitesDB = {};
            config.maravillas.forEach((item, idx) => {
                const siteKey = 'maravilla_' + idx;
                sitesDB[siteKey] = {
                    name: item.nombre || '',
                    description: item.descripcion_breve || '',
                    history: item.historia_detalles || '',
                    mapLink: item.link_mapa || '#',
                    webLink: item.link_web || '#',
                    type: item.tipo || 'other',
                    images: item.images || [],
                    videos: item.videos || [],
                    index: item.index || []
                };
            });

            localStorage.setItem('sitesDB', JSON.stringify(sitesDB));

            const sites = [];
            for (const [siteId, siteData] of Object.entries(sitesDB)) {
                sites.push({
                    id: siteId,
                    name: siteData.name,
                    country: "",
                    type: siteData.type,
                    description: siteData.description,
                    history: siteData.history,
                    mapLink: siteData.mapLink,
                    webLink: siteData.webLink,
                    images: siteData.images,
                    filterType: "",
                    marker: siteId,
                    index: siteData.index,
                    videos: siteData.videos
                });
            }
            localStorage.setItem('turisarSites', JSON.stringify(sites));
        } else if (config.sites || config.sitesDB) {
            if (config.sites) {
                localStorage.setItem('turisarSites', JSON.stringify(config.sites));
                
                const sitesDB = {};
                config.sites.forEach(site => {
                    sitesDB[site.id] = {
                        name: site.name,
                        country: site.country || "",
                        description: site.description || "",
                        history: site.history || "",
                        mapLink: site.mapLink || "#",
                        webLink: site.webLink || "#",
                        images: site.images || [],
                        filterType: site.filterType || "",
                        type: site.type || "other"
                    };
                });
                localStorage.setItem('sitesDB', JSON.stringify(sitesDB));
            }
            
            if (config.sitesDB) {
                localStorage.setItem('sitesDB', JSON.stringify(config.sitesDB));
                
                if (!config.sites) {
                    const sites = [];
                    for (const [id, site] of Object.entries(config.sitesDB)) {
                        sites.push({
                            id: id,
                            name: site.name,
                            country: site.country || "",
                            type: site.type || "other",
                            description: site.description || "",
                            history: site.history || "",
                            mapLink: site.mapLink || "#",
                            webLink: site.webLink || "#",
                            images: site.images || [],
                            filterType: site.filterType || "",
                            marker: site.marker || id
                        });
                    }
                    localStorage.setItem('turisarSites', JSON.stringify(sites));
                }
            }
            
            if (config.markers) localStorage.setItem('turisarMarkers', JSON.stringify(config.markers));
            if (config.filters) localStorage.setItem('turisarFilters', JSON.stringify(config.filters));
            if (config.arMarkers) localStorage.setItem('arMarkers', JSON.stringify(config.arMarkers));
        } else {
            try {
                const hasSiteProperties = Object.values(config).some(value => 
                    value && typeof value === 'object' && value.name && value.description);
                
                if (hasSiteProperties) {
                    localStorage.setItem('sitesDB', JSON.stringify(config));
                    
                    const sites = [];
                    for (const [id, site] of Object.entries(config)) {
                        if (site && site.name) {
                            sites.push({
                                id: id,
                                name: site.name,
                                country: site.country || "",
                                type: site.type || "other",
                                description: site.description || "",
                                history: site.history || "",
                                mapLink: site.mapLink || "#",
                                webLink: site.webLink || "#",
                                images: site.images || [],
                                filterType: site.filterType || "",
                                marker: site.marker || id
                            });
                        }
                    }
                    localStorage.setItem('turisarSites', JSON.stringify(sites));
                } else {
                    throw new Error('Estructura de datos no reconocida');
                }
            } catch (innerError) {
                console.error('Error al procesar estructura desconocida:', innerError);
                throw new Error('El JSON no tiene un formato compatible con el sistema');
            }
        }
        
        localStorage.setItem('sitesDBUpdated', new Date().getTime().toString());
        
        loadSitesData();
        loadMarkersData();
        loadFiltersData();
        setupModalEvents();
        assignSiteButtonEvents();
        assignMarkerButtonEvents();
        setupNavigation();
        
        showNotification('Cambios aplicados correctamente a todas las vistas');
        
        const fileInput = document.getElementById('import-json-file');
        if (fileInput) fileInput.value = '';
        
    } catch (error) {
        console.error('Error al aplicar la configuración:', error);
        showNotification('Error al aplicar la configuración: ' + error.message, true);
    }
}

function editSiteDirectly(siteId) {
    try {
        const sites = JSON.parse(localStorage.getItem('turisarSites') || '[]');
        const sitesDB = JSON.parse(localStorage.getItem('sitesDB') || '{}');
        
        const site = sites.find(s => s.id === siteId);
        
        if (site) {
            document.getElementById('json-editor').value = formatJSON(JSON.stringify(site));
            
            document.querySelector('.nav-btn[data-section="config"]').click();
            
            showNotification('Edite el sitio y luego haga clic en "Aplicar desde editor" para guardar los cambios');
        } else {
            showNotification('Sitio no encontrado', true);
        }
    } catch (error) {
        console.error('Error al cargar el sitio para edición directa:', error);
        showNotification('Error al cargar el sitio', true);
    }
}

function importSitesFromFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const sitesData = JSON.parse(e.target.result);
            
            if (!sitesData.sitesDB || typeof sitesData.sitesDB !== 'object') {
                throw new Error('El archivo no contiene una estructura válida de sitios turísticos');
            }
            
            document.getElementById('json-editor').value = formatJSON(JSON.stringify(sitesData.sitesDB));
            
            if (confirm('¿Quieres aplicar estos sitios turísticos inmediatamente o revisar primero el JSON en el editor?')) {
                localStorage.setItem('sitesDB', JSON.stringify(sitesData.sitesDB));
                
                importSitesToAdmin(sitesData.sitesDB);
                
                showNotification('Sitios turísticos importados correctamente');
                
                loadSitesData();
            }
        } catch (error) {
            console.error('Error al importar sitios turísticos:', error);
            showNotification('Archivo inválido: ' + error.message, true);
        }
    };
    
    reader.onerror = function() {
        showNotification('Error al leer el archivo', true);
    };
    
    reader.readAsText(file);
}

function importSitesToAdmin(sitesDB) {
    let sites = [];
    
    for (const [id, site] of Object.entries(sitesDB)) {
        sites.push({
            id: id,
            name: site.name,
            country: site.country,
            type: site.type || 'other',
            description: site.description || '',
            history: site.history || '',
            mapLink: site.mapLink || '#',
            webLink: site.webLink || '#',
            images: site.images || [],
            filterType: site.filterType || '',
            marker: site.marker || id
        });
    }
    
    localStorage.setItem('turisarSites', JSON.stringify(sites));
}

function showNotification(message, isError = false) {
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.toggle('error', isError);
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function formatJSON(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch (error) {
        throw new Error('JSON inválido');
    }
}

function exportExternalFormatJSON() {
    try {
        const sitesDB = JSON.parse(localStorage.getItem('sitesDB') || '{}');
        
        const externalFormat = convertToExternalFormat(sitesDB);
        
        const blob = new Blob([JSON.stringify(externalFormat, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `turisar-maravillas-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        showNotification('Sitios exportados en formato externo correctamente');
    } catch (error) {
        console.error('Error al exportar en formato externo:', error);
        showNotification('Error al exportar: ' + error.message, true);
    }
}

function saveSites(sites) {
    try {
        localStorage.setItem('sitesDB', JSON.stringify(sites));
        
        showNotification('Cambios guardados correctamente', false);
        
    } catch (error) {
        console.error('Error al guardar sitios:', error);
        showNotification('Error al guardar los cambios: ' + error.message, true);
    }
}

function convertFromExternalFormat(jsonData) {
	if (typeof jsonData === 'string') {
		try {
			return JSON.parse(jsonData);
		} catch(e) {
			console.error("Error al aplicar la configuración:", e);
			return null;
		}
	} else if (typeof jsonData === 'object' && jsonData !== null) {
		return jsonData;
	} else {
		console.error("Error al aplicar la configuración: formato inválido.");
		return null;
	}
}

function updateSiteField(siteId, field, value) {
    try {
        const sitesDB = JSON.parse(localStorage.getItem('sitesDB') || '{}');
        
        if (!sitesDB[siteId]) {
            throw new Error(`El sitio ${siteId} no existe`);
        }
        
        sitesDB[siteId][field] = value;
        
        localStorage.setItem('sitesDB', JSON.stringify(sitesDB));
        
        showNotification(`Campo ${field} actualizado correctamente`, false);
        return true;
    } catch (error) {
        console.error('Error al actualizar campo:', error);
        showNotification('Error al actualizar campo: ' + error.message, true);
        return false;
    }
}

function applyConfigFromJSON(config) {
    try {
        if (!config || typeof config !== 'object') {
            throw new Error('Formato de configuración inválido');
        }
        
        const backup = {
            turisarSites: localStorage.getItem('turisarSites'),
            turisarMarkers: localStorage.getItem('turisarMarkers'),
            turisarFilters: localStorage.getItem('turisarFilters'),
            sitesDB: localStorage.getItem('sitesDB'),
            arMarkers: localStorage.getItem('arMarkers')
        };

        if (config.maravillas && Array.isArray(config.maravillas)) {
            localStorage.setItem('originalMaravillasJSON', JSON.stringify(config));
            
            const sitesDB = {};
            config.maravillas.forEach((item, idx) => {
                const siteKey = 'maravilla_' + idx;
                sitesDB[siteKey] = {
                    name: item.nombre || '',
                    description: item.descripcion_breve || '',
                    history: item.historia_detalles || '',
                    mapLink: item.link_mapa || '#',
                    webLink: item.link_web || '#',
                    type: item.tipo || 'other',
                    images: item.images || [],
                    videos: item.videos || [],
                    index: item.index || []
                };
            });

            localStorage.setItem('sitesDB', JSON.stringify(sitesDB));

            const sites = [];
            for (const [siteId, siteData] of Object.entries(sitesDB)) {
                sites.push({
                    id: siteId,
                    name: siteData.name,
                    country: "",
                    type: siteData.type,
                    description: siteData.description,
                    history: siteData.history,
                    mapLink: siteData.mapLink,
                    webLink: siteData.webLink,
                    images: siteData.images,
                    filterType: "",
                    marker: siteId,
                    index: siteData.index,
                    videos: siteData.videos
                });
            }
            localStorage.setItem('turisarSites', JSON.stringify(sites));
        } else if (config.sites || config.sitesDB) {
            if (config.sites) {
                localStorage.setItem('turisarSites', JSON.stringify(config.sites));
                const sitesDB = {};
                config.sites.forEach(site => {
                    sitesDB[site.id] = {
                        name: site.name,
                        country: site.country || "",
                        description: site.description || "",
                        history: site.history || "",
                        mapLink: site.mapLink || "#",
                        webLink: site.webLink || "#",
                        images: site.images || [],
                        filterType: site.filterType || "",
                        type: site.type || "other"
                    };
                });
                localStorage.setItem('sitesDB', JSON.stringify(sitesDB));
            }
            
            if (config.sitesDB) {
                localStorage.setItem('sitesDB', JSON.stringify(config.sitesDB));
                if (!config.sites) {
                    const sites = [];
                    for (const [id, site] of Object.entries(config.sitesDB)) {
                        sites.push({
                            id: id,
                            name: site.name,
                            country: site.country || "",
                            type: site.type || "other",
                            description: site.description || "",
                            history: site.history || "",
                            mapLink: site.mapLink || "#",
                            webLink: site.webLink || "#",
                            images: site.images || [],
                            filterType: site.filterType || "",
                            marker: site.marker || id
                        });
                    }
                    localStorage.setItem('turisarSites', JSON.stringify(sites));
                }
            }
            if (config.markers) localStorage.setItem('turisarMarkers', JSON.stringify(config.markers));
            if (config.filters) localStorage.setItem('turisarFilters', JSON.stringify(config.filters));
            if (config.arMarkers) localStorage.setItem('arMarkers', JSON.stringify(config.arMarkers));
        } else {
            try {
                const hasSiteProperties = Object.values(config).some(value => 
                    value && typeof value === 'object' && value.name && value.description);
                
                if (hasSiteProperties) {
                    localStorage.setItem('sitesDB', JSON.stringify(config));
                    const sites = [];
                    for (const [id, site] of Object.entries(config)) {
                        if (site && site.name) {
                            sites.push({
                                id: id,
                                name: site.name,
                                country: site.country || "",
                                type: site.type || "other",
                                description: site.description || "",
                                history: site.history || "",
                                mapLink: site.mapLink || "#",
                                webLink: site.webLink || "#",
                                images: site.images || [],
                                filterType: site.filterType || "",
                                marker: site.marker || id
                            });
                        }
                    }
                    localStorage.setItem('turisarSites', JSON.stringify(sites));
                } else {
                    throw new Error('Estructura de datos no reconocida');
                }
            } catch (innerError) {
                console.error('Error al procesar estructura desconocida:', innerError);
                throw new Error('El JSON no tiene un formato compatible con el sistema');
            }
        }
        
        localStorage.setItem('sitesDBUpdated', new Date().getTime().toString());
        
        loadSitesData();
        loadMarkersData();
        loadFiltersData();
        setupModalEvents();
        assignSiteButtonEvents();
        assignMarkerButtonEvents();
        setupNavigation();
        
        showNotification('Cambios aplicados correctamente a todas las vistas');
        const fileInput = document.getElementById('import-json-file');
        if (fileInput) fileInput.value = '';
        
    } catch (error) {
        console.error('Error al aplicar la configuración:', error);
        showNotification('Error al aplicar la configuración: ' + error.message, true);
    }
}

// Nueva función para ingresar un nuevo JSON para originalMaravillasJSON
function setupOriginalJSONButton() {
    const container = document.getElementById('config-section');
    if (!container) return;

    const newBtn = document.createElement('button');
    newBtn.id = 'new-original-json-btn';
    newBtn.textContent = 'Ingresar nuevo JSON para originalMaravillasJSON';
    container.appendChild(newBtn);

    newBtn.addEventListener('click', function() {
        const textArea = document.getElementById('json-editor');
        if (!textArea || !textArea.value.trim()) {
            alert('Por favor, ingrese el JSON en el editor.');
            return;
        }
        try {
            const parsed = JSON.parse(textArea.value);
            localStorage.setItem('originalMaravillasJSON', JSON.stringify(parsed));
            alert('El nuevo JSON se ha guardado correctamente en originalMaravillasJSON.');
        } catch (error) {
            alert('Error al parsear el JSON: ' + error.message);
        }
    });
}
