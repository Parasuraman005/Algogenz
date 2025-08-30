// Firebase Configuration for AlgoGenz Club
// To enable cloud storage, replace the placeholder values with your Firebase project details
// and uncomment the firebase.initializeApp() call in this file.

const firebaseConfig = {
  apiKey: "AIzaSyCy7WoD4K-hmdeWBL2W7034A9ecoY0t8KU",
  authDomain: "algogenz-5261c.firebaseapp.com",
  projectId: "algogenz-5261c",
  storageBucket: "algogenz-5261c.firebasestorage.app",
  messagingSenderId: "517177863011",
  appId: "1:517177863011:web:90f01baa7be89f763ec156",
  measurementId: "G-32450YVNTK"
};

// Uncomment the line below and add this script to members.html to enable cloud storage
// firebase.initializeApp(firebaseConfig);

// Instructions:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Click "Add app" and choose Web
// 6. Copy the config object and replace the values above
// 7. Go to Firestore Database and create a database
// 8. Set up security rules to allow read/write access
// 9. Uncomment the firebase.initializeApp line above
// 10. Add this script to members.html before the members.js script

console.log('Firebase config loaded. To enable cloud storage, configure your Firebase project details and uncomment the initialization line.');
