// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Chat } from '../../chat/entities/chat.entity.js';

@Entity('users') // Maps this class to the 'users' database table
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Exclude password from query results by default
  password: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Chat, (chat) => chat.userA, { cascade: true, onDelete: 'CASCADE', nullable: true })
  userAchats: Chat[];
  
  @OneToMany(() => Chat, (chat) => chat.userB, { cascade: true, onDelete: 'CASCADE', nullable: true })
  userBchats: Chat[];
}
