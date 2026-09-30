import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { SendMessageDto } from './dto/message.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly firestoreService: FirestoreService) { }

  @Post('create')
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Post(':chatId/message/send')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body() sendMessageDto: SendMessageDto
  ) {
    const docId = await this.firestoreService.saveMessage('messages', {...sendMessageDto, chatId: +chatId, createdAt: new Date().toISOString()});
    return { success: true, id: docId };
  }

  @Post(':chatId/message/:messageId/read')
  async markMessageRead(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Body() body: {userId: number}
  ) {
    return await this.firestoreService.markMessageRead({
      chatId: chatId,
      messageId: messageId,
      userId: body.userId.toString(),
    });
  }

  @Post(':chatId/lastseen')
  async markLastSeen(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Body() body: {userId: number}
  ) {
    return await this.firestoreService.markLastSeen({
      chatId: chatId,
      messageId: messageId,
      userId: body.userId.toString(),
    });
  }

  @Get(':chatId/messages')
  async findAll(@Param('chatId') chatId: string, @Query('limit') limit: number = 50, @Query('offset') offset: number = 0) {
    const messages = await this.firestoreService.getChatMessages(+chatId, +limit, undefined);
    return { success: true, messages };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
