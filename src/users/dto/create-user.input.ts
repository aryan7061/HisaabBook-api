import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../user.entity';

@InputType('CreateUserInput')
export class CreateUserInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => Role)
  @IsEnum(Role)
  role!: Role;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;
}
