import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { TaskStage } from './task-stage.entity';
import { CreateTaskStageInput } from './dto/create-task-stage.input';
import { UpdateTaskStageInput } from './dto/update-task-stage.input';
import { CreatedByCreateOneHook } from '../common/hooks/created-by.hooks';
import { TaskStageAuthorizer } from './task-stage.authorizer';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([TaskStage])],
      resolvers: [
        {
          DTOClass: TaskStage,
          EntityClass: TaskStage,
          CreateDTOClass: CreateTaskStageInput,
          UpdateDTOClass: UpdateTaskStageInput,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  providers: [CreatedByCreateOneHook, TaskStageAuthorizer],
})
export class TaskStagesModule {}
