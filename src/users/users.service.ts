import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Chat } from '../chat/entities/chat.entity.js';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) { }

  private readonly saltRounds = 10;

  // 1. Hash a plain text password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });

    // .save() executes the database INSERT query
    return await this.userRepository.save(newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  getAllChats(userId: number) {
    return this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.userA', 'userA')
      .leftJoinAndSelect('chat.userB', 'userB')
      .where('userA.id = :id OR userB.id = :id', { id: userId })
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
