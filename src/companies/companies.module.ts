import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Company } from './company.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Company])],
      resolvers: [
        {
          DTOClass: Company,
          EntityClass: Company,
          enableAggregate: true,
          enableTotalCount: true,
        },
      ],
    }),
  ],
})
export class CompaniesModule {}
