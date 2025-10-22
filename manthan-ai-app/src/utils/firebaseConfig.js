import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase (skip in demo mode)
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
]
const missing = requiredKeys.filter((k) => !import.meta.env[k])
if (missing.length && !DEMO_MODE) {
  console.error(`Missing Firebase environment variables: ${missing.join(', ')}`)
}
let app = null
if (!DEMO_MODE) {
  app = initializeApp(firebaseConfig)
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = app ? getAuth(app) : null

// Initialize Cloud Firestore and get a reference to the service
export const db = app ? getFirestore(app) : null

export default app
