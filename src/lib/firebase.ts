/**
 * Firebase setup. The website only needs Firebase for the News admin (/admin) and for reading News posts.
 * Add these four values (from Firebase console > Project settings > Your apps) to .env.local and your host's
 * environment variables. While they are empty, the site uses the built-in sample content.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/** Name of the Firestore collection that holds the news posts. */
export const NEWS_COLLECTION = 'newsPosts';
/** Name of the Firestore collection that holds enquiries sent through the Partnerships form. */
export const ENQUIRIES_COLLECTION = 'enquiries';
/** Name of the Firestore collection that holds the events. */
export const EVENTS_COLLECTION = 'events';

/** Loads Firebase only when needed (the admin page), so normal visitors never download it. */
export async function getFirebase() {
  const [{ initializeApp, getApps, getApp }, { getAuth }, firestore] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return { auth: getAuth(app), db: firestore.getFirestore(app), firestore };
}
