import db from './config.mjs';
import { admin } from './config.mjs';

const users = db.collection('users');

// Creates user record in Firebase.
const createUser = async (uid) => {
  const userRef = users.doc(`${uid}`);
  let user = await userRef.get();
  if (user.exists) {
    throw new Error('User already exists!');
  }

  await userRef.set({
    mmr: 1000,
    gamesPlayed: 0,
    gamesWon: 0,
  });

  user = await userRef.get();
  return user;
};

// Reads user data from Firebase.
const getUser = async (uid) => {
  let user = await users.doc(`${uid}`).get();
  if (!user.exists) {
    user = await createUser(uid);
  }
  return user.data();
};

export const updateUserWonGame = async (uid) => {
  const userRef = users.doc(`${uid}`);
  await userRef.update({
    gamesPlayed: admin.firestore.FieldValue.increment(1),
    gamesWon: admin.firestore.FieldValue.increment(1),
  });
}

export const updateUserLostGame = async (uid) => {
  const userRef = users.doc(`${uid}`);
  await userRef.update({
    gamesPlayed: admin.firestore.FieldValue.increment(1),
  });
}

export { getUser };
