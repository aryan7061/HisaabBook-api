import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsDateString,
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

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  closeDate?: string;

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
