import { registerEnumType } from '@nestjs/graphql';

// Split out of user.entity.ts specifically so files that only need the
// Role enum (the *.authorizer.ts files, which evaluate Role.ADMIN /
// Role.SALES_MANAGER at module-load time, not inside a function) don't
// have to import user.entity.ts. That import would otherwise route
// through users/hooks/delete-user-guard.hook.ts (imported by
// user.entity.ts for its @BeforeDeleteOne decorator), which imports
// Company/Contact/Deal — leading back to whichever entity file
// triggered the load in the first place, before user.entity.ts has
// finished initializing.
export enum Role {
  ADMIN = 'ADMIN',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_PERSON = 'SALES_PERSON',
  SALES_INTERN = 'SALES_INTERN',
}
registerEnumType(Role, { name: 'Role' });
