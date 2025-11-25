/**
 * MapLibre GL JS Map Module
 * Handles MapLibre map rendering and interactions
 */

const MapLibreMap = {
    map: null,
    currentGeoJSON: null,
    currentElectionData: null,
    selectedFeatureId: null,

    /**
     * Initialize the MapLibre map
     */
    init(containerId = 'map') {
        // Create map centered on Spain
        this.map = new maplibregl.Map({
            container: containerId,
            style: {
                version: 8,
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                layers: [{
                    id: 'osm',
                    type: 'raster',
                    source: 'osm',
                    minzoom: 0,
                    maxzoom: 19
                }]
            },
            center: [-3.7, 40.4],
            zoom: 5.5,
            minZoom: 5,
            maxZoom: 12
        });

        // Add navigation controls
        this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Wait for map to load before adding data
        this.map.on('load', () => {
            console.log('MapLibre map loaded');
        });

        return this.map;
    },

    /**
     * Load and display data
     */
    async loadData(geoJSON, electionData) {
        this.currentGeoJSON = geoJSON;
        this.currentElectionData = electionData;

        // Wait for map to be fully loaded
        if (!this.map.loaded()) {
            await new Promise(resolve => this.map.once('load', resolve));
        }

        // Add GeoJSON source
        this.map.addSource('regions', {
            type: 'geojson',
            data: geoJSON
        });

        // Add fill layer for regions
        this.map.addLayer({
            id: 'regions-fill',
            type: 'fill',
            source: 'regions',
            paint: {
                'fill-color': ['get', 'fillColor'],
                'fill-opacity': 0.7
            }
        });

        // Add border layer
        this.map.addLayer({
            id: 'regions-border',
            type: 'line',
            source: 'regions',
            paint: {
                'line-color': '#ffffff',
                'line-width': 2
            }
        });

        // Add hover layer
        this.map.addLayer({
            id: 'regions-hover',
            type: 'line',
            source: 'regions',
            paint: {
                'line-color': '#333',
                'line-width': 3
            },
            filter: ['==', 'iso_3166_2', '']
        });

        // Set colors based on election results
        this.updateColors();

        // Add interactivity
        this.setupInteractions();
    },

    /**
     * Update feature colors based on election results
     */
    updateColors() {
        this.currentGeoJSON.features.forEach(feature => {
            const electionData = feature.properties.electionData;
            if (electionData && electionData.winner) {
                feature.properties.fillColor = DataLoader.getPartyColor(electionData.winner);
            } else {
                feature.properties.fillColor = '#cccccc';
            }
        });

        // Update the source
        this.map.getSource('regions').setData(this.currentGeoJSON);
    },

    /**
     * Setup map interactions
     */
    setupInteractions() {
        // Change cursor on hover
        this.map.on('mouseenter', 'regions-fill', () => {
            this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', 'regions-fill', () => {
            this.map.getCanvas().style.cursor = '';
        });

        // Highlight on hover
        this.map.on('mousemove', 'regions-fill', (e) => {
            if (e.features.length > 0) {
                const feature = e.features[0];
                this.map.setFilter('regions-hover', ['==', 'iso_3166_2', feature.properties.iso_3166_2]);
            }
        });

        this.map.on('mouseleave', 'regions-fill', () => {
            this.map.setFilter('regions-hover', ['==', 'iso_3166_2', '']);
        });

        // Click to select region
        this.map.on('click', 'regions-fill', (e) => {
            if (e.features.length > 0) {
                const feature = e.features[0];
                this.selectRegion(feature);
            }
        });
    },

    /**
     * Select a region and display results
     */
    selectRegion(feature) {
        const properties = feature.properties;
        const regionCode = properties.iso_3166_2;

        // Store selected feature
        this.selectedFeatureId = regionCode;

        // Get election data for this region
        const electionData = this.currentElectionData?.results?.[regionCode];

        // Display results in panel
        this.displayResults(regionCode, electionData, properties);

        // Fly to the region
        const bounds = this.getFeatureBounds(feature);
        if (bounds) {
            this.map.fitBounds(bounds, {
                padding: {top: 100, bottom: 100, left: 400, right: 100},
                duration: 1000
            });
        }
    },

    /**
     * Get bounds for a feature
     */
    getFeatureBounds(feature) {
        try {
            let coords = [];

            if (feature.geometry.type === 'Polygon') {
                coords = feature.geometry.coordinates[0];
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(polygon => {
                    coords = coords.concat(polygon[0]);
                });
            }

            if (coords.length === 0) return null;

            const bounds = coords.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new maplibregl.LngLatBounds(coords[0], coords[0]));

            return bounds;
        } catch (error) {
            console.error('Error calculating bounds:', error);
            return null;
        }
    },

    /**
     * Display results in panel
     */
    displayResults(regionCode, electionData, properties) {
        const name = electionData?.name || properties?.name || 'Region';

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
     * Create legend
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
    }
};
