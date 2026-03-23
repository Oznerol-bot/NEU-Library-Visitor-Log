/**
 * visitorLogin.js - Student Authentication & Blocklist Check
 * Location: /VisitorLogin/visitorLogin.js
 */
import { auth, googleProvider, db } from '../firebase-config.js';
import { signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FORCED ACCOUNT PICKER ---
// This ensures the Google popup allows you to switch to your @neu.edu.ph account
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

document.addEventListener('DOMContentLoaded', () => {
    const visitorForm = document.getElementById('visitor-form');
    const errorMsg = document.getElementById('error-message');

    // --- GOOGLE LOGIN HANDLER ---
    window.handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // 1. DOMAIN ENFORCEMENT (Immediate check)
            if (!user.email.endsWith('@neu.edu.ph')) {
                await signOut(auth); // Clear the session immediately
                showError("Access Denied: Use your official @neu.edu.ph account.");
                return;
            }

            // 2. BLOCKLIST CHECK (Only runs if domain is correct)
            const blockRef = doc(db, "restricted_access", user.email);
            const blockSnap = await getDoc(blockRef);

            if (blockSnap.exists()) {
                await signOut(auth);
                showError("⛔ Access Restricted. Please contact library staff.");
                return;
            }

            // SUCCESS
            localStorage.setItem('visitorEmail', user.email);
            localStorage.setItem(`name_${user.email}`, user.displayName || "Visitor");
            window.location.href = 'visitorIdentity.html';

        } catch (error) {
            console.error("Login Error:", error);
            // Specifically handle the domain error shown in your console
            if (error.code === 'auth/unauthorized-domain') {
                showError("Domain error: Add 127.0.0.1 to Firebase Authorized Domains.");
            } else {
                showError("Login failed. Check your connection or permissions.");
            }
        }
    };

    // --- MANUAL EMAIL HANDLER ---
    visitorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email-input');
        const email = emailInput.value.trim().toLowerCase();

        // 1. DOMAIN VALIDATION
        if (!email.endsWith('@neu.edu.ph')) {
            showError("Only @neu.edu.ph emails are accepted.");
            return;
        }

        try {
            // 2. BLOCKLIST CHECK
            const blockRef = doc(db, "restricted_access", email);
            const blockSnap = await getDoc(blockRef);

            if (blockSnap.exists()) {
                showError("⛔ This account is currently restricted.");
                return;
            }

            localStorage.setItem('visitorEmail', email);
            window.location.href = 'visitorIdentity.html';
        } catch (dbError) {
            console.error("Database Error:", dbError);
            showError("Database error. Verify your Firestore Security Rules.");
        }
    });

    function showError(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            const input = document.getElementById('email-input');
            input.classList.add('error-shake');
            setTimeout(() => input.classList.remove('error-shake'), 400);
        }
    }
});