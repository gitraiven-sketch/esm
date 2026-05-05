const admin = require('firebase-admin');

const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    try {
      // First try to load from environment variables (production)
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        // Normalize key format
        privateKey = privateKey.trim();
        privateKey = privateKey.replace(/^"|"$/g, ''); // Remove wrapping quotes

        if (privateKey.includes('\\n')) {
          privateKey = privateKey.replace(/\\n/g, '\n');
        }

        if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
          privateKey = '-----BEGIN PRIVATE KEY-----\n' + privateKey;
        }
        if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
          privateKey = privateKey + '\n-----END PRIVATE KEY-----';
        }

        const serviceAccount = {
          type: process.env.FIREBASE_TYPE || 'service_account',
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: privateKey,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL
        });

        console.log('Firebase Admin initialized from environment variables');
      } else {
        // Fallback to JSON file (development/local)
        const fs = require('fs');
        const path = require('path');
        const keyPath = path.join(__dirname, '../../system-hr-fa2e8-firebase-adminsdk-fbsvc-9d9f2e6249.json');

        if (fs.existsSync(keyPath)) {
          const serviceAccount = require(keyPath);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://system-hr-fa2e8.firebaseio.com'
          });
          console.log('Firebase service account loaded from JSON file');
        } else {
          throw new Error('Firebase configuration not found. Please set environment variables or provide JSON file.');
        }
      }
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error.message);
      throw error;
    }
  }
};

module.exports = { initializeFirebaseAdmin };
      console.log('Firebase Admin initialized');
    } catch (error) {
      console.error('Firebase Admin initialization failed:', error.message);
    }
  }
};

const getAuth = () => {
  if (admin.apps.length === 0) return null;
  return admin.auth();
};

module.exports = { initializeFirebaseAdmin, firebaseAdmin: admin, getAuth };
