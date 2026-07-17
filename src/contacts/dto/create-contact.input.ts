import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ContactStatus } from '../contact.entity';

@InputType('CreateContactInput')
export class CreateContactInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @Field(() => ContactStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;

  @Field()
  @IsString()
  companyName!: string;

  @Field(() => ID)
  @IsUUID()
  salesOwnerId!: string;
}
