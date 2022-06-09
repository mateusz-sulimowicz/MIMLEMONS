// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDH1r7NFVkLL5DedTrBJb4N4242ReQutfs",
  authDomain: "jnp2-fda92.firebaseapp.com",
  databaseURL: "https://jnp2-fda92-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jnp2-fda92",
  storageBucket: "jnp2-fda92.appspot.com",
  messagingSenderId: "722686657939",
  appId: "1:722686657939:web:8eea23688073ba3eda9466",
  measurementId: "G-ZKV9T6M3QJ"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth(app);
export const provider = new firebase.auth.GoogleAuthProvider();

export default firebase;