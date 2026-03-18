import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK (server-side only)
// Used only for authentication verification — all data is in PostgreSQL
function ensureInitialized() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // .env stores \n as literal backslash-n; replace with real newlines
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    })
  }
}

// Lazy getters — avoid initializing during Next.js build / page-data collection
export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(_target, prop, receiver) {
    ensureInitialized()
    const auth = admin.auth()
    return Reflect.get(auth, prop, receiver)
  },
})

export const adminApp = new Proxy({} as admin.app.App, {
  get(_target, prop, receiver) {
    ensureInitialized()
    const app = admin.app()
    return Reflect.get(app, prop, receiver)
  },
})

// NOTE: Firestore (adminDb) has been removed.
// All business data now lives in PostgreSQL via Prisma.

export default admin
