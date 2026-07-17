import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BeforeDeleteOneHook,
  DeleteOneInputType,
} from '@ptc-org/nestjs-query-graphql';
import { Company } from '../../companies/company.entity';
import { Contact } from '../../contacts/contact.entity';
import { Deal } from '../../deals/deal.entity';
import { User } from '../user.entity';

// Blocks deleting a user who is still the required sales/deal owner on
// any Company, Contact, or Deal — those FKs are NOT NULL, so deleting
// through them would either orphan data or fail ugly at the DB layer.
// Confirmed decision: block with a clear message, don't cascade or
// auto-reassign.
@Injectable()
export class DeleteUserGuardHook implements BeforeDeleteOneHook<User> {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
    @InjectRepository(Deal) private readonly dealRepo: Repository<Deal>,
  ) {}

  async run(instance: DeleteOneInputType): Promise<DeleteOneInputType> {
    const userId = instance.id as string;

    const [companyCount, contactCount, dealCount] = await Promise.all([
      this.companyRepo.count({ where: { salesOwnerId: userId } }),
      this.contactRepo.count({ where: { salesOwnerId: userId } }),
      this.dealRepo.count({ where: { dealOwnerId: userId } }),
    ]);

    const reasons: string[] = [];
    if (companyCount) {
      reasons.push(`${companyCount} compan${companyCount === 1 ? 'y' : 'ies'}`);
    }
    if (contactCount) {
      reasons.push(`${contactCount} contact${contactCount === 1 ? '' : 's'}`);
    }
    if (dealCount) {
      reasons.push(`${dealCount} deal${dealCount === 1 ? '' : 's'}`);
    }

    if (reasons.length) {
      throw new BadRequestException(
        `Can't delete this user — still the sales/deal owner of ${reasons.join(
          ', ',
        )}. Reassign ownership first.`,
      );
    }

    return instance;
  }
}
