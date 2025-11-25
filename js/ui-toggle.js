/**
 * UI Toggle Module
 * Handles toggle functionality for legend and regions list
 */

const UIToggle = {
    /**
     * Initialize toggle handlers
     */
    init() {
        // Get elements
        const toggleLegend = document.getElementById('toggleLegend');
        const toggleRegions = document.getElementById('toggleRegions');
        const closeLegend = document.getElementById('closeLegend');
        const closeRegions = document.getElementById('closeRegions');
        const legend = document.getElementById('legend');
        const regionsList = document.getElementById('regionsList');

        // Check if mobile
        const isMobile = () => window.innerWidth <= 768;

        // Initialize visibility based on screen size
        const initializeVisibility = () => {
            // Hide both panels by default on all devices
            legend.classList.add('hidden');
            legend.classList.remove('visible');
            regionsList.classList.add('hidden');
            regionsList.classList.remove('visible');
            toggleLegend.classList.remove('active');
            toggleRegions.classList.remove('active');
        };

        // Toggle legend
        const toggleLegendPanel = () => {
            if (isMobile()) {
                // Mobile: use visible class
                const isVisible = legend.classList.contains('visible');
                if (isVisible) {
                    legend.classList.remove('visible');
                    legend.classList.add('hidden');
                    toggleLegend.classList.remove('active');
                } else {
                    legend.classList.add('visible');
                    legend.classList.remove('hidden');
                    toggleLegend.classList.add('active');
                }
            } else {
                // Desktop: use hidden class
                const isHidden = legend.classList.contains('hidden');
                if (isHidden) {
                    legend.classList.remove('hidden');
                    toggleLegend.classList.add('active');
                } else {
                    legend.classList.add('hidden');
                    toggleLegend.classList.remove('active');
                }
            }
        };

        // Toggle regions list
        const toggleRegionsPanel = () => {
            if (isMobile()) {
                // Mobile: use visible class
                const isVisible = regionsList.classList.contains('visible');
                if (isVisible) {
                    regionsList.classList.remove('visible');
                    regionsList.classList.add('hidden');
                    toggleRegions.classList.remove('active');
                } else {
                    regionsList.classList.add('visible');
                    regionsList.classList.remove('hidden');
                    toggleRegions.classList.add('active');
                }
            } else {
                // Desktop: use hidden class
                const isHidden = regionsList.classList.contains('hidden');
                if (isHidden) {
                    regionsList.classList.remove('hidden');
                    toggleRegions.classList.add('active');
                } else {
                    regionsList.classList.add('hidden');
                    toggleRegions.classList.remove('active');
                }
            }
        };

        // Close legend (mobile)
        const closeLegendPanel = () => {
            if (isMobile()) {
                legend.classList.remove('visible');
                legend.classList.add('hidden');
                toggleLegend.classList.remove('active');
            }
        };

        // Close regions list (mobile)
        const closeRegionsPanel = () => {
            if (isMobile()) {
                regionsList.classList.remove('visible');
                regionsList.classList.add('hidden');
                toggleRegions.classList.remove('active');
            }
        };

        // Event listeners
        if (toggleLegend) {
            toggleLegend.addEventListener('click', toggleLegendPanel);
        }

        if (toggleRegions) {
            toggleRegions.addEventListener('click', toggleRegionsPanel);
        }

        if (closeLegend) {
            closeLegend.addEventListener('click', closeLegendPanel);
        }

        if (closeRegions) {
            closeRegions.addEventListener('click', closeRegionsPanel);
        }

        // Initialize on load
        initializeVisibility();

        // Re-initialize on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(initializeVisibility, 150);
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIToggle.init());
} else {
    UIToggle.init();
}
