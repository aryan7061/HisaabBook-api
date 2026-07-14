import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCompanyInput } from './create-company.input';

@InputType('UpdateCompanyInput')
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {}
