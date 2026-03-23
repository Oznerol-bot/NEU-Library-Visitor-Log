// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyALyctqjIJeQR_KkzeObfEu-uq_RhE_Lcc",
  authDomain: "neulibrarylog-f550e.firebaseapp.com",
  projectId: "neulibrarylog-f550e",
  storageBucket: "neulibrarylog-f550e.firebasestorage.app",
  messagingSenderId: "624269108230",
  appId: "1:624269108230:web:abd09f31a6e6bd7bee8f87",
  measurementId: "G-KV4DYMBNHP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Force the Google picker to show NEU accounts specifically
googleProvider.setCustomParameters({
    hd: "neu.edu.ph" 
});