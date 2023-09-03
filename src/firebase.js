// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbl1393VeGV4m9eLvvRPpMfH-bfDSI8mE",
  authDomain: "myfinance-6c349.firebaseapp.com",
  projectId: "myfinance-6c349",
  storageBucket: "myfinance-6c349.appspot.com",
  messagingSenderId: "549914940889",
  appId: "1:549914940889:web:98288a8a05dff68bf635c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const dataBase = getFirestore(app)

export {
    dataBase,
    auth
}