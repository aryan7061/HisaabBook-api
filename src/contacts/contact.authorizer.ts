import { Role } from '../users/role.enum';
import { createOwnershipAuthorizer } from '../common/authorizers/ownership-authorizer.factory';
import type { Contact } from './contact.entity';

// ADMIN/SALES_MANAGER see and modify every contact; everyone else is
// restricted to contacts they created or are the sales owner of.
export const ContactAuthorizer = createOwnershipAuthorizer<Contact>(
  ['createdById', 'salesOwnerId'],
  [Role.ADMIN, Role.SALES_MANAGER],
);
