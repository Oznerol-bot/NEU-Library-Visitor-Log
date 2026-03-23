/**
 * main.js - Global controller for NEU Library Visitor System
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log("NEU Library System Status: Online");
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    if (!timeElement || !dateElement) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

function navigateTo(destination) {
    switch(destination) {
        case 'visitor':
            window.location.href = 'VisitorLogin/visitorLogin.html';
            break;
        case 'admin':
            window.location.href = 'Admin/adminLogin.html';
            break;
        default:
            console.warn("Route not found");
    }
}