// Establish a connection to the WebSocket server
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = function() {
  console.log('WebSocket connection established');
};

ws.onerror = function(error) {
  console.error('WebSocket Error: ', error);
};

// WebSocket onmessage enhanced logging
ws.onmessage = function(event) {
  console.log("WebSocket message received:", event.data); // Log raw data
  try {
    const { type, data } = JSON.parse(event.data);
    if (type === 'update') {
      console.log("Updating point:", data);
      addPoint(data.latitude, data.longitude);
    } else {
      console.log("Received non-update message");
    }
  } catch (error) {
    console.error('Error parsing message from WebSocket:', error);
  }
};

function updateScales() {
  const grid = document.getElementById('grid'); // Ensure this is the correct ID
  if (!grid) {
    console.error('Grid DOM element not found');
    return; // Exit if grid is not found
  }

  const gridWidth = grid.clientWidth; // Width of the grid
  const gridHeight = grid.clientHeight; // Height of the grid
  const centerX = gridWidth / 2; // Calculate center X
  const centerY = gridHeight / 2; // Calculate center Y

  // Define scale functions for longitude and latitude
  function scaleX(longitude) {
    // Scale longitude to fit within the grid width
    // Assuming longitude is a value between -180 and 180 degrees
    return centerX + longitude * (gridWidth / 360);
  }

  function scaleY(latitude) {
    // Scale latitude to fit within the grid height
    // Assuming latitude is a value between -90 and 90 degrees
    return centerY - latitude * (gridHeight / 180);
  }

  return { scaleX, scaleY };
}


// Check if DOM elements exist
function addPoint(latitude, longitude) {
  console.log(`Adding point at (${latitude}, ${longitude})`); // Log coordinates
  const { scaleX, scaleY } = updateScales();
  const x = scaleX(longitude);
  const y = scaleY(latitude);

  console.log(`Calculated position: (${x}, ${y})`); // Log computed positions

  const grid = document.getElementById('grid'); // Ensure this is the correct ID
  const tooltip = document.getElementById('tooltip'); // Ensure this is the correct ID
  if (!grid || !tooltip) {
    console.error('Grid or Tooltip DOM element not found');
    return;
  }

  const point = document.createElement('div');
  point.className = 'point';
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;
  point.dataset.coords = `(${longitude}, ${latitude})`;

  point.addEventListener('mouseenter', function(e) {
    tooltip.textContent = `Coords: ${this.dataset.coords}`;
    tooltip.style.display = 'block';
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
  });

  point.addEventListener('mouseleave', function() {
    tooltip.style.display = 'none';
  });

  grid.appendChild(point);
  console.log("Point added to the grid");
}
