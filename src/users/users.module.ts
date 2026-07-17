import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GeneratePasswordHook } from '../common/hooks/generate-password.hook';
import { DeleteUserGuardHook } from './hooks/delete-user-guard.hook';
import { CrossEntityAccessModule } from '../common/cross-entity-access.module';

@Module({
  imports: [
    CrossEntityAccessModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([User])],
      resolvers: [
        {
          DTOClass: User,
          EntityClass: User,
          CreateDTOClass: CreateUserInput,
          UpdateDTOClass: UpdateUserInput,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  providers: [GeneratePasswordHook, DeleteUserGuardHook],
})
export class UsersModule {}
