import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { User } from './entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../chat/entities/chat.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])], 
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
