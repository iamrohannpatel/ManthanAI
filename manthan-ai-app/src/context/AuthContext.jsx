import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

// Enhanced logging for debugging
console.log('VITE_DEMO_MODE:', import.meta.env.VITE_DEMO_MODE);
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
console.log('DEMO_MODE:', DEMO_MODE);
console.log('Firebase auth object:', auth);

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google Sign In
  const signInWithGoogle = async () => {
    console.log('Attempting to sign in with Google...');
    if (!auth) {
      console.error('Firebase auth object is not available. Cannot sign in.');
      throw new Error('Authentication is disabled or not configured.');
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Successfully signed in with Google:', result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error.code, error.message);
      throw error;
    }
  };

  // Sign Out
  const logout = async () => {
    console.log('Attempting to sign out...');
    if (!auth) {
      console.error('Firebase auth object is not available. Cannot sign out.');
      throw new Error('Authentication is disabled or not configured.');
    }
    try {
      await signOut(auth);
      console.log('Successfully signed out.');
    } catch (error) {
      console.error('Error signing out:', error.code, error.message);
      throw error;
    }
  };

  useEffect(() => {
    console.log('Auth provider useEffect is running...');
    if (!auth) {
      console.warn('Firebase auth object is not available. Auth state changes will not be tracked.');
      setCurrentUser(null);
      setLoading(false);
      return () => {};
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged triggered. User:', user);
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener.');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
