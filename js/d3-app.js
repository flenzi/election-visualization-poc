/**
 * D3.js Application
 * Main application logic for D3 visualization
 */

const D3App = {
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Show loading overlay
            this.showLoading();

            // Initialize D3 map
            D3Map.init('map');

            // Load data
            await this.loadAllData();

            // Hide loading overlay
            this.hideLoading();

        } catch (error) {
            console.error('Application initialization error:', error);
            this.showError(error.message);
        }
    },

    /**
     * Load all required data
     */
    async loadAllData() {
        try {
            await D3Map.loadData(
                'data/geo/spain-comunidades.topojson',
                'data/elections/2023-generales.json'
            );
        } catch (error) {
            console.error('Error loading data:', error);
            throw new Error('No se pudieron cargar los datos. Por favor, verifica que los archivos existen.');
        }
    },

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 500);
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="color: #E53935; margin-bottom: 1rem;">Error</h2>
                    <p style="color: #757575;">${message}</p>
                    <button onclick="location.reload()"
                            style="margin-top: 1rem; padding: 0.5rem 1rem;
                                   background: #667eea; color: white;
                                   border: none; border-radius: 4px;
                                   cursor: pointer;">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => D3App.init());
} else {
    D3App.init();
}
