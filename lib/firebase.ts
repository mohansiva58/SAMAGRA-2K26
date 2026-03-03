import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDAaetYa2rdX86TIfUrI7MSdXSVJTaMBRw",
    authDomain: "sih-kerala.firebaseapp.com",
    databaseURL: "https://sih-kerala-default-rtdb.firebaseio.com",
    projectId: "sih-kerala",
    storageBucket: "sih-kerala.firebasestorage.app",
    messagingSenderId: "84752283767",
    appId: "1:84752283767:web:c3b1ca8f6afe1ba4bdee72",
    measurementId: "G-GXE59L0KCR",
};

// Prevent re-initializing on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const rtdb = getDatabase(app);
export default app;
