/**
 * visitorEntry.js - Handles the final entry confirmation view
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve the stored visitor details from localStorage
    const name = localStorage.getItem('lastVisitorName') || "Visitor";
    const college = localStorage.getItem('lastVisitorCollege') || "General";
    const reason = localStorage.getItem('lastVisitorReason') || "Library Visit";
    const time = localStorage.getItem('lastVisitorTime') || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    // 2. Inject values into the HTML elements
    document.getElementById('visitor-name').textContent = name;
    document.getElementById('display-college').textContent = college;
    document.getElementById('display-reason').textContent = reason;
    document.getElementById('display-time').textContent = time;

    // Optional: Log the final entry for debugging
    console.log(`Access Granted: ${name} at ${time}`);
});

/**
 * Resets the session and returns to the portal landing
 */
function finishEntry() {
    // Clear the specific keys used for this visitor flow
    localStorage.removeItem('visitorEmail');
    localStorage.removeItem('lastVisitorName');
    localStorage.removeItem('lastVisitorCollege');
    localStorage.removeItem('lastVisitorReason');
    localStorage.removeItem('lastVisitorTime');

    // Redirect to the main library portal
    window.location.href = '../index.html';
}