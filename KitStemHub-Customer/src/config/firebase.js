// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: "loginkitstem.firebaseapp.com",
  projectId: "loginkitstem",
  storageBucket: "loginkitstem.appspot.com",
  messagingSenderId: "953447545464",
  appId: "1:953447545464:web:d8aba810ce65c557040b8d",
  measurementId: "G-Z9KQJHVFFZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
export { googleProvider, auth };
