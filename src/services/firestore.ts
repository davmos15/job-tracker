import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import type { 
  QueryConstraint, 
  DocumentData, 
  QuerySnapshot, 
  Unsubscribe, 
  WriteBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { FIREBASE_COLLECTIONS } from '../utils/constants';
import type { Application, ApplicationFormData } from '../types/application';

// Enable offline persistence
let offlineEnabled = false;

export const enableOffline = async () => {
  if (!offlineEnabled) {
    await disableNetwork(db);
    offlineEnabled = true;
  }
};

export const enableOnline = async () => {
  if (offlineEnabled) {
    await enableNetwork(db);
    offlineEnabled = false;
  }
};

// Application CRUD operations

export const createApplication = async (
  userId: string,
  data: ApplicationFormData
): Promise<string> => {
  const applicationsRef = collection(db, FIREBASE_COLLECTIONS.APPLICATIONS);
  
  const application = {
    ...data,
    userId,
    interviewNotes: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(applicationsRef, application);
  return docRef.id;
};

export const updateApplication = async (
  applicationId: string,
  data: Partial<ApplicationFormData>
): Promise<void> => {
  const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, applicationId);
  
  await updateDoc(applicationRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteApplication = async (applicationId: string): Promise<void> => {
  const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, applicationId);
  await deleteDoc(applicationRef);
};

export const getApplication = async (applicationId: string): Promise<Application | null> => {
  const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, applicationId);
  const docSnap = await getDoc(applicationRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Application;
  }
  
  return null;
};

export const getUserApplications = async (
  userId: string,
  constraints: QueryConstraint[] = []
): Promise<Application[]> => {
  const applicationsRef = collection(db, FIREBASE_COLLECTIONS.APPLICATIONS);
  const q = query(
    applicationsRef,
    where('userId', '==', userId),
    ...constraints
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Application));
};

// Real-time subscription
export const subscribeToUserApplications = (
  userId: string,
  onUpdate: (applications: Application[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const applicationsRef = collection(db, FIREBASE_COLLECTIONS.APPLICATIONS);
  const q = query(
    applicationsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Application));
      onUpdate(applications);
    },
    onError
  );
};

// Batch operations
export const batchUpdateApplications = async (
  updates: Array<{ id: string; data: Partial<ApplicationFormData> }>
): Promise<void> => {
  const batch: WriteBatch = writeBatch(db);
  
  updates.forEach(({ id, data }) => {
    const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, id);
    batch.update(applicationRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  });
  
  await batch.commit();
};

export const batchDeleteApplications = async (applicationIds: string[]): Promise<void> => {
  const batch: WriteBatch = writeBatch(db);
  
  applicationIds.forEach(id => {
    const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, id);
    batch.delete(applicationRef);
  });
  
  await batch.commit();
};

// Interview notes operations
export const addInterviewNote = async (
  applicationId: string,
  note: any
): Promise<void> => {
  const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, applicationId);
  const applicationDoc = await getDoc(applicationRef);
  
  if (!applicationDoc.exists()) {
    throw new Error('Application not found');
  }
  
  const currentNotes = applicationDoc.data().interviewNotes || [];
  const newNote = {
    ...note,
    id: `note-${Date.now()}`
  };
  
  await updateDoc(applicationRef, {
    interviewNotes: [...currentNotes, newNote],
    updatedAt: serverTimestamp()
  });
};

export const updateInterviewNote = async (
  applicationId: string,
  noteId: string,
  noteData: any
): Promise<void> => {
  const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, applicationId);
  const applicationDoc = await getDoc(applicationRef);
  
  if (!applicationDoc.exists()) {
    throw new Error('Application not found');
  }
  
  const currentNotes = applicationDoc.data().interviewNotes || [];
  const updatedNotes = currentNotes.map((note: any) =>
    note.id === noteId ? { ...note, ...noteData } : note
  );
  
  await updateDoc(applicationRef, {
    interviewNotes: updatedNotes,
    updatedAt: serverTimestamp()
  });
};

export const deleteInterviewNote = async (
  applicationId: string,
  noteId: string
): Promise<void> => {
  const applicationRef = doc(db, FIREBASE_COLLECTIONS.APPLICATIONS, applicationId);
  const applicationDoc = await getDoc(applicationRef);
  
  if (!applicationDoc.exists()) {
    throw new Error('Application not found');
  }
  
  const currentNotes = applicationDoc.data().interviewNotes || [];
  const filteredNotes = currentNotes.filter((note: any) => note.id !== noteId);
  
  await updateDoc(applicationRef, {
    interviewNotes: filteredNotes,
    updatedAt: serverTimestamp()
  });
};

// User preferences operations
export const getUserPreferences = async (userId: string): Promise<any> => {
  const prefsRef = doc(db, FIREBASE_COLLECTIONS.PREFERENCES, userId);
  const docSnap = await getDoc(prefsRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  
  return null;
};

export const updateUserPreferences = async (
  userId: string,
  preferences: any
): Promise<void> => {
  const prefsRef = doc(db, FIREBASE_COLLECTIONS.PREFERENCES, userId);
  
  await setDoc(prefsRef, {
    ...preferences,
    updatedAt: serverTimestamp()
  }, { merge: true });
};