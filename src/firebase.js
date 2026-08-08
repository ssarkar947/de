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

// Default Firebase Configuration (Can be overridden via .env variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyDesiEatsOnline2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "desieats-online.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "desieats-online",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "desieats-online.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "987654321012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:987654321012:web:abcdef123456"
};

let app = null;
let db = null;
let isFirebaseConnected = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseConnected = true;
  console.log("🔥 Firebase initialized successfully for desieats.online");
} catch (e) {
  console.warn("⚠️ Firebase initialization fallback to local database mode:", e);
}

export { app, db, isFirebaseConnected };

// Real-Time Listener Helper
export const subscribeToCollection = (collectionName, callback, orderField = null) => {
  if (!db) return () => {};
  try {
    const colRef = collection(db, collectionName);
    const q = orderField ? query(colRef, orderBy(orderField, 'desc')) : colRef;
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      console.warn(`Firestore collection [${collectionName}] read issue, operating locally:`, error);
    });
  } catch (err) {
    console.warn(`Failed to subscribe to ${collectionName}:`, err);
    return () => {};
  }
};

// Save / Update Document
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
