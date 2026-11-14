import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
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
let isFirestoreHealthy = false;
let firestoreErrorDetails = { code: 'checking', message: 'Checking database access...' };
const statusListeners = new Set();

export const onFirestoreStatusChange = (callback) => {
  statusListeners.add(callback);
  callback({ healthy: isFirestoreHealthy, error: firestoreErrorDetails });
  return () => statusListeners.delete(callback);
};

export const notifyStatus = (healthy, err = null) => {
  isFirestoreHealthy = healthy;
  firestoreErrorDetails = err;
  statusListeners.forEach(cb => {
    try { cb({ healthy, error: err }); } catch (e) {}
  });
};

export const checkFirestoreHealth = async () => {
  if (!db) {
    const errObj = { code: 'no-db', message: 'Database not initialized' };
    notifyStatus(false, errObj);
    return { healthy: false, error: errObj };
  }
  try {
    const colRef = collection(db, 'orders');
    const snap = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
    notifyStatus(true, null);
    return { healthy: true, size: snap.size };
  } catch (err) {
    const isPerm = err?.code === 'permission-denied' || String(err?.message).includes('permissions') || String(err).includes('PERMISSION_DENIED');
    const errObj = {
      code: isPerm ? 'permission-denied' : (err?.code || 'error'),
      message: err?.message || 'Database access denied'
    };
    notifyStatus(false, errObj);
    return { healthy: false, error: errObj };
  }
};

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseConnected = true;
  console.log("🔥 Connected to Sourav's Firebase Project [desieats-online]!");
  // Immediate background health check
  checkFirestoreHealth().catch(() => {});
} catch (e) {
  console.warn("⚠️ Firebase fallback mode active:", e);
  notifyStatus(false, { code: 'init-error', message: e?.message });
}

export { app, db, isFirebaseConnected };

// Real-Time Collection Subscriber
export const subscribeToCollection = (collectionName, callback, orderField = null) => {
  if (!db) return () => {};
  try {
    const colRef = collection(db, collectionName);
    const q = orderField ? query(colRef, orderBy(orderField, 'desc')) : colRef;
    
    return onSnapshot(q, (snapshot) => {
      notifyStatus(true, null);
      const data = snapshot.docs.map(d => {
        const docData = d.data() || {};
        return {
          ...docData,
          _docId: d.id,
          id: docData.id || d.id
        };
      });
      callback(data);
    }, (error) => {
      console.warn(`Firestore collection [${collectionName}] read issue:`, error);
      const isPerm = error?.code === 'permission-denied' || String(error?.message).includes('permissions') || String(error).includes('PERMISSION_DENIED');
      notifyStatus(false, {
        code: isPerm ? 'permission-denied' : (error?.code || 'error'),
        message: error?.message || `Failed to read ${collectionName}`
      });
    });
  } catch (err) {
    console.warn(`Failed to subscribe to ${collectionName}:`, err);
    return () => {};
  }
};

// Clean undefined values for Firestore serialization
const sanitizeForFirestore = (obj) => {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('_')) continue; // exclude internal metadata like _docId
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    } else {
      clean[key] = null;
    }
  }
  return clean;
};

// Save / Merge Document
export const saveFirestoreDoc = async (collectionName, docId, data) => {
  if (!db || !docId) return false;
  try {
    const cleanId = String(docId).trim();
    const docRef = doc(db, collectionName, cleanId);
    const sanitized = sanitizeForFirestore(data);
    await setDoc(docRef, sanitized, { merge: true });

    // If document was originally tracked with an alternate Firestore doc ID, update/clean that doc as well
    if (data && data._docId && String(data._docId).trim() !== cleanId) {
      try {
        const altDocRef = doc(db, collectionName, String(data._docId).trim());
        await setDoc(altDocRef, sanitized, { merge: true });
      } catch (altErr) {}
    }

    notifyStatus(true, null);
    return true;
  } catch (err) {
    console.warn(`Firestore write error [${collectionName}/${docId}]:`, err);
    const isPerm = err?.code === 'permission-denied' || String(err?.message).includes('permissions') || String(err).includes('PERMISSION_DENIED');
    notifyStatus(false, {
      code: isPerm ? 'permission-denied' : (err?.code || 'error'),
      message: err?.message || `Failed to write ${collectionName}/${docId}`
    });
    return false;
  }
};

// Add New Document
export const addFirestoreDoc = async (collectionName, data) => {
  if (!db) return null;
  try {
    const colRef = collection(db, collectionName);
    const sanitized = sanitizeForFirestore(data);
    const docRef = await addDoc(colRef, sanitized);
    return docRef.id;
  } catch (err) {
    console.warn(`Firestore add error [${collectionName}]:`, err);
    return null;
  }
};

// Get Single Document
export const getFirestoreDoc = async (collectionName, docId) => {
  if (!db || !docId) return null;
  try {
    const cleanId = String(docId).trim();
    const docRef = doc(db, collectionName, cleanId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, _docId: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (err) {
    console.warn(`Firestore getDoc error [${collectionName}/${docId}]:`, err);
    return null;
  }
};

// Delete Document
export const deleteFirestoreDoc = async (collectionName, docId) => {
  if (!db || !docId) return false;
  try {
    const cleanId = String(docId).trim();
    const docRef = doc(db, collectionName, cleanId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn(`Firestore delete error [${collectionName}/${docId}]:`, err);
    return false;
  }
};

// Delete All Documents in Collection
export const deleteAllFirestoreDocs = async (collectionName) => {
  if (!db) return false;
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (err) {
    console.warn(`Firestore deleteAllDocs error [${collectionName}]:`, err);
    return false;
  }
};
