import { InputType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('CreateDealInput')
export class CreateDealInput {
  @Field()
  @IsString()
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  value?: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  closeDate?: Date;

  @Field(() => ID)
  @IsUUID()
  companyId!: string;

  @Field(() => ID)
  @IsUUID()
  dealOwnerId!: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  dealContactId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  stageId?: string;
}
