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
  BeforeCreateOne,
} from '@ptc-org/nestjs-query-graphql';
import { ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Deal } from '../deals/deal.entity';
import { CreatedByCreateOneHook } from '../common/hooks/created-by.hooks';

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@FilterableRelation('createdBy', () => User, { nullable: true })
@FilterableOffsetConnection('deals', () => Deal, { enableAggregate: true })
@BeforeCreateOne(CreatedByCreateOneHook)
@Entity('deal_stages')
export class DealStage {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @FilterableField()
  @Column()
  title!: string;

  @OneToMany(() => Deal, (deal) => deal.stage)
  deals!: Deal[];

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
