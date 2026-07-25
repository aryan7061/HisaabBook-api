import { Injectable, ForbiddenException } from '@nestjs/common';
import {
  BeforeUpdateOneHook,
  UpdateOneInputType,
} from '@ptc-org/nestjs-query-graphql';
import { User } from '../user.entity';
import { Role } from '../role.enum';

interface GqlContext {
  req?: { user?: { sub: string; email: string; role: Role } };
}

const MANAGER_ROLES = [Role.ADMIN, Role.SALES_MANAGER];

// See delete-user-guard.hook.ts for why the context parameter is typed
// as `User` and cast internally, and for why Role is imported from
// './role.enum' rather than '../user.entity' (this file is also
// imported directly by user.entity.ts, for @BeforeUpdateOne).
@Injectable()
export class UserUpdateAuthorizationHook implements BeforeUpdateOneHook<User> {
  run(
    instance: UpdateOneInputType<User>,
    context: User,
  ): UpdateOneInputType<User> {
    const caller = (context as unknown as GqlContext)?.req?.user;
    if (!caller) {
      throw new ForbiddenException('Not authenticated');
    }

    if (MANAGER_ROLES.includes(caller.role)) {
      return instance;
    }

    if (instance.id !== caller.sub) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (instance.update.role !== undefined) {
      throw new ForbiddenException(
        'Only an admin or sales manager can change a role',
      );
    }

    return instance;
  }
}
