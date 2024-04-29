const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws'); // WebSocket library
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for coordinates
let coordinates = {};

// Creating a server from the Express app
const server = require('http').createServer(app);

// Setting up the WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', function connection(ws) {
  console.log('Client connected');
  ws.on('message', function incoming(message) {
    console.log('Received message:', message);
  });

  // Send existing coordinates to newly connected client
  ws.send(JSON.stringify({ type: 'init', data: coordinates }));
});

// Function to broadcast messages to all connected clients
function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Route to receive coordinates from the phone
app.post('/send-coordinates', (req, res) => {
    const { id, latitude, longitude } = req.body;
    coordinates[id] = { latitude, longitude };
    res.status(200).send('Coordinates received');
    console.log('Sent coordinates: ', coordinates);

    // Broadcast the new coordinates
    broadcast(JSON.stringify({ type: 'update', data: { latitude, longitude } }));
});

// Starting the combined server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
