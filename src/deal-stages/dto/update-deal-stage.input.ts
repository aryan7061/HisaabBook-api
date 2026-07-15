import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDealStageInput } from './create-deal-stage.input';

@InputType('UpdateDealStageInput')
export class UpdateDealStageInput extends PartialType(CreateDealStageInput) {}
