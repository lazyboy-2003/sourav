// Firebase web configuration. Firebase web API keys identify the project; database security is enforced by Firestore Rules.
const firebaseConfig = {
  apiKey: "AIzaSyB1VIaVLNy_0QrgZm8vi5aZAnegNMuC0sQ",
  authDomain: "sourav-portfolio-82277.firebaseapp.com",
  projectId: "sourav-portfolio-82277",
  storageBucket: "sourav-portfolio-82277.firebasestorage.app",
  messagingSenderId: "92180258162",
  appId: "1:92180258162:web:5eaba767dd32f94bd8d1eb",
  measurementId: "G-Y2FPMJLHLV"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const portfolioAuth = firebase.auth();
const portfolioDb = firebase.firestore();
