import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module';
import { Chat } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirestoreService } from '../firebase/firestore.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Chat])], // Import UsersModule to access UsersService
  controllers: [ChatController],
  providers: [ChatService, FirestoreService],
})
export class ChatModule {}
