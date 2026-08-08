import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

// Sourav's Official Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBJ2U4Yu-wjml3K2W1S8Varoie90tvHMq4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "desieats-online.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "desieats-online",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "desieats-online.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "881044837279",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:881044837279:web:6e2ae8ef3c1046fe2be3aa"
};

let app = null;
let db = null;
let isFirebaseConnected = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseConnected = true;
  console.log("🔥 Connected to Sourav's Firebase Project [desieats-online]!");
} catch (e) {
  console.warn("⚠️ Firebase fallback mode active:", e);
}

export { app, db, isFirebaseConnected };

// Real-Time Collection Subscriber
export const subscribeToCollection = (collectionName, callback, orderField = null) => {
  if (!db) return () => {};
  try {
    const colRef = collection(db, collectionName);
    const q = orderField ? query(colRef, orderBy(orderField, 'desc')) : colRef;
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      console.warn(`Firestore collection [${collectionName}] read issue:`, error);
    });
  } catch (err) {
    console.warn(`Failed to subscribe to ${collectionName}:`, err);
    return () => {};
  }
};

// Save / Merge Document
export const saveFirestoreDoc = async (collectionName, docId, data) => {
  if (!db) return false;
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (err) {
    console.warn(`Firestore write error [${collectionName}/${docId}]:`, err);
    return false;
  }
};

// Add New Document
export const addFirestoreDoc = async (collectionName, data) => {
  if (!db) return null;
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  } catch (err) {
    console.warn(`Firestore add error [${collectionName}]:`, err);
    return null;
  }
};

// Delete Document
export const deleteFirestoreDoc = async (collectionName, docId) => {
  if (!db) return false;
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn(`Firestore delete error [${collectionName}/${docId}]:`, err);
    return false;
  }
};
