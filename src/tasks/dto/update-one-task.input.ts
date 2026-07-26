import { InputType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { UpdateTaskInput } from './update-task.input';

// Manually declared because auto-update is disabled for Task — matches
// updateOneTask(input: { id: ID!, update: UpdateTaskInput! })
@InputType('UpdateOneTaskInput')
export class UpdateOneTaskInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => UpdateTaskInput)
  @ValidateNested()
  @Type(() => UpdateTaskInput)
  update!: UpdateTaskInput;
}
