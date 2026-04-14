import { User } from '@/prisma/generated/client';
import { TokenType } from '@/prisma/generated/enums';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { generateVerificationToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { saveSession } from '@/src/shared/utils/session.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { MailService } from '../../libs/mail/mail.service';
import { VerificationInput } from './inputs/verification.input';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async verifyEmail(req: Request, input: VerificationInput, userAgent: string) {
    const { token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.EMAIL_VERIFICATION,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Verification token not found');
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();
    if (hasExpired) {
      throw new BadRequestException('Verification code has expired');
    }

    const user = await this.prismaService.user.update({
      where: {
        id: existingToken.userId ?? undefined,
      },
      data: {
        isActive: true,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    const metadata = getSessionMetadata(req, userAgent);

    const { user: savedUser } = await saveSession(req, user, metadata);

    return savedUser;
  }

  async sendVerificationToken(user: User) {
    const verificationToken = await generateVerificationToken(
      this.prismaService,
      user,
      TokenType.EMAIL_VERIFICATION,
      true,
    );

    await this.mailService.sendVerificationToken(
      user.email,
      verificationToken.token,
    );

    return true;
  }
}
