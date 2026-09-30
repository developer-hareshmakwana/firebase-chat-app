// firestore.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirestoreService implements OnModuleInit {
    private db: Firestore;
    private firestore = new Firestore();

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        // Initializes Firestore.
        // If running locally, ensure you have set the GOOGLE_APPLICATION_CREDENTIALS env variable.
        this.db = new Firestore({
            projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
            keyFilename: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
        });
    }

    async saveMessage(collectionName: string, messageData: any): Promise<string> {
        // Saves the message to the specified collection with an auto-generated ID
        const docRef = await this.db.collection(collectionName).add({
            ...messageData,
            createdAt: new Date().toISOString(),
        });

        return docRef.id;
    }

    async getChatMessages(
        chatId: number,
        limitNum: number,
        lastVisibleDocId?: string // Recommended replacement for 'offset'
    ) {
        const collectionRef = this.firestore.collection('messages');

        // 1. Start building the query with the WHERE clause and ORDER BY
        let query = collectionRef
            .where('chatId', '==', chatId)
            .orderBy('createdAt', 'desc') // Date descending
            .limit(limitNum);

        // 2. Handle Pagination (Cursor-based instead of Offset)
        if (lastVisibleDocId) {
            const lastDocSnapshot = await collectionRef.doc(lastVisibleDocId).get();
            if (lastDocSnapshot.exists) {
                query = query.startAfter(lastDocSnapshot);
            }
        }

        // 3. Execute the query
        const snapshot = await query.get();

        // 4. Map and return results
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}
