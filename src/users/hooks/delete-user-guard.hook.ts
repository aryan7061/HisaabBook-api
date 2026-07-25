import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
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
import { Role } from '../role.enum';

interface GqlContext {
  req?: { user?: { sub: string; email: string; role: Role } };
}

const MANAGER_ROLES = [Role.ADMIN, Role.SALES_MANAGER];

@Injectable()
export class DeleteUserGuardHook implements BeforeDeleteOneHook<User> {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
    @InjectRepository(Deal) private readonly dealRepo: Repository<Deal>,
  ) {}

  async run(
    instance: DeleteOneInputType,
    context: User,
  ): Promise<DeleteOneInputType> {
    const caller = (context as unknown as GqlContext)?.req?.user;
    if (!caller || !MANAGER_ROLES.includes(caller.role)) {
      throw new ForbiddenException(
        'Only an admin or sales manager can delete a user',
      );
    }

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
