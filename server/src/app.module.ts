import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        console.log('server connected');
        return {
          uri: process.env.MONGODB_URI,
        };
      },
    }),
    
    TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}