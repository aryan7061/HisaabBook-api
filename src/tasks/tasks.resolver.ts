import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import DataLoader from 'dataloader';
import { Task } from './task.entity';
import { User, Role } from '../users/user.entity';
import { Contact } from '../contacts/contact.entity';
import { CreateOneTaskInput } from './dto/create-one-task.input';
import { UpdateOneTaskInput } from './dto/update-one-task.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

const MANAGER_ROLES = [Role.ADMIN, Role.SALES_MANAGER];

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
    @CurrentUser() currentUser: { sub: string; email: string; role: Role },
  ): Promise<Task> {
    const { userIds, contactIds, ...rest } = args.task;

    const task = this.taskRepo.create({
      ...rest,
      createdById: currentUser?.sub,
    });

    if (userIds?.length) {
      const users = await this.userRepo.findBy({ id: In(userIds) });
      if (users.length !== userIds.length) {
        throw new BadRequestException(
          'One or more selected members do not exist',
        );
      }
      task.users = users;
    }
    if (contactIds?.length) {
      const contacts = await this.contactRepo.findBy({ id: In(contactIds) });
      if (contacts.length !== contactIds.length) {
        throw new BadRequestException(
          'One or more selected contacts do not exist',
        );
      }
      task.contacts = contacts;
    }
    return this.taskRepo.save(task);
  }

  @Mutation(() => Task)
  async updateOneTask(
    @Args('input') args: UpdateOneTaskInput,
    @CurrentUser() currentUser: { sub: string; email: string; role: Role },
  ): Promise<Task> {
    const { userIds, contactIds, ...rest } = args.update;

    const task = await this.taskRepo.findOne({
      where: { id: args.id },
      relations: ['users', 'contacts'],
    });
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    const isManager = MANAGER_ROLES.includes(currentUser?.role);
    const isCreator = task.createdById === currentUser?.sub;
    const isAssigned = task.users?.some((u) => u.id === currentUser?.sub);
    if (!isManager && !isCreator && !isAssigned) {
      throw new ForbiddenException(
        'You can only update tasks you created or are assigned to',
      );
    }

    Object.assign(task, rest);
    if (userIds) {
      const users = await this.userRepo.findBy({ id: In(userIds) });
      if (users.length !== userIds.length) {
        throw new BadRequestException(
          'One or more selected members do not exist',
        );
      }
      task.users = users;
    }
    if (contactIds) {
      const contacts = await this.contactRepo.findBy({ id: In(contactIds) });
      if (contacts.length !== contactIds.length) {
        throw new BadRequestException(
          'One or more selected contacts do not exist',
        );
      }
      task.contacts = contacts;
    }
    return this.taskRepo.save(task);
  }
}
