/**
 * Main Application
 * Orchestrates the election map visualization
 */

const App = {
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Show loading overlay
            this.showLoading();

            // Initialize map
            ElectionMap.init('map');

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
            // Get configuration (use custom config if available, otherwise use defaults)
            const config = window.ELECTION_CONFIG || {
                geoDataPath: 'data/geo/spain-comunidades.json',
                electionDataPath: 'data/elections/2023-generales.json',
                mapCenter: [40.4, -3.7],
                mapZoom: 6,
                geoIdProperty: null,
                geoNameProperty: 'name'
            };

            // Load geographic boundaries and election data
            const [geoJSON, electionData] = await Promise.all([
                DataLoader.loadGeoJSON(config.geoDataPath),
                DataLoader.loadElectionData(config.electionDataPath)
            ]);

            // Merge data (pass ID property for custom matching)
            const mergedData = DataLoader.mergeData(geoJSON, electionData, config.geoIdProperty);

            // Display on map (pass config for map center/zoom)
            ElectionMap.loadData(mergedData, electionData, config);

            // Create legend
            ElectionMap.createLegend(electionData);

            // Create regions list
            ElectionMap.createRegionsList(mergedData, electionData);

        } catch (error) {
            console.error('Error loading data:', error);
            throw new Error('Could not load data. Please verify that the files exist.');
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
                        Retry
                    </button>
                </div>
            `;
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
