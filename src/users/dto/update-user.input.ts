import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType('UpdateUserInput')
export class UpdateUserInput extends PartialType(CreateUserInput) {}
