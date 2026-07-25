import { Role } from '../users/role.enum';
import { createRoleGatedWriteAuthorizer } from '../common/authorizers/role-gated-write-authorizer.factory';
import type { DealStage } from './deal-stage.entity';

// Read stays open to everyone (shared pipeline stages used on every
// user's Deals board). Only ADMIN/SALES_MANAGER can create, rename, or
// delete a stage.
export const DealStageAuthorizer = createRoleGatedWriteAuthorizer<DealStage>([
  Role.ADMIN,
  Role.SALES_MANAGER,
]);
