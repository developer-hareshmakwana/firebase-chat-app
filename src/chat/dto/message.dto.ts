export class SendMessageDto {
    text: string;
    senderId: number;
}

export class MarkReadDto {
    userId: string;
    chatId: string;
    messageId: string;
}

export class LastSeenDto {
    userId: string;
    messageId: string;
    chatId: string;
}
