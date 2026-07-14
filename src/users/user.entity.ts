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
} from '@ptc-org/nestjs-query-graphql';
import {
  ID,
  ObjectType,
  GraphQLISODateTime,
  registerEnumType,
} from '@nestjs/graphql';

export enum Role {
  ADMIN = 'ADMIN',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_PERSON = 'SALES_PERSON',
  SALES_INTERN = 'SALES_INTERN',
}
registerEnumType(Role, { name: 'Role' });

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
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
