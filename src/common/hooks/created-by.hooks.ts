import { Injectable } from '@nestjs/common';
import {
  BeforeCreateOneHook,
  BeforeCreateManyHook,
  CreateOneInputType,
  CreateManyInputType,
} from '@ptc-org/nestjs-query-graphql';

interface HasCreatedById {
  createdById?: string;
}

interface GqlContext {
  req?: { user?: { sub: string; email: string } };
}

@Injectable()
export class CreatedByCreateOneHook<
  T extends HasCreatedById,
> implements BeforeCreateOneHook<T, GqlContext> {
  run(
    instance: CreateOneInputType<T>,
    context: GqlContext,
  ): CreateOneInputType<T> {
    const userId = context?.req?.user?.sub;
    if (userId) {
      instance.input.createdById = userId;
    }
    return instance;
  }
}

@Injectable()
export class CreatedByCreateManyHook<
  T extends HasCreatedById,
> implements BeforeCreateManyHook<T, GqlContext> {
  run(
    instance: CreateManyInputType<T>,
    context: GqlContext,
  ): CreateManyInputType<T> {
    const userId = context?.req?.user?.sub;
    if (userId) {
      instance.input = instance.input.map((c) => ({
        ...c,
        createdById: userId,
      }));
    }
    return instance;
  }
}
