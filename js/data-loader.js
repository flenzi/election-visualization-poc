/**
 * Data Loader Module
 * Handles loading and processing of geographic and election data
 */

const DataLoader = {
    /**
     * Load GeoJSON data from a URL or file
     */
    async loadGeoJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading GeoJSON:', error);
            throw error;
        }
    },

    /**
     * Load election results data
     */
    async loadElectionData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading election data:', error);
            throw error;
        }
    },

    /**
     * Merge election data with geographic features
     */
    mergeData(geoJSON, electionData) {
        const results = electionData.results;

        geoJSON.features.forEach(feature => {
            const regionCode = feature.properties.iso_3166_2 ||
                              feature.properties.ISO_3166_2 ||
                              feature.properties.code;

            if (results[regionCode]) {
                feature.properties.electionData = results[regionCode];
            } else {
                console.warn(`No election data found for region: ${regionCode} (${feature.properties.name})`);
            }
        });

        return geoJSON;
    },

    /**
     * Get party color
     */
    getPartyColor(party) {
        const colors = {
            'PP': '#1E88E5',
            'PSOE': '#E53935',
            'VOX': '#76B900',
            'SUMAR': '#E91E63',
            'ERC': '#FFB300',
            'JUNTS': '#00BCD4',
            'PNV': '#4CAF50',
            'BILDU': '#8BC34A',
            'BNG': '#03A9F4',
            'CC': '#FFEB3B',
            'OTHER': '#9E9E9E'
        };
        return colors[party] || colors['OTHER'];
    },

    /**
     * Get all parties from election data
     */
    getParties(electionData) {
        const partiesSet = new Set();

        Object.values(electionData.results).forEach(region => {
            if (region.parties) {
                Object.keys(region.parties).forEach(party => {
                    partiesSet.add(party);
                });
            }
        });

        return Array.from(partiesSet).sort();
    },

    /**
     * Format number with Spanish locale
     */
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    },

    /**
     * Format percentage
     */
    formatPercentage(num) {
        return `${num.toFixed(1)}%`;
    }
};
