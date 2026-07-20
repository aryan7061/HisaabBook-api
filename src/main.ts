import { types } from 'pg';

// Postgres 'timestamp without time zone' (OID 1114) columns store UTC values
// with no timezone marker. node-postgres's default parser interprets that
// raw string using the Node process's local timezone (Asia/Calcutta here),
// which silently shifts every createdAt/updatedAt by -5:30. This forces the
// raw string to be parsed as UTC, matching what's actually stored.
types.setTypeParser(
  1114,
  (value: string) => new Date(value.replace(' ', 'T') + 'Z'),
);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
