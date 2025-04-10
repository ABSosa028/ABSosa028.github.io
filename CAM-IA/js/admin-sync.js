/**
 * Sistema de sincronización entre el panel de administración y la vista AR
 * Este script asegura que los cambios realizados en el panel de administración
 * se reflejen automáticamente en la vista AR
 */

(function() {
    function convertToMaravillas(sitesDB) {
        if (!sitesDB) return { mind: "completa.mind", maravillas: [] };
        
        const maravillas = [];
        Object.entries(sitesDB).forEach(([id, site], index) => {
            const baseIndex = index * 10;
            const indices = [];
            for (let i = 0; i < 10; i++) {
                indices.push(baseIndex + i);
            }
            maravillas.push({
                id: id,
                index: site.index || indices,
                images: site.images || [],
                videos: site.videos || [],
                filtros: site.filterType || site.filtros || "filtro1",
                nombre: site.name || site.nombre || id,
                link_mapa: site.mapLink || site.link_mapa || "",
                link_web: site.webLink || site.link_web || "",
                descripcion_breve: site.description || site.descripcion_breve || "",
                historia_detalles: site.history || site.historia_detalles || "",
                tipo: site.type || site.tipo || "other",
                user_creacion: site.user_creacion || "admin"
            });
        });
        
        return {
            mind: "completa.mind",
            maravillas: maravillas
        };
    }
    function updateMaravillasFormat() {
        try {
            const sitesDB = localStorage.getItem('sitesDB');
            if (sitesDB) {
                const sites = JSON.parse(sitesDB);
                const maravillasData = convertToMaravillas(sites);
                localStorage.setItem('originalMaravillasJSON', JSON.stringify(maravillasData));
                console.log('Datos sincronizados para AR View');
                const syncEvent = new StorageEvent('storage', {
                    key: 'originalMaravillasJSON',
                    newValue: JSON.stringify(maravillasData),
                    url: window.location.href
                });
                window.dispatchEvent(syncEvent);
            }
        } catch (error) {
            console.error('Error al sincronizar datos:', error);
        }
    }
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.call(this, key, value);
        if (key === 'sitesDB') {
            updateMaravillasFormat();
        }
    };
    window.updateSite = function(siteId, field, value) {
        try {
            const sitesDB = JSON.parse(localStorage.getItem('sitesDB') || '{}');
            if (!sitesDB[siteId]) {
                sitesDB[siteId] = {
                    name: siteId,
                    type: "other",
                    images: [],
                    videos: [],
                    user_creacion: "admin"
                };
            }
            sitesDB[siteId][field] = value;
            localStorage.setItem('sitesDB', JSON.stringify(sitesDB));
            
            return true;
        } catch (error) {
            console.error('Error al actualizar sitio:', error);
            return false;
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateMaravillasFormat);
    } else {
        updateMaravillasFormat();
    }
})();
