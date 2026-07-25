import { Role } from '../users/role.enum';
import { createOwnershipAuthorizer } from '../common/authorizers/ownership-authorizer.factory';
import type { Deal } from './deal.entity';

export const DealAuthorizer = createOwnershipAuthorizer<Deal>(
  ['createdById', 'dealOwnerId'],
  [Role.ADMIN, Role.SALES_MANAGER],
  ['company', 'dealContact'],
);
