import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhdcSKljsI5rmiz6hV_O-oRAg0KtejI2c",
  authDomain: "sms-nis.firebaseapp.com",
  projectId: "sms-nis",
  storageBucket: "sms-nis.firebasestorage.app",
  messagingSenderId: "765870434973",
  appId: "1:765870434973:web:8019c7a305c4c42c5c0274",
  measurementId: "G-ZMBX2NH0XQ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
export default app;
