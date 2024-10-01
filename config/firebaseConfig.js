
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC7FAsEQl3xS5XaA_ZoXWdnIeqUM6_IZeo",
  authDomain: "kltn-edd92.firebaseapp.com",
  projectId: "kltn-edd92",
  storageBucket: "kltn-edd92.appspot.com",
  messagingSenderId: "571043098882",
  appId: "1:571043098882:web:e40e3ef8bcac55a0fed21b",
  measurementId: "G-KM55SLXJ4W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);