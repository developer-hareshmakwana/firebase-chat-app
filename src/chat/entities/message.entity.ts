import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages') // Maps this class to the 'chats' database table
export class Message {
    @PrimaryGeneratedColumn()
    messageId: number;

    @Column({type: 'int'})
    chatId: number;

    @Column()
    lastReadMessageId: string;

    @Column({type: 'int'})
    userId: number;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    lastReadAt: Date;
}