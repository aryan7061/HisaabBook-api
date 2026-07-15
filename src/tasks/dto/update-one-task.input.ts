import { InputType, Field, ID } from '@nestjs/graphql';
import { UpdateTaskInput } from './update-task.input';

// Manually declared because auto-update is disabled for Task — matches
// updateOneTask(input: { id: ID!, update: UpdateTaskInput! })
@InputType('UpdateOneTaskInput')
export class UpdateOneTaskInput {
  @Field(() => ID)
  id!: string;

  @Field(() => UpdateTaskInput)
  update!: UpdateTaskInput;
}
