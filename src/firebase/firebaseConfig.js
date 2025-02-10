// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCnTSZZu9V7m4914_UTRLft7AM38nUBUpw",
  authDomain: "pickup-games-dd78b.firebaseapp.com",
  projectId: "pickup-games-dd78b",
  storageBucket: "pickup-games-dd78b.firebasestorage.app",
  messagingSenderId: "873293755434",
  appId: "1:873293755434:web:ff2de9e94193c2b3973f53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
