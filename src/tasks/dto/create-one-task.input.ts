import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateTaskInput } from './create-task.input';

@InputType('CreateOneTaskInput')
export class CreateOneTaskInput {
  @Field(() => CreateTaskInput)
  @ValidateNested()
  @Type(() => CreateTaskInput)
  task!: CreateTaskInput;
}
