import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { TaskStage } from './task-stage.entity';
import { CreateTaskStageInput } from './dto/create-task-stage.input';
import { UpdateTaskStageInput } from './dto/update-task-stage.input';

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
})
export class TaskStagesModule {}
