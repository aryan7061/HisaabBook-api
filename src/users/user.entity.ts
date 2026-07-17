import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  FilterableField,
  IDField,
  QueryOptions,
  PagingStrategies,
  BeforeCreateOne,
  BeforeDeleteOne,
} from '@ptc-org/nestjs-query-graphql';
import {
  ID,
  ObjectType,
  GraphQLISODateTime,
  registerEnumType,
} from '@nestjs/graphql';
import { GeneratePasswordHook } from '../common/hooks/generate-password.hook';
import { DeleteUserGuardHook } from './hooks/delete-user-guard.hook';

export enum Role {
  ADMIN = 'ADMIN',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_PERSON = 'SALES_PERSON',
  SALES_INTERN = 'SALES_INTERN',
}
registerEnumType(Role, { name: 'Role' });

// Tracks which "Add" flow created this user — TASK_MEMBER for the Task
// board's Add Member modals (per-task panel + global Team Members
// panel), SALES_OWNER for the Companies/Contacts "Add Sales Owner"
// modal. Existing rows (created before this distinction existed) all
// backfill to SALES_OWNER by column default — none of them originated
// from the Task Members flow, so none should appear there.
export enum UserSource {
  TASK_MEMBER = 'TASK_MEMBER',
  SALES_OWNER = 'SALES_OWNER',
}
registerEnumType(UserSource, { name: 'UserSource' });

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@BeforeCreateOne(GeneratePasswordHook)
@BeforeDeleteOne(DeleteUserGuardHook)
@Entity('users')
export class User {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @FilterableField()
  @Column()
  name!: string;

  @FilterableField()
  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  jobTitle?: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @FilterableField(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.SALES_PERSON })
  role!: Role;

  @FilterableField(() => UserSource)
  @Column({
    type: 'enum',
    enum: UserSource,
    default: UserSource.SALES_OWNER,
  })
  source!: UserSource;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  timezone?: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  avatarUrl?: string;

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt!: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt!: Date;
}
