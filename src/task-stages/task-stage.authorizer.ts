import { Role } from '../users/role.enum';
import { createRoleGatedWriteAuthorizer } from '../common/authorizers/role-gated-write-authorizer.factory';
import type { TaskStage } from './task-stage.entity';

// Same rule as DealStage — read open to everyone, write restricted to
// ADMIN/SALES_MANAGER.
export const TaskStageAuthorizer = createRoleGatedWriteAuthorizer<TaskStage>([
  Role.ADMIN,
  Role.SALES_MANAGER,
]);
