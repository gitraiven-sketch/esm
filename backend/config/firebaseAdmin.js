const admin = require('firebase-admin');

const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    const serviceAccount = {
      "type": process.env.FIREBASE_TYPE || 'service_account',
      "project_id": process.env.FIREBASE_PROJECT_ID || 'your-project-id',
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || 'your-private-key-id',
      "private_key": (process.env.FIREBASE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nREPLACE_ME\n-----END PRIVATE KEY-----\n').replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk@your-project-id.iam.gserviceaccount.com',
      "client_id": process.env.FIREBASE_CLIENT_ID || 'your-client-id',
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL || 'https://www.googleapis.com/...'
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || ''
    });

    console.log('Firebase Admin initialized');
  }
};

module.exports = { initializeFirebaseAdmin, firebaseAdmin: admin };
