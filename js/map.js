/**
 * Map Module
 * Handles map initialization, rendering, and interactions
 */

const ElectionMap = {
    map: null,
    geoJSONLayer: null,
    currentGeoJSON: null,
    currentElectionData: null,
    selectedFeature: null,

    /**
     * Initialize the map
     */
    init(containerId = 'map') {
        // Create map centered on Spain
        this.map = L.map(containerId, {
            center: [40.4168, -3.7038], // Madrid
            zoom: 6,
            minZoom: 5,
            maxZoom: 10,
            zoomControl: true
        });

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        return this.map;
    },

    /**
     * Load and display election data on the map
     */
    loadData(geoJSON, electionData) {
        this.currentGeoJSON = geoJSON;
        this.currentElectionData = electionData;

        // Remove existing layer if present
        if (this.geoJSONLayer) {
            this.map.removeLayer(this.geoJSONLayer);
        }

        // Add GeoJSON layer with styling and interactions
        this.geoJSONLayer = L.geoJSON(geoJSON, {
            style: this.styleFeature.bind(this),
            onEachFeature: this.onEachFeature.bind(this)
        }).addTo(this.map);

        // Fit map to bounds
        this.map.fitBounds(this.geoJSONLayer.getBounds());
    },

    /**
     * Style each feature based on election results
     */
    styleFeature(feature) {
        const electionData = feature.properties.electionData;
        let fillColor = '#cccccc';
        let fillOpacity = 0.7;

        if (electionData && electionData.winner) {
            fillColor = DataLoader.getPartyColor(electionData.winner);
            fillOpacity = 0.7;
        }

        return {
            fillColor: fillColor,
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: fillOpacity
        };
    },

    /**
     * Add interactions to each feature
     */
    onEachFeature(feature, layer) {
        // Hover effects
        layer.on({
            mouseover: (e) => this.highlightFeature(e),
            mouseout: (e) => this.resetHighlight(e),
            click: (e) => this.selectFeature(e)
        });

        // Tooltip
        const name = feature.properties.electionData?.name ||
                     feature.properties.name ||
                     feature.properties.NAME_1 ||
                     'Región';

        layer.bindTooltip(name, {
            permanent: false,
            direction: 'center',
            className: 'region-tooltip'
        });
    },

    /**
     * Highlight feature on hover
     */
    highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#666',
            fillOpacity: 0.9
        });

        layer.bringToFront();
    },

    /**
     * Reset highlight
     */
    resetHighlight(e) {
        this.geoJSONLayer.resetStyle(e.target);

        // Re-highlight if this is the selected feature
        if (this.selectedFeature && this.selectedFeature === e.target) {
            e.target.setStyle({
                weight: 3,
                color: 'white',
                fillOpacity: 0.9
            });
        }
    },

    /**
     * Select a feature and display detailed results
     */
    selectFeature(e) {
        const layer = e.target;
        const feature = layer.feature;

        // Reset previous selection
        if (this.selectedFeature) {
            this.geoJSONLayer.resetStyle(this.selectedFeature);
        }

        // Highlight new selection
        this.selectedFeature = layer;
        layer.setStyle({
            weight: 3,
            color: 'white',
            fillOpacity: 0.9
        });

        // Display results in panel
        this.displayResults(feature);

        // Update regions list selection
        const regionCode = feature.properties.iso_3166_2 ||
                          feature.properties.ISO_3166_2 ||
                          feature.properties.code;
        if (regionCode) {
            document.querySelectorAll('.region-list-item').forEach(item => {
                item.classList.remove('selected');
            });
            document.querySelector(`[data-region-code="${regionCode}"]`)?.classList.add('selected');
        }

        // Fly to the selected region with smooth animation
        const bounds = layer.getBounds();

        // Check if mobile
        const isMobile = window.innerWidth <= 768;

        // Different settings for mobile vs desktop
        if (isMobile) {
            // Mobile: results panel is below (40vh), so use vertical padding
            this.map.flyToBounds(bounds, {
                paddingTopLeft: [20, 20],
                paddingBottomRight: [20, 250], // Extra bottom padding for results panel
                maxZoom: 7,
                duration: 1.5
            });
        } else {
            // Desktop: results panel on right (350px), use horizontal padding
            this.map.flyToBounds(bounds, {
                paddingTopLeft: [50, 50],
                paddingBottomRight: [450, 50], // Large right padding for panel
                maxZoom: 8,
                duration: 1.5
            });
        }
    },

    /**
     * Display detailed results in the side panel
     */
    displayResults(feature) {
        const electionData = feature.properties.electionData;
        const name = electionData?.name ||
                     feature.properties.name ||
                     feature.properties.NAME_1 ||
                     'Región';

        if (!electionData) {
            document.getElementById('panelContent').innerHTML = `
                <div class="region-detail">
                    <h2 class="region-name">${name}</h2>
                    <p class="info-text">No data available for this region</p>
                </div>
            `;
            return;
        }

        // Sort parties by votes
        const parties = Object.entries(electionData.parties || {})
            .sort((a, b) => b[1].votes - a[1].votes);

        const totalVotes = parties.reduce((sum, [_, data]) => sum + data.votes, 0);

        // Build HTML
        let html = `
            <div class="region-detail">
                <h2 class="region-name">${name}</h2>

                <div class="region-stats">
                    <div class="stat-item">
                        <div class="stat-label">Turnout</div>
                        <div class="stat-value">${DataLoader.formatPercentage(electionData.turnout || 0)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Total Votes</div>
                        <div class="stat-value">${DataLoader.formatNumber(totalVotes)}</div>
                    </div>
                </div>

                <div class="party-results">
                    <h3>Results by Party</h3>
        `;

        parties.forEach(([partyCode, partyData]) => {
            const color = DataLoader.getPartyColor(partyCode);
            html += `
                <div class="party-item" style="border-left-color: ${color}">
                    <div class="party-color" style="background-color: ${color}"></div>
                    <div class="party-info">
                        <div class="party-name">${partyCode}</div>
                        <div class="party-stats">
                            <span class="party-percentage">${DataLoader.formatPercentage(partyData.percentage)}</span>
                            <span>${DataLoader.formatNumber(partyData.votes)} votes</span>
                            ${partyData.seats ? `<span>${partyData.seats} seats</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        document.getElementById('panelContent').innerHTML = html;
    },

    /**
     * Create and display legend
     */
    createLegend(electionData) {
        const parties = DataLoader.getParties(electionData);
        const legendItems = document.getElementById('legendItems');

        legendItems.innerHTML = '';

        parties.forEach(party => {
            const color = DataLoader.getPartyColor(party);
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-color" style="background-color: ${color}"></div>
                <span>${party}</span>
            `;
            legendItems.appendChild(item);
        });
    },

    /**
     * Create regions list
     */
    createRegionsList(geoJSON, electionData) {
        const regionsListItems = document.getElementById('regionsListItems');
        regionsListItems.innerHTML = '';

        // Get all regions with their names
        const regions = geoJSON.features.map(feature => {
            const regionCode = feature.properties.iso_3166_2 ||
                              feature.properties.ISO_3166_2 ||
                              feature.properties.code;
            const regionData = electionData?.results?.[regionCode];
            const name = regionData?.name || feature.properties.name || 'Unknown';

            return {
                code: regionCode,
                name: name,
                feature: feature
            };
        }).sort((a, b) => a.name.localeCompare(b.name));

        // Create list items
        regions.forEach(region => {
            const item = document.createElement('div');
            item.className = 'region-list-item';
            item.textContent = region.name;
            item.dataset.regionCode = region.code;

            item.addEventListener('click', () => {
                this.selectRegionByCode(region.code);
            });

            regionsListItems.appendChild(item);
        });
    },

    /**
     * Select region by code
     */
    selectRegionByCode(regionCode) {
        // Find the feature by region code
        const feature = this.currentGeoJSON.features.find(f => {
            const code = f.properties.iso_3166_2 ||
                        f.properties.ISO_3166_2 ||
                        f.properties.code;
            return code === regionCode;
        });

        if (feature) {
            // Find the corresponding layer
            this.geoJSONLayer.eachLayer(layer => {
                if (layer.feature === feature) {
                    // Trigger the selection
                    this.selectFeature({ target: layer });

                    // Update selected state in list
                    document.querySelectorAll('.region-list-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    document.querySelector(`[data-region-code="${regionCode}"]`)?.classList.add('selected');
                }
            });
        }
    }
};
