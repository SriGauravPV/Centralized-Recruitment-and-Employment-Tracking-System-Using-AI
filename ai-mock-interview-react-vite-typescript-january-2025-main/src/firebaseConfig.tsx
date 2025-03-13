// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  enableNetwork,
  disableNetwork
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getStorage, 
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import {
  getMessaging,
  getToken,
  onMessage
} from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb3YsOX5Ni9rbTzwXaq3zX2Cm0rMjQd0Q",
  authDomain: "placement-portal-e0405.firebaseapp.com",
  projectId: "placement-portal-e0405",
  storageBucket: "placement-portal-e0405.appspot.com",
  messagingSenderId: "304361988512",
  appId: "1:304361988512:web:d6114576083b3ccc4e04c5",
  measurementId: "G-LWMNWJRL41"
};

class FirebaseService {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.initializeServices();
    this.currentUser = null;
  }

  initializeServices() {
    // Initialize Firestore
    this.db = getFirestore(this.app);
    this.setupPersistence();

    // Initialize Auth
    this.auth = getAuth(this.app);
    this.setupAuthListener();

    // Initialize Storage
    this.storage = getStorage(this.app);

    // Initialize Analytics in browser only
    if (typeof window !== 'undefined') {
      this.analytics = getAnalytics(this.app);
    }

    // Initialize Messaging in browser only
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      this.messaging = getMessaging(this.app);
      this.setupMessaging();
    }
  }

  async setupPersistence() {
    try {
      await enableIndexedDbPersistence(this.db);
      console.log('Offline persistence enabled');
    } catch (err) {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in first tab only');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser doesn\'t support persistence');
      }
    }
  }

  setupAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      if (user) {
        console.log('User is signed in:', user.email);
      } else {
        console.log('User is signed out');
      }
    });
  }

  async setupMessaging() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: 'YOUR_VAPID_KEY' // Add your VAPID key here
        });
        console.log('FCM Token:', token);
        
        onMessage(this.messaging, (payload) => {
          console.log('Message received:', payload);
          // Handle foreground messages here
        });
      }
    } catch (error) {
      console.error('Error setting up messaging:', error);
    }
  }

  // Auth methods
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async logOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Storage methods
  async uploadFile(file, path) {
    try {
      const fileRef = storageRef(this.storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { downloadURL, path };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Network status methods
  async enableNetwork() {
    try {
      await enableNetwork(this.db);
      console.log('Network enabled');
    } catch (error) {
      console.error('Error enabling network:', error);
    }
  }

  async disableNetwork() {
    try {
      await disableNetwork(this.db);
      console.log('Network disabled');
    } catch (error) {
      console.error('Error disabling network:', error);
    }
  }

  handleAuthError(error) {
    const errorMap = {
      'auth/user-not-found': 'No user found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already registered',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/invalid-email': 'Invalid email address'
    };
    
    const errorMessage = errorMap[error.code] || error.message;
    return new Error(errorMessage);
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Create and export service instance
const firebaseService = new FirebaseService();
export const { db, auth, storage } = firebaseService;
export default firebaseService;