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
  BeforeUpdateOne,
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
import { UserUpdateAuthorizationHook } from './hooks/user-update-authorization.hook';
import { Role } from './role.enum';

// Re-exported so every existing `import { User, Role } from
// '../users/user.entity'` elsewhere in the codebase keeps working
// unchanged — only the *.authorizer.ts files need to import Role from
// './role.enum' directly instead (see that file for why).
export { Role };

export enum UserSource {
  TASK_MEMBER = 'TASK_MEMBER',
  SALES_OWNER = 'SALES_OWNER',
}
registerEnumType(UserSource, { name: 'UserSource' });

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@BeforeCreateOne(GeneratePasswordHook)
@BeforeUpdateOne(UserUpdateAuthorizationHook)
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
