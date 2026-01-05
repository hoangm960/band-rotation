import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxzVbcKy9eNz9LB9opxm5eldjAW6l5RuY",
    authDomain: "band-rotation.firebaseapp.com",
    projectId: "band-rotation",
    storageBucket: "band-rotation.firebasestorage.app",
    messagingSenderId: "190709672238",
    appId: "1:190709672238:web:fe278fd25194439d7432bf",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

