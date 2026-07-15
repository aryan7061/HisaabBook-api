import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('CreateDealStageInput')
export class CreateDealStageInput {
  @Field()
  @IsString()
  title!: string;
}
