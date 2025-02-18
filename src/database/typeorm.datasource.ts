import { DataSource } from 'typeorm';

export const TypeOrmDataSource = new DataSource({
  type: 'postgres', // or mysql, sqlite, etc.
  host: 'localhost',
  port: 5432, // For PostgreSQL
  username: 'user',
  password: 'password',
  database: 'products',
  entities: [`${__dirname}/**/*.entity.{ts,js}`],
  synchronize: false, // Set to false in production
  logging: true // Optional, to log queries
});
