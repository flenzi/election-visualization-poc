/**
 * D3.js Map Module
 * Handles D3 map rendering and interactions using TopoJSON
 */

const D3Map = {
    svg: null,
    projection: null,
    path: null,
    g: null,
    zoom: null,
    currentTopoJSON: null,
    currentElectionData: null,
    selectedFeature: null,

    /**
     * Initialize the D3 map
     */
    init(containerId = 'map') {
        const container = document.getElementById(containerId);
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Create SVG
        this.svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .style('max-width', '100%')
            .style('height', 'auto')
            .style('display', 'block');

        // Add background
        this.svg.append('rect')
            .attr('class', 'background')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#aad3df');

        // Create group for map features
        this.g = this.svg.append('g');

        // Create projection centered on Spain (will be adjusted after data load)
        this.projection = d3.geoMercator();

        // Create path generator
        this.path = d3.geoPath().projection(this.projection);

        // Setup zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize(containerId));

        return this.svg;
    },

    /**
     * Handle window resize
     */
    handleResize(containerId) {
        const container = document.getElementById(containerId);
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.svg
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        this.projection.translate([width / 2, height / 2]);
        this.g.selectAll('path').attr('d', this.path);
    },

    /**
     * Load and display data
     */
    async loadData(topoJSONUrl, electionDataUrl) {
        try {
            // Load both files
            const [topoJSON, electionData] = await Promise.all([
                d3.json(topoJSONUrl),
                d3.json(electionDataUrl)
            ]);

            this.currentTopoJSON = topoJSON;
            this.currentElectionData = electionData;

            // Convert TopoJSON to GeoJSON features
            // The topojson.feature expects (topology, object) where object is one of the named objects
            const objectKey = Object.keys(topoJSON.objects)[0];
            const geojson = topojson.feature(topoJSON, topoJSON.objects[objectKey]);

            // Merge election data
            geojson.features.forEach(feature => {
                const regionCode = feature.properties.iso_3166_2 ||
                                  feature.properties.ISO_3166_2 ||
                                  feature.properties.code;

                if (electionData.results[regionCode]) {
                    feature.properties.electionData = electionData.results[regionCode];
                }
            });

            // Render the map
            this.renderMap(geojson);

            // Create legend
            this.createLegend(electionData);

        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    },

    /**
     * Render the map
     */
    renderMap(geojson) {
        // Fit projection to bounds
        this.projection.fitSize(
            [this.svg.node().clientWidth, this.svg.node().clientHeight],
            geojson
        );

        // Draw regions
        const regions = this.g.selectAll('path')
            .data(geojson.features)
            .join('path')
            .attr('class', 'region')
            .attr('d', this.path)
            .attr('fill', d => this.getFillColor(d))
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d))
            .on('click', (event, d) => this.handleClick(event, d));

        // Add tooltips
        regions.append('title')
            .text(d => {
                const name = d.properties.electionData?.name || d.properties.name || 'Region';
                return name;
            });
    },

    /**
     * Get fill color based on election results
     */
    getFillColor(feature) {
        const electionData = feature.properties.electionData;
        if (electionData && electionData.winner) {
            return DataLoader.getPartyColor(electionData.winner);
        }
        return '#cccccc';
    },

    /**
     * Handle mouse over
     */
    handleMouseOver(event, d) {
        const path = d3.select(event.currentTarget);
        path.attr('stroke-width', 3)
            .attr('stroke', '#333')
            .style('filter', 'brightness(1.1)');
    },

    /**
     * Handle mouse out
     */
    handleMouseOut(event, d) {
        const path = d3.select(event.currentTarget);
        if (this.selectedFeature !== d) {
            path.attr('stroke-width', 1.5)
                .attr('stroke', '#ffffff')
                .style('filter', 'none');
        }
    },

    /**
     * Handle click
     */
    handleClick(event, d) {
        // Reset previous selection
        if (this.selectedFeature) {
            this.g.selectAll('path')
                .filter(feature => feature === this.selectedFeature)
                .attr('stroke-width', 1.5)
                .attr('stroke', '#ffffff')
                .style('filter', 'none');
        }

        // Highlight new selection
        this.selectedFeature = d;
        const path = d3.select(event.currentTarget);
        path.attr('stroke-width', 3)
            .attr('stroke', '#333')
            .style('filter', 'brightness(1.1)');

        // Display results
        this.displayResults(d);

        // Zoom to region
        this.zoomToFeature(d);
    },

    /**
     * Zoom to feature
     */
    zoomToFeature(feature) {
        const [[x0, y0], [x1, y1]] = this.path.bounds(feature);
        const dx = x1 - x0;
        const dy = y1 - y0;
        const x = (x0 + x1) / 2;
        const y = (y0 + y1) / 2;
        const scale = Math.min(8, 0.9 / Math.max(dx / this.svg.node().clientWidth, dy / this.svg.node().clientHeight));
        const translate = [this.svg.node().clientWidth / 2 - scale * x, this.svg.node().clientHeight / 2 - scale * y];

        this.svg.transition()
            .duration(750)
            .call(
                this.zoom.transform,
                d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );
    },

    /**
     * Display results in panel
     */
    displayResults(feature) {
        const electionData = feature.properties.electionData;
        const name = electionData?.name ||
                     feature.properties.name ||
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
