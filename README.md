# Election Results Map Visualization - Spain

An interactive web-based visualization of Spanish election results with **multiple datasets and implementations**. This proof-of-concept (POC) includes:
- **National Level**: 2023 general election results for Spain's autonomous communities
- **Municipal Level**: 2023 municipal election results for Málaga province municipalities

Both datasets are available in **Leaflet.js** and **MapLibre GL JS** implementations.

## Features

### Common Features (Both Implementations)
- **Interactive Map**: Explore election results across all 19 Spanish regions (17 autonomous communities + Ceuta & Melilla)
- **Choropleth Visualization**: Regions colored by winning party
- **Detailed Results Panel**: Click on any region to see detailed election statistics
- **Collapsible Panels**: Hover-activated on desktop, click-activated on mobile
- **Regions List**: Quick navigation to any autonomous community
- **Party Legend**: Visual reference for political parties and their colors
- **Hover Tooltips**: Quick region identification on hover
- **Smooth Transitions**: Animated fly-to-region with centering
- **Fully Responsive**: Optimized layouts for mobile (≤768px), tablet (769-1024px), and desktop (>1024px)

### Implementation-Specific Features

**Leaflet.js Version:**
- Lightweight and fast (~40KB library)
- Tile-based map controls
- Standard zoom and pan controls
- Smooth flyToBounds transitions with device-specific padding
- Optimized for mobile devices

**MapLibre GL JS Version:**
- Modern WebGL-powered rendering (~700KB library)
- Smooth fitBounds animations with device-specific padding
- Hardware-accelerated graphics (GPU)
- Vector-based rendering
- OpenStreetMap base layer
- Excellent performance with large datasets

## Live Demo

View the live demo: **[https://flenzi.github.io/election-visualization-poc/](https://flenzi.github.io/election-visualization-poc/)**

### Spain - General Elections 2023
- **Leaflet Version**: [https://flenzi.github.io/election-visualization-poc/leaflet.html](https://flenzi.github.io/election-visualization-poc/leaflet.html)
- **MapLibre GL JS Version**: [https://flenzi.github.io/election-visualization-poc/maplibre.html](https://flenzi.github.io/election-visualization-poc/maplibre.html)

### Málaga - Municipal Elections 2023
- **Leaflet Version**: [https://flenzi.github.io/election-visualization-poc/malaga-leaflet.html](https://flenzi.github.io/election-visualization-poc/malaga-leaflet.html)
- **MapLibre GL JS Version**: [https://flenzi.github.io/election-visualization-poc/malaga-maplibre.html](https://flenzi.github.io/election-visualization-poc/malaga-maplibre.html)

## Technologies Used

### Leaflet Implementation
- **Leaflet 1.9.4**: Lightweight interactive mapping library (40KB)
- **GeoJSON**: Standard geographic data format (659KB)
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with CSS custom properties

### MapLibre GL JS Implementation
- **MapLibre GL JS 3.6**: Modern WebGL mapping library (700KB)
- **GeoJSON**: Standard geographic data format (659KB)
- **OpenStreetMap**: Base map tiles for context
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Shared styling with Leaflet version

## Project Structure

```
election-visualization-poc/
├── index.html                       # Main landing page
├── leaflet.html                     # Spain national - Leaflet.js
├── maplibre.html                    # Spain national - MapLibre GL JS
├── malaga-leaflet.html              # Málaga municipal - Leaflet.js
├── malaga-maplibre.html             # Málaga municipal - MapLibre GL JS
├── css/
│   └── styles.css                   # Shared application styles
├── js/
│   ├── data-loader.js              # Shared data fetching and processing
│   ├── ui-toggle.js                # Shared UI panel toggle logic (hover/click)
│   ├── app.js                      # Leaflet application logic
│   ├── map.js                      # Leaflet map rendering
│   ├── maplibre-app.js             # MapLibre application logic
│   └── maplibre-map.js             # MapLibre map rendering
├── data/
│   ├── geo/
│   │   ├── spain-comunidades.json  # National boundaries (659KB)
│   │   └── malaga-municipios.json  # Málaga municipalities (GADM Level 4)
│   └── elections/
│       ├── 2023-generales.json     # National election results
│       └── 2023-malaga-municipales.json  # Málaga municipal results
├── assets/                          # Static assets
└── README.md
```

## Implementation Comparison

| Feature | Leaflet.js | MapLibre GL JS |
|---------|-----------|----------------|
| **Library Size** | ~40KB | ~700KB |
| **Data Format** | GeoJSON (659KB) | GeoJSON (659KB) |
| **Total Load Size** | ~699KB | ~1359KB |
| **Rendering** | Canvas/SVG hybrid | WebGL (GPU accelerated) |
| **Animation** | flyToBounds (1.5s desktop, 2s tablet) | fitBounds (1.5s desktop, 2s tablet) |
| **Transitions** | Device-specific padding | Device-specific padding |
| **Base Map** | Optional | OpenStreetMap included |
| **Performance** | Good for medium datasets | Excellent for large datasets |
| **Best For** | General use, simplicity | Modern apps, performance |
| **Learning Curve** | Easy | Moderate |
| **Customization** | Good | Excellent |

**Winner for simplicity**: Leaflet.js (lighter, easier to use)
**Winner for performance**: MapLibre GL JS (GPU acceleration, smooth animations)
**Winner for features**: MapLibre GL JS (WebGL rendering, better animations)

## Data Sources

### Geographic Boundaries

#### National Level (Autonomous Communities)
- **Source**: codeforgermany/click_that_hood (high-quality community data)
- **Format**: GeoJSON (RFC 7946) - 659KB
- **Coordinate System**: WGS84 (EPSG:4326)
- **Regions**: All 19 Spanish regions (17 Autonomous Communities + Ceuta & Melilla)
- **Quality**: 23,179 coordinate points total across all regions

#### Municipal Level (Málaga Province)
- **Source**: GADM (Database of Global Administrative Areas)
- **Level**: Level 4 (Municipality boundaries)
- **Format**: GeoJSON
- **Version**: GADM 4.1
- **Coverage**: 15 major municipalities in Málaga province
- **Download Instructions**:
  1. Visit [GADM Download Page](https://gadm.org/download_country.html)
  2. Select "Spain" from the country list
  3. Choose "GeoJSON" format
  4. Download Level 4 (municipalities)
  5. Extract and filter for Málaga province (NAME_2 = "Málaga")

  **Alternative Sources**:
  - [OpenDataSoft Spain Municipalities](https://data.opendatasoft.com/explore/dataset/georef-spain-municipio@public/export/)
  - [mapSpain R Package](https://ropenspain.github.io/mapSpain/) - Filter for Málaga

**Note**: The current `malaga-municipios.json` contains sample geometries for demonstration. Replace with actual GADM data for production use.

### Election Data

#### National Elections
- **Election**: 2023 Spanish General Elections (Congreso de los Diputados)
- **Date**: July 23, 2023
- **Format**: JSON
- **Data**: Sample data based on 2023 general election results

#### Municipal Elections (Málaga)
- **Election**: 2023 Spanish Municipal Elections (Ayuntamientos)
- **Date**: May 28, 2023
- **Format**: JSON
- **Coverage**: 15 municipalities in Málaga province
- **Data**: Sample data based on 2023 municipal election results

## Party Colors

| Party | Color | Hex Code |
|-------|-------|----------|
| PP (Partido Popular) | Blue | #1E88E5 |
| PSOE (Partido Socialista) | Red | #E53935 |
| VOX | Green | #76B900 |
| SUMAR | Magenta | #E91E63 |
| ERC (Esquerra Republicana) | Orange | #FFB300 |
| JUNTS | Cyan | #00BCD4 |
| PNV (Partido Nacionalista Vasco) | Green | #4CAF50 |
| BILDU (EH Bildu) | Light Green | #8BC34A |
| BNG (Bloque Nacionalista Galego) | Light Blue | #03A9F4 |
| CC (Coalición Canaria) | Yellow | #FFEB3B |

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (for development)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/election-visualization-poc.git
cd election-visualization-poc
```

2. Start a local web server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

### Deployment to GitHub Pages

1. Push your code to GitHub
2. Go to your repository settings
3. Navigate to "Pages" section
4. Select the branch to deploy (usually `main` or `gh-pages`)
5. Save and wait for deployment

Your site will be available at: `https://YOUR_USERNAME.github.io/election-visualization-poc/`

## Customization

### Adding New Election Data

1. Create a new JSON file in `data/elections/` following this structure:

```json
{
  "election": {
    "name": "Election Name",
    "date": "YYYY-MM-DD",
    "type": "congress",
    "description": "Description"
  },
  "results": {
    "ES-MD": {
      "name": "Madrid",
      "turnout": 71.2,
      "parties": {
        "PP": {
          "votes": 1685000,
          "percentage": 40.8,
          "seats": 21
        }
      },
      "winner": "PP"
    }
  }
}
```

2. Update `js/app.js` to load your new data file:
```javascript
DataLoader.loadElectionData('data/elections/your-election.json')
```

### Modifying Party Colors

Edit the CSS custom properties in `css/styles.css`:

```css
:root {
    --pp-blue: #1E88E5;
    --psoe-red: #E53935;
    /* Add or modify party colors */
}
```

Or update the `getPartyColor()` function in `js/data-loader.js`:

```javascript
getPartyColor(party) {
    const colors = {
        'PP': '#1E88E5',
        'PSOE': '#E53935',
        'YOUR_PARTY': '#HEX_COLOR'
    };
    return colors[party] || colors['OTHER'];
}
```

## Accessibility & UX Features

- Keyboard navigation support
- ARIA labels for screen readers
- High contrast color scheme
- Focus indicators for interactive elements
- Device-specific responsive layouts:
  - **Mobile** (≤768px): Bottom sheet panels, header-positioned buttons, 40vh results panel
  - **Tablet** (769-1024px): Slower 2s transitions, optimized padding (300-350px)
  - **Desktop** (>1024px): Hover-activated panels with 300ms delay, side-positioned results panel
- Smooth scroll behavior with sticky headers (z-index optimized)
- Touch-friendly large tap targets on mobile (0.75rem padding)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Known Limitations

- Sample election data based on 2023 results (not real-time)
- Static data (no automatic updates)
- Simplified island geometries for Canary Islands
- **Málaga municipalities**: Sample geometries provided - replace with actual GADM Level 4 data for accurate boundaries
- Municipal data limited to 15 major municipalities in Málaga province (103 total municipalities in the province)

## Future Enhancements

- [ ] Add provincia-level visualization
- [x] Municipality-level detail (completed for Málaga)
- [ ] Expand municipality coverage to all 103 Málaga municipalities
- [ ] Add municipality visualizations for other provinces
- [ ] Multiple election comparison (time-series view)
- [ ] Export functionality (PNG, SVG, PDF)
- [ ] Time-series animation
- [ ] Vote share gradient visualization
- [ ] Turnout percentage view
- [ ] Real-time data integration
- [ ] Multi-language support (Spanish/English/Catalan)
- [ ] Replace sample GADM geometries with actual GADM Level 4 data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Leaflet**: For the excellent mapping library
- **MapLibre GL JS**: For the modern WebGL mapping library
- **OpenStreetMap**: For base map tiles
- **codeforgermany/click_that_hood**: For high-quality national-level GeoJSON data
- **GADM**: For providing comprehensive global administrative boundaries
- Election data structure inspired by real 2023 Spanish general and municipal election results

## Contact

For questions or feedback, please open an issue in the GitHub repository.

---

Made with ❤️ for transparent democracy visualization
