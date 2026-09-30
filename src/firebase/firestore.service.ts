// firestore.service.ts
import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FieldValue, Firestore } from '@google-cloud/firestore';
import { ConfigService } from '@nestjs/config';
import { LastSeenDto, MarkReadDto } from '../chat/dto/message.dto';

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

    async markMessageRead(
        dto: MarkReadDto,
    ) {
        const { chatId, messageId, userId } = dto;

        const messageRef = this.db
            .collection('messages')
            .doc(messageId);

        const messageSnapshot = await messageRef.get();

        if (!messageSnapshot.exists) {
            throw new NotFoundException('Message not found');
        }

        const message = messageSnapshot.data();

        // Important: make sure the message belongs
        // to the requested chat.
        console.log('Message chatId:', message?.chatId, 'Requested chatId:', chatId);
        if (+message?.chatId !== +chatId) {
            throw new NotFoundException(
                'Message does not belong to this chat',
            );
        }

        // 4. Use chatId + userId as deterministic document ID
        const documentId = `${chatId}_${userId}`;

        // 5. Read receipt
        const readReceiptRef = this.db
            .collection('readReceipts')
            .doc(documentId);

        // 6. Last read message
        const lastReadRef = this.db
            .collection('lastReadMessages')
            .doc(documentId);

        const now = FieldValue.serverTimestamp();

        // Update both atomically
        const batch = this.db.batch();

        batch.set(
            readReceiptRef,
            {
                chatId,
                userId,
                messageId,
                readAt: now,
            },
            {
                merge: true,
            },
        );

        batch.set(
            lastReadRef,
            {
                chatId,
                userId,
                messageId,
                updatedAt: now,
            },
            {
                merge: true,
            },
        );

        await batch.commit();

        return {
            success: true,
            chatId,
            messageId,
            userId,
        };
    }

    async markLastSeen(
        dto: LastSeenDto,
    ) {
        const { chatId, messageId, userId } = dto;
        const messageRef = this.db
            .collection('messages')
            .doc(messageId);

        const messageSnapshot = await messageRef.get();

        if (!messageSnapshot.exists) {
            throw new NotFoundException(
                'Message not found',
            );
        }

        const message = messageSnapshot.data();

        if (+message?.chatId !== +chatId) {
            throw new BadRequestException(
                'Message does not belong to this chat',
            );
        }

        // 4. Update last read
        const documentId = `${chatId}_${userId}`;

        await this.db
            .collection('lastReadMessages')
            .doc(documentId)
            .set(
                {
                    chatId,
                    userId,
                    messageId,
                    updatedAt: FieldValue.serverTimestamp(),
                },
                {
                    merge: true,
                },
            );

        return {
            success: true,
            chatId,
            userId,
            messageId,
        };
    }
}
