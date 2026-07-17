import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.type';
import { User } from '../users/user.entity';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Public()
  @Mutation(() => User)
  async register(@Args('registerInput') input: RegisterInput): Promise<User> {
    return this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(
    @CurrentUser() currentUser: { sub: string; email: string },
  ): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { id: currentUser.sub },
    });
  }
}
