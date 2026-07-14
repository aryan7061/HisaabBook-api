import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Role } from '../users/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: input.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    // name is a placeholder until the frontend's "Complete Your Profile" flow
    // updates it via UPDATE_USER_MUTATION, matching the existing pattern.
    const user = this.usersRepository.create({
      email: input.email,
      passwordHash,
      name: input.email.split('@')[0],
      role: Role.SALES_PERSON,
    });

    return this.usersRepository.save(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: input.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return { accessToken };
  }
}
