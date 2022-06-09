import { initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';

import serviceAccount from '../../firebase-auth-key.json';

// Initialize Firebase
initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://jnp2-fda92.firebaseio.com',
});

// Initialize Cloud Firestore and get a reference to the service
const db = admin.firestore();

export default db;

export { admin };
