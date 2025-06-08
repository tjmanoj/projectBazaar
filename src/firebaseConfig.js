import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlg-sZpEt09ETTgjlbw5wMyRfhSJPYA9E",
  authDomain: "project-bazaar-official.firebaseapp.com",
  projectId: "project-bazaar-official",
  storageBucket: "project-bazaar-official.firebasestorage.app",
  messagingSenderId: "461077668560",
  appId: "1:461077668560:web:73ca5af5e6a1a3235af4d5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
