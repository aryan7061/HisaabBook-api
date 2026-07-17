import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { Deal } from '../deals/deal.entity';

// Makes Company/Contact/Deal repositories resolvable from ANY module's
// injector context — including the internal context nestjs-query builds
// for @BeforeCreateOne/@BeforeDeleteOne hooks, which don't inherit a
// regular module's `imports` array. Same fix pattern as AuthModule's
// @Global() (see gql-auth.guard.ts / JwtService resolution issue).
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Company, Contact, Deal])],
  exports: [TypeOrmModule],
})
export class CrossEntityAccessModule {}
