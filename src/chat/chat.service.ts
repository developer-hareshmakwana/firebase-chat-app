import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>, // 👈 Injected repository
  ) { }

  async create(createChatDto: CreateChatDto) {
    const chat = this.chatRepository.create(createChatDto);
    const response = await this.chatRepository.save(chat);
    return { chatId: response.chatId };
  }

  findAll({ chatId, limit, offset }: { chatId: string; limit: number; offset: number }) {
    return this.chatRepository.find({
      where: { chatId: +chatId },
      take: limit,
      skip: offset,
      order: { createdAt: 'ASC' }, // Order by createdAt in descending order
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
