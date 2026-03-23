/**
 * visitorDetails.js - Firestore Integration
 */
import { db } from '../firebase-config.js';
import { collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const email = localStorage.getItem('visitorEmail');
    const submitBtn = document.getElementById('submit-details');
    
    // --- 1. SECURITY & SESSION CHECK ---
    if (!email) {
        window.location.href = 'visitorLogin.html';
        return;
    }

    // Double check blocklist from Firestore (Real-time safety)
    const blockRef = doc(db, "restricted_access", email);
    const blockSnap = await getDoc(blockRef);
    if (blockSnap.exists()) {
        alert("⛔ Access Denied: This account is restricted.");
        window.location.href = 'visitorLogin.html';
        return;
    }

    // --- 2. SELECTION LOGIC ---
    const selections = {
        visitorType: null,
        college: null,
        reason: null
    };

    const cards = document.querySelectorAll('.selection-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            const value = card.dataset.value;

            document.querySelectorAll(`.selection-card[data-type="${type}"]`).forEach(c => {
                c.classList.remove('active');
            });

            card.classList.add('active');
            selections[type] = value;

            if (selections.visitorType && selections.college && selections.reason) {
                submitBtn.disabled = false;
            }
        });
    });

    // --- 3. FIRESTORE SUBMISSION ---
    submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;
        submitBtn.textContent = "Recording...";

        const name = localStorage.getItem(`name_${email}`) || "Unknown Visitor";
        
        try {
            // Push to Firestore 'library_logs' collection
            const docRef = await addDoc(collection(db, "library_logs"), {
                email: email,
                name: name,
                visitorType: selections.visitorType,
                college: selections.college,
                reason: selections.reason,
                timestamp: serverTimestamp() // Use Firebase Server time, not local PC time
            });

            console.log("Log recorded with ID: ", docRef.id);

            // Keep local storage for the "Success" screen display summary
            localStorage.setItem('lastVisitorName', name);
            localStorage.setItem('lastVisitorCollege', selections.college);
            localStorage.setItem('lastVisitorReason', selections.reason);
            localStorage.setItem('lastVisitorTime', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

            window.location.href = 'visitorEntry.html';
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error saving your entry. Please try again.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Complete Registration";
        }
    });
});