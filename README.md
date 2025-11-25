# Election Results Map Visualization - Spain

An interactive web-based visualization of Spanish election results using Leaflet.js. This proof-of-concept (POC) displays the 2023 general election results on a choropleth map of Spain's autonomous communities.

## Features

- **Interactive Map**: Explore election results across all 19 Spanish regions (17 autonomous communities + Ceuta & Melilla)
- **Choropleth Visualization**: Regions colored by winning party
- **Detailed Results Panel**: Click on any region to see detailed election statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Party Legend**: Visual reference for political parties and their colors
- **Hover Tooltips**: Quick region identification on hover

## Live Demo

View the live demo: **[https://flenzi.github.io/election-visualization-poc/](https://flenzi.github.io/election-visualization-poc/)**

## Technologies Used

- **Leaflet 1.9.4**: Interactive mapping library
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with CSS custom properties
- **GeoJSON**: Geographic boundary data for Spanish regions

## Project Structure

```
election-visualization-poc/
├── index.html                  # Main HTML file
├── css/
│   └── styles.css             # Application styles
├── js/
│   ├── app.js                 # Main application logic
│   ├── map.js                 # Map rendering and interactions
│   └── data-loader.js         # Data loading and processing
├── data/
│   ├── geo/
│   │   └── spain-comunidades.json  # GeoJSON boundaries
│   └── elections/
│       └── 2023-generales.json     # Election results data
├── assets/                    # Static assets
└── README.md
```

## Data Sources

### Geographic Boundaries
- **Source**: Aggregated from province-level data
- **Format**: GeoJSON (RFC 7946)
- **Coordinate System**: WGS84 (EPSG:4326)
- **Regions**: All 19 Spanish regions (17 Autonomous Communities + Ceuta & Melilla)

### Election Data
- **Election**: 2023 Spanish General Elections (Congreso de los Diputados)
- **Date**: July 23, 2023
- **Format**: JSON
- **Data**: Sample data based on 2023 general election results

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

## Accessibility Features

- Keyboard navigation support
- ARIA labels for screen readers
- High contrast color scheme
- Focus indicators for interactive elements
- Responsive design for mobile devices

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Known Limitations

- Sample election data based on 2023 results (not real-time)
- No municipality-level detail (only autonomous communities)
- Static data (no automatic updates)
- Simplified island geometries for Canary Islands

## Future Enhancements

- [ ] Add provincia-level visualization
- [ ] Municipality-level detail on zoom
- [ ] Multiple election comparison
- [ ] Export functionality (PNG, SVG, PDF)
- [ ] Time-series animation
- [ ] Vote share gradient visualization
- [ ] Turnout percentage view
- [ ] Real-time data integration
- [ ] Multi-language support (Spanish/English/Catalan)

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
- **OpenStreetMap**: For base map tiles
- **Province GeoJSON**: From [adbcs/Geojson](https://github.com/adbcs/Geojson)
- Election data structure inspired by real 2023 Spanish general election results

## Contact

For questions or feedback, please open an issue in the GitHub repository.

---

Made with ❤️ for transparent democracy visualization
