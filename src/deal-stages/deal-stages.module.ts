import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { DealStage } from './deal-stage.entity';
import { CreateDealStageInput } from './dto/create-deal-stage.input';
import { UpdateDealStageInput } from './dto/update-deal-stage.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([DealStage])],
      resolvers: [
        {
          DTOClass: DealStage,
          EntityClass: DealStage,
          CreateDTOClass: CreateDealStageInput,
          UpdateDTOClass: UpdateDealStageInput,
          enableTotalCount: true,
        },
      ],
    }),
  ],
})
export class DealStagesModule {}
