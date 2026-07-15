import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDealInput } from './create-deal.input';

@InputType('UpdateDealInput')
export class UpdateDealInput extends PartialType(CreateDealInput) {}
