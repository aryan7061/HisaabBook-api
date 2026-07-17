import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  FilterableField,
  FilterableRelation,
  IDField,
  QueryOptions,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { ID, ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { TaskStage } from '../task-stages/task-stage.entity';
import { Contact } from '../contacts/contact.entity';
import { CheckListItem } from './checklist-item.object';

@ObjectType()
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
@FilterableRelation('stage', () => TaskStage, { nullable: true })
@FilterableRelation('createdBy', () => User, { nullable: true })
@Entity('tasks')
export class Task {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @FilterableField()
  @Column()
  title!: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @FilterableField(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @FilterableField()
  @Column({ default: false })
  completed!: boolean;

  @FilterableField(() => ID, { nullable: true })
  @Column({ name: 'stage_id', nullable: true })
  stageId?: string;

  @ManyToOne(() => TaskStage, { nullable: true })
  @JoinColumn({ name: 'stage_id' })
  stage?: TaskStage;

  // JSONB, not a table — ChecklistItemInput has no id, always replaced wholesale.
  @Field(() => [CheckListItem])
  @Column({ type: 'jsonb', default: () => "'[]'" })
  checklist!: CheckListItem[];

  // Real TypeORM relation for DB-level joins. Deliberately NOT a
  // @FilterableRelation — reads are served via the custom @ResolveField
  // below, and writes go through the custom createOneTask/updateOneTask
  // mutations, because the frontend sends a plain `userIds: string[]`
  // in one call, not nestjs-query's one-at-a-time setUsersOnTask.
  @ManyToMany(() => User)
  @JoinTable({
    name: 'task_users',
    joinColumn: { name: 'task_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users!: User[];

  // Same pattern as `users` above — custom resolver-managed, written via
  // a plain `contactIds: string[]`, not nestjs-query's relation setters.
  @ManyToMany(() => Contact)
  @JoinTable({
    name: 'task_contacts',
    joinColumn: { name: 'task_id' },
    inverseJoinColumn: { name: 'contact_id' },
  })
  contacts!: Contact[];

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
