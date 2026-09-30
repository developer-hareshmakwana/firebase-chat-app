import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { UsersModule } from '../users/users.module.js';
import { Chat } from './entities/chat.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirestoreService } from '../firebase/firestore.service.js';
import { Message } from './entities/message.entity.js';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Chat, Message])], // Import UsersModule to access UsersService
  controllers: [ChatController],
  providers: [ChatService, FirestoreService],
})
export class ChatModule {}
