/**
 * visitorIdentity.js - Profile Management
 * Ensures only authorized @neu.edu.ph users can create/read profiles.
 */
import { db } from '../firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const userEmail = localStorage.getItem('visitorEmail');
    
    // Redirect if session is missing
    if (!userEmail) { 
        window.location.href = 'visitorLogin.html'; 
        return; 
    }

    // Safety check: Ensure the email in storage is actually an NEU account
    if (!userEmail.endsWith('@neu.edu.ph')) {
        localStorage.clear();
        window.location.href = 'visitorLogin.html';
        return;
    }

    try {
        // 1. Check Firestore for existing profile in the "users" collection
        const userRef = doc(db, "users", userEmail);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Returning User: Store name and move to details
            const userData = userSnap.data();
            localStorage.setItem(`name_${userEmail}`, userData.name);
            window.location.href = 'visitorDetails.html';
        } else {
            // New User: Hide loading spinner and show registration card
            document.getElementById('loading-state').classList.add('hidden');
            document.getElementById('registration-card').classList.remove('hidden');
        }
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        // This usually happens if Firestore Rules block the request
        alert("Session error. Please log in again.");
        window.location.href = 'visitorLogin.html';
    }
});

// Handle New Profile Creation
document.getElementById('identity-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('visitor-name').value.trim();
    const userEmail = localStorage.getItem('visitorEmail');

    if (fullName && userEmail) {
        try {
            // Save the new profile to Firestore
            await setDoc(doc(db, "users", userEmail), { 
                name: fullName,
                email: userEmail,
                createdAt: new Date().toISOString()
            });
            
            // Save to local storage for the current session
            localStorage.setItem(`name_${userEmail}`, fullName);
            
            // Proceed to the next step
            window.location.href = 'visitorDetails.html';
        } catch (error) {
            console.error("Profile Creation Error:", error);
            alert("Could not create profile. Ensure you are using an @neu.edu.ph account.");
        }
    }
});