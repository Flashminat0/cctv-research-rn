// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsXwGd0Ls0LI6U62cBUSa-HCfOHqYDfsM",
    authDomain: "research-cctv.firebaseapp.com",
    databaseURL: "https://research-cctv-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "research-cctv",
    storageBucket: "research-cctv.appspot.com",
    messagingSenderId: "666791292975",
    appId: "1:666791292975:web:c309de4d85f1cbd12196da",
    measurementId: "G-FHEYVJ41V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);