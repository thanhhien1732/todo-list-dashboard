import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, }), PrismaModule, TasksModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
