import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHO_YxgwInSN7zSmgP-IbwKachQSZZUH8",
  authDomain: "ebizbro-llp.firebaseapp.com",
  projectId: "ebizbro-llp",
  storageBucket: "ebizbro-llp.appspot.com",
  messagingSenderId: "266808578165",
  appId: "1:266808578165:web:85b17e7b6d3105517ea83c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);