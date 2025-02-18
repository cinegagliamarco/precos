import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormDatabaseModule } from './database/typeorm.database.module';

@Module({
  imports: [HttpModule, TypeormDatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
