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
import { ID, ObjectType, GraphQLISODateTime, Int } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { DealStage } from '../deal-stages/deal-stage.entity';
import { CreatedByCreateOneHook } from '../common/hooks/created-by.hooks';

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@FilterableRelation('company', () => Company, { nullable: false })
@FilterableRelation('dealOwner', () => User, { nullable: false })
@FilterableRelation('dealContact', () => Contact, { nullable: true })
@FilterableRelation('stage', () => DealStage, { nullable: true })
@FilterableRelation('createdBy', () => User, { nullable: true })
@BeforeCreateOne(CreatedByCreateOneHook)
@Entity('deals')
export class Deal {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @FilterableField()
  @Column()
  title!: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'float', nullable: true })
  value?: number;

  @FilterableField(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamp', name: 'close_date', nullable: true })
  closeDate?: Date;

  @FilterableField(() => Int, { nullable: true })
  @Column({
    type: 'int',
    nullable: true,
    generatedType: 'STORED',
    asExpression: `EXTRACT(MONTH FROM "close_date")::int`,
    insert: false,
    update: false,
  })
  closeDateMonth?: number;

  @FilterableField(() => Int, { nullable: true })
  @Column({
    type: 'int',
    nullable: true,
    generatedType: 'STORED',
    asExpression: `EXTRACT(YEAR FROM "close_date")::int`,
    insert: false,
    update: false,
  })
  closeDateYear?: number;

  @FilterableField()
  @Column({ name: 'company_id' })
  companyId!: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @FilterableField()
  @Column({ name: 'deal_owner_id' })
  dealOwnerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deal_owner_id' })
  dealOwner!: User;

  @FilterableField({ nullable: true })
  @Column({ name: 'deal_contact_id', nullable: true })
  dealContactId?: string;

  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'deal_contact_id' })
  dealContact?: Contact;

  @FilterableField(() => ID, { nullable: true })
  @Column({ name: 'stage_id', nullable: true })
  stageId?: string;

  @ManyToOne(() => DealStage, { nullable: true })
  @JoinColumn({ name: 'stage_id' })
  stage?: DealStage;

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
