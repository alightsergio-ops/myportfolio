
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAaHKvKOat8MEYEnr-f--T7ayCp6gJXVb0",
    authDomain: "portfolio-2b43f.firebaseapp.com",
    projectId: "portfolio-2b43f",
    storageBucket: "portfolio-2b43f.firebasestorage.app",
    messagingSenderId: "1076539748550",
    appId: "1:1076539748550:web:941501fcf32c1f5321e7c7",
    measurementId: "G-BGV8CN0KVD"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
