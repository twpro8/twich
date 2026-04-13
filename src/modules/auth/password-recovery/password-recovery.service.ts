import { TokenType } from '@/prisma/generated/enums';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { generateVerificationToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import type { Request } from 'express';
import { MailService } from '../../libs/mail/mail.service';
import type { NewPasswordInput } from './inputs/new-password.input';
import { ResetPasswordInput } from './inputs/reset-password.input';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async resetPassword(
    req: Request,
    input: ResetPasswordInput,
    userAgent: string,
  ) {
    const { email } = input;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = await generateVerificationToken(
      this.prismaService,
      user,
      TokenType.PASSWORD_RESET,
      true,
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendPasswordRecoveryToken(
      user.email,
      resetToken.token,
      metadata,
    );

    return true;
  }

  async newPassword(input: NewPasswordInput) {
    // don't be a pussy, add email here pls.
    const { password, token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Recovery code not found');
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();
    if (hasExpired) {
      throw new BadRequestException('Recovery code has expired');
    }

    await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        password: await hash(password),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    return true;
  }
}
