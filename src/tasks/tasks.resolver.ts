import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import DataLoader from 'dataloader';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { Contact } from '../contacts/contact.entity';
import { CreateOneTaskInput } from './dto/create-one-task.input';
import { UpdateOneTaskInput } from './dto/update-one-task.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// The GraphQL context object is created fresh per request in
// app.module.ts (`context: ({ req }) => ({ req })`), so stashing loaders
// on it here is naturally request-scoped — no cross-request leakage, no
// changes needed to app.module.ts.
type TaskLoaderContext = {
  taskLoaders?: {
    users: DataLoader<string, User[]>;
    contacts: DataLoader<string, Contact[]>;
  };
};

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  // Lazily creates one pair of loaders per request and reuses them across
  // every task resolved in that request. This is what turns "one query
  // per task" (the original N+1 bug) into "one query per request" —
  // DataLoader automatically batches every .load(id) call made within the
  // same tick into a single taskRepo.find({ id: In([...]) }) call.
  private getLoaders(context: TaskLoaderContext) {
    if (!context.taskLoaders) {
      context.taskLoaders = {
        users: new DataLoader<string, User[]>(async (taskIds) => {
          const tasks = await this.taskRepo.find({
            where: { id: In(taskIds as string[]) },
            relations: ['users'],
          });
          const byId = new Map(tasks.map((t) => [t.id, t.users ?? []]));
          return taskIds.map((id) => byId.get(id) ?? []);
        }),
        contacts: new DataLoader<string, Contact[]>(async (taskIds) => {
          const tasks = await this.taskRepo.find({
            where: { id: In(taskIds as string[]) },
            relations: ['contacts'],
          });
          const byId = new Map(tasks.map((t) => [t.id, t.contacts ?? []]));
          return taskIds.map((id) => byId.get(id) ?? []);
        }),
      };
    }
    return context.taskLoaders;
  }

  @ResolveField(() => [User])
  async users(
    @Parent() task: Task,
    @Context() context: TaskLoaderContext,
  ): Promise<User[]> {
    return this.getLoaders(context).users.load(task.id);
  }

  @ResolveField(() => [Contact])
  async contacts(
    @Parent() task: Task,
    @Context() context: TaskLoaderContext,
  ): Promise<Contact[]> {
    return this.getLoaders(context).contacts.load(task.id);
  }

  @Mutation(() => Task)
  async createOneTask(
    @Args('input') args: CreateOneTaskInput,
    @CurrentUser() currentUser: { sub: string; email: string },
  ): Promise<Task> {
    const { userIds, contactIds, ...rest } = args.task;

    const task = this.taskRepo.create({
      ...rest,
      createdById: currentUser?.sub,
    });
    if (userIds?.length) {
      task.users = await this.userRepo.findBy({ id: In(userIds) });
    }
    if (contactIds?.length) {
      task.contacts = await this.contactRepo.findBy({ id: In(contactIds) });
    }
    return this.taskRepo.save(task);
  }

  @Mutation(() => Task)
  async updateOneTask(@Args('input') args: UpdateOneTaskInput): Promise<Task> {
    const { userIds, contactIds, ...rest } = args.update;

    const task = await this.taskRepo.findOneOrFail({
      where: { id: args.id },
      relations: ['users', 'contacts'],
    });

    Object.assign(task, rest);
    if (userIds) {
      task.users = await this.userRepo.findBy({ id: In(userIds) });
    }
    if (contactIds) {
      task.contacts = await this.contactRepo.findBy({ id: In(contactIds) });
    }
    return this.taskRepo.save(task);
  }
}
