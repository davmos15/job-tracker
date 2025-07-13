import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInAsGuest,
  linkAnonymousAccount,
  sendPasswordReset,
  logout,
  updateUserProfile,
  subscribeToAuthChanges
} from '../services/auth';
import type { User as AppUser } from '../types/user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FIREBASE_COLLECTIONS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInGuest: () => Promise<void>;
  linkAccount: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch app user data from Firestore
  const fetchAppUser = async (firebaseUser: User) => {
    try {
      const userDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, firebaseUser.uid));
      if (userDoc.exists()) {
        setAppUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchAppUser(firebaseUser);
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAuthError = (error: any) => {
    const errorMessage = error.code ? getErrorMessage(error.code) : error.message;
    setError(errorMessage);
    throw error;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmail(email, password);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      await signUpWithEmail(email, password);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const signInGoogle = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const signInGuest = async () => {
    try {
      setError(null);
      await signInAsGuest();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const linkAccount = async (email: string, password: string) => {
    try {
      setError(null);
      await linkAnonymousAccount(email, password);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordReset(email);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await logout();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const updateProfile = async (displayName?: string, photoURL?: string) => {
    try {
      setError(null);
      await updateUserProfile(displayName, photoURL);
      if (user) {
        await fetchAppUser(user);
      }
    } catch (err) {
      handleAuthError(err);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    appUser,
    loading,
    error,
    signIn,
    signUp,
    signInGoogle,
    signInGuest,
    linkAccount,
    resetPassword,
    signOut,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};