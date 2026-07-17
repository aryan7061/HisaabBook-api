import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  FilterableField,
  FilterableRelation,
  IDField,
  QueryOptions,
  PagingStrategies,
  BeforeCreateOne,
} from '@ptc-org/nestjs-query-graphql';
import {
  ID,
  ObjectType,
  GraphQLISODateTime,
  registerEnumType,
} from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { CreatedByCreateOneHook } from '../common/hooks/created-by.hooks';

export enum ContactStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
  CHURNED = 'CHURNED',
}
registerEnumType(ContactStatus, { name: 'ContactStatus' });

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@FilterableRelation('salesOwner', () => User, { nullable: false })
@FilterableRelation('createdBy', () => User, { nullable: true })
@BeforeCreateOne(CreatedByCreateOneHook)
@Entity('contacts')
export class Contact {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @FilterableField()
  @Column()
  name!: string;

  @FilterableField()
  @Column()
  email!: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  jobTitle?: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  avatarUrl?: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  score?: number;

  @FilterableField(() => ContactStatus)
  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.NEW })
  status!: ContactStatus;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  timezone?: string;

  @FilterableField()
  @Column({ name: 'company_name' })
  companyName!: string;

  @FilterableField()
  @Column({ name: 'sales_owner_id' })
  salesOwnerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sales_owner_id' })
  salesOwner!: User;

  @FilterableField({ nullable: true })
  @Column({ name: 'created_by_id', nullable: true })
  createdById?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt!: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt!: Date;
}
