import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon's connection, same as app.module.ts
  },
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
