import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestoreService } from './firestore.service.js';

// Define a unique injection token
export const FIREBASE_ADMIN_TOKEN = 'FIREBASE_ADMIN_TOKEN';
export const FIRESTORE_TOKEN = 'FIRESTORE_TOKEN';

@Global() // This makes the providers available globally
@Module({
  providers: [
    FirestoreService
    // {
    //   provide: FIREBASE_ADMIN_TOKEN,
    //   useFactory: () => {
    //     // Only initialize if not already initialized
    //     if (admin.apps.length === 0) {
    //       return admin.initializeApp({
    //         credential: admin.credential.applicationDefault(), // or your service account config
    //       });
    //     }
    //     return admin.app();
    //   },
    // },
    // {
    //   provide: FIRESTORE_TOKEN,
    //   useFactory: () => {
    //     // Correct way to get the Firestore instance in modern firebase-admin
    //     return getFirestore();
    //   },
    // },
  ],
  exports: [FIREBASE_ADMIN_TOKEN, FIRESTORE_TOKEN, FirestoreService], // Export tokens for injection
})
export class FirebaseModule {}
