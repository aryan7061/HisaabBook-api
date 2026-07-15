import { InputType, Field } from '@nestjs/graphql';
import { CreateTaskInput } from './create-task.input';

@InputType('CreateOneTaskInput')
export class CreateOneTaskInput {
  @Field(() => CreateTaskInput)
  task!: CreateTaskInput;
}
