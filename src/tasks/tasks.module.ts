import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { Contact } from '../contacts/contact.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TasksResolver } from './tasks.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Contact]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Task])],
      resolvers: [
        {
          DTOClass: Task,
          EntityClass: Task,
          CreateDTOClass: CreateTaskInput,
          UpdateDTOClass: UpdateTaskInput,
          create: { one: { disabled: true }, many: { disabled: true } },
          update: { one: { disabled: true }, many: { disabled: true } },
          enableTotalCount: true,
        },
      ],
    }),
  ],
  providers: [TasksResolver],
})
export class TasksModule {}
