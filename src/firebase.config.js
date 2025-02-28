import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGIXc2JfX8bchKWQ19DL6L7UtVbGZuxoY",
  authDomain: "otp-project-a805d.firebaseapp.com",
  projectId: "otp-project-a805d",
  storageBucket: "otp-project-a805d.firebasestorage.app",
  messagingSenderId: "832636518503",
  appId: "1:832636518503:web:42dd30d13d4332100594c2",
  measurementId: "G-M9DF1S85S0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

