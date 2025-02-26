import { parse } from 'pg-connection-string';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'postgres', // or mysql, sqlite, etc.
  host: 'localhost',
  port: 5432, // For PostgreSQL
  username: 'user',
  password: 'password',
  database: 'products',
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  entities: [`${__dirname}/**/*.entity.{ts,js}`],
  logging: true
};

if (process.env.DATABASE_URL) {
  const connectionOptions = parse(process.env.DATABASE_URL);

  config.host = connectionOptions.host;
  config.port = Number(connectionOptions.port); // For PostgreSQL
  config.username = connectionOptions.user;
  config.password = connectionOptions.password;
  config.database = connectionOptions.database;
  config.migrations = [`${__dirname}/migrations/*.{ts,js}`];
  config.entities = [`${__dirname}/**/*.entity.{ts,js}`];
  config.logging = false; // If not on heroku, log queries
}

export const TypeOrmDataSource = new DataSource(config as DataSourceOptions);
