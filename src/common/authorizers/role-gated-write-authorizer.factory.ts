import { Injectable } from '@nestjs/common';
import {
  CustomAuthorizer,
  AuthorizationContext,
} from '@ptc-org/nestjs-query-graphql';
import { Filter } from '@ptc-org/nestjs-query-core';
import type { Role } from '../../users/user.entity';

interface RequestUser {
  sub: string;
  email: string;
  role: Role;
}

interface GqlAuthorizerContext {
  req?: { user?: RequestUser };
}

export function createRoleGatedWriteAuthorizer<DTO>(
  allowedRoles: Role[],
): new () => CustomAuthorizer<DTO> {
  @Injectable()
  class RoleGatedWriteAuthorizer implements CustomAuthorizer<DTO> {
    async authorize(
      context: GqlAuthorizerContext,
      authorizationContext?: AuthorizationContext,
    ): Promise<Filter<DTO>> {
      if (authorizationContext?.readonly) {
        return {};
      }

      const user = context?.req?.user;
      if (user && allowedRoles.includes(user.role)) {
        return {};
      }

      return {
        id: { eq: '00000000-0000-0000-0000-000000000000' },
      } as unknown as Filter<DTO>;
    }
  }

  return RoleGatedWriteAuthorizer;
}
