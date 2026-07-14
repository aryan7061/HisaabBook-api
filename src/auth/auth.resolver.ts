import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.type';
import { User } from '../users/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('registerInput') input: RegisterInput): Promise<User> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }
}
