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
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS origin is env-driven so the Vercel URL can be set/updated purely
  // via Render's dashboard, with no code change or redeploy needed later.
  // FRONTEND_URL is a comma-separated list to support both the Vercel
  // production domain and Vercel preview-deployment domains if needed.
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
    : true; // no FRONTEND_URL set (e.g. local dev) -> allow all, matches prior behavior

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
