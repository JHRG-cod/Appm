/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWJoQ2t0eC1FnbvECc9lHvavN9jowpAhg",
  authDomain: "appm-17e90.firebaseapp.com",
  databaseURL: "https://appm-17e90-default-rtdb.firebaseio.com",
  projectId: "appm-17e90",
  storageBucket: "appm-17e90.firebasestorage.app",
  messagingSenderId: "1001756735669",
  appId: "1:1001756735669:web:701b6f893ee9e692bee6fc",
  measurementId: "G-E54N7KF1B9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWJoQ2t0eC1FnbvECc9lHvavN9jowpAhg",
  authDomain: "appm-17e90.firebaseapp.com",
  databaseURL: "https://appm-17e90-default-rtdb.firebaseio.com",
  projectId: "appm-17e90",
  storageBucket: "appm-17e90.firebasestorage.app",
  messagingSenderId: "1001756735669",
  appId: "1:1001756735669:web:701b6f893ee9e692bee6fc",
  measurementId: "G-E54N7KF1B9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

