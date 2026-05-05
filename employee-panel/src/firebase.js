import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig } from '@shared/config/firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' && firebaseConfig.measurementId ? getAnalytics(app) : null;
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

const requestFirebaseToken = async () => {
  if (!messaging || !firebaseConfig.vapidKey) {
    return null;
  }
  try {
    return await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
  } catch (error) {
    console.error('Unable to get messaging token:', error);
    return null;
  }
};

const onMessageListener = (callback) => {
  if (!messaging) return;
  onMessage(messaging, callback);
};

const logoutFromFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase sign-out error:', error);
  }
};

export { auth, analytics, messaging, requestFirebaseToken, onMessageListener, logoutFromFirebase };
