import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// config for each project
var firebaseConfig = {
  apiKey: "AIzaSyCK6fpml9riTn40fW3tPTlCB10gtyk-IPM",
  authDomain: "pokedex-11caf.firebaseapp.com",
  databaseURL: "https://pokedex-11caf.firebaseio.com",
  projectId: "pokedex-11caf",
  storageBucket: "pokedex-11caf.appspot.com",
  messagingSenderId: "430392357279",
  appId: "1:430392357279:web:6b519b97a6af018b814daa",
  measurementId: "G-2E8PC20N07"
};

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// exported consts and function
export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const signOut = () => auth.signOut();
export const signIn = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);
export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGooogle = () => auth.signInWithPopup(provider);

window.firebase = firebase; // for development purposes and testing

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  // Get a reference to the place in the database where a user profile might be.
  const userRef = firestore.doc(`users/${user.uid}`);

  // Go and fetch the document from that location.
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user", error.message);
    }
  }

  return getUserDocument(user.uid);
};

export const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    return firestore.collection("users").doc(uid);
  } catch (error) {
    console.error("Error fetching user", error.message);
  }
};

export default firebase;
