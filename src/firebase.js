// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArbSki5hJXi1VnXltDZabAnI7Sm-WQAfo",
  authDomain: "transaltor-app.firebaseapp.com",
  projectId: "transaltor-app-c2079",
  storageBucket: "transaltor-app.appspot.com",
  messagingSenderId: "869613552943",
  appId: "1:869613552943:web:a18c8a1c25b7d3b5c2d01d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
