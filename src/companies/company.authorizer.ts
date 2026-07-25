import { Role } from '../users/role.enum';
import { createOwnershipAuthorizer } from '../common/authorizers/ownership-authorizer.factory';
import type { Company } from './company.entity';

// ADMIN/SALES_MANAGER see and modify every company; everyone else is
// restricted to companies they created or are the sales owner of.
export const CompanyAuthorizer = createOwnershipAuthorizer<Company>(
  ['createdById', 'salesOwnerId'],
  [Role.ADMIN, Role.SALES_MANAGER],
);
