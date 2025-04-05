// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsfFkGlELpeuupgOrpTKmNbjqlLH2s_Vc",
  authDomain: "eden-roots-client-portal.firebaseapp.com",
  projectId: "eden-roots-client-portal",
  storageBucket: "eden-roots-client-portal.firebasestorage.app",
  messagingSenderId: "816931228460",
  appId: "1:816931228460:web:d05e4f061bd784332bfa89",
  measurementId: "G-6W83E30HQC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const db = getFirestore(app);