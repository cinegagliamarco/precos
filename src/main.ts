import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeOrmDataSource } from './database/typeorm.data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await TypeOrmDataSource.runMigrations();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
