import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Company } from './company.entity';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Company])],
      resolvers: [
        {
          DTOClass: Company,
          EntityClass: Company,
          CreateDTOClass: CreateCompanyInput,
          UpdateDTOClass: UpdateCompanyInput,
          enableAggregate: true,
          enableTotalCount: true,
        },
      ],
    }),
  ],
})
export class CompaniesModule {}
