/**
 * adminLogs.js - Table History & Access Control
 */
import { db, auth } from '../firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('adminEmail')) { window.location.href = 'adminLogin.html'; return; }
    
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

    listenToVisitorLogs();
    listenToBlocklist();
});

function listenToVisitorLogs() {
    const q = query(collection(db, "library_logs"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        const tbody = document.getElementById('logTableBody');
        const blockedUsers = window.currentBlockedList || [];
        tbody.innerHTML = '';
        snapshot.forEach((logDoc) => {
            const log = logDoc.data();
            const email = log.email;
            const isBlocked = blockedUsers.includes(email);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.timestamp?.toDate().toLocaleString() || "..."}</td>
                <td>${log.name}</td>
                <td>${email}</td>
                <td>${log.college}</td>
                <td>${log.reason}</td>
                <td>
                    ${isBlocked 
                        ? `<button class="btn-unblock" style="background:#555" onclick="handleUnblock('${email}')">Unblock</button>` 
                        : `<button class="btn-block" onclick="handleBlock('${email}')">Block</button>`}
                </td>
            `;
            tbody.appendChild(row);
        });
    });
}

function listenToBlocklist() {
    onSnapshot(collection(db, "restricted_access"), (snapshot) => {
        const container = document.getElementById('blocked-list-container');
        if(!container) return;
        container.innerHTML = '';
        window.currentBlockedList = [];
        snapshot.forEach((blockDoc) => {
            const email = blockDoc.id;
            window.currentBlockedList.push(email);
            const tag = document.createElement('div');
            tag.className = 'blocked-tag';
            tag.innerHTML = `<span>${email}</span><button class="tag-unblock-btn" onclick="handleUnblock('${email}')">&times;</button>`;
            container.appendChild(tag);
        });
        if (window.currentBlockedList.length === 0) container.innerHTML = '<p class="empty-msg">No restricted users found.</p>';
    });
}

window.handleBlock = async (email) => {
    if (confirm(`Restrict access for ${email}?`)) {
        await setDoc(doc(db, "restricted_access", email), {
            blockedAt: new Date().toISOString(),
            admin: localStorage.getItem('adminEmail')
        });
    }
};

window.handleUnblock = async (email) => {
    if (confirm(`Restore access for ${email}?`)) {
        await deleteDoc(doc(db, "restricted_access", email));
    }
};

window.filterLogs = () => {
    const val = document.getElementById('logSearch').value.toLowerCase();
    document.querySelectorAll('#logTableBody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
};