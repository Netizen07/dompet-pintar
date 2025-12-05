import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE KODE CONFIG DARI FIREBASE CONSOLE DI SINI ---
const firebaseConfig = {
 apiKey: "AIzaSyBOQ3_WiELsK_0KYtMg-izGZ8EnvqdsGes",
  authDomain: "dompet-keluarga-ku.firebaseapp.com",
  projectId: "dompet-keluarga-ku",
  storageBucket: "dompet-keluarga-ku.firebasestorage.app",
  messagingSenderId: "260749977730",
  appId: "1:260749977730:web:99d98bb80288796b18ac9b",
  measurementId: "G-FVXK5FKWTH"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Export layanan agar bisa dipakai di file lain
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);