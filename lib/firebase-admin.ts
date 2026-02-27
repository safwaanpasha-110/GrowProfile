import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK (server-side only)
// Used only for authentication verification — all data is in PostgreSQL
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
  }
}

export const adminAuth = admin.auth()
export const adminApp = admin.app()

// NOTE: Firestore (adminDb) has been removed.
// All business data now lives in PostgreSQL via Prisma.

export default admin
