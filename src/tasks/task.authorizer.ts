import { Injectable } from '@nestjs/common';
import {
  CustomAuthorizer,
  AuthorizationContext,
} from '@ptc-org/nestjs-query-graphql';
import { Filter } from '@ptc-org/nestjs-query-core';
import { Role } from '../users/user.entity';
import type { Task } from './task.entity';

interface GqlAuthorizerContext {
  req?: { user?: { sub: string; email: string; role: Role } };
}

// INTERIM — scopes the auto-generated tasks/task/deleteOneTask/
// deleteManyTasks resolvers by createdById only. Deliberately does NOT
// include "assigned to me" (the `users` M2M relation) yet — doing that
// requires resolving a conflict with TasksResolver's hand-written
// @ResolveField for `users` first (see chat discussion). "Assigned to
// me" IS already enforced correctly in the custom updateOneTask
// mutation below, since that check runs in plain TypeScript against the
// already-loaded task, not through this filter.
@Injectable()
export class TaskAuthorizer implements CustomAuthorizer<Task> {
  async authorize(
    context: GqlAuthorizerContext,
    _authorizationContext?: AuthorizationContext,
  ): Promise<Filter<Task>> {
    const user = context?.req?.user;

    if (user && [Role.ADMIN, Role.SALES_MANAGER].includes(user.role)) {
      return {};
    }

    const userId = user?.sub ?? '00000000-0000-0000-0000-000000000000';
    return { createdById: { eq: userId } } as unknown as Filter<Task>;
  }
}
