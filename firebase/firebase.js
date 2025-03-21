import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

console.log('Initializing Firebase in firebase.js...');

const firebaseConfig = {
  apiKey: "AIzaSyB_zMqRkXAiHYBnc1aIGDi6AfTrwCL3SVg",
  authDomain: "shoeshable-e8142.firebaseapp.com",
  projectId: "shoeshable-e8142",
  storageBucket: "shoeshable-e8142.appspot.com",
  messagingSenderId: "80143970667",
  appId: "1:80143970667:android:1ead76556cf20bc4ce9c2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;