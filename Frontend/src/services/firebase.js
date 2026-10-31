import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your_api_key_here" &&
  firebaseConfig.projectId
);
let authInstance = null;
if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    authInstance = getAuth(app);
  } catch (err) {
    console.warn("Firebase initialization warning, falling back to local auth mode:", err);
  }
}
// Local mock storage key for fallback demo mode
const LOCAL_USER_KEY = 'interviewiq_local_user';
export async function loginWithEmail(email, password) {
  if (authInstance) {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  }
  // Local fallback
  const simulatedUser = {
    uid: 'user_' + btoa(email).slice(0, 10),
    email,
    displayName: email.split('@')[0],
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(simulatedUser));
  return simulatedUser;
}
export async function signUpWithEmail(email, password, displayName = '') {
  if (authInstance) {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  }
  // Local fallback
  const simulatedUser = {
    uid: 'user_' + btoa(email).slice(0, 10),
    email,
    displayName: displayName || email.split('@')[0],
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(simulatedUser));
  return simulatedUser;
}
export async function logoutUser() {
  if (authInstance) {
   await signOut(authInstance);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
  return true;
}
export async function resetUserPassword(email) {
  if (authInstance) {
    await sendPasswordResetEmail(authInstance, email);
    return true;
  }
  // Local fallback
  await new Promise((r) => setTimeout(r, 600));
  return true;
}
export function subscribeToAuth(callback) {
  if (authInstance) {
    return onAuthStateChanged(authInstance, (user) => {
      callback(user);
    });
  }
  // Local fallback check
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      callback(JSON.parse(stored));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }
  return () => {};
}
export function getGuestUser() {
  return {
    uid: 'guest_user',
    email: 'guest@interviewiq.ai',
    displayName: 'Alex Candidate (Demo)',
    isGuest: true,
  };
} 