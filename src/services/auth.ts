import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import type { User, UserCredential, NextOrObserver } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_COLLECTIONS } from '../utils/constants';
import type { User as AppUser } from '../types/user';

const googleProvider = new GoogleAuthProvider();

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(userCredential.user);
  return userCredential;
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  await createUserDocument(userCredential.user);
  return userCredential;
};

// Sign in anonymously (Guest mode)
export const signInAsGuest = async (): Promise<UserCredential> => {
  const userCredential = await signInAnonymously(auth);
  await createUserDocument(userCredential.user);
  return userCredential;
};

// Link anonymous account to permanent account
export const linkAnonymousAccount = async (email: string, password: string): Promise<UserCredential> => {
  if (!auth.currentUser || !auth.currentUser.isAnonymous) {
    throw new Error('No anonymous user to link');
  }
  
  const credential = EmailAuthProvider.credential(email, password);
  const userCredential = await linkWithCredential(auth.currentUser, credential);
  await updateUserDocument(userCredential.user);
  return userCredential;
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// Sign out
export const logout = async (): Promise<void> => {
  return signOut(auth);
};

// Update user profile
export const updateUserProfile = async (displayName?: string, photoURL?: string): Promise<void> => {
  if (!auth.currentUser) throw new Error('No user logged in');
  
  await updateProfile(auth.currentUser, {
    displayName: displayName || auth.currentUser.displayName,
    photoURL: photoURL || auth.currentUser.photoURL
  });
  
  await updateUserDocument(auth.currentUser);
};

// Create user document in Firestore
const createUserDocument = async (user: User): Promise<void> => {
  const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const userData: AppUser = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    await setDoc(userRef, userData);
  } else {
    // Update last login
    await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
  }
};

// Update user document in Firestore
const updateUserDocument = async (user: User): Promise<void> => {
  const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, user.uid);
  
  await setDoc(userRef, {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    lastLogin: new Date()
  }, { merge: true });
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: NextOrObserver<User | null>) => {
  return onAuthStateChanged(auth, callback);
};

// Auto logout after inactivity
let inactivityTimer: NodeJS.Timeout;

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (auth.currentUser) {
      logout();
    }
  }, 30 * 60 * 1000); // 30 minutes
};

// Set up activity listeners
if (typeof window !== 'undefined') {
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer);
  });
  
  // Start timer when user logs in
  subscribeToAuthChanges((user) => {
    if (user) {
      resetInactivityTimer();
    } else {
      clearTimeout(inactivityTimer);
    }
  });
}