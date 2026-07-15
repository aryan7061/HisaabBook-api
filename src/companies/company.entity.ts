import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  FilterableField,
  FilterableRelation,
  FilterableOffsetConnection,
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
import { User } from '../users/user.entity';
import { Deal } from '../deals/deal.entity';

export enum CompanySize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}
registerEnumType(CompanySize, { name: 'CompanySize' });

export enum BusinessType {
  B2B = 'B2B',
  B2C = 'B2C',
  B2G = 'B2G',
}
registerEnumType(BusinessType, { name: 'BusinessType' });

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@FilterableRelation('salesOwner', () => User, { nullable: false })
@FilterableRelation('createdBy', () => User, { nullable: true })
@FilterableOffsetConnection('deals', () => Deal, { enableAggregate: true })
@Entity('companies')
export class Company {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @FilterableField()
  @Column()
  name!: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  avatarUrl?: string;

  @FilterableField(() => CompanySize, { nullable: true })
  @Column({ type: 'enum', enum: CompanySize, nullable: true })
  companySize?: CompanySize;

  @FilterableField({ nullable: true })
  @Column({ type: 'bigint', nullable: true })
  totalRevenue?: number;

  @FilterableField(() => BusinessType, { nullable: true })
  @Column({ type: 'enum', enum: BusinessType, nullable: true })
  businessType?: BusinessType;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  website?: string;

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

  @OneToMany(() => Deal, (deal) => deal.company)
  deals!: Deal[];
}
