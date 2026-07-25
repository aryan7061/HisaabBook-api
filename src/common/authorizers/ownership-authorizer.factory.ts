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

export function createOwnershipAuthorizer<DTO>(
  ownerFields: (keyof DTO & string)[],
  allowedRoles: Role[],
  bypassRelations: string[] = [],
): new () => CustomAuthorizer<DTO> {
  @Injectable()
  class OwnershipAuthorizer implements CustomAuthorizer<DTO> {
    async authorize(
      context: GqlAuthorizerContext,
      _authorizationContext?: AuthorizationContext,
    ): Promise<Filter<DTO>> {
      const user = context?.req?.user;

      if (user && allowedRoles.includes(user.role)) {
        return {};
      }

      const userId = user?.sub ?? '00000000-0000-0000-0000-000000000000';

      if (ownerFields.length === 1) {
        return { [ownerFields[0]]: { eq: userId } } as unknown as Filter<DTO>;
      }

      return {
        or: ownerFields.map((field) => ({ [field]: { eq: userId } })),
      } as unknown as Filter<DTO>;
    }

    async authorizeRelation(
      relationName: string,
      _context: GqlAuthorizerContext,
    ): Promise<Filter<unknown> | undefined> {
      if (bypassRelations.includes(relationName)) {
        return {};
      }
      // undefined = fall through to the related type's own @Authorize
      // filter (or its relation's own `auth` option, if it has one).
      return undefined;
    }
  }

  return OwnershipAuthorizer;
}
