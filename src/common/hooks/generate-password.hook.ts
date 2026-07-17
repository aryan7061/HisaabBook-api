import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  BeforeCreateOneHook,
  CreateOneInputType,
} from '@ptc-org/nestjs-query-graphql';

interface HasPasswordHash {
  passwordHash?: string;
}

interface GqlContext {
  req?: { user?: { sub: string; email: string } };
}

// Users created through admin/CRM flows (e.g. "Add Sales Owner") are
// placeholder accounts — they never go through AuthService.register(),
// so nothing else ever sets passwordHash. Since users.passwordHash is
// NOT NULL, we generate a random, unguessable hash here so the row can
// be created. These accounts cannot log in with this password.
@Injectable()
export class GeneratePasswordHook<
  T extends HasPasswordHash,
> implements BeforeCreateOneHook<T, GqlContext> {
  async run(
    instance: CreateOneInputType<T>,
    _context: GqlContext,
  ): Promise<CreateOneInputType<T>> {
    const randomPassword = randomUUID() + randomUUID();
    instance.input.passwordHash = await bcrypt.hash(randomPassword, 10);
    return instance;
  }
}
