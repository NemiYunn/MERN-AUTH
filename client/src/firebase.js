// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-26c4e.firebaseapp.com",
  projectId: "mern-auth-26c4e",
  storageBucket: "mern-auth-26c4e.appspot.com",
  messagingSenderId: "837829899625",
  appId: "1:837829899625:web:194ac969a90d17dc28f9f8"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);