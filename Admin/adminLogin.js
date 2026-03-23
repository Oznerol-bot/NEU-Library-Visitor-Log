/**
 * adminLogin.js
 */
import { auth, googleProvider, db } from '../firebase-config.js';
import { signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Force Google to show the account chooser every time
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('google-login-btn');
    const loginForm = document.getElementById('admin-login-form');
    const errorMsg = document.getElementById('error-message');

    window.handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // 1. Domain Check
            if (!user.email.endsWith('@neu.edu.ph')) {
                await signOut(auth);
                showError("Access Denied: Please use your @neu.edu.ph account.");
                return;
            }

            // 2. Admin Database Check
            const adminRef = doc(db, "authorized_admins", user.email);
            const adminSnap = await getDoc(adminRef);

            if (adminSnap.exists()) {
                localStorage.setItem('adminEmail', user.email);
                window.location.href = 'adminMain.html';
            } else {
                await signOut(auth);
                showError("Access Denied: This account is not registered as an Admin.");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            showError("Authentication failed. Please try again.");
        }
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value.trim().toLowerCase();

        if (!email.endsWith('@neu.edu.ph')) {
            showError("Only @neu.edu.ph accounts are authorized.");
            return;
        }

        try {
            const adminRef = doc(db, "authorized_admins", email);
            const adminSnap = await getDoc(adminRef);

            if (adminSnap.exists()) {
                localStorage.setItem('adminEmail', email);
                window.location.href = 'adminMain.html';
            } else {
                showError("Access Denied: Admin record not found.");
            }
        } catch (error) {
            console.error("Database Error:", error);
            showError("Permissions error. Check Firestore Rules.");
        }
    });

    function showError(msg) {
        if (errorMsg) errorMsg.textContent = msg;
    }

    if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);
});