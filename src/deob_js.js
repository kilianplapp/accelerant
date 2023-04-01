const API_ENDPOINT = 'https://kilianpl.app/api/mm';
let mouseMovements = [];
let listenerAdded = false;

function sendMouseMovements() {
  // Only send the data if there is data available
  if (mouseMovements.length > 0) {
    // Obfuscate the data
    const obfuscatedData = obfuscate(JSON.stringify(mouseMovements));

    // Make a POST request to the API endpoint with the obfuscated data as the request body
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ 'data': obfuscatedData })
    })
    .then(response => {
      if (response.ok) {
        // Clear the array after sending the data
        mouseMovements = [];
      } else {
        console.error('Failed!');
      }
    })
    .catch(error => {
      console.error('Failed!');
    });
  }

  // Set the timer to send the data again in 10 seconds
  timer = setTimeout(sendMouseMovements, 5000);
}

function addMouseMovement(event) {
  // Add the mouse movement data to the array with millisecond accuracy timestamp
  mouseMovements.push({ x: event.clientX, y: event.clientY, timestamp: Date.now() });
}

function startListening() {
  // Add the event listener if it hasn't already been added
  if (!listenerAdded) {
    document.addEventListener('mousemove', addMouseMovement);
    listenerAdded = true;
  }

  // Start the timer to send the data
  timer = setTimeout(sendMouseMovements, 5000);
}

// Start listening when the script is loaded
startListening();

// Stop the timer and remove the event listener when the user leaves the page
window.addEventListener('unload', function() {
  clearTimeout(timer);
  document.removeEventListener('mousemove', addMouseMovement);
  listenerAdded = false;
});

// Re-add the event listener and start the timer when the user switches back to the page
window.addEventListener('focus', function() {
  startListening();
});

function obfuscate(str) {
  const key = "1KxIeFm2bC5xxEk89XGLVwRuDIRCqq0xlQRfYmiWkGXOPzFFsITZwp5RwMe6RWtn";
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const keyChar = key[i % key.length];
    const keyInt = keyChar.charCodeAt(0);
    result += String.fromCharCode(keyInt ^ str.charCodeAt(i));
  }
  return btoa(result);
}