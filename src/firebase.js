import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAiUqGDE8Hi8aV93EhCiufJxRV-E733EY",
  authDomain: "portfolio-analytics-595a9.firebaseapp.com",
  projectId: "portfolio-analytics-595a9",
  storageBucket: "portfolio-analytics-595a9.firebasestorage.app",
  messagingSenderId: "460965604505",
  appId: "1:460965604505:web:3a46c34366ee667b201c08"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
