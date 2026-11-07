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
  /** Optional: only needed for picture upload in /admin (Firebase > Storage). */
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
};

/** Optional free picture host (Cloudinary). Create a free account, then an "unsigned" upload preset (see FIREBASE-SETUP.md). */
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
};
export const cloudinaryEnabled = Boolean(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset);

/** Picture upload in /admin works with Cloudinary (free) or a Firebase Storage bucket. With neither, the admin keeps the paste-a-link box. */
export const uploadsEnabled = cloudinaryEnabled || Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.storageBucket);

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/** Name of the Firestore collection that holds the news posts. */
export const NEWS_COLLECTION = 'newsPosts';
/** Name of the Firestore collection that holds enquiries sent through the Partnerships form. */
export const ENQUIRIES_COLLECTION = 'enquiries';
/** Name of the Firestore collection that holds the events. */
export const EVENTS_COLLECTION = 'events';
/** Name of the Firestore collection that holds the game page extras (trailer, screenshots, waiting list link). One document per game: alpha, beta, gamma. */
export const GAMES_COLLECTION = 'games';

/** Music page: one document called `album` (the featured soundtrack, its tracklist and streaming links). */
export const MUSIC_COLLECTION = 'music';
/** Music page: one document per release in "Latest releases". */
export const MUSIC_RELEASES_COLLECTION = 'musicReleases';

/** Site-wide settings: one document called `site` (Discord, contact email, social links). */
export const SETTINGS_COLLECTION = 'settings';
/** The studio team shown on the About page and on every game page. */
export const TEAM_COLLECTION = 'team';
/** IP characters shown on the IP page. */
export const CHARACTERS_COLLECTION = 'characters';
/** IP page: two documents, `universe` (the featured universe) and `links` (the IP blurb for each game in IP × Games). */
export const IP_COLLECTION = 'ip';
/** IP page: one document per tile in the Concept Art Vault. */
export const IP_VAULT_COLLECTION = 'ipVault';

/** Loads Firebase only when needed (the admin page), so normal visitors never download it. */
export async function getFirebase() {
  const [{ initializeApp, getApps, getApp }, { getAuth }, firestore] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return { app, auth: getAuth(app), db: firestore.getFirestore(app), firestore };
}
