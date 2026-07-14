import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsUrl,
} from 'class-validator';
import { BusinessType, CompanySize } from '../company.entity';

@InputType('CreateCompanyInput')
export class CreateCompanyInput {
  @Field()
  @IsString()
  name!: string;

  @Field(() => CompanySize, { nullable: true })
  @IsOptional()
  @IsEnum(CompanySize)
  companySize?: CompanySize;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalRevenue?: number;

  @Field(() => BusinessType, { nullable: true })
  @IsOptional()
  @IsEnum(BusinessType)
  businessType?: BusinessType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field(() => ID)
  @IsUUID()
  salesOwnerId!: string;
}
