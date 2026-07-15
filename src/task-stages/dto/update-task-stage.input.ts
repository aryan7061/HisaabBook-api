import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTaskStageInput } from './create-task-stage.input';

@InputType('UpdateTaskStageInput')
export class UpdateTaskStageInput extends PartialType(CreateTaskStageInput) {}
