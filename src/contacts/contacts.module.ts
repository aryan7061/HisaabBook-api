import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Contact } from './contact.entity';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Contact])],
      resolvers: [
        {
          DTOClass: Contact,
          EntityClass: Contact,
          CreateDTOClass: CreateContactInput,
          UpdateDTOClass: UpdateContactInput,
          enableTotalCount: true,
        },
      ],
    }),
  ],
})
export class ContactsModule {}
