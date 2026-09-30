import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { ChatModule } from './chat/chat.module.js';
import { FirebaseModule } from './firebase/firebase.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available across all modules without re-importing
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'), // Guaranteed to pull safely
        database: configService.get<string>('DB_NAME'),
        entities: [import.meta.dirname + '/**/*.entity{.ts,.js}'], // Dynamically load all entity files
        autoLoadEntities: true,
        synchronize: true, // Turn off in production!
      }),
    }),
    UsersModule,
    ChatModule,
    // FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
