// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2MZJVI-nkbNfEG-qLu7KOgT2c3pheE8A",
  authDomain: "arcane-aab7a.firebaseapp.com",
  projectId: "arcane-aab7a",
  storageBucket: "arcane-aab7a.firebasestorage.app",
  messagingSenderId: "362668665168",
  appId: "1:362668665168:web:73e0fcfe725358de3c6455",
  measurementId: "G-F3KE405BDF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

