import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { Contact } from '../contacts/contact.entity';
import { CreateOneTaskInput } from './dto/create-one-task.input';
import { UpdateOneTaskInput } from './dto/update-one-task.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  @ResolveField(() => [User])
  async users(@Parent() task: Task): Promise<User[]> {
    const full = await this.taskRepo.findOne({
      where: { id: task.id },
      relations: ['users'],
    });
    return full?.users ?? [];
  }

  @ResolveField(() => [Contact])
  async contacts(@Parent() task: Task): Promise<Contact[]> {
    const full = await this.taskRepo.findOne({
      where: { id: task.id },
      relations: ['contacts'],
    });
    return full?.contacts ?? [];
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
