import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB9mWlF-TLxd5Z0WXfUI4DJG-3ywIL0NPk",
  authDomain: "badminton-b2802.firebaseapp.com",
  projectId: "badminton-b2802",
  storageBucket: "badminton-b2802.firebasestorage.app",
  messagingSenderId: "17087719159",
  appId: "1:17087719159:web:b8f3f3024622e77745d5f2",
  measurementId: "G-SC745JQX0J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };