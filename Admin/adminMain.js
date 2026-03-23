/**
 * adminMain.js - Dashboard Logic
 */
import { db, auth } from '../firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, getDocs, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentFilteredLogs = [];
let myChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) { window.location.href = 'adminLogin.html'; return; }
    
    document.getElementById('admin-display-email').textContent = adminEmail;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                localStorage.removeItem('adminEmail');
                window.location.href = '../libraryLanding.html'; 
            } catch (error) {
                console.error("Logout Error:", error);
            }
        });
    }

    // Initialize the Real-Time Stats (Counters)
    setupLiveStats();
});

// --- 1. LIVE COUNTERS (Independent of Filters) ---
function setupLiveStats() {
    const logsRef = collection(db, "library_logs");

    // This listener ALWAYS looks at the full database for the top cards
    onSnapshot(logsRef, (snapshot) => {
        const allLogs = [];
        snapshot.forEach(doc => allLogs.push(doc.data()));

        const now = new Date();
        const todayStr = now.toDateString();
        
        const todayCount = allLogs.filter(log => {
            const d = log.timestamp?.toDate() || new Date();
            return d.toDateString() === todayStr;
        }).length;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weeklyCount = allLogs.filter(log => {
            const d = log.timestamp?.toDate() || new Date();
            return d >= sevenDaysAgo;
        }).length;

        // Update the 3 Cards (These will no longer change when you filter)
        if(document.getElementById('global-today')) document.getElementById('global-today').textContent = todayCount;
        if(document.getElementById('global-week')) document.getElementById('global-week').textContent = weeklyCount;
        if(document.getElementById('global-total')) document.getElementById('global-total').textContent = allLogs.length;
    });
}

// --- 2. FLEXIBLE FILTERING ---
window.applyFilters = async () => {
    const fCollege = document.getElementById('filter-college').value;
    const fReason = document.getElementById('filter-reason').value;
    const fType = document.getElementById('filter-type').value;
    const fYear = document.getElementById('filter-year')?.value; 
    const fCourse = document.getElementById('filter-course')?.value;

    const logsRef = collection(db, "library_logs");
    const q = query(logsRef, orderBy("timestamp", "desc"));

    try {
        const querySnapshot = await getDocs(q);
        let results = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Match if: (Filter is empty) OR (Data matches filter)
            const matchCollege = !fCollege || data.college === fCollege;
            const matchReason = !fReason || data.reason === fReason;
            const matchType = !fType || data.visitorType === fType;
            const matchYear = !fYear || data.yearLevel === fYear;
            const matchCourse = !fCourse || data.course === fCourse;

            if (matchCollege && matchReason && matchType && matchYear && matchCourse) {
                results.push(data);
            }
        });

        currentFilteredLogs = results;
        
        // ONLY update the chart and the "Matches Found" area
        updateUIWithFilters(results);

    } catch (error) {
        console.error("Filtering Error:", error);
        alert("Search failed. Please check your connection.");
    }
};

// --- 3. CHART UI ---
function updateUIWithFilters(data) {
    const resultsArea = document.getElementById('results-area');
    const matchCount = document.getElementById('filter-match-count');
    
    if (resultsArea) resultsArea.style.display = 'block';
    if (matchCount) matchCount.textContent = data.length;

    const collegeCounts = {};
    data.forEach(log => {
        // This ensures CICS and College of Informatics... are counted correctly
        const label = log.college || "Unknown";
        collegeCounts[label] = (collegeCounts[label] || 0) + 1;
    });

    if (myChart) myChart.destroy();
    const ctx = document.getElementById('resultsChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(collegeCounts),
            datasets: [{
                label: 'Visitors',
                data: Object.values(collegeCounts),
                backgroundColor: 'rgba(224, 225, 221, 0.5)',
                borderColor: '#E0E1DD',
                borderWidth: 1
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { 
                y: { beginAtZero: true, ticks: { color: '#E0E1DD' } }, 
                x: { ticks: { color: '#E0E1DD' } } 
            }
        }
    });
}

// --- 4. EXPORT ---
window.exportFilteredData = () => {
    if (currentFilteredLogs.length === 0) {
        alert("No data to export.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("NEU Library Attendance Report", 14, 20);
    const tableData = currentFilteredLogs.map(log => [
        log.timestamp?.toDate().toLocaleDateString() || "N/A",
        log.name, log.email, log.college, log.reason
    ]);
    doc.autoTable({ startY: 30, head: [['Date', 'Name', 'Email', 'College', 'Reason']], body: tableData });
    doc.save(`Report_${Date.now()}.pdf`);
};