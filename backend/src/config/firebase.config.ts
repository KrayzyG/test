import * as admin from 'firebase-admin';
import config from './app.config';

// Initialize Firebase Admin SDK if credentials are provided
if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    }),
    storageBucket: config.firebase.storageBucket,
    databaseURL: config.firebase.databaseURL,
  });
  
  console.log('Firebase Admin SDK initialized');
} else {
  console.warn('Firebase credentials not provided. Firebase services will not be available.');
}

export const firebaseAdmin = admin;
export const firebaseStorage = admin.storage();
export const firebaseMessaging = admin.messaging();
