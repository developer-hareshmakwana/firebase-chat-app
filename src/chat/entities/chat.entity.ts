// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('chats') // Maps this class to the 'chats' database table
export class Chat {
    @PrimaryGeneratedColumn()
    chatId: number;

    @Column({ type: 'text' })
    text: string;

    @ManyToOne(() => Chat, (chat) => chat.reply, { onDelete: 'SET NULL', nullable: true })
    reply?: Chat;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => User, (user) => user.userAchats, { nullable: false })
    userA: User | number;

    @ManyToOne(() => User, (user) => user.userBchats, { nullable: false })
    userB: User | number;
}
