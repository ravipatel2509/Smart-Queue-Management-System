/* 
   Smart Queue System - Simple Logic
   Easy to explain, Minimal Code.
*/

// --- 1. Global Variables ---
// We simulate the "Current Serving Token" starting from 100
let currentServingToken = 100;

// --- 2. Queue Simulation Logic ---
// This runs every time the page loads to set the initial state
function initSystem() {
    // Set Date Picker Min Date to Today
    const datePicker = document.getElementById('dateSelect');
    if (datePicker) {
        const today = new Date().toISOString().split('T')[0];
        datePicker.setAttribute('min', today);
    }

    // Check if we have a saved state in localStorage, otherwise use default
    let saved = localStorage.getItem('sqms_current_serving');
    if (saved) {
        currentServingToken = parseInt(saved);
    }

    // Update the screen immediately
    updateDisplay();

    // Start the automatic counter (Simulation)
    // Increases token number every 5 seconds (5000 milliseconds)
    setInterval(simulateQueue, 5000);
}

// Function to increase the queue number
function simulateQueue() {
    currentServingToken++;

    // Save to localStorage so numbers don't reset on refresh
    localStorage.setItem('sqms_current_serving', currentServingToken);

    updateDisplay();
}

// Function to update HTML elements with new numbers
function updateDisplay() {
    // We look for elements by ID and change their text
    const servingEl = document.getElementById('current-serving-display');
    const nextEl = document.getElementById('next-token-display');

    if (servingEl) servingEl.innerText = currentServingToken;
    if (nextEl) nextEl.innerText = currentServingToken + 1;

    // If we are on the "My Token" page, check status
    checkUserTokenStatus();
}

// --- 3. Booking Logic (Book Token Page) ---
function generateToken() {
    // 1. Get values from form
    const place = document.getElementById('placeSelect').value;
    const service = document.getElementById('serviceSelect').value;
    const date = document.getElementById('dateSelect').value;
    const time = document.getElementById('timeSelect').value;

    if (place === "" || service === "" || date === "" || time === "") {
        alert("Please select Place, Service, Date, and Time.");
        return;
    }

    // 2. Generate a simple random token number (Current + random 5 to 10)
    // This ensures the user is always "ahead" of the current queue
    const userToken = currentServingToken + Math.floor(Math.random() * 5) + 5;

    // 3. Save to localStorage  
    const ticketData = {
        number: userToken,
        place: place,
        service: service,
        date: date,
        time: time
    };
    localStorage.setItem('sqms_user_ticket', JSON.stringify(ticketData));

    // 4. Show the result card
    document.getElementById('booking-form-section').style.display = 'none';
    const resultCard = document.getElementById('token-result');
    resultCard.style.display = 'block';

    document.getElementById('display-user-token').innerText = userToken;
    document.getElementById('display-place').innerText = place;
    document.getElementById('display-date').innerText = date;
    document.getElementById('display-time').innerText = time;
}

// --- 4. User Status Logic (My Token Page) ---
function checkUserTokenStatus() {
    // Get the User's element on the screen
    const userDisplay = document.getElementById('user-token-number');
    const statusBadge = document.getElementById('status-badge');

    if (!userDisplay) return; // Not on "My Token" page

    // Get data from storage
    const ticketData = JSON.parse(localStorage.getItem('sqms_user_ticket'));

    if (ticketData) {
        userDisplay.innerText = ticketData.number;

        // Update Date and Time if elements exist
        const dateEl = document.getElementById('user-token-date');
        const timeEl = document.getElementById('user-token-time');
        if (dateEl) dateEl.innerText = ticketData.date || "--";
        if (timeEl) timeEl.innerText = ticketData.time || "--";

        // Simple Comparison Logic
        if (currentServingToken < ticketData.number) {
            statusBadge.innerText = "WAITING";
            statusBadge.className = "badge bg-warning text-dark status-badge";
        } else if (currentServingToken === ticketData.number) {
            statusBadge.innerText = "NOW SERVING";
            statusBadge.className = "badge bg-success status-badge";
        } else {
            statusBadge.innerText = "COMPLETED";
            statusBadge.className = "badge bg-secondary status-badge";
        }
    } else {
        userDisplay.innerText = "--";
        statusBadge.innerText = "No Token Found";
    }
}

// Start the system when script loads
initSystem();
