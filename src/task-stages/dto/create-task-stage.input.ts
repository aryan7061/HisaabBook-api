import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('CreateTaskStageInput')
export class CreateTaskStageInput {
  @Field()
  @IsString()
  title!: string;
}
