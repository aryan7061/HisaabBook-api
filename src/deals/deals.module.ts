import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Deal } from './deal.entity';
import { CreateDealInput } from './dto/create-deal.input';
import { UpdateDealInput } from './dto/update-deal.input';
import { CreatedByCreateOneHook } from '../common/hooks/created-by.hooks';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Deal])],
      resolvers: [
        {
          DTOClass: Deal,
          EntityClass: Deal,
          CreateDTOClass: CreateDealInput,
          UpdateDTOClass: UpdateDealInput,
          enableAggregate: true,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  providers: [CreatedByCreateOneHook],
})
export class DealsModule {}
