import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { TaskStagesModule } from './task-stages/task-stages.module';
import { TasksModule } from './tasks/tasks.module';
import { DealStagesModule } from './deal-stages/deal-stages.module';
import { DealsModule } from './deals/deals.module';
import { GqlAuthGuard } from './auth/guards/gql-auth.guard';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false, // required for Neon's connection
      },
    }),
    // Needed so GqlAuthGuard (registered below as APP_GUARD, which Nest
    // constructs using AppModule's own DI graph, not AuthModule's) can
    // inject Repository<User> for its per-request role lookup.
    TypeOrmModule.forFeature([User]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: !isProduction,
      introspection: !isProduction,
      context: ({ req }) => ({ req }),
    }),
    UsersModule,
    CompaniesModule,
    AuthModule,
    ContactsModule,
    TaskStagesModule,
    TasksModule,
    DealStagesModule,
    DealsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule {}
