import { User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { VerificationService } from '../verification/verification.service';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  async me(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async create(input: CreateUserInput) {
    const { username, email, password } = input;

    const existingUsername = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: await hash(password),
        name: username,
      },
    });

    return await this.verificationService.sendVerificationToken(user);
  }

  async changeEmail(user: User, input: ChangeEmailInput) {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { email: input.email },
    });
    // todo: send confirmation via email or messenger
    return true;
  }

  async changePassword(user: User, input: ChangePasswordInput) {
    if (!(await verify(user.password, input.password))) {
      throw new BadRequestException('Incorrect password');
    }
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: await hash(input.newPassword) },
    });
    return true;
  }
}
