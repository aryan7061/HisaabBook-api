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
import { CreateOneTaskInput } from './dto/create-one-task.input';
import { UpdateOneTaskInput } from './dto/update-one-task.input';

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @ResolveField(() => [User])
  async users(@Parent() task: Task): Promise<User[]> {
    const full = await this.taskRepo.findOne({
      where: { id: task.id },
      relations: ['users'],
    });
    return full?.users ?? [];
  }

  @Mutation(() => Task)
  async createOneTask(@Args('input') args: CreateOneTaskInput): Promise<Task> {
    const { userIds, ...rest } = args.task;

    const task = this.taskRepo.create(rest);
    if (userIds?.length) {
      task.users = await this.userRepo.findBy({ id: In(userIds) });
    }
    return this.taskRepo.save(task);
  }

  @Mutation(() => Task)
  async updateOneTask(@Args('input') args: UpdateOneTaskInput): Promise<Task> {
    const { userIds, ...rest } = args.update;

    const task = await this.taskRepo.findOneOrFail({
      where: { id: args.id },
      relations: ['users'],
    });

    Object.assign(task, rest);
    if (userIds) {
      task.users = await this.userRepo.findBy({ id: In(userIds) });
    }
    return this.taskRepo.save(task);
  }
}
