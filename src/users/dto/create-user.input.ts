import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role, UserSource } from '../user.entity';

@InputType('CreateUserInput')
export class CreateUserInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  phone!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  // Sent explicitly as TASK_MEMBER by both Task Members "Add" modals.
  // Omitted entirely by AddSalesOwnerModal, so the entity's column
  // default (SALES_OWNER) applies — no change needed there.
  @Field(() => UserSource, { nullable: true })
  @IsOptional()
  @IsEnum(UserSource)
  source?: UserSource;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;
}
