/**
 * UI Toggle Module
 * Handles toggle functionality for legend and regions list panels
 *
 * Interaction Model:
 * - Desktop (>768px): Hover to show panels with 300ms delayed hide on mouse out
 * - Mobile (≤768px): Click to toggle panels, with close button support
 *
 * Features:
 * - Timeout management to prevent premature panel hiding
 * - Smooth transitions between hover/click states
 * - Automatic re-initialization on window resize
 * - Device-specific event handling
 */

const UIToggle = {
    legendTimeout: null,
    regionsTimeout: null,

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

        // Initialize visibility - hide by default
        const initializeVisibility = () => {
            legend.classList.add('hidden');
            legend.classList.remove('visible');
            regionsList.classList.add('hidden');
            regionsList.classList.remove('visible');
            toggleLegend.classList.remove('active');
            toggleRegions.classList.remove('active');
        };

        // Show legend
        const showLegend = () => {
            clearTimeout(this.legendTimeout);
            if (isMobile()) {
                legend.classList.add('visible');
                legend.classList.remove('hidden');
            } else {
                legend.classList.remove('hidden');
            }
            toggleLegend.classList.add('active');
        };

        // Hide legend
        const hideLegend = () => {
            if (isMobile()) {
                legend.classList.remove('visible');
                legend.classList.add('hidden');
            } else {
                legend.classList.add('hidden');
            }
            toggleLegend.classList.remove('active');
        };

        // Hide legend with delay (desktop hover)
        const hideLegendDelayed = () => {
            if (!isMobile()) {
                this.legendTimeout = setTimeout(() => {
                    hideLegend();
                }, 300);
            }
        };

        // Show regions
        const showRegions = () => {
            clearTimeout(this.regionsTimeout);
            if (isMobile()) {
                regionsList.classList.add('visible');
                regionsList.classList.remove('hidden');
            } else {
                regionsList.classList.remove('hidden');
            }
            toggleRegions.classList.add('active');
        };

        // Hide regions
        const hideRegions = () => {
            if (isMobile()) {
                regionsList.classList.remove('visible');
                regionsList.classList.add('hidden');
            } else {
                regionsList.classList.add('hidden');
            }
            toggleRegions.classList.remove('active');
        };

        // Hide regions with delay (desktop hover)
        const hideRegionsDelayed = () => {
            if (!isMobile()) {
                this.regionsTimeout = setTimeout(() => {
                    hideRegions();
                }, 300);
            }
        };

        // Desktop: Hover events for legend
        if (!isMobile()) {
            // Toggle button hover
            toggleLegend.addEventListener('mouseenter', showLegend);
            toggleLegend.addEventListener('mouseleave', hideLegendDelayed);

            // Panel hover
            legend.addEventListener('mouseenter', () => {
                clearTimeout(this.legendTimeout);
            });
            legend.addEventListener('mouseleave', hideLegendDelayed);

            // Toggle button hover for regions
            toggleRegions.addEventListener('mouseenter', showRegions);
            toggleRegions.addEventListener('mouseleave', hideRegionsDelayed);

            // Regions panel hover
            regionsList.addEventListener('mouseenter', () => {
                clearTimeout(this.regionsTimeout);
            });
            regionsList.addEventListener('mouseleave', hideRegionsDelayed);
        }

        // Mobile: Click events
        if (isMobile()) {
            // Toggle legend on click
            toggleLegend.addEventListener('click', () => {
                const isVisible = legend.classList.contains('visible');
                if (isVisible) {
                    hideLegend();
                } else {
                    showLegend();
                }
            });

            // Toggle regions on click
            toggleRegions.addEventListener('click', () => {
                const isVisible = regionsList.classList.contains('visible');
                if (isVisible) {
                    hideRegions();
                } else {
                    showRegions();
                }
            });

            // Close buttons
            if (closeLegend) {
                closeLegend.addEventListener('click', hideLegend);
            }

            if (closeRegions) {
                closeRegions.addEventListener('click', hideRegions);
            }
        }

        // Initialize on load
        initializeVisibility();

        // Re-initialize on window resize (debounced to 150ms)
        // Reload is necessary to switch between hover and click event handlers
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                initializeVisibility();
                // Page reload required to re-attach correct event listeners for new device type
                location.reload();
            }, 150);
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIToggle.init());
} else {
    UIToggle.init();
}
